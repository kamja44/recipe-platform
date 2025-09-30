# AI 레시피 추천 플랫폼 프로젝트

## 프로젝트 개요
재료 기반 AI 레시피 추천 및 요리 커뮤니티 플랫폼

## 아키텍처
**마이크로서비스 구조**
- **NestJS 메인 서비스** (포트: 3000)
  - 사용자 인증, 레시피 CRUD, 리뷰 관리
  - PostgreSQL + Redis
- **FastAPI AI 서비스** (포트: 8000)
  - AI 레시피 추천, 재료 인식, 영양분석
  - OpenAI/Claude API 연동

## 기술 스택
### Frontend
- Next.js 15.5.4, React 19.1.0, TypeScript
- Tailwind CSS v4, shadcn/ui (Spectrum UI)
- Turbopack (개발/빌드 성능 최적화)

### Backend
- **Main**: NestJS, TypeScript, PostgreSQL, Redis
- **AI**: FastAPI, Python, OpenAI/Anthropic API
- **Computer Vision** (예정): OpenCV, YOLO, GPT-4V, 영상 처리

### DevOps
- Docker Compose, GitHub Actions

## 핵심 기능
1. 재료 입력 → AI 레시피 추천
2. 레시피 CRUD 및 평점 시스템
3. 사용자 커뮤니티 및 레시피 공유
4. 영양정보 분석 및 식단 관리
5. **컴퓨터 비전 기반 영상 레시피 추출** (예정)
   - 1분 미만 요리 영상 업로드
   - AI가 영상 분석하여 재료/조리법 자동 추출
   - 프레임별 객체 인식 및 조리 과정 분석
   - 자동 레시피 텍스트 생성

## 개발 환경
- 운영체제: Windows 11
- 작업 디렉토리: C:\Users\YES\Desktop\study\project

## 명령어
### 개발 환경
- **Frontend**: `cd frontend && npm run dev`
- **Main 서비스**: `cd main-service && npm run start:dev`
- **AI 서비스**: `cd ai-service && pip install -r requirements.txt && uvicorn app.main:app --reload`
- **전체 서비스**: `docker-compose up`

### UI 컴포넌트 추가
```bash
cd frontend
npx shadcn@latest add [component-name]
```

### shadcn/ui 컴포넌트 단계별 설치 가이드
**⚠️ 주의: 반드시 frontend 폴더에서 실행**

```bash
# 1단계: 기본 필수 컴포넌트 (현재 단계)
npx shadcn@latest add badge input textarea select label

# 2단계: 폼 관련 (향후 필요시)
npx shadcn@latest add checkbox radio-group switch form

# 3단계: 레이아웃 관련 (향후 필요시)
npx shadcn@latest add separator sheet dialog tabs

# 4단계: 피드백 관련 (향후 필요시)
npx shadcn@latest add alert-dialog toast progress skeleton
```

### 빌드 및 배포
- Frontend 빌드: `cd frontend && npm run build`
- Main 서비스 빌드: `cd main-service && npm run build`

## 프로젝트 구조 (모노레포)
```
project/                        # 모노레포 루트
├── frontend/                   # Next.js 프론트엔드
│   ├── src/
│   │   ├── app/               # App Router
│   │   ├── components/        # 재사용 컴포넌트
│   │   ├── hooks/             # 커스텀 훅
│   │   ├── lib/               # 유틸리티 함수
│   │   └── types/             # 타입 정의
│   ├── public/
│   ├── package.json
│   └── tailwind.config.js
│
├── main-service/              # NestJS 메인 서비스
│   ├── src/
│   │   ├── auth/              # 인증 모듈
│   │   ├── users/             # 사용자 관리
│   │   ├── recipes/           # 레시피 CRUD
│   │   ├── reviews/           # 리뷰 시스템
│   │   ├── common/            # 공통 모듈
│   │   └── main.ts
│   ├── test/
│   ├── package.json
│   └── nest-cli.json
│
├── ai-service/                # FastAPI AI 서비스
│   ├── app/
│   │   ├── api/               # API 엔드포인트
│   │   ├── core/              # 설정 및 보안
│   │   ├── services/          # AI 서비스 로직
│   │   └── main.py
│   └── requirements.txt
│
├── docker-compose.yml         # 전체 서비스 오케스트레이션
├── .env.example              # 환경변수 예시
├── .gitignore                # Git 제외 파일
├── CLAUDE.md                 # 프로젝트 지침
└── README.md                 # 프로젝트 가이드
```

