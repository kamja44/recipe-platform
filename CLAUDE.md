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

### Frontend 인증 시스템 구현 완료 (2024-10-01)

✅ **React Hook Form 기반 인증 폼 완성**
- **LoginForm 컴포넌트**: React Hook Form + 이메일/비밀번호 검증
- **SignupForm 컴포넌트**: 비밀번호 확인 검증 (watch + validate)
- **PasswordField**: forwardRef 패턴으로 register() 호환
- **types/auth.ts**: LoginFormData, SignupFormData 타입 정의

✅ **인증 상태 관리 시스템 구축**
- **AuthContext**: Context API로 전역 인증 상태 관리
- **useAuth 훅**: Context 소비 훅 (hooks/ 폴더 분리)
- **localStorage**: 토큰/사용자 정보 영구 저장
- **TanStack Query useMutation**: 로그인/회원가입 API 호출

✅ **비즈니스 로직과 UI 로직 완전 분리**
- **page.tsx**: 비즈니스 로직 (API 호출, 리다이렉트, 에러 처리)
- **Form 컴포넌트**: UI 로직 (폼 렌더링, 검증)
- **콜백 패턴**: onSuccess로 검증된 데이터만 전달
- **재사용성 극대화**: 모달, 체크아웃 등 다양한 상황에서 사용 가능

✅ **학습 내용 문서화**
- **TIL-Auth.md**: React Hook Form, 비즈니스/UI 로직 분리 원칙 추가
- **TIL-Frontend.md**: Separation of Concerns 섹션 추가
- **CLAUDE.md**: Form 구현 원칙, 비즈니스 로직 분리 원칙 추가

✅ **인증 시스템 통합 완료** (2024-10-01)
- **layout.tsx에 AuthProvider 추가**: 전역 인증 상태 관리 활성화
- **Axios 인터셉터**: JWT 토큰 자동 추가, 401 에러 시 토큰 제거
- **ProtectedRoute 컴포넌트**: 인증 필요 페이지 보호, LoadingState 재사용
- **Header 로그인 상태 표시**: 조건부 렌더링 (로그인/로그아웃 버튼)

🎯 **완성된 인증 시스템 전체 구조**
```
Frontend 인증 플로우:
1. 사용자 로그인 → AuthContext에 토큰/사용자 저장
2. localStorage에 영구 저장 (새로고침 유지)
3. Axios 인터셉터가 모든 API 요청에 토큰 자동 추가
4. ProtectedRoute로 보호된 페이지 접근 제어
5. Header에 로그인 상태 실시간 표시
```

✅ **Frontend-Backend 연동 테스트 완료** (2024-10-01)
- **CORS 설정**: credentials 오타 수정 (Credential → credentials)
- **API 경로 수정**: `/users/register`, `/users/login` 경로 통일
- **DTO 필드명 통일**: Backend `name` → `username` 변경
- **회원가입 성공**: test@test.com 계정 생성 완료
- **로그인 성공**: JWT 토큰 발급 및 localStorage 저장 확인
- **토큰 자동 추가**: Axios 인터셉터가 Authorization 헤더 자동 추가 확인
- **Header 상태 표시**: "test님" 표시 및 로그아웃 버튼 정상 작동
- **새로고침 유지**: localStorage 덕분에 브라우저 재시작 후에도 로그인 유지

🎉 **인증 시스템 완전 작동 확인**
```
✅ 회원가입 → 로그인 → 토큰 저장 → 자동 헤더 추가 → 상태 표시 → 새로고침 유지
완벽한 인증 플로우 동작!
```

🔄 **Backend 다음 단계**
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

### Form 구현 원칙 (React Hook Form)

⚠️ **Form 상태 관리 원칙**
- **React Hook Form 사용 필수**: useState 대신 useForm() 훅 사용
- **컴포넌트 내부에서 폼 선언**: SOLID 원칙(SRP) 준수
- **부모는 결과만 받음**: onSuccess 콜백 패턴 사용
- **폼 검증 로직 캡슐화**: register()로 선언적 검증

**Form 아키텍처 패턴:**
```typescript
// ✅ 올바른 패턴: 컴포넌트 내부에서 useForm 선언
function LoginForm({ onSuccess, isLoading }: LoginFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data: LoginFormData) => {
    onSuccess(data);  // 부모에게 검증된 데이터만 전달
  };

  return <form onSubmit={handleSubmit(onSubmit)}>...</form>;
}

// ❌ 잘못된 패턴: page.tsx에서 useForm 선언
function AuthPage() {
  const loginForm = useForm<LoginFormData>();  // 이렇게 하지 말 것
  return <LoginForm form={loginForm} />;
}
```

