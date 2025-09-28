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


---

### 4. Pydantic 모델 설계 - API 구조 정의

#### 🎯 왜 Pydantic 모델이 필요한가?

**API 개발의 핵심 문제점:**
```
사용자 입력 → 서버 처리 → AI API 호출 → 응답 반환
     ↑              ↑              ↑           ↑
타입 불명확    검증 누락      형식 다양    일관성 부족
```

**Pydantic이 해결하는 문제:**
1. **타입 안전성**: 런타임 타입 검증
2. **자동 검증**: 잘못된 데이터 자동 차단
3. **문서화**: Swagger UI 자동 생성
4. **일관성**: 표준화된 요청/응답 구조

#### 🏗️ 모델 설계 철학

**1. 요청 모델 (Request DTOs)**
```python
class RecipeRequest(BaseModel):
    ingredients: List[str] = Field(..., description="재료 목록")
    preferences: Optional[str] = Field(None, description="추가 요구사항")
    provider: AIProvider = Field(AIProvider.OPENAI, description="AI 제공자")
```

**설계 이유:**
- **명확한 인터페이스**: 클라이언트가 보내야 할 데이터 구조 명시
- **선택적 필드**: `Optional[str]`로 필수/선택 구분
- **기본값 제공**: `AIProvider.OPENAI` 기본 설정
- **문서화**: `description`으로 API 문서 자동 생성

**2. 응답 모델 (Response DTOs)**
```python
class RecipeResponse(BaseModel):
    recipe_name: str = Field(..., description="요리명")
    ingredients_list: List[str] = Field(..., description="재료 목록")
    instructions: List[str] = Field(..., description="조리 순서")
    raw_response: str = Field(..., description="AI 원본 응답")
```

**설계 이유:**
- **구조화된 응답**: AI 응답을 파싱하여 일관된 형식으로 제공
- **확장 가능성**: 새로운 필드 추가 용이
- **원본 보존**: `raw_response`로 AI 응답 원본 유지

#### 🔧 실제 동작 플로우

```
POST /api/recipes/generate
{
  "ingredients": ["토마토", "계란"],
  "preferences": "간단하게",
  "provider": "openai"
}
                    ↓
        Pydantic 자동 검증
        - ingredients가 List[str]인가?
        - provider가 유효한 enum 값인가?
                    ↓
        검증 통과 → AI 클라이언트 호출
        검증 실패 → 422 에러 반환
                    ↓
        AI 응답 → Pydantic 응답 모델로 구조화
                    ↓
{
  "success": true,
  "message": "레시피 생성 완료",
  "data": {
    "recipe_name": "토마토 스크램블",
    "ingredients_list": ["토마토 2개", "계란 3개"],
    "instructions": ["1. 토마토를 썬다", "2. 계란을 푼다"],
    "cooking_time": "10분",
    "difficulty": "쉬움"
  }
}
```

#### 💡 NestJS DTO와 비교

| 구분 | FastAPI + Pydantic | NestJS + class-validator |
|------|---------------------|---------------------------|
| 타입 검증 | 런타임 자동 검증 | 데코레이터 기반 검증 |
| 문서화 | 자동 Swagger 생성 | @ApiProperty 필요 |
| 변환 | 자동 타입 변환 | ValidationPipe 필요 |
| 사용법 | `Field(..., description=)` | `@IsString() @ApiProperty()` |

**Pydantic의 장점:**
- **Less Boilerplate**: 적은 코드로 많은 기능
- **Python Native**: Python 타입 힌트 완전 활용
- **Runtime Validation**: 실행 중 타입 안전성 보장

---

### 5. FastAPI 라우터 구현 - generate.py 완전 분석

#### 🎯 generate.py의 역할과 위치

**파일 경로:** `ai-service/app/api/recipes/generate.py`

**핵심 역할:**
```
사용자 요청 → 라우터(generate.py) → AI 클라이언트 → AI 응답 파싱 → 구조화된 응답
```

이 파일은 **API 엔드포인트 레이어**로, 다음을 담당:
1. HTTP 요청 수신 및 검증
2. 비즈니스 로직 호출 (AI 클라이언트)
3. 응답 변환 및 에러 처리
4. RESTful API 제공

#### 📚 코드 구조 및 문법 완전 분석

**1. 모듈 임포트 구조**
```python
from fastapi import APIRouter, HTTPException
from app.models.schemas import RecipeRequest, RecipeResponse, APIResponse
from app.services.ai_client import AIClientFactory
import re
```

**임포트 분석:**
- `APIRouter`: FastAPI의 라우팅 시스템 (NestJS의 `@Controller()`와 유사)
- `HTTPException`: HTTP 에러 응답 생성 (NestJS의 `HttpException`)
- `schemas`: Pydantic 모델 (요청/응답 DTO)
- `AIClientFactory`: AI 클라이언트 팩토리 패턴
- `re`: 정규표현식 모듈 (AI 응답 파싱용)

**2. 라우터 인스턴스 생성**
```python
router = APIRouter(prefix="/api/recipes", tags=["recipes"])
```

**문법 설명:**
- `prefix="/api/recipes"`: 모든 라우트에 자동으로 `/api/recipes` 경로 추가
- `tags=["recipes"]`: Swagger UI에서 엔드포인트 그룹화
- NestJS와 비교: `@Controller('recipes')`와 동일한 역할

**3. POST 엔드포인트 - 레시피 생성 API**