## 개발 규칙
1. 코드 스타일과 컨벤션 준수
2. 커밋 전 린트/타입체크 실행
3. 테스트 작성 및 실행
4. 보안 모범 사례 준수
5. 민감한 정보 커밋 금지

## 설치된 주요 패키지
### Frontend
- **UI**: shadcn/ui, @radix-ui/react-slot, lucide-react
- **스타일링**: Tailwind CSS v4, class-variance-authority, clsx, tailwind-merge
- **개발**: TypeScript, ESLint, Turbopack

### 현재 상태
✅ 모노레포 구조 생성
✅ Next.js 15 + React 19 프론트엔드
✅ NestJS 백엔드 서비스
✅ FastAPI AI 서비스
✅ shadcn/ui 디자인 시스템 구성
✅ Docker Compose 설정

### Backend 개발 완료 현황 (2024-09-29)
✅ **NestJS 완전한 백엔드 API 구현 완료** 🎉
- Production 수준의 NestJS 마이크로서비스 완성
- PostgreSQL + TypeORM 연동 및 Entity 관계 설정
- 사용자 인증 시스템 (bcrypt 패스워드 해싱)
- 레시피 CRUD API (검색, 페이지네이션, 관계 데이터 로딩)
- Swagger API 문서화 및 자동 검증 시스템

✅ **NestJS 서버 실행 및 API 테스트 완료** (2024-09-29)
- **서버 접속**: http://localhost:3001 (포트 충돌 해결)
- **Swagger 문서**: http://localhost:3001/api (완전한 API 문서)
- **환경변수 문제 해결**: DB_* 형식으로 통일
- **전역 ValidationPipe 설정**: DTO 자동 검증 및 타입 변환
- **실제 API 엔드포인트 동작 확인**: 모든 CRUD 기능 정상 작동

✅ **완전 구현된 기능들**
- **사용자 API**: 회원가입, 로그인, 프로필 조회/수정 (`/users`)
- **레시피 API**: CRUD, 검색, 카테고리별 조회 (`/recipes`)
- **보안 시스템**: bcrypt 해싱, 입력 검증, 에러 처리
- **데이터베이스**: PostgreSQL 연동, Entity 관계, Repository 패턴
- **문서화**: Swagger UI를 통한 실시간 API 테스트 환경

✅ **기술적 마스터 달성**
- **NestJS 아키텍처**: DTO → Service → Controller → Module 완전 이해
- **TypeORM**: Entity 설계, 관계 매핑, Repository 패턴 숙련
- **보안 모범 사례**: 패스워드 해싱, 정보 누출 방지, 입력 검증
- **API 설계**: RESTful 원칙, HTTP 상태 코드, Swagger 문서화
- **모듈 시스템**: 의존성 주입, 계층 분리, 확장 가능한 구조

- **Docker Compose 환경**: 마이크로서비스 컨테이너 아키텍처
- **환경변수 관리**: 이중 .env 구조로 개발/프로덕션 분리
- **PostgreSQL 컨테이너**: 데이터 영속성 및 자동 스키마 동기화
- **포트 관리**: Frontend(3000), Backend(3001), AI서비스(8000) 분리

✅ **JWT 토큰 기반 인증 시스템 완전 구현 완료** (2024-09-29)
- **JWT 인증 아키텍처**: Service-Strategy-Guard 패턴 구현
- **보안 강화**: 안전한 JWT_SECRET 생성 및 Bearer 토큰 검증
- **타입 안전성**: auth.types.ts 분리 및 완전한 타입 커버리지
- **Passport 통합**: JwtStrategy 및 AuthGuard 미들웨어 구현
- **모듈 설계**: AuthModule과 AppModule 완전 통합
- **JWT API 통합**: 로그인 시 JWT 토큰 발급 및 Bearer 토큰 인증
- **보호된 라우트**: @UseGuards(JwtAuthGuard) + @ApiBearerAuth() 구현
- **순환 의존성 해결**: forwardRef() 패턴으로 모듈간 순환 참조 해결

✅ **JWT 인증 시스템 실제 테스트 및 트러블슈팅 완료** (2024-09-29)
- **실제 API 테스트**: Swagger UI를 통한 회원가입 API 완전 동작 검증
- **JWT 토큰 오류 해결**: JWT_SECRET 환경변수 멀티라인 형식 문제 발견 및 해결
- **bcrypt 해싱 검증**: 패스워드 보안 및 응답에서 패스워드 제외 확인
- **환경변수 디버깅**: 체계적인 문제 진단 및 해결 프로세스 구축
- **Production 수준 테스트**: 실제 데이터베이스 연동 및 완전한 기능 검증
- **보안 모범 사례**: JWT_SECRET 생성, 환경변수 관리, 에러 처리 최적화