**이유:**
- LoginForm이 자신의 폼만 책임 (단일 책임 원칙)
- 폼 구현 세부사항 캡슐화 (정보 은닉)
- 컴포넌트 재사용성 극대화
- Page 컴포넌트는 비즈니스 로직만 처리

**검증 규칙 작성:**
```typescript
{...register("email", {
  required: "이메일을 입력해주세요",
  pattern: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: "올바른 이메일 형식이 아닙니다",
  },
})}
```

**비밀번호 확인 검증:**
```typescript
const password = watch("password");  // 실시간 감시

{...register("confirmPassword", {
  validate: (value) => value === password || "비밀번호가 일치하지 않습니다",
})}
```

**forwardRef 패턴 (커스텀 Input):**
```typescript
// register()와 호환되는 커스텀 컴포넌트
export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ id, placeholder, ...props }, ref) => {
    return <Input ref={ref} {...props} />;
  }
);
PasswordField.displayName = "PasswordField";
```

**작업 플로우:**
1. Claude가 작업 가이드 및 코드 예시 제공
2. 사용자가 직접 코드 작성
3. 사용자가 "작업 완료했어, 검토해줘" 요청
4. Claude가 코드 검토 및 피드백 제공
5. 다음 단계 진행

- 단계별 진행하며 각 단계 완료 후 다음 단계로 진행

### TIL 문서 작성 가이드
⚠️ **중요**: TIL 작성 시 다음 원칙을 준수

**시각화 원칙:**
- **아스키 아트 활용 필수**: 복잡한 구조나 플로우는 반드시 아스키 아트로 시각화
- **데이터 흐름 표현**: 화살표(→, ↓)를 사용하여 데이터 흐름 명확히 표시
- **계층 구조 표현**: 들여쓰기와 박스(┌─┐└─┘)를 활용하여 계층 관계 표현
- **비교표 활용**: 개념 비교 시 표(table) 형식 활용

**아스키 아트 예시:**
```
┌─────────────────────────────────────────────────┐
│                  상위 컴포넌트                    │
└───────────────────┬─────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│               중간 컴포넌트                       │
└───────────────────┬─────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│               하위 컴포넌트                       │
└─────────────────────────────────────────────────┘
```

**설명 구조:**
1. **개념 소개**: 무엇을 배웠는지
2. **시각적 표현**: 아스키 아트로 구조/플로우 표현
3. **코드 분석**: 실제 코드와 문법 설명
4. **핵심 정리**: 배운 내용 요약

**문서 구성:**
- 목차 제공 (긴 문서의 경우)
- 이모지 활용으로 가독성 향상
- 코드 블록에 언어 명시
- 실제 프로젝트 파일 경로 명시
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

✅ **FastAPI AI 서비스 테스트 완료** (2024-10-01)
- ✅ FastAPI 서버 실행 및 정상 동작 확인
- ✅ 헬스 체크 엔드포인트 테스트 성공
- ✅ AI 레시피 생성 API 테스트 성공
- ✅ Frontend → NestJS → FastAPI → OpenAI 완전 통합 동작 확인

✅ **SSE 스트리밍 통신 구현 완료** (2024-10-01) 🎉
- **FastAPI SSE 엔드포인트**: `/api/recipes/generate-stream` 구현
  - `StreamingResponse`로 SSE 형식 응답 (`data: {...}\n\n`)
  - 비동기 제너레이터 함수 (`async def event_generator()`)
  - `ensure_ascii=False`로 한글 깨짐 방지
- **OpenAI 스트리밍 API**: `stream=True` 옵션으로 실시간 응답
  - `async for chunk in stream` 패턴
  - `chunk.choices[0].delta.content` 증분 데이터 처리
- **Claude 스트리밍 API**: `generate_recipe_stream()` 메서드 구현
- **NestJS 스트리밍 프록시**: GET 요청을 POST로 변환
  - `@Query()` 전체 객체로 받아 ValidationPipe 우회
  - `responseType: 'stream'`으로 Axios 스트림 모드
  - `stream.pipe(res)`로 FastAPI 응답 프록시
- **Frontend EventSource**: 브라우저 네이티브 SSE 클라이언트
  - `new EventSource(url)` 자동 GET 요청
  - `eventSource.onmessage`로 실시간 메시지 수신
  - `setRecipe((prev) => prev + content)` 누적 업데이트
- **NestJS 라우트 순서 수정**: 동적 경로(`:id`)를 구체적 경로 뒤로 이동
- **실시간 UX**: AI 응답이 타이핑되듯 한 글자씩 화면에 표시

🎯 **스트리밍 통신 구조**
```
Frontend (EventSource GET)
    ↓ Query String
NestJS (프록시: GET → POST 변환)
    ↓ HTTP Stream
FastAPI (SSE 응답 생성)
    ↓ OpenAI Stream
OpenAI API (GPT-3.5-turbo)
```

