# TIL (Today I Learned) - AI Recipe Platform

이 프로젝트의 학습 내용은 Frontend와 Backend로 분할하여 관리합니다.

## 📚 분할된 학습 문서

### 🎨 Frontend 학습 내용
**파일**: [TIL-Frontend.md](./TIL-Frontend.md)

**주요 학습 내용:**
- Next.js 15 + React 19 핵심 개념
- App Router vs Pages Router
- React Server Components vs Client Components
- 하이드레이션 (Hydration) 개념
- 동적 라우팅 (Dynamic Routes)
- SOLID 원칙 기반 컴포넌트 설계
- Tailwind CSS v4 + shadcn/ui
- 컴포넌트 분리 및 상태 관리

### 🛠️ Backend 학습 내용
**파일**: [TIL-Backend.md](./TIL-Backend.md)

**주요 학습 내용:**
- NestJS 마이크로서비스 아키텍처
- TypeORM Entity 설계 및 관계 설정
- PostgreSQL 연동 및 데이터베이스 모델링
- DTO 패턴 및 데이터 검증 (class-validator)
- Service 계층 비즈니스 로직 구현
- Controller 계층 HTTP 인터페이스 구현
- 사용자 인증 시스템 (bcrypt 해싱)
- Module 시스템 및 의존성 주입

## 📈 학습 진행 현황

### ✅ 완료된 학습 영역

#### Frontend (2024-09-28)
- **기본 페이지 구조**: 홈, 추천, 상세, 목록, 인증 페이지
- **SOLID 원칙 리팩토링**: 컴포넌트 분리 및 재사용성 확보
- **성능 최적화**: 코드 라인 수 30% 감소
- **UX 개선**: Enter 키 재료 추가, 독립적 상태 관리

#### Backend (2024-09-28)
- **NestJS CRUD API**: Recipe 완전 구현 (Entity → DTO → Service → Controller → Module)
- **User 인증 시스템**: DTO, Service 구현 완료
- **데이터베이스 설계**: PostgreSQL + TypeORM 관계 설정
- **보안 구현**: bcrypt 패스워드 해싱, 입력 검증

### 🔄 진행 중인 작업

#### Frontend
- 인증 페이지 LoginForm, SignupForm 구현 예정
- API 연동 및 상태 관리

#### Backend
- UsersController 인증 API 엔드포인트 구현 예정
- JWT 토큰 기반 인증 시스템
- FastAPI AI 서비스 기본 구조

## 🎯 핵심 학습 성과

### 아키텍처 설계 역량
- **마이크로서비스**: NestJS + FastAPI 분리 설계
- **계층화**: Controller → Service → Repository → Database
- **모듈 시스템**: 관심사 분리 및 의존성 주입

### 개발 방법론 학습
- **SOLID 원칙**: 특히 SRP(단일 책임 원칙) 적용
- **TDD 접근**: DTO → Service → Controller → Module 순서
- **리팩토링**: 현재 코드 기준 최적화 (미래 확장성 제외)

### 기술 스택 숙련도
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS v4
- **Backend**: NestJS, TypeORM, PostgreSQL, class-validator
- **도구**: Turbopack, shadcn/ui, Swagger, bcrypt

## 📝 학습 원칙

### 코드 품질
1. **타입 안전성**: TypeScript 엄격 모드 활용
2. **검증 계층**: DTO 패턴으로 입력 데이터 검증
3. **에러 처리**: NestJS 표준 예외 처리
4. **보안 모범 사례**: 패스워드 해싱, 정보 누출 방지

### 개발 프로세스
1. **학습 중심**: Claude는 가이드만, 직접 코딩으로 학습
2. **단계별 진행**: 각 단계 완료 후 다음 단계로
3. **현재 코드 기준**: 미래 확장성보다 현재 구현 중심
4. **문서화**: 학습 과정과 결과를 체계적으로 기록

## 🔗 관련 문서

- [CLAUDE.md](./CLAUDE.md) - 프로젝트 전체 지침 및 현황
- [README.md](./README.md) - 프로젝트 설치 및 실행 가이드
- [TIL-Frontend.md](./TIL-Frontend.md) - 프론트엔드 상세 학습 내용
- [TIL-Backend.md](./TIL-Backend.md) - 백엔드 상세 학습 내용

---

**마지막 업데이트**: 2024-09-29
**총 학습 기간**: 프로젝트 시작일부터 현재까지
**다음 목표**: JWT 인증 시스템 구현 및 AI 서비스 연동