```python
@router.post("/generate", response_model=APIResponse)
async def generate_recipe(request: RecipeRequest):
    """AI를 이용한 레시피 생성"""
```

**데코레이터 분석:**
- `@router.post("/generate")`: POST 요청을 `/api/recipes/generate`로 매핑
- `response_model=APIResponse`: 응답 형식 정의 (Pydantic 모델로 자동 검증)
- `async def`: 비동기 함수 (I/O 대기 중 다른 요청 처리 가능)
- `request: RecipeRequest`: 요청 본문을 Pydantic 모델로 자동 변환 및 검증

**NestJS와 비교:**
```typescript
// NestJS
@Post('generate')
async generateRecipe(@Body() request: RecipeRequest) { }

// FastAPI
@router.post("/generate", response_model=APIResponse)
async def generate_recipe(request: RecipeRequest):
```

#### 🔧 핵심 로직 단계별 분석

**Step 1: AI 클라이언트 생성 (팩토리 패턴)**
```python
ai_client = AIClientFactory.get_client(request.provider)
```

**동작 원리:**
```
request.provider = "openai" 또는 "claude"
            ↓
AIClientFactory.get_client("openai")
            ↓
if provider == "openai":
    return OpenAIClient()  # OpenAI 전용 클라이언트 반환
elif provider == "claude":
    return ClaudeClient()  # Claude 전용 클라이언트 반환
```

**왜 이렇게 구현했는가?**
- **유연성**: 사용자가 AI 제공자 선택 가능
- **확장성**: 새로운 AI 추가시 기존 코드 수정 불필요
- **캡슐화**: AI별 복잡한 로직을 클라이언트 내부로 숨김

**Step 2: AI 레시피 생성 (비동기 호출)**
```python
raw_response = await ai_client.generate_recipe(
    ingredients=request.ingredients,
    preferences=request.preferences
)
```

**문법 설명:**
- `await`: 비동기 함수 호출 완료까지 대기 (다른 요청은 계속 처리)
- `ai_client.generate_recipe()`: OpenAIClient 또는 ClaudeClient의 메소드 호출
- 반환값: AI가 생성한 레시피 텍스트 (구조화되지 않은 원본 응답)

**내부 동작 흐름:**
```
ingredients=["토마토", "계란"], preferences="간단하게"
                ↓
build_recipe_prompt() 호출 → 프롬프트 생성
                ↓
OpenAI/Claude API 호출 (async)
                ↓
raw_response = "요리명: 토마토 스크램블\n재료: 토마토 2개..."
```

**Step 3: AI 응답 파싱 (정규표현식)**
```python
parsed_recipe = parse_ai_response(raw_response)
```

**parse_ai_response() 함수 상세 분석:**

```python
def parse_ai_response(response: str) -> dict:
    """AI 응답을 파싱하여 구조화된 데이터로 변환"""
    result = {}

    # 1️⃣ 요리명 추출
    name_match = re.search(r'(?:요리명|레시피명):\s*(.+)', response)
    result["recipe_name"] = name_match.group(1).strip() if name_match else "알 수 없는 요리"
```

**정규표현식 문법 분석:**
- `r'...'`: raw string (백슬래시 이스케이프 불필요)
- `(?:요리명|레시피명)`: 비캡처 그룹, "요리명" 또는 "레시피명" 매칭
- `:\s*`: 콜론 뒤 공백 0개 이상
- `(.+)`: 캡처 그룹, 임의의 문자 1개 이상 (실제 요리명 추출)
- `.group(1)`: 첫 번째 캡처 그룹의 값 반환
- `.strip()`: 앞뒤 공백 제거

**예시:**
```
입력: "요리명: 토마토 스크램블 에그\n재료: ..."
매칭: "요리명:"까지 찾고, 그 뒤의 " 토마토 스크램블 에그" 추출
결과: "토마토 스크램블 에그"
```

```python
    # 2️⃣ 재료 추출 (여러 줄)
    ingredients_match = re.search(
        r'재료:\s*(.*?)(?=조리법|만드는법|조리순서)',
        response,
        re.DOTALL
    )
```

**고급 정규표현식 문법:**
- `(.*?)`: 비탐욕적 매칭 (최소한만 매칭)
- `(?=조리법|만드는법|조리순서)`: lookahead 어서션 (조리법 앞까지만 매칭)
- `re.DOTALL`: `.`이 줄바꿈 문자도 포함하도록 설정

**동작 원리:**
```
입력: "재료:
토마토 2개
계란 3개
소금 약간
조리법:
1. 토마토를 썬다..."

매칭 범위: "재료:" 뒤부터 "조리법:" 앞까지
    ↓
"
토마토 2개
계란 3개
소금 약간
"
```

```python
    if ingredients_match:
        ingredients_text = ingredients_match.group(1).strip()
        result["ingredients"] = [
            ing.strip()
            for ing in ingredients_text.split('\n')
            if ing.strip()
        ]
```

**리스트 컴프리헨션 분석:**
```python
[ing.strip() for ing in ingredients_text.split('\n') if ing.strip()]
 ↑          ↑                                        ↑
출력값      반복 대상                              조건 (빈 줄 제외)
```

**단계별 동작:**
```
ingredients_text = "\n토마토 2개\n계란 3개\n\n소금 약간\n"
                        ↓ split('\n')
["", "토마토 2개", "계란 3개", "", "소금 약간", ""]
                        ↓ if ing.strip() (빈 문자열 제외)
["토마토 2개", "계란 3개", "소금 약간"]
                        ↓ ing.strip() (각 항목 공백 제거)
["토마토 2개", "계란 3개", "소금 약간"]
```