📚 **학습 내용 문서화**
- ✅ TIL-stream.md 작성 완료
  - SSE vs WebSocket 비교
  - 스트리밍 아키텍처 아스키 아트
  - FastAPI/NestJS/Frontend 상세 코드 분석
  - NestJS 라우트 순서의 중요성
  - 비동기 제너레이터, Stream pipe 개념

✅ **레시피 상세 페이지 실제 데이터 연동 완료** (2024-10-01)
- **TanStack Query 적용**: useQuery로 Backend API 연동
- **목업 데이터 제거**: 하드코딩된 데이터를 실제 DB 데이터로 대체
- **타입 안전성**: `Recipe` → `RecipeDetail` 타입 수정
- **로딩/에러 처리**: LoadingState, ErrorState 컴포넌트 활용
- **자동 캐싱**: 같은 레시피 재방문 시 즉시 표시

✅ **AI 생성 레시피 저장 기능 완료** (2024-10-01) 🎉
- **저장 버튼 UI**: 스트리밍 완료 후 "레시피 저장하기" 버튼 표시
- **AI 텍스트 파싱**: 정규표현식으로 구조화된 데이터 변환
  - 요리명, 재료, 조리법, 조리시간, 난이도 자동 추출
  - **쉼표 구분 재료 처리**: `flatMap`으로 `"토란, 계란"` → `["토란", "계란"]` 변환
  - 줄바꿈 분리, 접두사 제거 (`-`, `*`, 숫자 등)
- **TanStack Query Mutation**: useMutation으로 레시피 생성 API 호출
- **필수 필드 검증**: 재료/조리법 빈 배열 시 alert 표시
- **저장 성공 후 리다이렉트**: 생성된 레시피 상세 페이지로 자동 이동
- **완벽한 플로우**: 재료 입력 → AI 생성 → 저장 → 상세 페이지 표시

🎯 **AI 레시피 저장 플로우**
```
사용자 재료 입력 ("양파", "감자")
    ↓
AI 스트리밍 레시피 생성
    ↓
"레시피 저장하기" 버튼 클릭
    ↓
parseAIRecipe(텍스트)
    ↓
{ title, ingredients: ["양파", "감자"], instructions: [...] }
    ↓
POST /recipes (Backend API)
    ↓
응답: { id: 5, title: "양파 감자 수프", ... }
    ↓
router.push('/recipes/5')
    ↓
레시피 상세 페이지 표시
```

📚 **추가 학습 내용 문서화**
- ✅ TIL-recipe-save.md 작성 완료
  - TanStack Query vs useEffect 비교
  - useQuery vs useMutation 차이
  - 정규표현식 패턴 상세 분석
  - flatMap 활용한 배열 평탄화
  - Frontend/Backend 이중 검증
  - 트러블슈팅 (400 에러, 빈 배열, 타입 에러)

✅ **레시피 목록 페이지 완전 구현 완료** (2024-10-15) 🎉

### 페이지네이션 기능
- **Pagination 컴포넌트**: 이전/다음 버튼, 페이지 번호 버튼
- **알고리즘**: 최대 5개 버튼, 현재 페이지 중심 배치
- **첫/마지막 페이지**: 바로가기 버튼 + "..." 표시
- **자동 재조회**: TanStack Query의 queryKey 변경 감지
- **UX 개선**: disabled 상태, 조건부 렌더링

### 검색/필터링 기능
- **SearchBar 컴포넌트**: 재료명 검색, Enter 키 지원, X 버튼
- **CategoryFilter 컴포넌트**: 카테고리 버튼 그룹, 선택 상태 표시, "AI추천" 카테고리 추가
- **Backend API 연동**:
  - 재료 검색: `GET /recipes/search/ingredient?q=감자`
  - 카테고리 필터: `GET /recipes/category/:category`
- **URL 디코딩**: `decodeURIComponent`로 한글 검색어 처리
- **PostgreSQL LIKE 검색**: `LOWER()` 함수로 대소문자 무시

### 트러블슈팅
- **simple-array 타입 이해**: 쉼표 구분 문자열로 저장됨
- **JSON 파싱 오류 해결**: PostgreSQL의 simple-array는 일반 LIKE만 사용
- **검색 쿼리 수정**: `%${ingredient}%` 양쪽에 와일드카드 추가
- **한글 인코딩 문제**: Backend Controller에서 URL 디코딩 처리
- **AI 레시피 카테고리**: recommend/page.tsx에서 `category: "AI추천"` 수정

✅ **레시피 CRUD 기능 완전 구현 완료** (2024-10-15) 🎉

