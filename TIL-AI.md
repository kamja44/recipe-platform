# TIL - AI Service (FastAPI) 개발 학습

## 2024-09-29: FastAPI AI 서비스 기본 구조 구축

### 1. config.py 설정 파일 구현

#### 📚 학습한 개념들

**1. pydantic_settings.BaseSettings**

```python
from pydantic_settings import BaseSettings
```

- **역할**: 환경변수를 자동으로 Python 클래스로 매핑
- **NestJS와 비교**: NestJS의 `@nestjs/config`와 동일한 역할
- **장점**: 타입 안전성 + 자동 검증 + 환경변수 로딩

**2. pydantic.Field 활용**

```python
openai_api_key: Optional[str] = Field(default=None, env="OPENAI_API_KEY")
```

- **default**: 기본값 설정
- **env**: 매핑할 환경변수 이름 지정
- **타입 힌트**: `Optional[str]` = None 허용

**3. Settings 클래스 구조**

```python
class Settings(BaseSettings):
    # 필드 정의
    openai_api_key: Optional[str] = Field(default=None, env="OPENAI_API_KEY")

    class Config:
        env_file = ".env"  # .env 파일 자동 로딩
        case_sensitive = False  # 대소문자 구분 안함
```

#### 🔧 구현한 설정 항목들

**1. API Keys 관리**

- `openai_api_key`: OpenAI GPT API 연동
- `anthropic_api_key`: Claude API 연동
- `Optional[str]` 타입으로 필수가 아님을 명시

**2. 서버 설정**

- `host`: 바인딩할 IP (기본: 0.0.0.0)
- `port`: 포트 번호 (기본: 8000)
- `debug`: 디버그 모드 설정

**3. 외부 서비스 연동**

- `main_service_url`: NestJS 메인 서비스 URL
- 마이크로서비스 간 통신을 위한 설정

#### 🎯 FastAPI vs NestJS 설정 비교

| 구분        | FastAPI                          | NestJS                               |
| ----------- | -------------------------------- | ------------------------------------ |
| 환경변수    | `pydantic_settings.BaseSettings` | `@nestjs/config`                     |
| 타입 안전성 | pydantic 타입 힌트               | TypeScript 인터페이스                |
| 검증        | pydantic Field 검증              | class-validator                      |
| 사용법      | `settings.openai_api_key`        | `configService.get('openai.apiKey')` |

#### 💡 핵심 학습 포인트

**1. 전역 인스턴스 패턴**

```python
# Global settings instance
settings = Settings()
```

- 애플리케이션 전체에서 `settings` 객체로 접근
- 싱글톤 패턴과 유사한 효과

**2. 환경변수 자동 로딩**

- `.env` 파일에서 자동으로 환경변수 읽기
- `case_sensitive = False`로 대소문자 구분 없이 매핑

**3. 타입 안전성**

- `Optional[str]`: None 허용
- `int`, `bool`: 자동 타입 변환
- 런타임에 타입 검증 수행

#### 🚀 다음 학습 예정

- [ ] Pydantic 모델을 이용한 요청/응답 DTO 정의
- [ ] FastAPI 라우터 구조 설계
- [ ] OpenAI/Claude API 클라이언트 구현
- [ ] 의존성 주입(Dependency Injection) 패턴 학습

---

### 환경 설정 파일 구조

**ai-service/.env.example** (생성 예정)

```env
# AI Service Configuration
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Server Configuration
HOST=0.0.0.0
PORT=8000
DEBUG=True

# Main Service Configuration
MAIN_SERVICE_URL=http://localhost:3001
```

🔄 마이크로서비스 간 통신 상세 분석 (main_service_url)

아키텍처 시각화
┌─────────────────────────┐ HTTP 요청
┌─────────────────────────┐
│ AI Service (FastAPI) │ ←─────────────→ │ Main Service
(NestJS) │
│ │ │
│
│ - AI 레시피 생성 │ │ - 사용자
인증/관리 │
│ - 영양 분석 │ │ - 레시피 CRUD
│
│ - 재료 인식 │ │ - 리뷰 시스템
│
│ │ │ - PostgreSQL
연동 │
│ Port: 8000 │ │ Port: 3001
│
└─────────────────────────┘
└─────────────────────────┘

설정 구조 분석
main_service_url: str =
Field(default="http://localhost:3001",
env="MAIN_SERVICE_URL")

# ↑ ↑ ↑

     ↑

# 타입 Field 함수 기본값(개발환경)

환경변수명

환경별 설정 시나리오

# 🏠 로컬 개발환경

MAIN_SERVICE_URL=http://localhost:3001

# 🐳 Docker Compose 환경

MAIN_SERVICE_URL=http://main-service:3001