**3️⃣ 조리법 추출 (동일한 패턴)**
```python
instructions_match = re.search(
    r'(?:조리법|만드는법|조리순서):\s*(.*?)(?=조리시간|난이도|$)',
    response,
    re.DOTALL
)
```

**새로운 문법:**
- `(?=조리시간|난이도|$)`: lookahead로 "조리시간", "난이도", 또는 문자열 끝($) 앞까지 매칭

**Step 4: Pydantic 응답 모델 생성**
```python
recipe_response = RecipeResponse(
    recipe_name=parsed_recipe.get("recipe_name", ""),
    ingredients_list=parsed_recipe.get("ingredients", []),
    instructions=parsed_recipe.get("instructions", []),
    cooking_time=parsed_recipe.get("cooking_time", ""),
    difficulty=parsed_recipe.get("difficulty", ""),
    raw_response=raw_response
)
```

**dict.get() 메소드의 안전성:**
- `parsed_recipe.get("recipe_name", "")`: 키가 없으면 기본값 `""` 반환
- `parsed_recipe["recipe_name"]`와 차이: 후자는 키 없으면 에러 발생

**Step 5: 표준화된 API 응답 반환**
```python
return APIResponse(
    success=True,
    message="레시피 생성이 완료되었습니다.",
    data=recipe_response.dict()
)
```

**APIResponse 구조:**
```json
{
  "success": true,
  "message": "레시피 생성이 완료되었습니다.",
  "data": {
    "recipe_name": "토마토 스크램블",
    "ingredients_list": ["토마토 2개", "계란 3개"],
    "instructions": ["1. 토마토를 썬다", "2. 계란을 푼다"],
    "cooking_time": "10분",
    "difficulty": "쉬움",
    "raw_response": "AI 원본 응답..."
  }
}
```

#### ⚠️ 에러 처리 전략

**1. ValueError 처리 (비즈니스 로직 오류)**
```python
except ValueError as e:
    raise HTTPException(status_code=400, detail=str(e))
```

**시나리오:**
- AI 제공자가 잘못된 값 (openai, claude 외)
- 재료 목록이 비어있음
- API 키 미설정

**HTTP 400 (Bad Request)**: 클라이언트 요청 오류

**2. Exception 처리 (예상치 못한 오류)**
```python
except Exception as e:
    raise HTTPException(
        status_code=500,
        detail=f"레시피 생성 중 오류가 발생했습니다: {str(e)}"
    )
```

**HTTP 500 (Internal Server Error)**: 서버 내부 오류

#### 🏥 헬스 체크 엔드포인트

```python
@router.get("/health")
async def health_check():
    """헬스 체크 엔드포인트"""
    return {
        "status": "healthy",
        "service": "recipes"
    }
```

**역할:**
- 서비스 정상 동작 확인
- 로드 밸런서/모니터링 시스템에서 활용
- 배포 후 서비스 상태 체크

**접속 URL:** `GET http://localhost:8000/api/recipes/health`

#### 💡 설계 철학 및 학습 포인트

**1. 레이어드 아키텍처 (Layered Architecture)**
```
┌──────────────────────────────────────────────┐
│     라우터 (generate.py)                      │
│     - HTTP 요청/응답 처리                      │
│     - 엔드포인트 정의                          │
└──────────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────────┐
│     서비스 레이어 (ai_client.py)              │
│     - 비즈니스 로직                           │
│     - AI API 호출                            │
└──────────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────────┐
│     외부 API (OpenAI/Claude)                 │
└──────────────────────────────────────────────┘
```

**각 레이어의 책임:**
- **라우터**: "무엇을 받고, 무엇을 반환할 것인가?"
- **서비스**: "어떻게 처리할 것인가?"
- **외부 API**: "실제 AI 작업 수행"

**2. 왜 정규표현식으로 파싱하는가?**

**장점:**
- 빠른 구현: 복잡한 파서 불필요
- 유연성: 다양한 AI 응답 형식 대응
- 가볍다: 추가 라이브러리 불필요

**단점:**
- AI 응답 형식이 바뀌면 정규식 수정 필요
- 복잡한 구조에는 한계

**향후 개선 방향:**
- OpenAI Function Calling API 활용 (구조화된 JSON 응답)
- JSON Schema 기반 응답 포맷 강제

**3. 비동기 프로그래밍의 위력**

```python
# ❌ 동기 방식
def generate_recipe(request):
    response = openai_api_call()  # 5초 대기
    return parse(response)
# → 동시 요청 처리 불가

# ✅ 비동기 방식
async def generate_recipe(request):
    response = await openai_api_call()  # 5초 대기 중 다른 요청 처리
    return parse(response)
# → 동시 100개 요청 처리 가능
```

**FastAPI + async의 성능:**
- **동기**: 초당 10-20 요청
- **비동기**: 초당 1000+ 요청 (I/O 대기가 많은 경우)

#### 🎯 전체 데이터 흐름 시각화