### 수정/삭제 기능
- **RecipeActions 컴포넌트**: 권한 기반 수정/삭제 버튼 표시
  - `user?.id === authorId` 조건으로 본인 레시피만 표시
  - AlertDialog로 삭제 확인 모달 구현
  - 삭제 성공 시 캐시 무효화 및 목록 페이지로 리다이렉트
- **레시피 수정 페이지**: `/recipes/[id]/edit` 구현
  - React Hook Form으로 폼 상태 관리
  - `reset()`으로 기존 데이터 폼 초기화
  - 재료/조리법 배열 ↔ 문자열 변환 (줄바꿈 기준)
  - 필수 필드 검증: 재료 2개 이상, 조리법 3단계 이상
- **난이도 필드 변환 로직**:
  - Backend: 한글 저장 ("쉬움", "보통", "어려움")
  - Frontend: 영어 value ("easy", "medium", "hard")
  - `difficultyToEn()`, `difficultyToKo()` 변환 함수로 매핑

### API 통합
- **updateRecipe()**: `PATCH /recipes/:id` API 호출
- **deleteRecipe()**: `DELETE /recipes/:id` API 호출
- **userId 필드 추가**: AI 레시피 저장 시 사용자 ID 포함
  - Backend DTO에 `userId?: number` 추가
  - Frontend에서 `useAuth()` 훅으로 현재 사용자 확인
  - 로그인 체크 후 저장 진행

### 권한 관리
- **조건부 렌더링**: `if (!canEdit || !authorId) return null;`
- **본인 레시피만 수정/삭제**: AuthContext의 user.id와 recipe.userId 비교
- **레시피 상세 페이지**: RecipeActions 컴포넌트 추가

🎯 **완성된 레시피 목록 페이지**
```
┌──────────────────────────────────────────┐
│         레시피 목록 페이지               │
├──────────────────────────────────────────┤
│  🔍 검색: "재료명으로 검색..."           │
│  📁 필터: [전체][AI추천][한식][중식]...  │
├──────────────────────────────────────────┤
│  📋 레시피 목록 (페이지네이션)           │
│  ┌──────┐ ┌──────┐ ┌──────┐             │
│  │레시피│ │레시피│ │레시피│             │
│  └──────┘ └──────┘ └──────┘             │
├──────────────────────────────────────────┤
│  [이전] [1][2][3][4][5] [다음]          │
└──────────────────────────────────────────┘
```

🎯 **완성된 CRUD 플로우**
```
✅ Create: AI 레시피 생성 및 저장 (userId 포함)
✅ Read: 레시피 목록/상세 페이지 (TanStack Query)
✅ Update: React Hook Form + 난이도 변환 로직
✅ Delete: AlertDialog 확인 + 캐시 무효화
```

✅ **리뷰/평점 시스템 Backend 완전 구현 완료** (2024-10-15) 🎉

### Review Entity 및 TypeORM 관계 설정
- **Review Entity**: rating(1-5), comment, userId, recipeId
- **User ↔ Review**: OneToMany (한 유저가 여러 리뷰 작성)
- **Recipe ↔ Review**: OneToMany (한 레시피가 여러 리뷰 받음)
- **onDelete CASCADE**: 레시피 삭제 시 리뷰 자동 삭제
- **eager: true**: 리뷰 조회 시 작성자 정보 자동 로드

### Reviews Service 구현
- **create()**: 리뷰 생성 (recipeId, userId, CreateReviewDto)
- **findByRecipe()**: 레시피별 리뷰 목록 조회 (최신순 정렬)
- **update()**: 리뷰 수정 (권한 체크: 본인만 가능)
- **remove()**: 리뷰 삭제 (권한 체크: 본인만 가능)
- **getAverageRating()**: SQL AVG, COUNT로 평균 평점 계산
  - QueryBuilder 활용
  - 타입 안전성: `getRawOne<T>()` 제네릭 타입 명시
  - null 체크 및 기본값 0 반환

### Reviews Controller 구현
- **POST /reviews/recipes/:recipeId**: 리뷰 작성 (JWT 필수)
- **GET /reviews/recipes/:recipeId**: 리뷰 목록 조회 (공개)
- **GET /reviews/recipes/:recipeId/average**: 평균 평점 조회 (공개)
- **PATCH /reviews/:id**: 리뷰 수정 (본인만, JWT 필수)
- **DELETE /reviews/:id**: 리뷰 삭제 (본인만, JWT 필수)
- **AuthenticatedRequest 인터페이스**: req.user 타입 안전성 확보

### DTO 및 타입 안전성
- **CreateReviewDto**: rating(1-5 검증), comment(필수)
- **UpdateReviewDto**: PartialType으로 선택적 수정
  - `@nestjs/mapped-types` 사용 (타입 변환용)
  - `@nestjs/swagger` 대신 사용하여 타입 안전성 확보

