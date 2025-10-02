from typing import List, Optional
from pydantic import BaseModel, Field
from enum import Enum

class AIProvider(str, Enum):
    """AI 제공자 선택"""
    OPENAI = "openai"
    CLAUDE = "claude"

class RecipeRequest(BaseModel):
    """레시피 생성 요청 모델"""
    ingredients: List[str] = Field(
        ...,
        description="재료 목록",
        example=["토마토", "계란", "치즈"]
    )
    preferences: Optional[str] = Field(
        None, description="추가 요구사항", example="매운맛으로, 10분 이내로"
    )
    provider: AIProvider = Field(
        AIProvider.OPENAI,
        description="사용할 AI 제공자"
    )

class RecipeResponse(BaseModel):
    """레시피 생성 응답 모델"""
    recipe_name: str = Field(..., description="요리명")
    ingredients_list: List[str] = Field(..., description="재료 목록")
    instructions: List[str] = Field(..., description="조리 순서")
    cooking_time: str = Field(..., description="조리 시간")
    difficulty: str = Field(..., description="난이도")
    raw_response: str = Field(..., description="AI 원본 응답")

class APIResponse(BaseModel):
    """표준 API 응답 형식"""
    success: bool = Field(..., description="성공 여부")
    message: str = Field(..., description="응답 메시지")
    data: Optional[dict] = Field(None, description="응답 데이터")