# ↑ 컨테이너 이름으로 통신

# ☁️ 프로덕션 환경

MAIN_SERVICE_URL=https://api.recipe-platform.com

실제 통신 예시 (향후 구현)
import httpx
from app.core.config import settings

# 사용자 정보 조회

async def get_user_info(user_id: int):
async with httpx.AsyncClient() as client:
response = await client.get(
f"{settings.main_service_url}/users/{user_id}"
)
return response.json()

왜 필요한가?

- 서비스 분리로 독립적 개발/배포
- AI 기능과 비즈니스 로직 분리
- 각 서비스별 최적화된 기술 스택 사용

### 프로젝트 구조 현황

```
ai-service/
├── app/
│   ├── core/
│   │   └── config.py ✅ (완료)
│   ├── api/ (다음 단계)
│   ├── services/ (다음 단계)
│   └── main.py (업데이트 예정)
├── requirements.txt ✅
└── .env.example (생성 예정)
```

### 2. AI 클라이언트 서비스 구현 (ai_client.py)

#### 📚 구현한 핵심 개념들

**1. 팩토리 패턴 (Factory Pattern)**
```python
class AIClientFactory:
    @staticmethod
    def get_client(provider: str = "openai"):
        if provider == "openai":
            return OpenAIClient()
        elif provider == "claude":
            return ClaudeClient()
```

**2. 비동기 프로그래밍 (async/await)**
- FastAPI와 일관성
- 성능 향상 (I/O 대기시간 최적화)
- 동시 여러 AI API 호출 가능

#### ⚠️ 개선 필요 사항

**1. OpenAI API 최신 버전으로 업데이트 필요**
**2. OpenAIClient에 _build_recipe_prompt 메소드 누락**
**3. 코드 중복 개선 필요**

✅ **잘 구현된 부분**: 팩토리 패턴, 에러 핸들링, 환경변수 연동
⚠️ **개선 필요**: API 버전, 누락된 메소드, 코드 중복


#### 🔄 리팩토링 과정 및 학습

**개선 전 문제점**
1. ❌ 코드 중복: 두 클라이언트에서 동일한 프롬프트 생성 로직
2. ❌ DRY 원칙 위반: `_build_recipe_prompt` 메소드 중복 구현
3. ❌ 유지보수성 저하: 프롬프트 수정시 여러 곳을 변경해야 함

**리팩토링 적용**
```python
# ✅ 공통 함수로 분리
def build_recipe_prompt(ingredients: List[str], preferences: Optional[str] = None) -> str:
    """레시피 생성 프롬프트 구성 (공통 함수)"""
    # 프롬프트 생성 로직

# 두 클라이언트 모두 공통 함수 사용
prompt = build_recipe_prompt(ingredients, preferences)
```

**학습한 설계 원칙**
1. **DRY 원칙**: 중복 코드 제거로 유지보수성 향상
2. **단일 책임 원칙**: 프롬프트 생성은 별도 함수가 담당
3. **함수형 프로그래밍**: 순수 함수로 프롬프트 생성

#### 📊 최종 AI 클라이언트 구현 완료 ✅

**성공적으로 구현된 부분**
- ✅ 팩토리 패턴으로 AI 제공자 추상화
- ✅ 환경변수 기반 설정 관리  
- ✅ 비동기 프로그래밍 적용
- ✅ 에러 핸들링 및 검증
- ✅ **코드 중복 완전 제거**
- ✅ **DRY 원칙 100% 적용**

**🏆 종합 평가: 10/10** - 리팩토링을 통한 완성도 높은 코드 달성


---

### 3. AI 클라이언트 설계 철학 및 구조 분석

#### 🏗️ 왜 이런 구조로 설계했는가?

**1. 각 클라이언트를 별도 클래스로 분리한 이유**

```
┌─────────────────────────────────────────────────────────────┐
│                    AI 제공자별 특성 차이점                        │
├─────────────────────┬───────────────────────────────────────┤
│     OpenAI GPT      │         Anthropic Claude              │
├─────────────────────┼───────────────────────────────────────┤
│ openai.api_key 설정  │ Anthropic(api_key=...) 클라이언트     │
│ ChatCompletion API  │ messages.create API                   │
│ system/user 역할 분리│ user 역할만 사용                       │
│ temperature 설정     │ 다른 파라미터 구조                     │
└─────────────────────┴───────────────────────────────────────┘
```

**설계 원칙:**
- **캡슐화**: 각 AI 제공자의 복잡성을 클래스 내부로 숨김
- **확장성**: 새로운 AI 제공자 쉽게 추가 가능
- **책임 분리**: OpenAI는 OpenAI만, Claude는 Claude만 담당