### 트러블슈팅
- **PartialType import 오류**: `@nestjs/swagger` → `@nestjs/mapped-types`
- **Request 타입 오류**: `@nestjs/common` → `express`에서 import
- **ESLint any 오류**: AuthenticatedRequest 인터페이스로 해결
- **getRawOne() 타입**: 제네릭 타입 명시 및 null 체크

🎯 **완성된 리뷰 시스템 구조**
```
┌──────────────────────────────────────────┐
│           리뷰/평점 시스템               │
├──────────────────────────────────────────┤
│  User (1) ←→ (N) Review                  │
│  Recipe (1) ←→ (N) Review                │
│                                           │
│  Reviews Service                          │
│  ├─ create()                              │
│  ├─ findByRecipe()                        │
│  ├─ update() (권한 체크)                  │
│  ├─ remove() (권한 체크)                  │
│  └─ getAverageRating() (SQL AVG)         │
│                                           │
│  Reviews Controller                       │
│  ├─ POST /reviews/recipes/:recipeId      │
│  ├─ GET /reviews/recipes/:recipeId       │
│  ├─ GET /reviews/recipes/:recipeId/avg   │
│  ├─ PATCH /reviews/:id                   │
│  └─ DELETE /reviews/:id                  │
└──────────────────────────────────────────┘
```

🔄 **다음 단계**
- [ ] Frontend 리뷰 UI 구현 (StarRating, ReviewForm, ReviewList)
- [ ] 평균 평점 표시 컴포넌트
- [ ] 검색 + 카테고리 조합 필터
- [ ] 검색 결과 페이지네이션
- [ ] 레시피 이미지 업로드 기능
- [ ] 사용자 프로필 페이지 (내가 작성한 레시피)
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

---

## 🚀 프로덕션 배포 전략

### 배포 아키텍처 개요

```
┌─────────────────────────────────────────────────────────────┐
│                무료/저비용 배포 아키텍처                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  🌐 Cloudflare DNS + CDN (무료)                             │
│     ├─ HTTPS 자동 인증서                                    │
│     ├─ DDoS 방어                                            │
│     └─ Custom 도메인 관리                                   │
│                                                              │
│  🖥️ Frontend: Cloudflare Pages (무료)                       │
│     ├─ Next.js 15 SSR/SSG 자동 배포                        │
│     ├─ GitHub 연동 자동 빌드                                │
│     ├─ 500 빌드/월, 무제한 요청                             │
│     └─ Edge CDN 전세계 배포                                 │
│                                                              │
│  ⚙️ Backend: Fly.io (무료 크레딧 ~$5/월)                    │
│     ├─ NestJS (Node.js) - Docker 배포                      │
│     ├─ FastAPI (Python) - Docker 배포                      │
│     ├─ 항상 실행 (슬립 없음)                                │
│     ├─ 전세계 리전 선택 가능 (sin/hkg 추천)                │
│     └─ 자동 스케일링 및 로드밸런싱                          │
│                                                              │
│  🐘 Database: Neon.tech (무료)                              │
│     ├─ Serverless PostgreSQL                                │
│     ├─ 최대 500MB, 1 worker                                 │
│     ├─ 초당 자동 슬립/웨이크                                │
│     ├─ SSL 기본 제공                                        │
│     └─ DATABASE_URL로 간편 연결                             │
│                                                              │
│  ☁️ Storage: Cloudflare R2 (무료)                           │
│     ├─ 10GB 스토리지 무료                                   │
│     ├─ Egress(데이터 전송) 무료                             │
│     ├─ AWS S3 API 호환                                      │
│     ├─ CDN 캐시 자동                                        │
│     └─ 이미지/파일 업로드 호스팅                            │
│                                                              │
│  💰 총 예상 비용: $0 ~ $5/월                                │
└─────────────────────────────────────────────────────────────┘
```

### 배포 플랫폼 상세