```
클라이언트 요청
POST /api/recipes/generate
{
  "ingredients": ["토마토", "계란"],
  "preferences": "간단하게",
  "provider": "openai"
}
                ↓
        Pydantic 자동 검증
        RecipeRequest 모델로 변환
                ↓
        AIClientFactory.get_client("openai")
        → OpenAIClient 인스턴스 생성
                ↓
        ai_client.generate_recipe()
        → build_recipe_prompt() 호출
        → OpenAI API 호출
                ↓
        raw_response (AI 원본 응답)
        "요리명: 토마토 스크램블
         재료: 토마토 2개, 계란 3개
         조리법: 1. 토마토를 썬다..."
                ↓
        parse_ai_response(raw_response)
        → 정규표현식으로 파싱
                ↓
        parsed_recipe (dict)
        {
          "recipe_name": "토마토 스크램블",
          "ingredients": ["토마토 2개", "계란 3개"],
          "instructions": ["1. 토마토를 썬다"],
          "cooking_time": "10분",
          "difficulty": "쉬움"
        }
                ↓
        RecipeResponse 모델 생성
        → APIResponse 래핑
                ↓
클라이언트 응답
{
  "success": true,
  "message": "레시피 생성이 완료되었습니다.",
  "data": { ... }
}
```

#### 🚀 NestJS 컨트롤러와 비교

| 구분 | FastAPI (generate.py) | NestJS Controller |
|------|----------------------|-------------------|
| 라우터 정의 | `router = APIRouter(prefix="/api/recipes")` | `@Controller('recipes')` |
| 엔드포인트 | `@router.post("/generate")` | `@Post('generate')` |
| 요청 본문 | `request: RecipeRequest` | `@Body() request: RecipeRequest` |
| 응답 모델 | `response_model=APIResponse` | 반환 타입 명시 |
| 에러 처리 | `raise HTTPException` | `throw new HttpException` |
| 비동기 | `async def` + `await` | `async` + `await` |

**FastAPI의 장점:**
- **Less Boilerplate**: 데코레이터 최소화
- **자동 검증**: Pydantic 모델로 자동 검증
- **타입 힌트 기반**: Python 네이티브 문법 활용

#### 📝 핵심 학습 정리

**1. FastAPI 라우터 = NestJS 컨트롤러**
- HTTP 요청을 받아 응답을 반환하는 엔드포인트 레이어

**2. 비동기 프로그래밍의 필수성**
- AI API 호출은 I/O 대기 시간이 길어 비동기 필수

**3. 정규표현식 파싱의 실용성**
- AI 응답을 구조화된 데이터로 변환하는 가장 빠른 방법

**4. Pydantic 모델의 강력함**
- 자동 검증 + 자동 문서화 + 타입 안전성 동시 제공

**5. 표준화된 API 응답 구조**
- `{ success, message, data }` 형식으로 일관성 유지

---

### 6. FastAPI 애플리케이션 통합 - main.py 및 개발 환경 설정

#### 🎯 main.py의 역할

**파일 경로:** `ai-service/app/main.py`

**핵심 역할:**
- FastAPI 애플리케이션 인스턴스 생성
- 라우터 등록 및 통합
- CORS 설정
- Swagger 문서화 설정
- 애플리케이션 진입점 역할

#### 📚 main.py 코드 구조 분석

**1. FastAPI 앱 인스턴스 생성**
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.recipes.generate import router as recipes_router

app = FastAPI(
    title="Recipe AI Service",
    version="1.0.0",
    description="AI 기반 레시피 추천 서비스",
    docs_url="/docs",      # Swagger UI 경로
    redoc_url="/redoc"     # ReDoc UI 경로
)
```

**FastAPI 생성자 파라미터:**
- `title`: API 문서에 표시될 제목
- `version`: API 버전
- `description`: API 설명
- `docs_url`: Swagger UI 접근 경로 (자동 생성)
- `redoc_url`: ReDoc 문서 접근 경로 (대체 문서 UI)

**NestJS와 비교:**
```typescript
// NestJS main.ts
const app = await NestFactory.create(AppModule);
const config = new DocumentBuilder()
  .setTitle('Recipe AI Service')
  .setVersion('1.0.0')
  .build();

// FastAPI는 생성자에서 한 번에 설정
app = FastAPI(title="...", version="...")
```

**2. CORS 미들웨어 설정**
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # 모든 도메인 허용 (개발용)
    allow_credentials=True,
    allow_methods=["*"],      # 모든 HTTP 메소드 허용
    allow_headers=["*"],      # 모든 헤더 허용
)
```

**CORS 설정 분석:**
- `allow_origins=["*"]`: 모든 출처 허용 (프로덕션에서는 특정 도메인만)
- `allow_credentials=True`: 쿠키/인증 정보 허용
- `allow_methods=["*"]`: GET, POST, PUT, DELETE 등 모든 메소드
- `allow_headers=["*"]`: Authorization, Content-Type 등 모든 헤더

**프로덕션 설정 예시:**
```python
allow_origins=[
    "http://localhost:3000",  # Frontend
    "http://localhost:3001",  # Main Service
    "https://your-domain.com"
]
```

**3. 라우터 등록**
```python
app.include_router(recipes_router)
```

**동작 원리:**
```
generate.py에서 정의한 라우터:
router = APIRouter(prefix="/api/recipes", tags=["recipes"])
@router.post("/generate")

        ↓ app.include_router(recipes_router)

FastAPI 앱에 등록됨:
POST http://localhost:8000/api/recipes/generate
GET  http://localhost:8000/api/recipes/health
```

**NestJS와 비교:**
```typescript
// NestJS - app.module.ts
@Module({
  imports: [RecipesModule],  // 모듈 자동 등록
})

// FastAPI - main.py
app.include_router(recipes_router)  // 라우터 수동 등록
```

**4. 기본 엔드포인트**
```python
@app.get("/")
async def root():
    return {
        "message": "Recipe AI Service is running!",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "ai-service"
    }
```

