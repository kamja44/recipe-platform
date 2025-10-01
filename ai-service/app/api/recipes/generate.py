from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from app.models.schemas import RecipeRequest, RecipeResponse, APIResponse
from app.services.ai_client import AIClientFactory
from app.core.config import settings
import re
import json

router = APIRouter(prefix="/api/recipes", tags=["recipes"])

@router.post("/generate", response_model=APIResponse)
async def generate_recipe(request: RecipeRequest):
    """AI를 이용한 레시피 생성"""
    try:
        # AI 클라이언트 생성
        ai_client = AIClientFactory.get_client(request.provider)

        # AI 레시피 생성
        raw_response = await ai_client.generate_recipe(
            ingredients=request.ingredients,
            preferences=request.preferences
        )

        # AI 응답 파싱
        parsed_recipe = parse_ai_response(raw_response)

        # 응답 생성
        recipe_response = RecipeResponse(
            recipe_name=parsed_recipe.get("recipe_name", ""),
            ingredients_list=parsed_recipe.get("ingredients", []),
            instructions=parsed_recipe.get("instructions", []),
            cooking_time=parsed_recipe.get("cooking_time", ""),
            difficulty=parsed_recipe.get("difficulty", ""),
            raw_response=raw_response
        )
        return APIResponse(
            success=True,
            message="레시피 생성이 완료되었습니다.",
            data=recipe_response.dict()
        )
    
    except ValueError as e:
          raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
          raise HTTPException(status_code=500, detail=f"레시피 생성 중 오류가 발생했습니다: {str(e)}")

@router.post("/generate-stream")
async def generate_recipe_stream(request: RecipeRequest):
    """AI 레시피 스트리밍 생성"""

    async def event_generator():
        try:
            client = AIClientFactory.get_client(
                provider=request.provider
            )

            # OpenAI 스트리밍 호출
            async for chunk in client.generate_recipe_stream(
                ingredients=request.ingredients,
                preferences=request.preferences
            ):
                yield f"data: {json.dumps({'content': chunk}, ensure_ascii=False)}\n\n"
            
            yield f"data: {json.dumps({'done': True}, ensure_ascii=False)}\n\n"
            
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)}, ensure_ascii=False)}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive"
        }
    )

def parse_ai_response(response: str) -> dict:
    """AI 응답을 파싱하여 구조화된 데이터로 변환"""
    result = {}

    # 요리명 추출
    name_match = re.search(r'(?:요리명|레시피명):\s*(.+)', response)
    result["recipe_name"]=  name_match.group(1).strip() if name_match else "알 수 없는 요리"

    # 재료 추출
    ingredients_match = re.search(r'재료:\s*(.*?)(?=조리법|만드는법|조리순서)', response, re.DOTALL)
    if ingredients_match:
        ingredients_text = ingredients_match.group(1).strip()
        
        # 줄바꿈으로 분리 시도
        lines = [ing.strip() for ing in ingredients_text.split('\n') if ing.strip() and ing.strip() != "-"]
        
        # 줄바꿈이 없고 쉼표가 있으면 쉼표로 분리
        if len(lines) == 1 and ',' in lines[0]:
            result["ingredients"] = [ing.strip() for ing in lines[0].split(',') if ing.strip()]
        else:
            result["ingredients"] = lines
    else:
        result["ingredients"] = []

    # 조리법 추출
    instructions_match = re.search(r'(?:조리법|만드는법|조리순서):\s*(.*?)(?=조리시간|난이도|$)', response, re.DOTALL)
    if instructions_match:
        instructions_text = instructions_match.group(1).strip()
        result["instructions"] = [
            inst.strip() 
            for inst in instructions_text.split('\n') 
            if inst.strip() and inst.strip() != "-"
            ]
    else:
        result["instructions"] = []
    
    # 조리시간 추출
    time_match = re.search(r'조리시간:\s*(.+)', response)
    result["cooking_time"] = time_match.group(1).strip() if time_match else "정보 없음"

    # 난이도 추출
    difficulty_match = re.search(r'난이도:\s*(.+)', response)
    result["difficulty"] = difficulty_match.group(1).strip() if difficulty_match else "보통"

    return result

@router.get("/health")
async def health_check():
    """헬스 체크 엔드포인트"""
    return {
        "status": "healthy",
        "service": "recipes"
    }