| 계층 | 기술 스택 | 배포 플랫폼 | 무료 티어 | 특징 / 장점 | 배포 형태 |
|------|-----------|-------------|-----------|-------------|-----------|
| 🖥️ **Frontend** | Next.js 15 (React 19) | **Cloudflare Pages** | ✅ 완전 무료 | • Edge CDN 자동 배포<br>• 빌드 500회/월<br>• 정적/SSR 모두 지원<br>• Custom 도메인 + SSL 무료 | GitHub 연동 후 자동 빌드 |
| ⚙️ **Backend (Main)** | NestJS (Node.js) | **Fly.io** | ✅ 무료 크레딧 제공<br>(~$5/월 상당) | • Docker 기반 완전 제어<br>• Render보다 빠름<br>• 슬립 없음(Always On)<br>• 전세계 리전 선택 가능<br>(sin/hkg 추천) | `flyctl deploy` |
| 🧠 **Backend (AI)** | FastAPI (Python) | **Fly.io** | ✅ 무료 크레딧 공유 | • NestJS와 동일 인프라 관리<br>• Docker 기반<br>• ML/AI 코드 쉽게 호스팅 | `flyctl deploy` |
| 🐘 **Database** | PostgreSQL | **Neon.tech** | ✅ 완전 무료<br>(최대 500MB) | • Serverless Postgres<br>• 초당 자동 슬립/웨이크<br>• SSL 기본 제공<br>• Fly.io와 쉽게 연결 | DATABASE_URL 연결 |
| ☁️ **Storage** | Cloudflare R2 | **Cloudflare** | ✅ 10GB 무료<br>egress 무료 | • AWS S3 API 호환<br>• CDN 캐시 자동<br>• 이미지 업로드/호스팅 | S3 SDK / Signed URL |
| 🌐 **도메인 관리** | Cloudflare DNS | **Cloudflare** | ✅ 무료 | • HTTPS 자동 인증서<br>• Pages + Fly.io 모두 연동 | Custom domain 연결 |

### 배포 순서

#### 1단계: Frontend 배포 (Cloudflare Pages)

```bash
# 1. Cloudflare Pages 연동
# https://dash.cloudflare.com/pages 접속

# 2. GitHub 레포지토리 연결
# - Repository: your-username/recipe-platform
# - Branch: main

# 3. 빌드 설정
# Build command: cd frontend && npm run build
# Build output directory: frontend/.next
# Root directory: / (모노레포)

# 4. 환경변수 설정 (Cloudflare Dashboard)
NEXT_PUBLIC_API_URL=https://your-app.fly.dev

# 5. 배포 트리거
# - main 브랜치에 push하면 자동 배포
git add .
git commit -m "Deploy to Cloudflare Pages"
git push origin main

# 배포 완료 URL: https://recipe-platform.pages.dev
```

**설정 팁:**
- `@opennextjs/cloudflare` 어댑터 설치 권장
- `wrangler.toml` 파일 추가로 더 세밀한 제어 가능

#### 2단계: Database 설정 (Neon.tech)

```bash
# 1. Neon.tech 가입 및 프로젝트 생성
# https://neon.tech

# 2. Database 생성
# - Name: recipe-platform
# - Region: AWS ap-southeast-1 (Singapore) 추천

# 3. Connection String 복사
# postgresql://user:password@ep-xxx.region.aws.neon.tech/recipe_platform?sslmode=require

# 4. 로컬에서 마이그레이션 실행
cd main-service

# .env 파일에 Neon DATABASE_URL 추가
DATABASE_URL=postgresql://user:password@ep-xxx.region.aws.neon.tech/recipe_platform?sslmode=require

# TypeORM 마이그레이션 실행
npm run typeorm migration:run

# 또는 synchronize로 자동 동기화 (개발 단계)
# production에서는 migration 사용 필수!
```

**주의사항:**
- 무료 티어는 500MB 제한
- 5분 미사용 시 자동 슬립 (첫 쿼리는 약간 느림)
- SSL 필수 (`?sslmode=require`)

#### 3단계: Backend 배포 (Fly.io)

##### 3-1. Fly.io 설치 및 로그인

```bash
# Fly.io CLI 설치 (Windows)
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"

# 로그인
flyctl auth login

# 신용카드 등록 (무료 크레딧 받기 위해 필요, 청구 안됨)
flyctl auth signup
```

##### 3-2. NestJS Backend 배포

```bash
cd main-service

# Dockerfile 생성 (이미 있다면 스킵)
cat > Dockerfile << 'EOF'
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
EXPOSE 3001
CMD ["node", "dist/main.js"]
EOF

# Fly.io 앱 초기화
flyctl launch
# App Name: recipe-backend (또는 원하는 이름)
# Region: Singapore (sin) 또는 Hong Kong (hkg) 추천
# PostgreSQL: No (Neon 사용)
# Redis: No (옵션)

# fly.toml 자동 생성됨 - 포트 수정
```

**fly.toml 수정:**
```toml
app = "recipe-backend"
primary_region = "sin"

[build]

[http_service]
  internal_port = 3001  # NestJS 포트
  force_https = true
  auto_stop_machines = "stop"
  auto_start_machines = true
  min_machines_running = 1  # 항상 1대 실행 (슬립 방지)

[[vm]]
  memory = "256mb"
  cpu_kind = "shared"
  cpus = 1

[env]
  NODE_ENV = "production"
  PORT = "3001"
```