**역할:**
- `/`: 서비스 실행 확인 및 문서 경로 안내
- `/health`: 헬스 체크 (모니터링/로드밸런서용)

#### 🐍 Python 가상환경 (venv) 설정

**가상환경이 필요한 이유:**
1. **프로젝트별 독립성**: 각 프로젝트가 서로 다른 패키지 버전 사용 가능
2. **글로벌 환경 오염 방지**: 시스템 Python에 영향 없음
3. **의존성 관리**: requirements.txt로 정확한 패키지 버전 관리
4. **배포 일관성**: 동일한 환경 재현 가능

**Conda vs Python venv 비교:**

| 구분 | Conda | Python venv |
|------|-------|-------------|
| 설치 | Anaconda/Miniconda 필요 | Python 내장 모듈 |
| 생성 | `conda create -n 이름` | `python -m venv 폴더명` |
| 활성화 | `conda activate 이름` | `.\venv\Scripts\Activate.ps1` |
| 저장 위치 | 중앙 집중 (`~/anaconda3/envs/`) | 프로젝트 폴더 내 (`./venv/`) |
| 패키지 관리 | `conda install` | `pip install` |
| 참조 방식 | 이름으로 참조 | 경로로 참조 |

**가상환경 생성 및 활성화:**

```bash
# 1. 가상환경 생성
python -m venv venv
         ↑    ↑    ↑
      모듈  명령  폴더명

# 2. 활성화 (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# 3. 활성화 확인
# 프롬프트 앞에 (venv) 표시
(venv) PS C:\Users\YES\Desktop\study\project\ai-service>

# 4. 비활성화
deactivate
```

**가상환경 폴더 구조:**
```
ai-service/
├── venv/                    # 가상환경 폴더
│   ├── Scripts/            # 활성화 스크립트 및 실행파일
│   │   ├── Activate.ps1   # PowerShell 활성화
│   │   ├── activate.bat   # CMD 활성화
│   │   ├── python.exe     # Python 인터프리터
│   │   ├── pip.exe        # 패키지 관리자
│   │   └── uvicorn.exe    # FastAPI 서버
│   ├── Lib/               # 설치된 패키지
│   │   └── site-packages/
│   └── pyvenv.cfg         # 가상환경 설정
├── app/
├── requirements.txt
└── .gitignore
```

#### 📦 requirements.txt 패키지 관리

**requirements.txt 구조:**
```txt
fastapi==0.115.4              # 웹 프레임워크
uvicorn[standard]==0.32.0     # ASGI 서버 + 성능 최적화
python-dotenv==1.0.1          # .env 파일 로딩
pydantic==2.9.2               # 데이터 검증
pydantic-settings==2.6.1      # 환경변수 관리 (BaseSettings)
openai==1.55.3                # OpenAI API 클라이언트
anthropic==0.34.2             # Claude API 클라이언트
httpx==0.28.1                 # 비동기 HTTP 클라이언트
python-multipart==0.0.12      # 파일 업로드 처리
```

**주요 패키지 역할:**

**1. uvicorn[standard]**
- `[standard]`: 추가 성능 최적화 패키지 포함
- `uvloop`: 고성능 이벤트 루프 (asyncio 대체)
- `httptools`: 빠른 HTTP 파싱
- `websockets`: WebSocket 지원

**2. pydantic-settings**
- **중요**: config.py의 `BaseSettings` 제공
- pydantic v2부터 별도 패키지로 분리됨
- 이 패키지가 없으면 config.py 실행 시 ImportError 발생

**3. python-multipart**
- FastAPI의 `File`, `Form` 데이터 처리
- 파일 업로드 기능 (향후 영상 레시피 추출에 필요)

**패키지 설치:**
```bash
# requirements.txt로 설치
pip install -r requirements.txt

# 개별 설치
pip install fastapi uvicorn[standard] pydantic-settings

# 설치 확인
pip list

# 설치된 패키지 목록 저장 (업데이트 시)
pip freeze > requirements.txt
```

**Windows 인코딩 이슈 해결:**
```bash
# 문제: requirements.txt의 한글 주석이 cp949로 인코딩됨
# 해결: 주석 제거 또는 UTF-8로 저장

# ❌ 에러 발생
UnicodeDecodeError: 'cp949' codec can't decode byte

# ✅ 해결 방법
# 1. requirements.txt에서 한글 주석 제거
# 2. 파일을 UTF-8 인코딩으로 저장
```

#### 🚀 uvicorn 서버 실행

**명령어 구조:**
```bash
uvicorn app.main:app --reload --port 8000
   ↑       ↑    ↑      ↑        ↑
 ASGI    모듈 앱객체  옵션1    옵션2
서버
```

**각 부분 설명:**

**1. `uvicorn`**
- ASGI 서버 (Asynchronous Server Gateway Interface)
- 비동기 Python 웹 애플리케이션 실행
- NestJS에서 `npm run start:dev`와 동일한 역할

**2. `app.main:app`**
- `app.main`: 모듈 경로 (`app/main.py`)
- `:app`: FastAPI 인스턴스 변수명

**파일 매핑:**
```
app.main:app
  ↓
ai-service/
  └── app/
      └── main.py
          └── app = FastAPI(...)
```

**3. `--reload`**
- 핫 리로드 (Hot Reload) 활성화
- 코드 변경 감지 시 자동 재시작
- **개발 환경 전용** (프로덕션 사용 금지)

