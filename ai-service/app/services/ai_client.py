from typing import List, Optional
import openai
from anthropic import Anthropic
from app.core.config import settings

# 공통 프롬프트 빌더 함수
def build_recipe_prompt(ingredients: List[str], preferences:Optional[str] = None) -> str:
    """레시피 생성 프롬프트 구성 (공통 함수)"""
    ingredients_text = ", ".join(ingredients)
    prompt = f"당신은 30년 경력의 전문 요리사이며, 미슐랭 3스타 헤드 셰프입니다. 다음 재료들을 사용한 레시피를 추천해주세요: {ingredients_text}"

    if preferences:
        prompt += f"\n추가 요구사항: {preferences}"

    prompt += "\n\n다음 형식으로 답변해주세요:\n- 요리명:\n- 재료:\n- 조리법:\n- 조리시간:\n- 난이도:"
    return prompt

class OpenAIClient:
    def __init__(self):
        if settings.openai_api_key:
            openai.api_key = settings.openai_api_key
    async def generate_recipe(self, ingredients: List[str], preferences: Optional[str] = None) -> str:
        """재료 기반 레시피 생성"""
        if not settings.openai_api_key:
            raise ValueError("OpenAI API key not configured")

        prompt = build_recipe_prompt(ingredients, preferences)

        try:
            response = await openai.ChatCompletion.acreate(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "당신은 30년 경력의 전문 요리사이며 미슐랭 3스타의 헤드 셰프 입니다. 주어진 재료로 맛있는 레시피를 추천해주세요."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=1000,
                temperature=0.7
            )
            return response.choices[0].message.content
        except Exception as e:
            raise Exception(f"OpenAI API 호출 실패:{str(e)}")
    

class ClaudeClient:
    def __init__(self):
        if settings.anthropic_api_key:
            self.client = Anthropic(api_key=settings.anthropic_api_key)
        else:
            self.client = None
    
    async def generate_recipe(self, ingredients: List[str], preferences: Optional[str]=None) -> str:
        """재료 기반 레시피 생성"""
        if not self.client:
            raise ValueError("Claude API key not configured")
        
        prompt = build_recipe_prompt(ingredients, preferences)

        try:
            response = await self.client.messages.create(
                model="claude-3-sonnet-20240229",
                max_tokens=1000,
                messages=[{"role": "user", "content": prompt}]
            )
            return response.content[0].text
        except Exception as e:
            raise Exception(f"Claude API 호출 실패: {str(e)}")
        

    
# AI 클라이언트 팩토리
class AIClientFactory:
    @staticmethod
    def get_client(provider: str = "openai"):
        """AI 클라이언트 생성"""
        if provider == "openai":
            return OpenAIClient()
        elif provider == "claude":
            return ClaudeClient()
        else:
            raise ValueError(f"지원하지 않는 AI 제공자: {provider}")