```bash
# 환경변수 설정 (Secret)
flyctl secrets set DATABASE_URL="postgresql://user:password@ep-xxx.neon.tech/recipe_platform?sslmode=require"
flyctl secrets set JWT_SECRET="your-jwt-secret"
flyctl secrets set CORS_ORIGIN="https://recipe-platform.pages.dev"
flyctl secrets set AI_SERVICE_URL="https://recipe-ai.fly.dev"

# 배포
flyctl deploy

# 배포 완료 URL: https://recipe-backend.fly.dev
# 헬스 체크: https://recipe-backend.fly.dev/health
```

##### 3-3. FastAPI AI 서비스 배포

```bash
cd ../ai-service

# Dockerfile 생성
cat > Dockerfile << 'EOF'
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
EOF

# Fly.io 앱 초기화
flyctl launch
# App Name: recipe-ai
# Region: Singapore (sin) - Backend와 같은 리전 권장

# fly.toml 자동 생성됨
```

**fly.toml 수정:**
```toml
app = "recipe-ai"
primary_region = "sin"

[build]

[http_service]
  internal_port = 8000  # FastAPI 포트
  force_https = true
  auto_stop_machines = "stop"
  auto_start_machines = true
  min_machines_running = 1

[[vm]]
  memory = "512mb"  # AI 서비스는 메모리 더 필요
  cpu_kind = "shared"
  cpus = 1

[env]
  PORT = "8000"
```

```bash
# 환경변수 설정
flyctl secrets set OPENAI_API_KEY="sk-proj-..."
flyctl secrets set MAIN_SERVICE_URL="https://recipe-backend.fly.dev"

# 배포
flyctl deploy

# 배포 완료 URL: https://recipe-ai.fly.dev
# Swagger UI: https://recipe-ai.fly.dev/docs
```

#### 4단계: Storage 설정 (Cloudflare R2)

```bash
# 1. Cloudflare Dashboard에서 R2 활성화
# https://dash.cloudflare.com/r2

# 2. Bucket 생성
# Bucket Name: recipe-images

# 3. API Token 생성
# - Permissions: Object Read & Write
# - R2 Buckets: recipe-images

# 4. Frontend/Backend에서 S3 호환 SDK 사용
# Endpoint: https://<account-id>.r2.cloudflarestorage.com
# Access Key ID: <your-access-key>
# Secret Access Key: <your-secret-key>

# 5. Backend 환경변수 추가 (Fly.io)
flyctl secrets set R2_ACCOUNT_ID="your-account-id"
flyctl secrets set R2_ACCESS_KEY_ID="your-access-key"
flyctl secrets set R2_SECRET_ACCESS_KEY="your-secret-key"
flyctl secrets set R2_BUCKET_NAME="recipe-images"
```

#### 5단계: Custom Domain 연결

```bash
# 1. Cloudflare DNS에 도메인 추가
# - recipe-platform.com 구매 (Cloudflare Registrar 추천)

# 2. Frontend (Cloudflare Pages) 도메인 연결
# Cloudflare Pages Dashboard → Custom domains
# - recipe-platform.com
# - www.recipe-platform.com

# 3. Backend (Fly.io) 도메인 연결
# Cloudflare DNS → Add Record
# Type: CNAME
# Name: api
# Target: recipe-backend.fly.dev
# Proxy: On (Cloudflare CDN 활성화)

# 4. AI Service 도메인 연결
# Type: CNAME
# Name: ai
# Target: recipe-ai.fly.dev
# Proxy: On

# 최종 URL:
# - Frontend: https://recipe-platform.com
# - Backend: https://api.recipe-platform.com
# - AI Service: https://ai.recipe-platform.com
```

### CI/CD 자동 배포 (GitHub Actions)

**`.github/workflows/deploy.yml`:**
```yaml
name: Deploy to Production

on:
  push:
    branches:
      - main

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # Cloudflare Pages는 자동 배포되므로 별도 작업 불필요
      # GitHub 연동 시 자동으로 배포됨

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Fly.io
        uses: superfly/flyctl-actions/setup-flyctl@master

      - name: Deploy NestJS Backend
        run: |
          cd main-service
          flyctl deploy --remote-only
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}

  deploy-ai:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Fly.io
        uses: superfly/flyctl-actions/setup-flyctl@master

      - name: Deploy FastAPI AI
        run: |
          cd ai-service
          flyctl deploy --remote-only
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

**GitHub Secrets 설정:**
```
Repository Settings → Secrets and variables → Actions

필수 시크릿:
- FLY_API_TOKEN: flyctl auth token
```

### 모니터링 및 로그

```bash
# Fly.io 로그 확인
flyctl logs -a recipe-backend
flyctl logs -a recipe-ai