🎯 **완성된 인증 시스템**
- 회원가입/로그인 API (실제 동작 검증 완료)
- JWT 토큰 발급 및 검증 (환경변수 문제 해결)
- Bearer 토큰 기반 API 보호
- Swagger JWT 인증 지원
- Production 수준 보안 구현 및 실제 테스트 완료

🔄 **다음 단계**
- [ ] FastAPI AI 서비스 기본 구조 구현
- [ ] NestJS와 FastAPI 간 마이크로서비스 통신
- [ ] AI 레시피 추천 기능 구현
- [ ] Frontend-Backend API 연동
- [ ] 통합 테스트 및 E2E 테스트

### Frontend 개발 완료 현황 (2024-09-28)
✅ **기본 페이지 구조 완성**
- 홈페이지 (Hero, Features, CTA 섹션)
- AI 레시피 추천 페이지 (/recommend)
- 레시피 상세 페이지 (/recipes/[id])
- 레시피 목록 페이지 (/recipes)
- 인증 페이지 (/auth)

✅ **SOLID 원칙 기반 컴포넌트 리팩토링 완료**
- **RecommendationResults 분리**: EmptyState, LoadingState, RecipeList
- **IngredientsInput 분리**: IngredientInputField, IngredientsList, RecommendButton
- **RecipeDetailPage 완전 분리**: RecipeHeader, RecipeIngredients, RecipeNutrition, RecipeInstructions, RecipeTips
- **RecipesPage 완전 분리**: PageTitleSection, RecipeGrid, EmptyState 재활용
- **AuthPage 부분 분리**: AuthHeader, PasswordField
- **공통 컴포넌트**: EmptyState, LoadingState (children 패턴 적용)
- **UX 개선**: Enter 키로 재료 추가 기능

✅ **학습된 리팩토링 패턴**
- SRP(단일 책임 원칙) 적용으로 컴포넌트 분리
- children 패턴 활용으로 유연한 컴포넌트 설계
- Props 최적화: 전체 객체 대신 필요한 데이터만 전달
- 불필요한 의존성 제거 및 코드 라인 수 30% 감소
- 현재 코드 기준 리팩토링 (미래 확장성 고려 제외)
- **컴포넌트 독립 상태 관리**: useState로 캡슐화된 상태
- **중복 코드 제거**: 공통 컴포넌트 재활용
- **외부 spacing 분리**: margin은 부모에서 관리

### 리팩토링 원칙 및 가이드라인
⚠️ **중요 원칙**
- **현재 코드만 고려**: 미래 기능이나 확장성은 생각하지 말고 현재 구현된 코드만 기준으로 리팩토링
- **SOLID 원칙 준수**: 특히 SRP(단일 책임 원칙)를 우선적으로 적용하여 컴포넌트 분리
- **과도한 추상화 금지**: 현재 필요하지 않은 추상화나 복잡한 패턴은 피하고 간단명료하게 구현
- **실용적 접근**: 학습 목적에 맞는 적절한 수준의 리팩토링 진행

### 컴포넌트 설계 원칙 (2024-09-28 학습)
⚠️ **Spacing 관리 원칙**
- **margin**: 외부 spacing → 부모 컴포넌트가 관리
- **padding**: 내부 spacing → 컴포넌트 자체가 관리
- **CSS-in-JS 커뮤니티 합의**: "Never apply external spacing inside a component"

⚠️ **상태 관리 원칙**
- **컴포넌트 독립성**: 각 컴포넌트 인스턴스는 독립적인 상태를 가짐
- **useState 격리**: 동일한 컴포넌트를 여러 번 사용해도 상태는 분리됨
- **캡슐화**: 컴포넌트 내부에서만 필요한 상태는 내부에서 관리

⚠️ **재사용성 원칙**
- **기존 컴포넌트 재활용**: 새로 만들기 전에 기존 공통 컴포넌트 활용 검토
- **Props 최적화**: 전체 객체보다는 필요한 데이터만 전달
- **타입 활용**: 기존 정의된 타입 인터페이스 재사용 (예: RecipeListItem)