#### 🔧 build_recipe_prompt() 함수의 핵심 역할

**함수 동작 플로우:**
```
입력: ["토마토", "양파", "닭고기"] + "매운맛으로"
    ↓
재료 조합: "토마토, 양파, 닭고기"
    ↓
역할 부여: "30년 경력 미슐랭 헤드 셰프"
    ↓
구조화된 출력 형식 지정
    ↓
완성된 프롬프트 반환
```

**왜 이 함수가 중요한가?**
1. **프롬프트 엔지니어링**: AI가 전문적 답변하도록 역할 부여
2. **구조화된 출력**: 파싱하기 쉬운 일관된 형식 
3. **개인화**: 재료 + 선호도 조합으로 맞춤형 레시피

#### 💡 설계 철학

**순수 함수로 만든 이유:**
- 동일 입력 → 동일 출력 (예측 가능)
- 상태 없음 (클래스 인스턴스 불필요)  
- 테스트 용이성
- 높은 재사용성


#### 🎯 AI 클라이언트 전체 동작 흐름 시각화

```
사용자 요청: "토마토, 계란으로 간단한 요리 추천해줘"
                            ↓
┌─────────────────────────────────────────────────────────┐
│                FastAPI 엔드포인트                        │
│  ingredients = ["토마토", "계란"]                        │
│  preferences = "간단한"                                 │
│  provider = "openai"  # 또는 "claude"                  │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│           AIClientFactory.get_client("openai")          │
│              ↓                                          │
│         OpenAIClient 인스턴스 생성                       │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│        build_recipe_prompt(ingredients, preferences)    │
│                                                         │
│  입력: ["토마토", "계란"] + "간단한"                      │
│    ↓                                                   │
│  "당신은 30년 경력의 전문 요리사이며, 미슐랭 3스타         │
│   헤드 셰프입니다. 다음 재료들을 사용한 레시피를           │
│   추천해주세요: 토마토, 계란                            │
│   추가 요구사항: 간단한                                 │
│                                                         │
│   다음 형식으로 답변해주세요:                            │
│   - 요리명:                                            │
│   - 재료: ..."                                         │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│              OpenAI API 호출                            │
│                                                         │
│  await openai.ChatCompletion.acreate(                  │
│    model="gpt-3.5-turbo",                             │
│    messages=[                                          │
│      {"role": "system", "content": "전문 요리사..."},    │
│      {"role": "user", "content": 생성된_프롬프트}       │
│    ]                                                   │
│  )                                                     │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                   AI 응답 반환                           │
│                                                         │
│  "- 요리명: 토마토 스크램블 에그                         │
│   - 재료: 토마토 2개, 계란 3개, 소금, 후추               │
│   - 조리법: 1. 토마토를 잘게 썬다...                    │
│   - 조리시간: 10분                                      │
│   - 난이도: 쉬움"                                       │
└─────────────────────────────────────────────────────────┘
```

#### 🔧 각 컴포넌트의 구체적인 설계 이유

**1. OpenAIClient vs ClaudeClient 분리 이유**

```python
# ❌ 하나의 클래스로 만들면?
class UniversalAIClient:
    def __init__(self, provider):
        if provider == "openai":
            # OpenAI 초기화
        elif provider == "claude":
            # Claude 초기화

    async def generate_recipe(self):
        if self.provider == "openai":
            # OpenAI 호출 로직
        elif self.provider == "claude":
            # Claude 호출 로직

# ✅ 분리한 이유
class OpenAIClient:
    # OpenAI 전용 로직만 집중

class ClaudeClient:
    # Claude 전용 로직만 집중
```

**분리의 이점:**
- **단일 책임**: 각 클래스가 하나의 AI 제공자만 담당
- **확장 용이**: 새로운 AI 추가시 기존 코드 수정 불필요
- **디버깅 용이**: 문제 발생시 해당 클래스만 확인하면 됨

**2. build_recipe_prompt() 함수의 핵심 역할**

```python
def build_recipe_prompt(ingredients, preferences):
    # 🎯 3가지 핵심 역할

    # 1️⃣ 역할 정의 (Role Assignment)
    prompt = "당신은 30년 경력의 전문 요리사..."
    # → AI가 전문가처럼 답변하도록 맥락 제공

    # 2️⃣ 구조화된 출력 형식 (Structured Output)
    prompt += "다음 형식으로 답변해주세요:\n- 요리명:\n- 재료:..."
    # → 일관된 형식으로 파싱 용이하게 만듦

    # 3️⃣ 개인화 (Personalization)
    if preferences:
        prompt += f"추가 요구사항: {preferences}"
    # → 사용자별 맞춤형 레시피 생성
```