# Cloudflare Pages 빌드 로그
# Dashboard에서 확인

# Neon.tech 쿼리 모니터링
# Dashboard → Monitoring

# Fly.io 앱 상태 확인
flyctl status -a recipe-backend
flyctl status -a recipe-ai

# 메트릭 확인
flyctl dashboard -a recipe-backend
```

### 비용 예상

```
┌──────────────────────────────────────────────────┐
│         월별 예상 비용 (실제 사용량 기준)        │
├──────────────────────────────────────────────────┤
│                                                   │
│  Cloudflare Pages:           $0                  │
│  Cloudflare R2 (10GB):       $0                  │
│  Cloudflare DNS:             $0                  │
│  Neon.tech (500MB):          $0                  │
│  Fly.io (2 apps, 최소):      $0 ~ $5             │
│    - 무료 크레딧 범위 내                         │
│    - 크레딧 소진 시 최대 $5/월                   │
│                                                   │
│  총 예상 비용:               $0 ~ $5/월 🎉       │
│                                                   │
│  ⚠️ 주의:                                        │
│  - OpenAI API는 별도 과금 (사용량 기준)         │
│  - 트래픽 급증 시 Fly.io 비용 증가 가능         │
└──────────────────────────────────────────────────┘
```

### 스케일링 전략

```bash
# Fly.io 앱 스케일링 (필요 시)

# 수평 스케일링 (인스턴스 추가)
flyctl scale count 2 -a recipe-backend

# 수직 스케일링 (메모리 증가)
flyctl scale memory 512 -a recipe-backend

# 리전 추가 (멀티 리전 배포)
flyctl regions add nrt -a recipe-backend  # Tokyo
flyctl regions add icn -a recipe-backend  # Seoul

# 오토스케일링 설정 (fly.toml)
[http_service]
  auto_stop_machines = "stop"
  auto_start_machines = true
  min_machines_running = 1
  max_machines_running = 3  # 최대 3개 인스턴스
```

### 백업 및 복구

```bash
# Neon.tech 자동 백업
# - Point-in-time recovery (PITR) 7일 보관
# - Dashboard에서 특정 시점으로 복구 가능

# 수동 백업 (로컬)
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# 복구
psql $DATABASE_URL < backup-20250117.sql

# Fly.io 볼륨 백업 (스냅샷)
flyctl volumes snapshots create <volume-id> -a recipe-backend
```

### 트러블슈팅

#### 1. Cloudflare Pages 빌드 실패

```bash
# 원인: 모노레포 경로 문제
# 해결: Build command에 cd 추가
Build command: cd frontend && npm install && npm run build
Build output directory: frontend/.next
```

#### 2. Fly.io 메모리 부족

```bash
# 증상: OOM (Out of Memory) 에러
# 해결: 메모리 증가
flyctl scale memory 512 -a recipe-backend
```

#### 3. Neon.tech 연결 타임아웃

```bash
# 증상: 첫 쿼리가 느림 (콜드 스타트)
# 해결: Connection pooling 설정
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/recipe_platform?sslmode=require&pool_timeout=30

# 또는 Prisma Accelerate / Neon Serverless Driver 사용
```

#### 4. CORS 오류

```bash
# main-service/src/main.ts
app.enableCors({
  origin: [
    'https://recipe-platform.pages.dev',
    'https://recipe-platform.com',
    'https://www.recipe-platform.com',
  ],
  credentials: true,
});
```

### 보안 체크리스트

```
✅ 모든 환경변수 Secrets로 관리
✅ HTTPS 강제 적용 (Cloudflare + Fly.io)
✅ CORS 올바르게 설정
✅ JWT_SECRET 안전하게 생성 및 저장
✅ Database SSL 연결 (sslmode=require)
✅ API Rate Limiting 설정
✅ Cloudflare WAF 활성화
✅ 민감한 정보 .gitignore에 추가
✅ TypeORM synchronize: false (production)
```

### 성능 최적화

```
✅ Cloudflare CDN 캐싱 활성화
✅ Next.js 이미지 최적화 (next/image)
✅ Database 인덱스 추가
✅ API 응답 압축 (gzip)
✅ Frontend 코드 스플리팅
✅ Fly.io 리전을 사용자 가까이 배치
✅ R2로 정적 자산 오프로드
```

---

## 📝 배포 완료 확인

배포가 완료되면 다음 URL에서 확인:

```
✅ Frontend: https://recipe-platform.pages.dev
✅ Backend: https://recipe-backend.fly.dev/api
✅ AI Service: https://recipe-ai.fly.dev/docs
✅ Database: Neon.tech Dashboard에서 연결 확인
```

축하합니다! 🎉 프로덕션 배포 완료!