### 향후 구현 예정
🔄 **컴퓨터 비전 레시피 추출**
- 영상 업로드 및 처리 시스템
- OpenCV 기반 프레임 분석
- YOLO 객체 탐지 (재료/도구 인식)
- GPT-4V 영상 분석 및 레시피 생성
- 영상 → 텍스트 레시피 변환 파이프라인

## Frontend 개발 단계 및 방법론

### 개발 단계 (우선순위 순)
**1단계: 기본 인프라 구축** 📐
- Header/Footer 컴포넌트 생성
- 전역 레이아웃 설정
- 라우팅 구조 계획

**2단계: 핵심 페이지 개발** 🎯
- ✅ 랜딩 페이지 완료 (HeroSection, FeaturesSection, CTASection)
- ✅ 재료 입력 → AI 추천 페이지 완료 (IngredientsInput, RecommendationResults)
- ✅ 레시피 상세 페이지 완료 (RecipeHeader, RecipeIngredients, RecipeNutrition, RecipeInstructions, RecipeTips)
- ✅ 레시피 목록 페이지 완료 (PageTitleSection, RecipeGrid, EmptyState)
- 🔄 인증 페이지 (AuthHeader, PasswordField 완료 / LoginForm, SignupForm 예정)

**3단계: 사용자 기능** 👤
- 로그인/회원가입 페이지
- 마이페이지 (즐겨찾기, 내 레시피)

**4단계: 커뮤니티 기능** 👥
- 레시피 목록 페이지
- 리뷰/평점 시스템

### 개발 방법론 (학습 목적)
⚠️ **중요**: 이 프로젝트는 학습용이므로 다음 규칙을 준수

**코드 작성 원칙:**
- **Claude는 코드를 직접 수정하지 않음**
- **Claude는 가이드와 코드 예시만 제공**
- **사용자가 직접 코드를 작성하여 학습**
- **코드 제공 방식**:
  - Claude가 코드 블록으로 제공
  - 어느 파일에 어떤 코드를 어떻게 넣어야 하는지 명확히 설명
  - 사용자가 파일에 직접 작성
  - 작업 완료 후 사용자가 Claude에게 검토 요청

**작업 플로우:**
1. Claude가 작업 가이드 및 코드 예시 제공
2. 사용자가 직접 코드 작성
3. 사용자가 "작업 완료했어, 검토해줘" 요청
4. Claude가 코드 검토 및 피드백 제공
5. 다음 단계 진행

- 단계별 진행하며 각 단계 완료 후 다음 단계로 진행
### AI Service 개발 완료 현황 (2024-09-30)

✅ **FastAPI AI 서비스 기본 구조 완성** 🤖
- **pydantic_settings**: 환경변수 자동 매핑 및 타입 안전성 확보
- **설정 관리**: config.py를 통한 중앙집중식 환경변수 관리
- **마이크로서비스 통신**: main_service_url 설정으로 NestJS 연동 준비

✅ **AI 클라이언트 서비스 완전 구현** (2024-09-29)
- **팩토리 패턴**: AIClientFactory로 OpenAI/Claude 클라이언트 추상화
- **비동기 프로그래밍**: FastAPI와 일관된 async/await 패턴 적용
- **에러 핸들링**: API 호출 실패시 명확한 에러 메시지 제공
- **환경변수 연동**: config.py와 완전 통합된 API 키 관리
- **DRY 원칙 적용**: 중복된 프롬프트 생성 로직을 공통 함수로 분리

✅ **Pydantic 모델 및 라우터 구현 완료** (2024-09-30)
- **schemas.py**: RecipeRequest, RecipeResponse, APIResponse 모델 정의
- **generate.py**: FastAPI 라우터 및 엔드포인트 구현
- **정규표현식 파싱**: AI 응답을 구조화된 데이터로 변환
- **에러 처리**: ValueError/Exception 처리 전략 구현

✅ **FastAPI AI 서비스 단독 개발 완료** (2024-09-30) 🎉
- **main.py**: FastAPI 앱 생성, 라우터 등록, CORS 설정
- **가상환경**: Python venv 생성 및 패키지 설치 완료
- **서버 실행**: uvicorn으로 FastAPI 서버 정상 구동
- **Swagger UI**: http://localhost:8000/docs 자동 생성
- **.env 설정**: OpenAI API 키 설정 및 환경변수 관리
- **실제 테스트**: Swagger UI를 통한 AI 레시피 생성 성공