**4. `--port 8000`**
- 서버 포트 지정
- 기본값: 8000 (생략 가능)

**추가 옵션:**
```bash
# 외부 접속 허용
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# 로그 레벨 설정
uvicorn app.main:app --reload --log-level debug

# 워커 프로세스 (프로덕션용)
uvicorn app.main:app --workers 4 --port 8000
```

**서버 실행 후 접속 URL:**
```
API 루트:        http://localhost:8000/
헬스체크:        http://localhost:8000/health
Swagger UI:      http://localhost:8000/docs
ReDoc:           http://localhost:8000/redoc
레시피 생성:     http://localhost:8000/api/recipes/generate
레시피 헬스체크: http://localhost:8000/api/recipes/health
```

#### 🎯 전체 애플리케이션 시작 흐름

```
1. 터미널에서 명령 실행
   uvicorn app.main:app --reload --port 8000
                ↓
2. uvicorn이 app/main.py 임포트
                ↓
3. main.py 실행
   - FastAPI 인스턴스 생성 (app)
   - CORS 미들웨어 등록
   - 라우터 등록 (recipes_router)
                ↓
4. generate.py 라우터 로드
   - POST /api/recipes/generate
   - GET /api/recipes/health
                ↓
5. config.py 로드
   - 환경변수 읽기 (.env)
   - Settings 인스턴스 생성
                ↓
6. ai_client.py 로드
   - AIClientFactory 준비
   - OpenAI/Claude 클라이언트 대기
                ↓
7. 서버 시작 완료
   INFO: Uvicorn running on http://127.0.0.1:8000
   INFO: Application startup complete
                ↓
8. Swagger UI 자동 생성
   http://localhost:8000/docs
```

#### 💡 핵심 학습 정리

**1. FastAPI 애플리케이션 구조**
- main.py: 앱 생성 및 통합
- 라우터: 엔드포인트 모듈화
- 미들웨어: CORS 등 전역 설정

**2. Python 가상환경의 중요성**
- 프로젝트별 독립된 패키지 관리
- requirements.txt로 의존성 버전 고정
- 배포 환경 일관성 보장

**3. uvicorn 명령어 구조 이해**
- `모듈경로:변수명` 패턴
- 개발/프로덕션 옵션 구분
- 핫 리로드로 개발 생산성 향상

**4. Swagger UI 자동 생성**
- FastAPI가 Pydantic 모델 기반으로 자동 생성
- `/docs`에서 실시간 API 테스트 가능
- NestJS보다 훨씬 간단한 설정

**5. NestJS vs FastAPI 서버 실행**

| 구분 | NestJS | FastAPI |
|------|--------|---------|
| 서버 | `npm run start:dev` | `uvicorn app.main:app --reload` |
| 핫 리로드 | 기본 내장 | `--reload` 플래그 |
| 앱 생성 | `NestFactory.create()` | `FastAPI()` |
| 라우터 등록 | 모듈 자동 로드 | `app.include_router()` 수동 등록 |
| Swagger | `@nestjs/swagger` 설치 필요 | 기본 내장 |

---

### 7. 환경변수 설정 및 실제 API 테스트

#### 🔑 .env 파일 설정

**파일 경로:** `ai-service/.env`

**환경변수 구조:**
```env
# AI Service Configuration
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxx
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxx

# Server Configuration
HOST=0.0.0.0
PORT=8000
DEBUG=True

# Main Service Configuration
MAIN_SERVICE_URL=http://localhost:3001
```

**각 환경변수 역할:**

**1. OPENAI_API_KEY**
- OpenAI GPT API 인증 키
- OpenAIClient에서 사용
- 발급: https://platform.openai.com/api-keys

**2. ANTHROPIC_API_KEY**
- Claude API 인증 키
- ClaudeClient에서 사용
- 발급: https://console.anthropic.com/settings/keys

**3. HOST / PORT**
- FastAPI 서버 바인딩 주소 및 포트
- `0.0.0.0`: 모든 네트워크 인터페이스에서 접속 허용
- `8000`: 기본 포트

**4. DEBUG**
- 디버그 모드 설정
- `True`: 상세한 에러 메시지 표시 (개발 환경)
- `False`: 간단한 에러 메시지만 표시 (프로덕션)

**5. MAIN_SERVICE_URL**
- NestJS 메인 서비스 주소 (향후 마이크로서비스 통신용)

#### 🔐 API 키 발급 가이드

**OpenAI API 키 발급:**
```
1. https://platform.openai.com/ 접속
2. 계정 생성 및 로그인
3. 우측 상단 프로필 → "View API keys"
4. "Create new secret key" 클릭
5. 키 이름 입력 후 생성
6. ⚠️ 생성된 키 즉시 복사 (한 번만 표시됨!)
7. 결제 정보 등록 (무료 크레딧 $5 제공)
```

**Anthropic Claude API 키 발급:**
```
1. https://console.anthropic.com/ 접속
2. 계정 생성 및 로그인
3. 좌측 메뉴 "API Keys" 선택
4. "Create Key" 클릭
5. 키 이름 입력 후 생성
6. ⚠️ 생성된 키 즉시 복사
7. 크레딧 충전 (무료 크레딧 $5 제공)
```

**가격 비교 (2024년 기준):**

| 모델 | 가격 (1M tokens) | 특징 |
|------|------------------|------|
| GPT-3.5-turbo | ~$2.00 | 빠르고 저렴 |
| GPT-4 | ~$30.00 | 높은 정확도 |
| Claude 3 Haiku | ~$0.25 | 가장 저렴 |
| Claude 3 Sonnet | ~$3.00 | 균형잡힌 성능 |

