from typing import List, Optional, Tuple
from openai import AsyncOpenAI
from anthropic import AsyncAnthropic
from app.core.config import settings
from app.services.prompt_guard import PromptGuard

# 공통 프롬프트 빌더 함수 (보안 강화)
def build_recipe_prompt(ingredients: List[str], preferences: Optional[str] = None) -> Tuple[str, str]:
    """
    레시피 생성 프롬프트 구성 (프롬프트 인젝션 방어 적용)

    Returns:
        (system_message, user_message)
    """
    return PromptGuard.build_safe_prompt(ingredients, preferences)

class OpenAIClient:
    def __init__(self):
        if not settings.openai_api_key:
            raise ValueError("OpenAI API 키가 설정되지 않았습니다.")
        self.client = AsyncOpenAI(api_key=settings.openai_api_key)

    async def generate_recipe_stream(self, ingredients: List[str], preferences: Optional[str]=None):
        """스트리밍 방식으로 레시피 생성 (보안 강화)"""
        system_msg, user_msg = build_recipe_prompt(ingredients, preferences)

        stream = await self.client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_msg},
                {"role": "user", "content": user_msg}
            ],
            stream=True,
            temperature=0.7
        )

        async for chunk in stream:
            content = chunk.choices[0].delta.content
            if content:
                yield content

    async def generate_recipe(self, ingredients: List[str], preferences: Optional[str] = None) -> str:
        """재료 기반 레시피 생성 (보안 강화)"""
        system_msg, user_msg = build_recipe_prompt(ingredients, preferences)

        try:
            response = await self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": system_msg},
                    {"role": "user", "content": user_msg}
                ],
                max_tokens=1000,
                temperature=0.7
            )
            return response.choices[0].message.content
        except Exception as e:
            raise Exception(f"OpenAI API 호출 실패: {str(e)}")


class ClaudeClient:
    def __init__(self):
        if not settings.anthropic_api_key:
            raise ValueError("Claude API 키가 설정되지 않았습니다.")
        self.client = AsyncAnthropic(api_key=settings.anthropic_api_key)

    async def generate_recipe_stream(self, ingredients: List[str], preferences: Optional[str]=None):
        """스트리밍 방식으로 레시피 생성 (보안 강화)"""
        system_msg, user_msg = build_recipe_prompt(ingredients, preferences)

        async for chunk in self.client.messages.stream(
            model="claude-3-haiku-20240307",
            max_tokens=1000,
            system=system_msg,
            messages=[{"role": "user", "content": user_msg}]
        ):
            if chunk.type == "content_block_delta":
                yield chunk.delta.text

    async def generate_recipe(self, ingredients: List[str], preferences: Optional[str] = None) -> str:
        """재료 기반 레시피 생성 (보안 강화)"""
        system_msg, user_msg = build_recipe_prompt(ingredients, preferences)

        try:
            response = await self.client.messages.create(
                model="claude-3-haiku-20240307",
                max_tokens=1000,
                system=system_msg,
                messages=[{"role": "user", "content": user_msg}]
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