✅ **NestJS ↔ FastAPI 마이크로서비스 통합 완료** (2024-09-30) 🎊
- **RecipesModule**: HttpModule 추가 및 의존성 주입
- **RecipesService**: FastAPI 호출 로직 구현 (HttpService + ConfigService)
- **DTO 타입 안전성**: any 제거, 명시적 타입 정의 (GenerateRecipeDto, AIRecipeResponseDto)
- **RecipesController**: POST /recipes/generate-ai 엔드포인트 추가
- **환경변수 설정**: AI_SERVICE_URL 추가
- **실제 통신 테스트**: NestJS → FastAPI → OpenAI 완전 검증 성공

🎯 **AI 서비스 현재 상태**
- ✅ 기본 구조 완성 (config.py, ai_client.py, schemas.py, generate.py, main.py)
- ✅ OpenAI GPT-3.5-turbo API 연동 완료 및 테스트 성공
- ✅ Claude API 연동 준비 완료 (선택적 사용 가능)
- ✅ 라우터 및 엔드포인트 구현 완료
- ✅ FastAPI 애플리케이션 통합 및 서버 실행 완료
- ✅ 환경변수 설정 및 실제 AI API 호출 검증 완료
- ✅ Swagger UI를 통한 API 테스트 환경 구축
- ✅ **NestJS와 FastAPI 마이크로서비스 통합 완료**

📋 **개발 전략**
**1단계: FastAPI 독립 개발 및 테스트** ✅ **완료!**
- ✅ FastAPI 단독으로 모든 기능 구현 및 검증
- ✅ Swagger UI로 API 테스트
- ✅ 클라이언트가 직접 FastAPI 호출하는 구조
- ✅ OpenAI API 연동 및 실제 레시피 생성 성공

**2단계: NestJS 통합 및 마이크로서비스 통신** ✅ **완료!**
- ✅ NestJS RecipesModule에 HttpModule 추가
- ✅ RecipesService에서 FastAPI 호출 로직 구현
- ✅ DTO 타입 안전성 확보 (any 제거)
- ✅ RecipesController 엔드포인트 추가 (POST /recipes/generate-ai)
- ✅ 환경변수 설정 (AI_SERVICE_URL)
- ✅ 실제 마이크로서비스 통신 테스트 성공

**3단계: Frontend 통합** (다음 진행 예정)
- [ ] Next.js에서 NestJS API 호출
- [ ] AI 레시피 생성 UI 구현
- [ ] 사용자 경험 개선

✅ **Frontend 통합 완료** (2024-09-30)
- ✅ Frontend → NestJS → FastAPI → OpenAI 완전 통합
- ✅ AI 레시피 생성 페이지 실시간 동작
- ✅ AI 생성 레시피 DB 저장 기능 구현
- ✅ 저장된 레시피 목록 조회 페이지 구현
- ✅ useMutation을 활용한 레시피 저장 기능
- ✅ useQuery를 활용한 레시피 목록 조회
- ✅ 커스텀 훅 분리 (useRecipes)
- ✅ FastAPI 파싱 로직 개선 (쉼표 구분 재료 지원)
- ✅ TypeORM Entity userId nullable 처리

🔄 **다음 단계**
- [ ] 사용자 인증 시스템 (JWT 토큰 Frontend 연동)
- [ ] 레시피 상세 페이지 실제 데이터 연동
- [ ] 레시피 수정/삭제 기능
- [ ] 페이지네이션 구현
- [ ] 에러 처리 개선 (타임아웃, 재시도)
- [ ] 프로덕션 배포 준비

💻 **개발 환경 명령어**
```bash
# FastAPI 서버 실행
cd ai-service
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --port 8000

# 접속 URL
http://localhost:8000/docs                # Swagger UI
http://localhost:8000/api/recipes/health  # 헬스체크
http://localhost:8000/api/recipes/generate # 레시피 생성 API

# NestJS 서버 실행 (향후 통합 시)
cd main-service
npm run start:dev
http://localhost:3001/api # NestJS Swagger
```

🏆 **FastAPI 개발 완료 성과**
- 재료 기반 AI 레시피 추천 시스템 구축
- OpenAI GPT-3.5-turbo 완전 연동
- 정규표현식 기반 AI 응답 파싱
- Pydantic 모델을 통한 타입 안전성 확보
- 비동기 프로그래밍으로 고성능 구현
- Swagger UI 자동 문서화로 개발 생산성 향상