#### 🧪 Swagger UI를 통한 API 테스트

**1. Swagger UI 접속:**
```
http://localhost:8000/docs
```

**2. POST /api/recipes/generate 엔드포인트 테스트:**

**요청 예시 (OpenAI 사용):**
```json
{
  "ingredients": ["토마토", "계란", "양파"],
  "preferences": "간단하고 빠르게 만들 수 있는 요리",
  "provider": "openai"
}
```

**요청 예시 (Claude 사용):**
```json
{
  "ingredients": ["닭가슴살", "브로콜리", "마늘"],
  "preferences": "건강한 다이어트 식단",
  "provider": "claude"
}
```

**provider 생략 시 자동으로 OpenAI 사용:**
```json
{
  "ingredients": ["김치", "돼지고기", "두부"],
  "preferences": "매콤한 한식"
}
```

**성공 응답 예시:**
```json
{
  "success": true,
  "message": "레시피 생성이 완료되었습니다.",
  "data": {
    "recipe_name": "토마토 스크램블 에그",
    "ingredients_list": [
      "토마토 2개",
      "계란 3개",
      "양파 1/2개",
      "소금 약간",
      "후추 약간",
      "식용유 1큰술"
    ],
    "instructions": [
      "1. 토마토와 양파를 잘게 썬다.",
      "2. 팬에 식용유를 두르고 양파를 �볶는다.",
      "3. 토마토를 넣고 1분간 볶는다.",
      "4. 계란을 풀어서 넣고 저어가며 익힌다.",
      "5. 소금과 후추로 간을 맞춘다."
    ],
    "cooking_time": "10분",
    "difficulty": "쉬움",
    "raw_response": "AI 원본 응답 전체..."
  }
}
```

**3. GET /api/recipes/health 헬스체크:**
```
http://localhost:8000/api/recipes/health
```

**응답:**
```json
{
  "status": "healthy",
  "service": "recipes"
}
```

#### ⚠️ 일반적인 에러 및 해결 방법

**1. API 키 오류**
```json
{
  "detail": "OpenAI API 키가 설정되지 않았습니다."
}
```
**해결:** .env 파일에 OPENAI_API_KEY 설정 확인

**2. 잘못된 provider**
```json
{
  "detail": "지원하지 않는 AI 제공자입니다: gemini"
}
```
**해결:** provider를 "openai" 또는 "claude"로 변경

**3. 재료 목록 비어있음**
```json
{
  "detail": [
    {
      "loc": ["body", "ingredients"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```
**해결:** ingredients 필드에 최소 1개 이상의 재료 입력

#### 💡 테스트 팁

**1. OpenAI만으로 테스트:**
- ANTHROPIC_API_KEY는 비워두고 OpenAI만 사용 가능
- provider를 명시하지 않으면 기본값 "openai" 사용

**2. 다양한 재료 조합 테스트:**
```json
// 한식
{"ingredients": ["김치", "돼지고기", "두부"], "preferences": "매운맛"}

// 양식
{"ingredients": ["스파게티", "베이컨", "크림"], "preferences": "크리미한"}

// 간단한 요리
{"ingredients": ["계란", "밥"], "preferences": "5분 안에"}

// 건강식
{"ingredients": ["닭가슴살", "샐러드"], "preferences": "저칼로리"}
```

**3. Swagger UI Try it out 기능:**
- "Try it out" 버튼 클릭
- JSON 입력 후 "Execute" 실행
- 실시간 응답 확인 및 디버깅

#### 🎯 FastAPI 완전 검증 체크리스트

- [x] FastAPI 서버 정상 구동
- [x] Swagger UI 접속 및 자동 문서화 확인
- [x] .env 파일 환경변수 로딩 확인
- [x] OpenAI API 키 설정 및 인증 성공
- [x] POST /api/recipes/generate 정상 응답
- [x] AI 응답 파싱 및 구조화 성공
- [x] 에러 처리 동작 확인
- [x] CORS 설정으로 외부 호출 가능

✅ **FastAPI AI 서비스 단독 개발 완료!**

#### 📊 현재까지 구현 완료 현황

**완성된 파일 목록:**
```
ai-service/
├── app/
│   ├── core/
│   │   └── config.py              ✅ 환경변수 관리
│   ├── services/
│   │   └── ai_client.py           ✅ AI 클라이언트 (OpenAI/Claude)
│   ├── models/
│   │   └── schemas.py             ✅ Pydantic 모델
│   ├── api/
│   │   └── recipes/
│   │       └── generate.py        ✅ FastAPI 라우터
│   └── main.py                    ✅ FastAPI 앱 통합
├── venv/                          ✅ 가상환경
├── requirements.txt               ✅ 의존성 관리
└── .env                           ✅ 환경변수 설정
```

**구현된 기능:**
- ✅ 재료 기반 AI 레시피 추천
- ✅ OpenAI GPT-3.5-turbo 연동
- ✅ Claude API 연동 준비
- ✅ 정규표현식 기반 AI 응답 파싱
- ✅ Swagger UI 자동 문서화
- ✅ CORS 설정으로 외부 호출 지원
- ✅ 에러 처리 및 예외 관리

