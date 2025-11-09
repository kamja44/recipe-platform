"""
프롬프트 인젝션 방어 모듈
"""
import re
from typing import List

class PromptGuard:
    """프롬프트 인젝션 공격 방어"""

    # 위험한 패턴 탐지 (영어 + 한국어)
    DANGEROUS_PATTERNS = [
        # 역할/명령 무시 시도 (영어)
        r"(?i)(ignore|forget|disregard).*(previous|above|instruction|prompt|system)",
        r"(?i)you are (now|a) (new|different)",
        r"(?i)act as",
        r"(?i)pretend (you|to be)",
        r"(?i)roleplay",

        # 역할/명령 무시 시도 (한국어)
        r"(이전|위|앞).*(지시|명령|프롬프트|시스템|내용).*(무시|잊|버려|삭제)",
        r"(무시|잊어버려|잊고).*(이전|위|앞|모든).*(지시|명령|instruction)",
        r"너는 (이제|지금부터|앞으로) (새로운|다른|해커|범죄자)",
        r"(역할극|롤플레이|연기)",
        r"~인 척",

        # 시스템 프롬프트 추출 시도 (영어)
        r"(?i)(show|tell|give).*(system|prompt|instruction)",
        r"(?i)what (is|are) your (instruction|prompt|rule)",
        r"(?i)repeat.*(above|previous)",

        # 시스템 프롬프트 추출 시도 (한국어)
        r"(보여줘|알려줘|출력|반복).*(시스템|프롬프트|지시|명령)",
        r"(시스템|프롬프트).*(뭐야|무엇|어떻게)",
        r"(이전|위).*(대화|내용|말).*(반복|다시)",

        # 유해 콘텐츠 생성 시도 (영어)
        r"(?i)(bomb|weapon|drug|hack|exploit)",
        r"(?i)(kill|murder|suicide|harm)",
        r"(?i)(sexual|porn|nude)",

        # 유해 콘텐츠 생성 시도 (한국어)
        r"(폭탄|무기|총|칼|마약|해킹|크랙)",
        r"(죽이|살인|자살|해치|상해)",
        r"(성적|음란|야동|포르노|누드)",

        # 개인정보/민감정보 요청 (영어)
        r"(?i)(password|credit card|ssn|personal)",
        r"(?i)(bank|account|private key)",

        # 개인정보/민감정보 요청 (한국어)
        r"(비밀번호|패스워드|주민번호|카드번호)",
        r"(계좌|은행|개인키|private)",
    ]

    @classmethod
    def detect_language(cls, text: str) -> str:
        """
        텍스트 언어 감지

        Returns:
            "ko" (한국어), "en" (영어), "cjk" (중일), "unknown"
        """
        if not text:
            return "unknown"

        # 각 언어별 문자 개수 카운트
        korean_chars = len(re.findall(r'[가-힣]', text))
        english_chars = len(re.findall(r'[a-zA-Z]', text))
        # 중국어/일본어 한자 (CJK Unified Ideographs + 히라가나 + 가타카나)
        cjk_chars = len(re.findall(r'[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff]', text))

        total_chars = korean_chars + english_chars + cjk_chars

        if total_chars == 0:
            return "unknown"

        # CJK 문자가 30% 이상이면 중국어/일본어로 판단
        if cjk_chars / total_chars > 0.3:
            return "cjk"
        # 한글이 30% 이상이면 한국어
        elif korean_chars / total_chars > 0.3:
            return "ko"
        # 영어가 50% 이상이면 영어
        elif english_chars / total_chars > 0.5:
            return "en"
        else:
            return "unknown"

    @classmethod
    def is_allowed_language(cls, text: str) -> tuple[bool, str]:
        """
        허용된 언어인지 검증 (한국어, 영어만 허용)

        Returns:
            (is_allowed: bool, reason: str)
        """
        lang = cls.detect_language(text)

        if lang in ["ko", "en"]:
            return True, ""
        elif lang == "cjk":
            return False, "중국어/일본어는 지원하지 않습니다"
        else:
            return True, ""  # unknown은 허용 (숫자, 특수문자만 있는 경우)

    @classmethod
    def is_safe_input(cls, text: str) -> tuple[bool, str]:
        """
        다단계 입력 검증 (언어 화이트리스트 + 패턴 매칭)

        Returns:
            (is_safe: bool, reason: str)
        """
        if not text or not text.strip():
            return True, ""

        # 1. 언어 화이트리스트 검증 (한국어, 영어만 허용)
        is_allowed, reason = cls.is_allowed_language(text)
        if not is_allowed:
            return False, reason

        # 2. 위험한 패턴 탐지 (정규표현식)
        for pattern in cls.DANGEROUS_PATTERNS:
            if re.search(pattern, text):
                return False, "유해한 내용이 감지되었습니다"

        # 3. 길이 제한 (DoS 방지)
        if len(text) > 500:
            return False, "입력이 너무 깁니다 (최대 500자)"

        # 4. 특수문자 과다 사용 탐지
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
