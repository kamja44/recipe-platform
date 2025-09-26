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
- 랜딩 페이지 개선 (현재 기본형 완료)
- 재료 입력 → AI 추천 페이지 (핵심 기능)
- 레시피 상세 페이지

**3단계: 사용자 기능** 👤
- 로그인/회원가입 페이지
- 마이페이지 (즐겨찾기, 내 레시피)

**4단계: 커뮤니티 기능** 👥
- 레시피 목록 페이지
- 리뷰/평점 시스템

### 개발 방법론 (학습 목적)
⚠️ **중요**: 이 프로젝트는 학습용이므로 다음 규칙을 준수
- **Claude는 코드를 직접 작성하지 않음**
- **Claude는 가이드와 설명만 제공**
- **사용자가 직접 코드를 타이핑하여 학습**
- 단계별 진행하며 각 단계 완료 후 다음 단계로 진행