**기술 스택 숙련도:**
- ✅ FastAPI 프레임워크 완전 이해
- ✅ Pydantic 모델 및 검증 시스템
- ✅ 비동기 프로그래밍 (async/await)
- ✅ 팩토리 패턴 설계
- ✅ Python 가상환경 관리
- ✅ 환경변수 기반 설정 관리

🎉 **다음 단계: NestJS와 FastAPI 마이크로서비스 통합!**

---

## 📝 FastAPI 파싱 로직 개선 - 쉼표 구분 재료 지원 (2024-09-30)

### 🎯 문제 상황
Frontend에서 AI 생성 레시피를 저장하려 할 때 400 Bad Request 에러 발생

#### 에러 원인 분석
```json
// AI가 반환한 재료 (쉼표로 구분)
"재료: 토마토, 양파, 베이컨, 식용유, 소금, 후추"

// FastAPI 파싱 결과 (단일 문자열)
{
  "ingredients": ["토마토, 양파, 베이컨, 식용유, 소금, 후추"]
}

// NestJS CreateRecipeDto 기대 형식 (개별 문자열 배열)
{
  "ingredients": ["토마토", "양파", "베이컨", "식용유", "소금", "후추"]
}
```

**문제:**
- FastAPI 파싱 로직이 줄바꿈(`\n`)만 처리
- AI가 쉼표로 구분된 재료를 반환하면 단일 문자열로 처리됨
- NestJS 검증 실패 (배열 형태가 아님)

---

### 🔧 파싱 로직 개선

#### 파일 위치
`ai-service/app/api/recipes/generate.py` (lines 52-62)

#### 기존 코드 (문제점)
```python
# 재료 추출 - 줄바꿈만 지원
ingredients_match = re.search(r'재료:\s*(.*?)(?=조리법)', response, re.DOTALL)
if ingredients_match:
    ingredients_text = ingredients_match.group(1).strip()
    result["ingredients"] = [
        ing.strip()
        for ing in ingredients_text.split('\n')  # 줄바꿈으로만 분리
        if ing.strip()
    ]
```

**한계:**
- 줄바꿈 구분만 처리
- 쉼표로 구분된 재료는 단일 문자열로 반환

#### 개선된 코드 (해결)
```python
# 재료 추출 - 줄바꿈 + 쉼표 구분 모두 지원
ingredients_match = re.search(
    r'재료:\s*(.*?)(?=조리법|만드는법|조리순서)',
    response,
    re.DOTALL
)

if ingredients_match:
    ingredients_text = ingredients_match.group(1).strip()

    # 1단계: 줄바꿈으로 분리 시도
    lines = [
        ing.strip()
        for ing in ingredients_text.split('\n')
        if ing.strip() and ing.strip() != "-"
    ]

    # 2단계: 줄바꿈이 없고 쉼표가 있으면 쉼표로 분리
    if len(lines) == 1 and ',' in lines[0]:
        result["ingredients"] = [
            ing.strip()
            for ing in lines[0].split(',')
            if ing.strip()
        ]
    else:
        result["ingredients"] = lines
else:
    result["ingredients"] = []
```

#### 개선 사항
1. **스마트 파싱**: 줄바꿈 우선 → 쉼표 대체
2. **다양한 형식 지원**: AI 응답 변동성 대응
3. **불필요한 문자 제거**: `-` 기호 필터링
4. **빈 배열 기본값**: 안전한 fallback

---

### 🧪 테스트 케이스

#### 케이스 1: 줄바꿈 형식 (기존 동작 유지)
```
재료:
- 토마토 2개
- 양파 1개
- 베이컨 3줄
```

**파싱 결과:**
```python
["토마토 2개", "양파 1개", "베이컨 3줄"]
```

#### 케이스 2: 쉼표 구분 형식 (신규 지원) ✅
```
재료: 토마토, 양파, 베이컨, 식용유, 소금, 후추
```

**파싱 결과:**
```python
["토마토", "양파", "베이컨", "식용유", "소금", "후추"]
```

#### 케이스 3: 혼합 형식
```
재료:
토마토, 양파
베이컨
```

**파싱 결과:**
```python
["토마토, 양파", "베이컨"]  # 줄바꿈 우선
```

---

### 💡 학습 포인트

**1. AI 응답의 불확실성 대응**
- AI는 동일한 프롬프트에도 다양한 형식으로 응답
- 파싱 로직은 여러 형식을 지원해야 안정적

**2. 방어적 프로그래밍**
```python
# 안전한 파싱 전략
1. 우선 순위 설정 (줄바꿈 > 쉼표)
2. 조건부 로직으로 다양한 케이스 처리
3. 빈 배열 기본값으로 에러 방지
```

**3. 프롬프트 엔지니어링의 한계**
- 프롬프트로 형식을 강제해도 AI가 항상 따르지 않음
- **해결책**: 파싱 로직에서 유연하게 처리

**4. 마이크로서비스 간 데이터 검증**
- FastAPI 응답 → NestJS DTO 검증
- 중간에 데이터 형식 불일치 발견
- 양쪽 모두 수정 필요 (FastAPI 파싱 + NestJS 검증)

---

### 🔄 통합 테스트 결과

**Before (에러 발생):**
```
POST /recipes/generate-ai
→ FastAPI 응답: {"ingredients": ["토마토, 양파, 베이컨"]}
→ NestJS 검증 실패: 400 Bad Request
```

**After (정상 동작):**
```
POST /recipes/generate-ai
→ FastAPI 응답: {"ingredients": ["토마토", "양파", "베이컨"]}
→ NestJS 검증 성공: 레시피 저장 완료 ✅
```

---

