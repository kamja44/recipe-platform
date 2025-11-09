"""
프롬프트 인젝션 방어 모듈
"""
import re
from typing import List

class PromptGuard:
    """프롬프트 인젝션 공격 방어"""

    # 위험한 패턴 탐지
    DANGEROUS_PATTERNS = [
        # 역할/명령 무시 시도
        r"(?i)(ignore|forget|disregard).*(previous|above|instruction|prompt|system)",
        r"(?i)you are (now|a) (new|different)",
        r"(?i)act as",
        r"(?i)pretend (you|to be)",
        r"(?i)roleplay",

        # 시스템 프롬프트 추출 시도
        r"(?i)(show|tell|give).*(system|prompt|instruction)",
        r"(?i)what (is|are) your (instruction|prompt|rule)",
        r"(?i)repeat.*(above|previous)",

        # 유해 콘텐츠 생성 시도
        r"(?i)(bomb|weapon|drug|hack|exploit)",
        r"(?i)(kill|murder|suicide|harm)",
        r"(?i)(sexual|porn|nude)",

        # 개인정보/민감정보 요청
        r"(?i)(password|credit card|ssn|personal)",
        r"(?i)(bank|account|private key)",
    ]

    # 허용된 재료 관련 키워드 (화이트리스트)
    ALLOWED_FOOD_KEYWORDS = [
        "맛있는", "건강한", "빠른", "간단한", "쉬운",
        "매운", "달콤한", "고소한", "담백한",
        "한식", "중식", "일식", "양식", "디저트",
        "다이어트", "저칼로리", "고단백",
        "채식", "비건", "할랄",
    ]

    @classmethod
    def is_safe_input(cls, text: str) -> tuple[bool, str]:
        """
        입력이 안전한지 검증

        Returns:
            (is_safe: bool, reason: str)
        """
        if not text or not text.strip():
            return True, ""

        # 1. 위험한 패턴 탐지
        for pattern in cls.DANGEROUS_PATTERNS:
            if re.search(pattern, text):
                return False, "유해한 내용이 감지되었습니다"

        # 2. 길이 제한 (DoS 방지)
        if len(text) > 500:
            return False, "입력이 너무 깁니다 (최대 500자)"

        # 3. 특수문자 과다 사용 탐지
        special_chars = re.findall(r'[^a-zA-Z0-9가-힣\s,.]', text)
        if len(special_chars) > len(text) * 0.3:
            return False, "특수문자가 과도하게 포함되어 있습니다"

        return True, ""

    @classmethod
    def sanitize_ingredients(cls, ingredients: List[str]) -> List[str]:
        """재료 입력 정제"""
        sanitized = []
        for ingredient in ingredients:
            # 공백 제거
            ingredient = ingredient.strip()

            # 길이 제한
            if len(ingredient) > 50:
                ingredient = ingredient[:50]

            # 특수문자 제거 (기본 한글, 영문, 숫자만)
            ingredient = re.sub(r'[^a-zA-Z0-9가-힣\s]', '', ingredient)

            if ingredient:
                sanitized.append(ingredient)

        return sanitized

    @classmethod
    def sanitize_preferences(cls, preferences: str) -> str:
        """선호사항 입력 정제"""
        if not preferences:
            return ""

        # 길이 제한
        if len(preferences) > 200:
            preferences = preferences[:200]

        # 위험한 문자 제거
        preferences = re.sub(r'[<>{}[\]\\]', '', preferences)

        return preferences.strip()

    @classmethod
    def build_safe_prompt(cls, ingredients: List[str], preferences: str = None) -> str:
        """안전한 프롬프트 구성"""

        # 입력 정제
        safe_ingredients = cls.sanitize_ingredients(ingredients)
        safe_preferences = cls.sanitize_preferences(preferences) if preferences else None

        # 재료 검증
        if not safe_ingredients:
            raise ValueError("유효한 재료가 없습니다")

        if len(safe_ingredients) > 20:
            raise ValueError("재료는 최대 20개까지 입력 가능합니다")

        # 선호사항 검증
        if safe_preferences:
            is_safe, reason = cls.is_safe_input(safe_preferences)
            if not is_safe:
                raise ValueError(f"입력이 안전하지 않습니다: {reason}")

        # 안전한 프롬프트 구성 (명확한 구분자 사용)
        ingredients_text = ", ".join(safe_ingredients)

        # System 메시지와 User 메시지 분리
        system_message = "당신은 30년 경력의 전문 요리사이며 미슐랭 3스타의 헤드 셰프입니다. 주어진 재료로 맛있는 레시피만 추천해주세요."

        user_message = f"""다음 재료를 사용한 레시피를 추천해주세요:
재료: {ingredients_text}"""

        if safe_preferences:
            user_message += f"\n\n추가 요구사항: {safe_preferences}"

        user_message += """

다음 형식으로 답변해주세요:
- 요리명:
- 재료:
- 조리법:
- 조리시간:
- 난이도:"""

        return system_message, user_message
