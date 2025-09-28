# TIL (Today I Learned) - AI Recipe Platform

## Next.js 핵심 개념 정리

### 1. App Router (Next.js 13+의 새로운 라우팅 시스템)

#### app/layout.tsx - 루트 레이아웃
```typescript
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        {children} {/* 여기에 각 페이지가 렌더링됨 */}
      </body>
    </html>
  );
}
```

**역할:**
- 모든 페이지에 공통으로 적용되는 레이아웃
- `<html>`, `<body>` 태그를 포함해야 함
- `children`으로 각 페이지 내용을 받아서 렌더링
- 메타데이터, 폰트, 전역 스타일 등을 설정

#### 파일 기반 라우팅
```
app/
├── layout.tsx          # 루트 레이아웃 (모든 페이지 공통)
├── page.tsx           # / (홈페이지)
├── about/
│   └── page.tsx       # /about
└── recipes/
    ├── page.tsx       # /recipes
    └── [id]/
        └── page.tsx   # /recipes/[id] (동적 라우팅)
```

### 2. 컴포넌트 구성 패턴

#### Higher-Order Component 패턴
```typescript
// Layout 컴포넌트 = HOC (다른 컴포넌트를 감싸는 컴포넌트)
function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      {children}  {/* 여기에 페이지별 내용이 들어감 */}
      <Footer />
    </div>
  );
}
```

#### 컴포넌트 합성 (Composition)
```
Layout
├── Header (네비게이션, 로고)
├── children (페이지별 다른 내용)
└── Footer (회사 정보, 링크)
```

### 3. TypeScript 타입 정의

#### Props 인터페이스
```typescript
interface LayoutProps {
  children: React.ReactNode;  // React에서 자식 요소를 나타내는 타입
}
```

#### React.ReactNode 타입
- JSX 요소, 문자열, 숫자, 배열 등을 모두 포함
- 컴포넌트의 children으로 전달될 수 있는 모든 것

### 4. CSS-in-JS vs Tailwind CSS

#### 전통적인 CSS
```css
.header { background-color: white; }
```

#### Tailwind CSS (유틸리티 퍼스트)
```tsx
<header className="bg-white border-b">
```

**장점:**
- 빠른 스타일링
- 일관성 있는 디자인 시스템
- 번들 크기 최적화

### 5. shadcn/ui 컴포넌트 시스템

#### 컴포넌트 불러오기
```typescript
import { Button } from '@/components/ui/button';
// @/ = src/ 경로 별칭 (TypeScript path mapping)
```

#### 사전 구성된 컴포넌트
- 접근성 (a11y) 준수
- 다양한 variant 제공
- Tailwind CSS로 스타일링

### 6. 메타데이터 설정

#### Next.js 메타데이터 API
```typescript
export const metadata: Metadata = {
  title: "AI Recipe Platform",
  description: "AI가 추천하는 맞춤 레시피 플랫폼",
};
```

**SEO 최적화:**
- 검색 엔진 최적화
- 소셜 미디어 공유 시 미리보기
- 브라우저 탭 제목 설정

## 오늘 배운 것 요약

1. **Next.js App Router**: 파일 기반 라우팅과 레이아웃 시스템
2. **컴포넌트 합성**: Layout → Header/Footer로 구조 분리
3. **TypeScript**: Props 타입 정의와 children 타입
4. **Tailwind CSS**: 유틸리티 클래스 기반 스타일링
5. **shadcn/ui**: 사전 구성된 UI 컴포넌트 시스템

## App Router vs Pages Router 차이점

### Pages Router (기존 방식, ~Next.js 12)
```
pages/
├── _app.tsx           # 전역 레이아웃
├── _document.tsx      # HTML 구조
├── index.tsx          # / (홈)
├── about.tsx          # /about
└── api/
    └── hello.ts       # /api/hello
```

**특징:**
- 파일명 = 라우트 경로
- `_app.tsx`에서 전역 레이아웃 관리
- 클라이언트 사이드 렌더링 위주

### App Router (새로운 방식, Next.js 13+)
```
app/
├── layout.tsx         # 루트 레이아웃
├── page.tsx          # / (홈)
├── about/
│   └── page.tsx      # /about
└── api/
    └── hello/
        └── route.ts   # /api/hello
```

**특징:**
- 폴더 구조 = 라우트 경로
- `page.tsx`가 실제 페이지
- `layout.tsx`로 중첩 레이아웃 가능
- 서버 컴포넌트 기본 지원

### 주요 차이점

| 구분 | Pages Router | App Router |
|------|-------------|------------|
| 파일 구조 | 파일명 기반 | 폴더 + page.tsx |
| 레이아웃 | _app.tsx 한 곳 | layout.tsx 중첩 가능 |
| 렌더링 | CSR 기본 | SSR/SSG 기본 |
| 데이터 페칭 | getServerSideProps | fetch API |
| API 라우트 | pages/api/파일.ts | app/api/폴더/route.ts |

### App Router의 장점
1. **중첩 레이아웃**: 각 경로마다 다른 레이아웃 가능
2. **서버 컴포넌트**: 초기 로딩 성능 향상
3. **스트리밍**: 부분적 렌더링으로 사용자 경험 개선
4. **더 직관적인 구조**: 폴더 = 경로

## React Server Components vs Client Components (Next.js 13+)

### 서버 컴포넌트 vs 클라이언트 컴포넌트 차이점

| 구분 | 서버 컴포넌트 | 클라이언트 컴포넌트 |
|------|-------------|------------------|
| 렌더링 위치 | 서버에서 렌더링 | 브라우저에서 렌더링 |
| 기본값 | Next.js 13+ 기본 | "use client" 명시 필요 |
| JavaScript 번들 | 포함되지 않음 | 클라이언트로 전송됨 |
| 인터랙션 | 불가능 | 가능 (onClick, useState 등) |
| API 호출 | 직접 DB/API 접근 가능 | fetch/axios 사용 |

### "use client" 지시어가 필요한 경우

```typescript
"use client"; // 클라이언트 컴포넌트임을 명시

import { useState, useEffect } from "react";

export default function InteractiveComponent() {
  const [count, setCount] = useState(0); // React Hook 사용

  return (
    <button onClick={() => setCount(count + 1)}>
      클릭: {count}
    </button>
  );
}
```

**사용해야 하는 경우:**
- `useState`, `useEffect` 등 React Hooks 사용
- `onClick`, `onChange` 등 이벤트 핸들러
- 브라우저 전용 API (localStorage, window 객체)
- 실시간 상호작용이 필요한 경우

### "use server" 지시어 (Server Actions)

```typescript
// app/actions.ts
"use server";

export async function createUser(formData: FormData) {
  const name = formData.get('name');
  // 서버에서만 실행되는 함수
  await db.user.create({ data: { name } });
}
```

**사용하는 경우:**
- 폼 제출 처리
- 데이터베이스 직접 접근
- 서버에서만 실행되어야 하는 민감한 로직

### 하이드레이션 (Hydration) 개념

#### 하이드레이션이란?
서버에서 렌더링된 정적 HTML을 클라이언트에서 React가 "접수"하여 인터랙티브하게 만드는 과정

```
1. 서버 렌더링: HTML 생성 → 빠른 초기 로딩
   <button>클릭: 0</button>

2. 하이드레이션: React가 JavaScript 이벤트 연결
   <button onClick={handler}>클릭: 0</button>

3. 인터랙티브: 사용자 상호작용 가능
```

#### 하이드레이션 에러 (Hydration Mismatch)
```typescript
// ❌ 잘못된 예시 - 서버와 클라이언트 결과가 다름
function BadComponent() {
  return <div>{Date.now()}</div>; // 매번 다른 값
}

// ✅ 올바른 예시 - 일관된 결과
function GoodComponent() {
  const [time, setTime] = useState<number>();

  useEffect(() => {
    setTime(Date.now()); // 클라이언트에서만 설정
  }, []);

  return <div>{time || "로딩중..."}</div>;
}
```

### 실제 사용 사례

#### 서버 컴포넌트 (기본, "use client" 없음)
```typescript
// 정적 콘텐츠, SEO 최적화
export default function HomePage() {
  return (
    <div>
      <h1>AI Recipe Platform</h1>
      <p>서버에서 렌더링된 정적 콘텐츠</p>
    </div>
  );
}
```

#### 클라이언트 컴포넌트 ("use client" 필요)
```typescript
"use client";

// 사용자 상호작용, 상태 관리
export default function RecommendPage() {
  const [ingredients, setIngredients] = useState<string[]>([]);

  const addIngredient = () => { /* 인터랙티브 로직 */ };

  return (
    <button onClick={addIngredient}>재료 추가</button>
  );
}
```

### 성능 최적화 팁

1. **서버 컴포넌트 우선 사용**: 불필요한 JavaScript 전송 방지
2. **클라이언트 컴포넌트 최소화**: 필요한 부분만 인터랙티브하게
3. **혼합 사용**: 서버 컴포넌트 안에 클라이언트 컴포넌트 포함 가능

```typescript
// 서버 컴포넌트
export default function Layout({ children }) {
  return (
    <div>
      <StaticHeader /> {/* 서버 컴포넌트 */}
      <InteractiveNavigation /> {/* 클라이언트 컴포넌트 */}
      {children}
    </div>
  );
}
```

### 핵심 정리 (간단 버전) 🎯

**"use client"가 필요한 경우:**
- React Hooks (useState, useEffect, 커스텀 훅 등)
- 이벤트 핸들러 (onClick, onChange, onSubmit 등)
- 브라우저 API (localStorage, window 등)
- 실시간 인터랙션이 필요한 모든 것

**서버 컴포넌트 (기본):**
- 정적 텍스트, 이미지
- SEO가 중요한 콘텐츠
- 상호작용이 없는 모든 것

> 💡 **기억하기**: 클릭하거나 입력받거나 상태가 바뀌면 → "use client"

## 동적 라우팅 (Dynamic Routes)

### 폴더 구조
```
app/
├── recipes/
│   ├── page.tsx        # /recipes (정적)
│   └── [id]/
│       └── page.tsx    # /recipes/123 (동적)
```

### 매개변수 접근
```typescript
interface PageProps {
  params: {
    id: string;  // URL 매개변수
  };
}

export default function RecipeDetailPage({ params }: PageProps) {
  const recipeId = params.id;  // "123"
  return <div>레시피 ID: {recipeId}</div>;
}
```

---

## 📝 React 컴포넌트 분리 및 상태 관리 학습 (2024-09-28)

### 🎯 **컴포넌트 Spacing 관리의 공식 디자인 원칙**

#### **핵심 개념**
**컴포넌트는 자신의 외부 spacing을 관리하지 않는다**

#### **CSS/React 디자인 시스템 공식 원칙들**
1. **Separation of Concerns** (관심사 분리)
   - **컴포넌트**: 내부 로직 + 내부 스타일링 담당
   - **부모**: 레이아웃 + 포지셔닝 담당

2. **CSS Box Model 원칙**
   - `margin`: 외부 spacing → **부모가 관리**
   - `padding`: 내부 spacing → **컴포넌트가 관리**

3. **Design System 베스트 프랙티스**
   - **Material Design**: "컴포넌트는 자체 경계선까지만 책임"
   - **Atomic Design**: "원자 단위는 독립적이어야 함"
   - **shadcn/ui**: 실제로 이 원칙을 따름

4. **실제 라이브러리 예시**
   ```tsx
   // Material-UI, Ant Design, shadcn/ui 모두 동일
   <Button>클릭</Button>  // margin 없음
   <Card>내용</Card>      // margin 없음
   ```

5. **CSS-in-JS 커뮤니티 합의**
   > **"Never apply external spacing inside a component"**

#### **실제 적용 예시**
```tsx
// ❌ 잘못된 방식 (컴포넌트 내부에서 외부 spacing 관리)
export function RecipeNutrition({ nutrition }) {
  return (
    <Card className="mt-6">  {/* ← 문제: 항상 위쪽에 margin */}
      <CardHeader>
        <CardTitle>🍎 영양 정보</CardTitle>
      </CardHeader>
    </Card>
  );
}

// ✅ 올바른 방식 (부모에서 외부 spacing 관리)
export function RecipeNutrition({ nutrition }) {
  return (
    <Card>  {/* ← spacing 없음, 재사용 가능 */}
      <CardHeader>
        <CardTitle>🍎 영양 정보</CardTitle>
      </CardHeader>
    </Card>
  );
}

// 부모 컴포넌트에서 사용
<div className="lg:col-span-1">
  <RecipeIngredients ... />

  <div className="mt-6">  {/* ← 부모가 spacing 책임 */}
    <RecipeNutrition nutrition={recipe.nutrition} />
  </div>
</div>
```

#### **왜 이렇게 해야 할까?**
1. **재사용성**: 다른 곳에서 사용할 때 불필요한 margin이 없음
2. **단일 책임**: 컴포넌트는 자신의 내용만 담당
3. **유연성**: 부모가 상황에 맞게 spacing 조정 가능

---

### 🧠 **React 컴포넌트 독립성 원리**

#### **1. 컴포넌트 인스턴스 생성**
- **같은 컴포넌트 함수여도 사용할 때마다 새로운 인스턴스 생성**
- **각 인스턴스는 독립적인 메모리 공간과 상태를 가짐**

#### **2. useState Hook의 격리**
```tsx
function PasswordField() {
  const [showPassword, setShowPassword] = useState(false);
  // ↑ 각 인스턴스마다 독립적인 상태
}

// 사용 시
<PasswordField id="password1" />      // 독립 상태 #1
<PasswordField id="password2" />      // 독립 상태 #2
<PasswordField id="password3" />      // 독립 상태 #3
```

#### **3. 메모리 구조**
```
┌─────────────────┬─────────────────┬─────────────────┐
│   인스턴스 #1   │   인스턴스 #2   │   인스턴스 #3   │
│ showPassword:   │ showPassword:   │ showPassword:   │
│     false       │     false       │     false       │
│ (독립적 상태)   │ (독립적 상태)   │ (독립적 상태)   │
└─────────────────┴─────────────────┴─────────────────┘
```

#### **4. React 내부 동작**
- **Virtual DOM에서 각 컴포넌트를 고유 key로 추적**
- **useState는 컴포넌트 인스턴스별로 격리된 상태 관리**
- **props로 구분되는 각자의 고유 식별자**

#### **실제 예시: 회원가입 폼의 2개 PasswordField**
```tsx
{/* 비밀번호 */}
<PasswordField
  id="signup-password"
  label="비밀번호"
  placeholder="8자 이상 입력하세요"
  required
/>

{/* 비밀번호 확인 */}
<PasswordField
  id="confirm-password"
  label="비밀번호 확인"
  placeholder="비밀번호를 다시 입력하세요"
  required
/>
```

**결과:**
- 비밀번호 필드: 자신만의 표시/숨기기 상태
- 비밀번호 확인 필드: 자신만의 표시/숨기기 상태
- 완전 독립적: 하나를 표시해도 다른 하나는 영향 없음

#### **핵심 포인트**
> **"코드는 하나지만 실행되는 인스턴스는 여러 개!"**

---

### 💡 **리팩토링 학습 요점**

1. **SOLID 원칙 적용**: 특히 SRP(단일 책임 원칙)
2. **현재 코드 기준 리팩토링**: 미래 확장성 고려 제외
3. **기존 컴포넌트 재활용**: 중복 제거 우선
4. **독립적 상태 관리**: 컴포넌트 내부에서 상태 캡슐화

#### **완료된 리팩토링 성과**
- **레시피 상세 페이지**: 231줄 → 158줄 (31% 감소)
- **레시피 목록 페이지**: 99줄 → 66줄 (33% 감소)
- **인증 페이지**: PasswordField 중복 제거로 코드 간소화

---

## 📝 Backend 개발 시작 - NestJS & 마이크로서비스 학습 (2024-09-28)

### 🏗️ **마이크로서비스 아키텍처 설계 원칙**

#### **서비스 분리 전략**
- **NestJS 메인 서비스** (포트: 3000): 사용자 인증, 레시피 CRUD, 리뷰 관리
- **FastAPI AI 서비스** (포트: 8000): AI 레시피 추천, 재료 인식, 영양분석
- **Frontend** (Next.js): 사용자 인터페이스

#### **환경 설정 관리 원칙**
**각 서비스별 독립적 .env 관리:**
```
recipe-platform/
├── main-service/.env     # NestJS 전용 (DB, JWT 설정)
├── ai-service/.env       # FastAPI 전용 (API 키, ML 설정)
└── frontend/.env.local   # Next.js 전용 (API 엔드포인트)
```

**장점:**
- **독립성**: 각 서비스가 자체 설정 관리
- **보안**: 필요한 서비스만 해당 환경변수에 접근
- **배포**: 서비스별 독립적 배포 가능
- **확장성**: 새로운 서비스 추가 시 기존 서비스 영향 없음

---

### 🛠️ **NestJS 프로젝트 구조 설계**

#### **모듈 기반 아키텍처**
```
main-service/src/
├── auth/          # 인증 모듈 (JWT, 로그인/회원가입)
├── users/         # 사용자 관리 (프로필, 권한)
├── recipes/       # 레시피 CRUD (생성, 조회, 수정, 삭제)
├── reviews/       # 리뷰 시스템 (평점, 댓글)
├── common/        # 공통 모듈 (DTO, Guards, Decorators)
├── config/        # 설정 파일들 (데이터베이스, JWT 등)
└── database/      # 데이터베이스 설정 및 마이그레이션
```

#### **NestJS 필수 패키지 이해**
- **@nestjs/typeorm**: TypeScript ORM 연동
- **@nestjs/config**: 환경변수 관리
- **@nestjs/swagger**: API 문서화 자동 생성
- **class-validator**: DTO 검증
- **class-transformer**: 데이터 변환

---

### 🔍 **TypeORM & PostgreSQL 연동 개념**

#### **ORM (Object-Relational Mapping) 이해**
- **Entity**: 데이터베이스 테이블과 매핑되는 클래스
- **Repository**: 데이터베이스 연산을 담당하는 패턴
- **Migration**: 데이터베이스 스키마 변경 관리

#### **환경 설정 패턴**
```typescript
// config/database.config.ts
export default registerAs('database', () => ({
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
}));
```

#### **설정의 장점**
- **타입 안전성**: TypeScript로 설정 검증
- **환경별 분리**: development, production 환경 구분
- **보안**: 민감한 정보를 환경변수로 분리

---

### 🛠️ **NestJS 데이터베이스 연동 설정 상세 분석**

#### **1. database.config.ts를 만드는 이유**

**문제상황:**
- 환경변수 직접 사용 시 타입 안전성 부족
- 설정값 검증 불가
- 코드 중복 및 관리 어려움

**해결방법:**
```typescript
// ❌ 직접 사용 (문제점)
TypeOrmModule.forRoot({
  host: process.env.DATABASE_HOST,  // string | undefined (타입 에러)
  port: process.env.DATABASE_PORT,  // string이지만 number 필요
})

// ✅ config 파일 사용 (해결)
export default registerAs('database', () => ({
  host: process.env.DATABASE_HOST || 'localhost',  // 항상 string
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),  // 항상 number
}));
```

**장점:**
- **타입 안전성**: 환경변수 값의 타입 변환과 기본값 제공
- **중앙 관리**: 데이터베이스 설정을 한 곳에서 관리
- **재사용성**: 다른 모듈에서도 동일한 설정 사용 가능
- **검증**: 설정값의 유효성 검사 가능

#### **2. AppModule에서 TypeORM 설정하는 이유**

**NestJS 의존성 주입(DI) 시스템:**
```typescript
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,  // 모든 모듈에서 ConfigService 사용 가능
      load: [databaseConfig],  // 설정 파일 로드
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        // ConfigService를 통해 설정값 주입받음
      }),
      inject: [ConfigService],  // 의존성 명시
    }),
  ],
})
```

**핵심 개념:**
- **forRootAsync()**: 비동기 설정으로 다른 서비스의 의존성 해결
- **useFactory**: 팩토리 패턴으로 동적 설정 생성
- **inject**: 의존성 주입할 서비스 명시
- **isGlobal: true**: ConfigService를 앱 전체에서 사용 가능

#### **3. synchronize: true 설정의 의미**

```typescript
TypeOrmModule.forRootAsync({
  useFactory: () => ({
    synchronize: true,  // 개발 환경에서만 사용
  }),
})
```

**동작 방식:**
- **true**: Entity 변경 시 자동으로 데이터베이스 스키마 동기화
- **false**: 수동으로 마이그레이션 파일을 통해 스키마 변경

**주의사항:**
- **개발 환경**: 편의성을 위해 true 사용
- **운영 환경**: 데이터 손실 방지를 위해 반드시 false + 마이그레이션 사용

#### **4. NestJS 모듈 시스템의 동작 원리**

```typescript
@Module({
  imports: [ConfigModule, TypeOrmModule],  // 다른 모듈 가져오기
  controllers: [AppController],            // HTTP 요청 처리
  providers: [AppService],                 // 비즈니스 로직 서비스
})
```

**실행 순서:**
1. **ConfigModule 초기화** → 환경변수 로드
2. **TypeOrmModule 초기화** → ConfigService를 주입받아 DB 연결
3. **Controller/Provider 초기화** → 필요한 의존성들이 준비된 후 생성

---

### 💡 **학습 포인트**

1. **모듈화**: 기능별로 독립적인 모듈 구성
2. **의존성 주입**: NestJS의 DI 컨테이너 활용
3. **설정 관리**: 환경별 설정 분리와 타입 안전성
4. **API 설계**: RESTful API 원칙 준수
5. **비동기 초기화**: forRootAsync를 통한 의존성 해결
6. **팩토리 패턴**: useFactory로 동적 설정 생성

---

## 📝 TypeORM Entity 설계 - 데이터베이스 모델링 학습 (2024-09-28)

### 🎯 **Entity를 만드는 이유**

#### **Entity란?**
- **데이터베이스 테이블과 TypeScript 클래스를 매핑하는 객체**
- 객체 지향 프로그래밍과 관계형 데이터베이스를 연결하는 다리 역할
- SQL을 직접 작성하지 않고도 TypeScript 코드로 데이터베이스 조작 가능

#### **왜 Entity를 설계해야 하는가?**
```typescript
// ❌ Entity 없이 직접 SQL 사용 (문제점)
const query = `
  INSERT INTO users (email, name, password)
  VALUES ('${email}', '${name}', '${password}')
`;  // SQL Injection 위험, 타입 안전성 부족

// ✅ Entity 사용 (해결)
const user = new User();
user.email = email;
user.name = name;
user.password = password;
await userRepository.save(user);  // 타입 안전, SQL Injection 방지
```

**장점:**
- **타입 안전성**: TypeScript의 타입 검사 활용
- **코드 재사용**: 비즈니스 로직을 Entity에 포함 가능
- **관계 관리**: 테이블 간 관계를 객체 관계로 표현
- **자동 생성**: 스키마 자동 생성 및 동기화

---

### 🏗️ **TypeORM Annotation 상세 분석**

#### **1. 기본 Entity Annotations**
```typescript
@Entity('users')  // 테이블 이름 지정
export class User {
  @PrimaryGeneratedColumn()  // 자동 증가 기본키
  id: number;

  @Column({ unique: true })  // 고유 제약조건
  email: string;

  @Column('text')  // 긴 텍스트 타입
  description: string;

  @CreateDateColumn()  // 생성 시간 자동 설정
  createdAt: Date;

  @UpdateDateColumn()  // 수정 시간 자동 업데이트
  updatedAt: Date;
}
```

#### **2. 특수 컬럼 타입 Annotations**
```typescript
@Column('simple-array')
ingredients: string[];
// 저장: "토마토,양파,마늘"
// 읽기: ["토마토", "양파", "마늘"]

@Column('simple-json')
nutrition: { calories: number; protein: number; };
// 저장: '{"calories":250,"protein":15}'
// 읽기: { calories: 250, protein: 15 }

@Column({ default: 'easy', nullable: true })
difficulty: string;
// default: 기본값 설정
// nullable: NULL 허용 여부
```

#### **3. 관계 Annotations**
```typescript
// 1:N 관계 (한 사용자가 여러 레시피 소유)
@OneToMany(() => Recipe, recipe => recipe.user)
recipes: Recipe[];

// N:1 관계 (여러 레시피가 한 사용자에 속함)
@ManyToOne(() => User, user => user.recipes)
@JoinColumn({ name: 'userId' })
user: User;
```

---

### 🔗 **데이터베이스 관계(JOIN) 시각화**

#### **User ↔ Recipe 관계 구조**
```
┌─────────────────┐         ┌─────────────────────┐
│     users       │         │      recipes        │
├─────────────────┤         ├─────────────────────┤
│ id (PK)         │◄────────┤ userId (FK)         │
│ email           │    1:N  │ id (PK)             │
│ name            │         │ title               │
│ password        │         │ description         │
│ createdAt       │         │ ingredients[]       │
│ updatedAt       │         │ instructions[]      │
└─────────────────┘         │ nutrition{}         │
                            │ createdAt           │
                            │ updatedAt           │
                            └─────────────────────┘
```

#### **관계 설정의 핵심 포인트**
```typescript
// User Entity에서
@OneToMany(() => Recipe, recipe => recipe.user)
recipes: Recipe[];  // 한 사용자의 모든 레시피

// Recipe Entity에서
@ManyToOne(() => User, user => user.recipes)
@JoinColumn({ name: 'userId' })
user: User;  // 레시피 작성자
```

---

### 🔍 **TypeORM 관계 어노테이션 문법 상세 분석**

#### **`@OneToMany(() => Recipe, recipe => recipe.user)` 문법 해부**

```typescript
@OneToMany(
  () => Recipe,           // 1️⃣ 관련 Entity 타입 (Lazy Loading)
  recipe => recipe.user   // 2️⃣ 역방향 관계 참조 (Inverse Side)
)
recipes: Recipe[];
```

**1️⃣ `() => Recipe` - 지연 로딩(Lazy Loading)**
```typescript
// ❌ 직접 참조하면 순환 참조 문제 발생
@OneToMany(Recipe, recipe => recipe.user)  // Recipe를 직접 참조

// ✅ 함수로 감싸서 지연 로딩
@OneToMany(() => Recipe, recipe => recipe.user)  // 필요할 때 Recipe 로딩
```

**왜 함수로 감싸야 할까?**
- **순환 참조 해결**: User가 Recipe를 참조하고, Recipe가 User를 참조하는 상황
- **런타임 해결**: TypeScript 컴파일 타임에는 Recipe 클래스가 아직 정의되지 않을 수 있음
- **지연 평가**: 실제 필요할 때만 Recipe 타입을 평가

**2️⃣ `recipe => recipe.user` - 역방향 관계 참조**
```typescript
// User Entity의 recipes 속성이
// Recipe Entity의 어떤 속성과 연결되는지 명시
recipe => recipe.user
//  ↑        ↑
//  Recipe   Recipe의 user 속성
//  인스턴스
```

**실제 동작 원리:**
```typescript
// 사용자 조회 시 레시피도 함께 가져오기
const userWithRecipes = await userRepository.find({
  relations: ['recipes']  // recipes 관계도 함께 로딩
});

console.log(userWithRecipes[0].recipes);  // 해당 사용자의 모든 레시피
```

#### **양방향 관계 설정의 완전한 그림**

```typescript
// User Entity (One 쪽)
@OneToMany(() => Recipe, recipe => recipe.user)
recipes: Recipe[];
//         ↑
//         └─── Recipe.user와 연결

// Recipe Entity (Many 쪽)
@ManyToOne(() => User, user => user.recipes)
@JoinColumn({ name: 'userId' })
user: User;
//     ↑
//     └─── User.recipes와 연결
```

**관계 동기화 예시:**
```typescript
// 1. 새 사용자 생성
const user = new User();
user.email = "user@example.com";
user.name = "김사용자";

// 2. 새 레시피 생성
const recipe = new Recipe();
recipe.title = "김치찌개";
recipe.user = user;  // Recipe의 user 속성에 User 인스턴스 할당

// 3. 저장 시 TypeORM이 자동으로 관계 동기화
await userRepository.save(user);
await recipeRepository.save(recipe);

// 4. 조회 시 양방향 접근 가능
const foundUser = await userRepository.findOne({
  where: { id: user.id },
  relations: ['recipes']
});
console.log(foundUser.recipes[0].title);  // "김치찌개"

const foundRecipe = await recipeRepository.findOne({
  where: { id: recipe.id },
  relations: ['user']
});
console.log(foundRecipe.user.name);  // "김사용자"
```

#### **@JoinColumn의 역할**
```typescript
@ManyToOne(() => User, user => user.recipes)
@JoinColumn({ name: 'userId' })  // 실제 DB 컬럼명 지정
user: User;
```

**데이터베이스 레벨에서:**
```sql
-- recipes 테이블에 실제로 생성되는 컬럼
CREATE TABLE recipes (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  userId INTEGER REFERENCES users(id),  -- 외래키 컬럼
  -- 기타 컬럼들...
);
```

**정리:**
- `() => Recipe`: 순환 참조를 피하고 지연 로딩을 위한 함수 형태
- `recipe => recipe.user`: Recipe 엔티티의 user 속성과 연결됨을 명시
- 양방향 관계로 User → Recipe[], Recipe → User 모두 접근 가능
- TypeORM이 자동으로 관계 동기화 및 외래키 관리

---

### 🔧 **AppModule에 Entity 등록하기**

#### **왜 AppModule에 entities를 등록해야 할까?**

```typescript
// app.module.ts
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        entities: [User, Recipe], // 🎯 Entity 등록
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

#### **Entity 등록의 핵심 역할**

**1. 📋 TypeORM 메타데이터 등록**
```typescript
// TypeORM이 Entity 클래스를 스캔하고 메타데이터 수집
// @Entity, @Column, @PrimaryGeneratedColumn 등의 데코레이터 정보 분석
```

**2. 🏗️ 데이터베이스 테이블 자동 생성**
```sql
-- synchronize: true 옵션으로 Entity 기반 테이블 자동 생성
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR NOT NULL,
  password VARCHAR NOT NULL,
  "createdAt" TIMESTAMP DEFAULT now(),
  "updatedAt" TIMESTAMP DEFAULT now()
);

CREATE TABLE recipes (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT,
  ingredients TEXT, -- simple-array 타입
  instructions TEXT, -- simple-array 타입
  nutrition TEXT,   -- simple-json 타입
  "userId" INTEGER REFERENCES users(id),
  "createdAt" TIMESTAMP DEFAULT now(),
  "updatedAt" TIMESTAMP DEFAULT now()
);
```

**3. 🔄 Repository 패턴 활성화**
```typescript
// Entity 등록 후 Repository 사용 가능
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)  // Entity 등록으로 자동 주입 가능
    private userRepository: Repository<User>,
  ) {}

  async createUser(userData: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }
}
```

**4. 🔗 관계 매핑 활성화**
```typescript
// Entity 간 관계가 활성화되어 JOIN 쿼리 가능
const userWithRecipes = await this.userRepository.find({
  relations: ['recipes']  // User-Recipe 관계 로딩
});
```

#### **Entity 등록 없이 발생하는 문제들**

```typescript
// ❌ Entity 미등록 시 발생하는 에러들
// 1. Repository 주입 실패
@InjectRepository(User)  // Error: Repository<User> not found

// 2. 테이블 생성 안됨
// synchronize: true여도 테이블이 생성되지 않음

// 3. 관계 매핑 실패
relations: ['recipes']  // Error: Relation recipes not found
```

#### **Entity 등록 방식 비교**

**방식 1: 직접 등록 (현재 사용)**
```typescript
entities: [User, Recipe]
// 장점: 명시적, 작은 프로젝트에 적합
// 단점: Entity 추가 시마다 수동 등록 필요
```

**방식 2: 자동 스캔 (대규모 프로젝트)**
```typescript
entities: [__dirname + '/**/*.entity{.ts,.js}']
// 장점: 자동 스캔, 대규모 프로젝트에 적합
// 단점: 빌드 경로 이슈 가능성
```

#### **개발/운영 환경별 설정**

```typescript
// 개발 환경: synchronize: true
{
  entities: [User, Recipe],
  synchronize: true,  // Entity 변경 시 자동 테이블 업데이트
  logging: true,      // SQL 쿼리 로그 출력
}

// 운영 환경: synchronize: false
{
  entities: [User, Recipe],
  synchronize: false, // 수동 마이그레이션 사용
  migrations: ['dist/migrations/*{.ts,.js}'],
  migrationsRun: true,
}
```

**정리:**
- Entity 등록은 TypeORM이 클래스를 인식하고 데이터베이스와 매핑하기 위한 필수 과정
- Repository 패턴, 관계 매핑, 자동 테이블 생성이 모두 Entity 등록에 의존
- 개발 환경에서는 synchronize: true로 편리하게, 운영에서는 마이그레이션 사용

---

## 🏗️ **NestJS CRUD API 구현 아키텍처**

### 📋 **NestJS의 핵심 구성 요소와 역할**

#### **전체 아키텍처 흐름**
```
Client Request (HTTP)
        ↓
┌─────────────────┐    1. 요청 수신 및 라우팅
│   Controller    │ ←─ 📡 HTTP 요청/응답 처리
└─────────────────┘
        ↓ DTO 검증
┌─────────────────┐    2. 비즈니스 로직 처리
│     Service     │ ←─ 🧠 핵심 비즈니스 로직
└─────────────────┘
        ↓ Entity 조작
┌─────────────────┐    3. 데이터 접근 및 저장
│   Repository    │ ←─ 🗄️ 데이터베이스 CRUD
└─────────────────┘
        ↓ SQL Query
┌─────────────────┐    4. 데이터 영속성
│    Database     │ ←─ 💾 PostgreSQL
└─────────────────┘
```

---

### 🎯 **1. DTO (Data Transfer Object) - 데이터 전송 객체**

#### **DTO의 정의와 역할**
```typescript
// 📝 DTO는 계층 간 데이터 전송을 위한 객체
export class CreateRecipeDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description: string;

  @IsArray()
  @ArrayNotEmpty()
  ingredients: string[];

  @IsArray()
  instructions: string[];
}
```

**DTO의 핵심 목적:**
- **🔒 데이터 검증**: 클라이언트 입력값 유효성 검사
- **🛡️ 보안**: Entity 직접 노출 방지
- **📐 타입 안전성**: TypeScript 타입 시스템 활용
- **🔄 변환**: 외부 데이터 → 내부 데이터 구조 변환

#### **DTO vs Entity 차이점**
```typescript
// 🏗️ Entity: 데이터베이스 스키마와 1:1 매핑
@Entity('recipes')
export class Recipe {
  @PrimaryGeneratedColumn()
  id: number;                    // DB에서 자동 생성

  @CreateDateColumn()
  createdAt: Date;               // DB에서 자동 설정

  @ManyToOne(() => User)
  user: User;                    // 복잡한 관계 정보
}

// 📦 DTO: 클라이언트와의 데이터 교환용
export class CreateRecipeDto {
  // id, createdAt, user 등 제외
  title: string;                 // 클라이언트가 입력하는 것만
  description: string;
  ingredients: string[];
}
```

---

### 🧠 **2. Service - 비즈니스 로직 계층**

#### **Service의 정의와 역할**
```typescript
@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,
  ) {}

  // 🎯 핵심 비즈니스 로직 구현
  async createRecipe(createRecipeDto: CreateRecipeDto): Promise<Recipe> {
    // 1. 데이터 검증 및 변환
    const recipe = this.recipeRepository.create(createRecipeDto);

    // 2. 비즈니스 규칙 적용
    if (recipe.ingredients.length < 2) {
      throw new BadRequestException('레시피에는 최소 2개의 재료가 필요합니다');
    }

    // 3. 데이터 저장
    return this.recipeRepository.save(recipe);
  }
}
```

**Service가 담당하는 책임:**
- **📊 비즈니스 로직**: 도메인 규칙 및 정책 구현
- **🔄 데이터 처리**: Entity와 DTO 간 변환
- **🗄️ Repository 조작**: 데이터베이스 접근 추상화
- **⚠️ 예외 처리**: 비즈니스 규칙 위반 시 예외 발생

#### **Service가 없다면?**
```typescript
// ❌ Controller에 비즈니스 로직이 섞인 나쁜 예
@Controller('recipes')
export class RecipesController {
  @Post()
  async create(@Body() createRecipeDto: CreateRecipeDto) {
    // 🚫 Controller에서 직접 DB 접근
    const recipe = this.recipeRepository.create(createRecipeDto);

    // 🚫 Controller에서 비즈니스 로직 처리
    if (recipe.ingredients.length < 2) {
      throw new BadRequestException('재료가 부족합니다');
    }

    return this.recipeRepository.save(recipe);
  }
}
// 문제점: 재사용성 부족, 테스트 어려움, 관심사 분리 위반
```

---

### 📡 **3. Controller - HTTP 인터페이스 계층**

#### **Controller의 정의와 역할**
```typescript
@Controller('recipes')
@ApiTags('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post()
  @ApiOperation({ summary: '레시피 생성' })
  async create(@Body() createRecipeDto: CreateRecipeDto): Promise<Recipe> {
    // 🎯 HTTP 요청 → Service 호출 → HTTP 응답
    return this.recipesService.createRecipe(createRecipeDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Recipe> {
    return this.recipesService.findOne(+id);
  }
}
```

**Controller의 핵심 책임:**
- **🌐 HTTP 인터페이스**: REST API 엔드포인트 정의
- **📝 요청 처리**: URL, Body, Query 파라미터 추출
- **🔄 응답 변환**: Service 결과 → HTTP 응답 형태로 변환
- **📚 API 문서화**: Swagger 데코레이터로 API 스펙 자동 생성

#### **Controller의 계층 분리 원칙**
```typescript
// ✅ 올바른 Controller: 얇은 계층 (Thin Layer)
@Controller('recipes')
export class RecipesController {
  @Post()
  async create(@Body() dto: CreateRecipeDto) {
    return this.recipesService.createRecipe(dto);  // Service에 위임
  }
}

// ❌ 잘못된 Controller: 두꺼운 계층 (Fat Layer)
@Controller('recipes')
export class RecipesController {
  @Post()
  async create(@Body() dto: CreateRecipeDto) {

---

## 🔐 **UsersService - 인증 및 보안 구현**

### **1. bcrypt를 활용한 패스워드 보안**

#### **bcrypt의 동작 원리**
```typescript
import * as bcrypt from 'bcrypt';

export class UsersService {
  private readonly saltRounds = 10; // Salt Round 설정

  // 🔐 패스워드 해싱 (회원가입)
  async register(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,  // 평문 패스워드
      this.saltRounds,         // Salt 라운드 (복잡도)
    );

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,  // 해싱된 패스워드 저장
    });
  }

  // 🔍 패스워드 검증 (로그인)
  async login(loginUserDto: LoginUserDto) {
    const isPasswordValid = await bcrypt.compare(
      loginUserDto.password,  // 사용자 입력 (평문)
      user.password,          // DB 저장된 해시
    );
  }
}
```

#### **Salt와 Hash의 보안 메커니즘**
```
📊 bcrypt 해싱 과정:
1. Salt 생성: 무작위 문자열 생성 (saltRounds만큼 복잡도 증가)
2. Password + Salt 결합
3. Hash 함수 적용 (여러 라운드 반복)
4. 최종 해시값 반환 ($2b$10$salt+hash 형태)

🛡️ 보안 이점:
- 같은 패스워드라도 다른 해시값 생성 (Salt 덕분)
- 무차별 대입 공격(Brute Force) 방어
- 레인보우 테이블 공격 방어
- 시간 기반 공격 방어 (saltRounds로 계산 시간 조절)
```

#### **Salt Rounds의 선택 기준**
```typescript
// 🎯 saltRounds 선택 가이드
private readonly saltRounds = 10;  // 권장값

/*
saltRounds와 처리 시간:
- 10 rounds: ~65ms (권장, 2024년 기준)
- 12 rounds: ~250ms (높은 보안)
- 15 rounds: ~4초 (과도한 보안)

⚖️ 트레이드오프:
- 높을수록: 보안 강화, 성능 저하
- 낮을수록: 성능 향상, 보안 약화
*/
```

### **2. 사용자 인증 비즈니스 로직**

#### **회원가입 로직 (register)**
```typescript
async register(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
  // 🔍 1단계: 이메일 중복 확인
  const existingUser = await this.userRepository.findOne({
    where: { email: createUserDto.email },
  });

  if (existingUser) {
    throw new ConflictException('이미 존재하는 이메일입니다.');
  }

  // 🔐 2단계: 패스워드 해싱
  const hashedPassword = await bcrypt.hash(
    createUserDto.password,
    this.saltRounds,
  );

  // 💾 3단계: 사용자 생성 및 저장
  const user = this.userRepository.create({
    ...createUserDto,
    password: hashedPassword,
  });

  const savedUser = await this.userRepository.save(user);

  // 🛡️ 4단계: 보안을 위한 패스워드 제외 반환
  const { password, ...userWithoutPassword } = savedUser;
  return userWithoutPassword;
}
```

#### **로그인 로직 (login)**
```typescript
async login(loginUserDto: LoginUserDto): Promise<Omit<User, 'password'>> {
  // 🔍 1단계: 사용자 존재 확인
  const user = await this.userRepository.findOne({
    where: { email: loginUserDto.email },
  });

  if (!user) {
    throw new UnauthorizedException(
      '이메일 또는 패스워드가 올바르지 않습니다.',
    );
  }

  // 🔐 2단계: 패스워드 검증
  const isPasswordValid = await bcrypt.compare(
    loginUserDto.password,
    user.password,
  );

  if (!isPasswordValid) {
    throw new UnauthorizedException(
      '이메일 또는 패스워드가 올바르지 않습니다.',
    );
  }

  // 🛡️ 3단계: 성공 시 패스워드 제외 반환
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
```

### **3. 보안 모범 사례 구현**

#### **패스워드 제외 반환 패턴**
```typescript
// 🛡️ 모든 메서드에서 일관된 보안 처리
const { password, ...userWithoutPassword } = user;
return userWithoutPassword;

// 📝 TypeScript 타입으로 명시적 표현
Promise<Omit<User, 'password'>>  // 패스워드가 제외된 User 타입
```

#### **보안 에러 메시지 설계**
```typescript
// ✅ 정보 누출 방지: 이메일 존재 여부를 알 수 없게 함
if (!user || !isPasswordValid) {
  throw new UnauthorizedException(
    '이메일 또는 패스워드가 올바르지 않습니다.'
  );
}

// ❌ 정보 누출 위험
throw new UnauthorizedException('존재하지 않는 이메일입니다.');
throw new UnauthorizedException('패스워드가 틀렸습니다.');
```

### **4. 프로필 관리 및 관계 데이터 처리**

#### **사용자 조회 with 관계 데이터**
```typescript
async findOne(id: number): Promise<Omit<User, 'password'>> {
  const user = await this.userRepository.findOne({
    where: { id },
    relations: ['recipes'], // 🔗 User의 Recipe들도 함께 조회
  });

  if (!user) {
    throw new NotFoundException(`ID ${id}번 사용자를 찾을 수 없습니다.`);
  }

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
```

#### **프로필 수정 with 보안 검증**
```typescript
async update(id: number, updateUserDto: UpdateUserDto) {
  // 🔍 1단계: 사용자 존재 확인
  const existingUser = await this.userRepository.findOne({ where: { id } });

  // 📧 2단계: 이메일 변경 시 중복 확인
  if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
    const emailExists = await this.userRepository.findOne({
      where: { email: updateUserDto.email },
    });

    if (emailExists) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }
  }

  // 🔐 3단계: 패스워드 변경 시 해싱
  if (updateUserDto.password) {
    updateUserDto.password = await bcrypt.hash(
      updateUserDto.password,
      this.saltRounds,
    );
  }
}
```

### **5. User-Recipe 관계 활용**

#### **사용자별 레시피 통계**
```typescript
async getUserRecipeCount(id: number) {
  const user = await this.userRepository.findOne({
    where: { id },
    relations: ['recipes'], // 관계 데이터 로드
  });

  if (!user) {
    throw new NotFoundException(`ID ${id}번 사용자를 찾을 수 없습니다.`);
  }

  const { password, ...userWithoutPassword } = user;
  return {
    user: userWithoutPassword,
    recipeCount: user.recipes.length, // 관계 데이터 활용
  };
}
```

### **6. 유틸리티 메서드와 확장성**

#### **패스워드 검증 헬퍼**
```typescript
// 🔧 재사용 가능한 헬퍼 메서드
async validatePassword(
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

// 💡 활용 예시: JWT 토큰 갱신, 민감한 작업 재인증 등
```

### **7. NestJS 예외 처리 전략**

```typescript
// 🎯 적절한 HTTP 상태 코드와 예외 매핑
ConflictException     → 409: 리소스 충돌 (이메일 중복)
NotFoundException     → 404: 리소스 없음 (사용자 없음)
UnauthorizedException → 401: 인증 실패 (로그인 실패)

// 📊 프론트엔드에서 예외별 처리 가능
try {
  await userService.register(userData);
} catch (error) {
  if (error.status === 409) {
    showError('이미 존재하는 이메일입니다.');
  }
}
```

---
    // 🚫 Controller에서 복잡한 로직 처리
    const validatedData = this.validateData(dto);
    const processedData = this.processBusinessLogic(validatedData);
    return this.saveToDatabase(processedData);
  }
}
```

---

### 🏛️ **4. Module - 의존성 주입 및 모듈화**

#### **Module의 정의와 역할**
```typescript
@Module({
  imports: [TypeOrmModule.forFeature([Recipe])],  // Repository 등록
  controllers: [RecipesController],                // Controller 등록
  providers: [RecipesService],                     // Service 등록
  exports: [RecipesService],                       // 다른 모듈에서 사용 가능
})
export class RecipesModule {}
```

**Module이 담당하는 책임:**
- **🔗 의존성 주입**: Service, Controller, Repository 연결
- **📦 캡슐화**: 관련 기능들을 하나의 모듈로 묶음
- **🔄 모듈 간 통신**: exports로 다른 모듈에 서비스 제공
- **⚙️ 설정 관리**: 해당 도메인의 설정 집중 관리

#### **Module이 없다면?**
```typescript
// ❌ 모든 것이 AppModule에 집중되는 문제
@Module({
  imports: [TypeOrmModule.forFeature([User, Recipe, Review, Category])],
  controllers: [UserController, RecipeController, ReviewController],
  providers: [UserService, RecipeService, ReviewService],
})
export class AppModule {}
// 문제점: 모듈 크기 증가, 관심사 분리 부족, 유지보수 어려움
```

---

### 🎯 **개발 순서가 중요한 이유**

#### **권장 개발 순서: DTO → Service → Controller → Module**

```
1️⃣ DTO 작성
    ↓ 데이터 구조 정의
2️⃣ Service 작성
    ↓ 비즈니스 로직 구현
3️⃣ Controller 작성
    ↓ HTTP 인터페이스 구현
4️⃣ Module 작성
    ↓ 의존성 주입 설정
```

**각 단계별 개발 이유:**

**1단계: DTO 먼저**
- ✅ **데이터 계약 정의**: Service와 Controller가 어떤 데이터를 주고받을지 명확화
- ✅ **타입 안전성**: TypeScript 컴파일 타임 검증
- ✅ **검증 규칙 정의**: class-validator로 유효성 검사 규칙 설정

**2단계: Service 두 번째**
- ✅ **핵심 로직 구현**: DTO를 활용한 비즈니스 로직 작성
- ✅ **독립적 테스트**: Controller 없이도 Service 로직 테스트 가능
- ✅ **재사용성 확보**: 여러 Controller에서 동일한 Service 활용

**3단계: Controller 세 번째**
- ✅ **HTTP 인터페이스**: 완성된 Service를 HTTP로 노출
- ✅ **얇은 계층 유지**: Service에 모든 로직이 구현되어 있어 Controller는 단순해짐
- ✅ **API 문서화**: Swagger 데코레이터로 자동 문서화

**4단계: Module 마지막**
- ✅ **의존성 연결**: 모든 컴포넌트가 완성된 후 연결 설정
- ✅ **모듈 등록**: AppModule에 새로운 기능 모듈 추가
- ✅ **완전성 검증**: 전체 시스템이 올바르게 동작하는지 확인

#### **잘못된 순서로 개발할 때의 문제점**

```typescript
// ❌ Controller 먼저 만들면...
@Controller('recipes')
export class RecipesController {
  @Post()
  async create(@Body() ???: ???) {  // DTO가 없어서 타입 불명확
    return this.???Service.???(???);  // Service가 없어서 호출 불가
  }
}

// ❌ Service를 DTO 없이 만들면...
@Injectable()
export class RecipesService {
  async createRecipe(data: any) {  // any 타입 사용으로 타입 안전성 상실
    // 어떤 데이터가 올지 모르므로 검증 로직 작성 어려움
  }
}
```

**정리:**
- **DTO → Service → Controller → Module** 순서는 의존성 방향을 따름
- 각 계층이 명확한 책임을 가지며 관심사가 분리됨
- 테스트 용이성과 유지보수성이 크게 향상됨
- TypeScript의 타입 시스템을 최대한 활용할 수 있음

---

### 📝 **CreateRecipeDto 구현 상세 분석**

#### **DTO 어노테이션의 역할과 목적**

```typescript
export class CreateRecipeDto {
  @ApiProperty({ example: '김치찌개', description: '레시피 제목' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: '한식', description: '카테고리' })
  @IsOptional()
  @IsString()
  category?: string;
}
```

#### **1. 🔒 class-validator 어노테이션 (데이터 검증)**

**기본 검증 어노테이션:**
```typescript
@IsString()        // 문자열 타입 검증
@IsNotEmpty()      // 빈 문자열 방지 (null, undefined, '')
@IsArray()         // 배열 타입 검증
@ArrayNotEmpty()   // 빈 배열 방지 ([])
@IsNumber()        // 숫자 타입 검증
@IsObject()        // 객체 타입 검증
@IsOptional()      // 선택적 필드 (undefined 허용)
```

**고급 검증 어노테이션:**
```typescript
@Min(1)                    // 최솟값 검증 (1 이상)
@IsString({ each: true })  // 배열의 각 요소가 문자열인지 검증
```

#### **2. 📚 @nestjs/swagger 어노테이션 (API 문서화)**

**필수 필드 문서화:**
```typescript
@ApiProperty({
  example: '김치찌개',           // Swagger UI에 표시될 예시값
  description: '레시피 제목'      // 필드 설명
})
```

**선택적 필드 문서화:**
```typescript
@ApiPropertyOptional({
  example: '한식',              // 선택적 필드의 예시값
  description: '카테고리'        // 필드 설명
})
```

#### **3. 🎯 각 어노테이션이 해결하는 문제들**

**문제 1: 잘못된 데이터 타입**
```typescript
// ❌ 클라이언트가 잘못된 데이터 전송 시
{
  "title": 123,           // 숫자를 문자열로 전송
  "ingredients": "감자"    // 문자열을 배열로 전송
}

// ✅ @IsString(), @IsArray() 어노테이션으로 해결
@IsString()
title: string;           // 400 Bad Request 발생

@IsArray()
ingredients: string[];   // 400 Bad Request 발생
```

**문제 2: 빈 값 처리**
```typescript
// ❌ 클라이언트가 빈 값 전송 시
{
  "title": "",                    // 빈 문자열
  "ingredients": [],              // 빈 배열
  "instructions": ["", ""]        // 빈 문자열 포함 배열
}

// ✅ 검증 어노테이션으로 해결
@IsNotEmpty()
title: string;                    // 빈 문자열 거부

@ArrayNotEmpty()
ingredients: string[];            // 빈 배열 거부

@IsString({ each: true })
instructions: string[];           // 배열 내 빈 문자열 거부
```

**문제 3: API 문서화 부재**
```typescript
// ❌ 어노테이션 없이 Swagger에서 확인할 수 없는 정보
export class CreateRecipeDto {
  title: string;         // 어떤 형식인지 모름
  cookTime?: number;     // 필수인지 선택적인지 모름
}

// ✅ Swagger 어노테이션으로 해결
@ApiProperty({
  example: '김치찌개',
  description: '레시피 제목'
})
title: string;           // Swagger UI에서 명확한 정보 제공

@ApiPropertyOptional({
  example: 30,
  description: '조리 시간 (분)'
})
cookTime?: number;       // 선택적 필드임을 명시
```

#### **4. 🔄 Entity vs DTO 필드 매핑 전략**

```typescript
// 🏗️ Recipe Entity (전체 필드)
@Entity('recipes')
export class Recipe {
  @PrimaryGeneratedColumn()
  id: number;                    // ❌ DTO 제외: DB 자동 생성

  @CreateDateColumn()
  createdAt: Date;               // ❌ DTO 제외: 자동 설정

  @Column()
  title: string;                 // ✅ DTO 포함: 사용자 입력

  @Column('simple-array')
  ingredients: string[];         // ✅ DTO 포함: 사용자 입력

  @Column({ nullable: true })
  category?: string;             // ✅ DTO 포함: 선택적 입력

  @ManyToOne(() => User)
  user: User;                    // ❌ DTO 제외: 인증으로 해결
}

// 📦 CreateRecipeDto (필요한 필드만)
export class CreateRecipeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;                 // 필수 입력

  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  ingredients: string[];         // 필수 입력

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string;             // 선택적 입력
}
```

#### **5. 🎨 실제 Swagger UI 생성 결과**

```json
// POST /recipes 엔드포인트 문서
{
  "requestBody": {
    "required": true,
    "content": {
      "application/json": {
        "schema": {
          "type": "object",
          "properties": {
            "title": {
              "type": "string",
              "example": "김치찌개",
              "description": "레시피 제목"
            },
            "ingredients": {
              "type": "array",
              "items": { "type": "string" },
              "example": ["김치 300g", "돼지고기 200g"],
              "description": "재료 목록"
            },
            "category": {
              "type": "string",
              "example": "한식",
              "description": "카테고리"
            }
          },
          "required": ["title", "ingredients"]
        }
      }
    }
  }
}
```

#### **6. ⚠️ 검증 실패 시 응답 예시**

```typescript
// 클라이언트가 잘못된 데이터 전송 시
POST /recipes
{
  "title": "",                    // @IsNotEmpty() 위반
  "ingredients": [],              // @ArrayNotEmpty() 위반
  "cookTime": -5                  // @Min(1) 위반
}

// NestJS 자동 응답
HTTP 400 Bad Request
{
  "statusCode": 400,
  "message": [
    "title should not be empty",
    "ingredients should not be empty",
    "cookTime must not be less than 1"
  ],
  "error": "Bad Request"
}
```

**정리:**
- **class-validator**: 런타임 데이터 검증으로 안전성 확보
- **@nestjs/swagger**: 자동 API 문서화로 개발 효율성 향상
- **@IsOptional vs 필수 필드**: 비즈니스 요구사항에 따른 명확한 구분
- **Entity 필드 선별**: 보안과 사용성을 고려한 DTO 설계
- **타입 안전성**: TypeScript + 검증 어노테이션으로 이중 보장

---

### 🔄 **UpdateRecipeDto - PartialType 활용**

#### **PartialType이란?**

```typescript
import { PartialType } from '@nestjs/swagger';
import { CreateRecipeDto } from './create-recipe.dto';

export class UpdateRecipeDto extends PartialType(CreateRecipeDto) {}
```

**PartialType의 마법적인 변환:**

```typescript
// 🔍 PartialType이 내부적으로 수행하는 작업

// ✨ CreateRecipeDto (원본)
export class CreateRecipeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;                    // 필수 필드

  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  ingredients: string[];            // 필수 필드

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string;                // 이미 선택적 필드
}

// 🔄 UpdateRecipeDto (PartialType 적용 후)
export class UpdateRecipeDto {
  @ApiPropertyOptional()            // @ApiProperty → @ApiPropertyOptional
  @IsOptional()                     // 자동 추가
  @IsString()
  title?: string;                   // string → string? (선택적)

  @ApiPropertyOptional()            // @ApiProperty → @ApiPropertyOptional
  @IsOptional()                     // 자동 추가
  @IsArray()
  ingredients?: string[];           // string[] → string[]? (선택적)

  @ApiPropertyOptional()            // 기존 그대로 유지
  @IsOptional()
  @IsString()
  category?: string;                // 이미 선택적이므로 변화 없음
}
```

#### **PartialType vs 수동 작성 비교**

**❌ 수동으로 UpdateRecipeDto 작성 시 문제점:**
```typescript
// 😰 CreateRecipeDto를 수동으로 복사해서 작성
export class UpdateRecipeDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  ingredients?: string[];

  // ... 모든 필드를 일일이 복사하고 수정해야 함
  // 😱 CreateRecipeDto가 변경되면 UpdateRecipeDto도 수동으로 동기화 필요
}
```

**✅ PartialType 사용의 장점:**
```typescript
// 🎯 한 줄로 해결!
export class UpdateRecipeDto extends PartialType(CreateRecipeDto) {}

// 장점:
// 1. 코드 중복 제거
// 2. CreateRecipeDto 변경 시 자동으로 동기화
// 3. 타입 안전성 보장
// 4. Swagger 문서 자동 업데이트
```

#### **실제 API 사용 시나리오**

**Create vs Update 요청 비교:**

```typescript
// 📝 POST /recipes (생성) - 모든 필수 필드 제공
{
  "title": "김치찌개",              // ✅ 필수
  "description": "얼큰한 국물",     // ✅ 필수
  "ingredients": ["김치", "두부"],  // ✅ 필수
  "instructions": ["볶기", "끓이기"], // ✅ 필수
  "cookTime": 30,                  // 선택적
  "category": "한식"               // 선택적
}

// 🔄 PATCH /recipes/1 (수정) - 변경할 필드만 제공
{
  "cookTime": 25,                  // 조리시간만 수정
  "category": "국물요리"           // 카테고리만 수정
}
// title, description, ingredients, instructions는 기존 값 유지
```

#### **PartialType의 검증 동작**

```typescript
// PATCH /recipes/1 요청 시 UpdateRecipeDto 검증

// ✅ 올바른 부분 업데이트
{
  "title": "새로운 제목"           // @IsString() 검증 통과
}

// ✅ 아무것도 보내지 않아도 OK
{
  // 빈 객체도 유효 (모든 필드가 선택적)
}

// ❌ 잘못된 타입은 여전히 거부
{
  "title": 123,                   // @IsString() 검증 실패
  "cookTime": -5                  // @Min(1) 검증 실패
}
```

#### **HTTP 메서드별 DTO 사용 패턴**

```typescript
@Controller('recipes')
export class RecipesController {
  // 🆕 생성 - 모든 필수 필드 검증
  @Post()
  async create(@Body() createRecipeDto: CreateRecipeDto) {
    return this.recipesService.create(createRecipeDto);
  }

  // 🔄 전체 수정 - 모든 필수 필드 검증
  @Put(':id')
  async update(@Param('id') id: string, @Body() createRecipeDto: CreateRecipeDto) {
    return this.recipesService.update(id, createRecipeDto);
  }

  // 🔧 부분 수정 - 선택적 필드만 검증
  @Patch(':id')
  async partialUpdate(@Param('id') id: string, @Body() updateRecipeDto: UpdateRecipeDto) {
    return this.recipesService.update(id, updateRecipeDto);
  }
}
```

#### **다른 Utility Types와의 비교**

```typescript
// 🔄 PartialType - 모든 필드를 선택적으로
export class UpdateRecipeDto extends PartialType(CreateRecipeDto) {}
// 결과: { title?: string, ingredients?: string[] }

// 🎯 PickType - 특정 필드만 선택
export class RecipeTitleDto extends PickType(CreateRecipeDto, ['title', 'category']) {}
// 결과: { title: string, category?: string }

// 🚫 OmitType - 특정 필드 제외
export class RecipeWithoutIdDto extends OmitType(CreateRecipeDto, ['id']) {}
// 결과: CreateRecipeDto에서 id 제외한 모든 필드

// 🔀 IntersectionType - 두 DTO 합성
export class ExtendedRecipeDto extends IntersectionType(CreateRecipeDto, ExtraFieldsDto) {}
// 결과: CreateRecipeDto + ExtraFieldsDto의 모든 필드
```

#### **실제 비즈니스 로직에서의 활용**

```typescript
@Injectable()
export class RecipesService {
  async update(id: number, updateRecipeDto: UpdateRecipeDto): Promise<Recipe> {
    // 1. 기존 레시피 조회
    const existingRecipe = await this.recipeRepository.findOne({ where: { id } });

    // 2. 제공된 필드만 업데이트 (undefined 필드는 무시)
    const updatedRecipe = {
      ...existingRecipe,
      ...updateRecipeDto,    // 🎯 부분 업데이트의 핵심
    };

    // 3. 변경된 내용만 데이터베이스에 저장
    return this.recipeRepository.save(updatedRecipe);
  }
}

// 사용 예시:
// 기존: { title: "김치찌개", cookTime: 30, category: "한식" }
// 요청: { cookTime: 25 }
// 결과: { title: "김치찌개", cookTime: 25, category: "한식" }
```

**정리:**
- **PartialType**: 기존 DTO의 모든 필드를 선택적으로 변환하는 유틸리티
- **자동 동기화**: CreateRecipeDto 변경 시 UpdateRecipeDto 자동 반영
- **부분 업데이트**: REST API의 PATCH 메서드 구현에 최적화
- **타입 안전성**: TypeScript와 class-validator의 장점을 모두 유지
- **코드 효율성**: 중복 코드 제거 및 유지보수성 향상

---

### 🧠 **RecipesService - 비즈니스 로직 구현**

#### **Service의 핵심 책임과 구조**

```typescript
@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,
  ) {}

  // CRUD 메서드들...
}
```

**Service 클래스의 핵심 구성 요소:**
- **@Injectable()**: NestJS 의존성 주입 시스템에 등록
- **Repository 주입**: TypeORM Repository 패턴 활용
- **비즈니스 로직**: 도메인 규칙 및 데이터 처리 로직

#### **1. 🔒 비즈니스 규칙 검증**

```typescript
// 📝 create() 메서드에서의 비즈니스 검증
async create(createRecipeDto: CreateRecipeDto): Promise<Recipe> {
  // 🎯 비즈니스 규칙 1: 재료 최소 개수 검증
  if (createRecipeDto.ingredients.length < 2) {
    throw new BadRequestException('레시피에는 최소 2개의 재료가 필요합니다');
  }

  // 🎯 비즈니스 규칙 2: 조리 순서 최소 단계 검증
  if (createRecipeDto.instructions.length < 3) {
    throw new BadRequestException('조리 순서는 최소 3단계 이상이어야 합니다');
  }

  const recipe = this.recipeRepository.create(createRecipeDto);
  return this.recipeRepository.save(recipe);
}
```

**비즈니스 규칙이 중요한 이유:**
- **데이터 품질 보장**: 의미있는 레시피만 저장
- **사용자 경험 향상**: 완성도 높은 레시피 제공
- **도메인 지식 반영**: 실제 요리 상식을 코드로 구현

#### **2. 📋 페이지네이션과 관계 데이터 로딩**

```typescript
// 📋 findAll() - 페이지네이션 지원
async findAll(page: number = 1, limit: number = 10): Promise<{
  data: Recipe[];
  total: number;
  page: number;
  limit: number;
}> {
  const [data, total] = await this.recipeRepository.findAndCount({
    relations: ['user'],           // 🔗 관계 데이터 즉시 로딩
    skip: (page - 1) * limit,     // 📄 페이지네이션 offset
    take: limit,                  // 📄 페이지네이션 limit
    order: { createdAt: 'DESC' }, // 📅 최신순 정렬
  });

  return { data, total, page, limit };
}
```

**페이지네이션 구현의 장점:**
- **성능 최적화**: 대량 데이터를 분할하여 로딩
- **메모리 효율성**: 필요한 만큼만 메모리에 로드
- **사용자 경험**: 빠른 응답 시간 보장

#### **3. ⚠️ 에러 처리와 예외 관리**

```typescript
// 🔍 findOne() - 존재하지 않는 리소스 처리
async findOne(id: number): Promise<Recipe> {
  const recipe = await this.recipeRepository.findOne({
    where: { id },
    relations: ['user'],
  });

  if (!recipe) {
    throw new NotFoundException(`ID ${id}번 레시피를 찾을 수 없습니다`);
  }

  return recipe;
}
```

**NestJS 예외 처리 패턴:**
```typescript
// ❌ 일반적인 에러 (지양)
throw new Error('레시피를 찾을 수 없습니다');

// ✅ NestJS 표준 예외 (권장)
throw new NotFoundException(`ID ${id}번 레시피를 찾을 수 없습니다`);
throw new BadRequestException('레시피에는 최소 2개의 재료가 필요합니다');

// 자동으로 적절한 HTTP 상태 코드 반환:
// NotFoundException → 404 Not Found
// BadRequestException → 400 Bad Request
```

#### **4. 🔄 부분 업데이트 로직**

```typescript
// 🔄 update() - 부분 업데이트 구현
async update(id: number, updateRecipeDto: UpdateRecipeDto): Promise<Recipe> {
  // 1. 기존 데이터 조회
  const existingRecipe = await this.findOne(id);

  // 2. 업데이트될 데이터로 비즈니스 규칙 재검증
  const updatedIngredients = updateRecipeDto.ingredients || existingRecipe.ingredients;
  const updatedInstructions = updateRecipeDto.instructions || existingRecipe.instructions;

  // 3. 비즈니스 규칙 적용
  if (updatedIngredients.length < 2) {
    throw new BadRequestException('레시피에는 최소 2개의 재료가 필요합니다');
  }

  // 4. 부분 업데이트 적용 (spread operator 활용)
  const updatedRecipe = {
    ...existingRecipe,        // 기존 데이터 유지
    ...updateRecipeDto,       // 변경된 데이터만 덮어쓰기
  };

  return this.recipeRepository.save(updatedRecipe);
}
```

**부분 업데이트의 핵심 원리:**
```typescript
// 기존 데이터: { title: "김치찌개", ingredients: ["김치", "두부"], cookTime: 30 }
// 업데이트 요청: { cookTime: 25 }
// 최종 결과: { title: "김치찌개", ingredients: ["김치", "두부"], cookTime: 25 }
```

#### **5. 🔍 고급 검색 기능**

**카테고리별 검색:**
```typescript
async findByCategory(category: string): Promise<Recipe[]> {
  return this.recipeRepository.find({
    where: { category },
    relations: ['user'],
    order: { createdAt: 'DESC' },
  });
}
```

**재료로 검색 (QueryBuilder 활용):**
```typescript
async findByIngredient(ingredient: string): Promise<Recipe[]> {
  return this.recipeRepository
    .createQueryBuilder('recipe')
    .leftJoinAndSelect('recipe.user', 'user')     // LEFT JOIN으로 user 정보 포함
    .where('recipe.ingredients LIKE :ingredient', {
      ingredient: `%${ingredient}%`               // 부분 일치 검색
    })
    .orderBy('recipe.createdAt', 'DESC')
    .getMany();
}
```

**QueryBuilder vs find() 비교:**
```typescript
// 🔍 단순 검색: find() 메서드 사용
this.recipeRepository.find({ where: { category: '한식' } });

// 🔍 복잡한 검색: QueryBuilder 사용
this.recipeRepository
  .createQueryBuilder('recipe')
  .where('recipe.ingredients LIKE :ingredient', { ingredient: '%감자%' })
  .andWhere('recipe.cookTime < :time', { time: 30 })
  .getMany();
```

#### **6. 🗄️ Repository 패턴 활용**

```typescript
// Repository 메서드 활용 예시
const recipe = this.recipeRepository.create(createRecipeDto);  // Entity 인스턴스 생성
await this.recipeRepository.save(recipe);                     // 데이터베이스 저장
await this.recipeRepository.findOne({ where: { id } });       // 단건 조회
await this.recipeRepository.findAndCount({ skip: 0, take: 10 }); // 페이지네이션
await this.recipeRepository.remove(recipe);                   // 삭제
```

**Repository vs 직접 SQL 비교:**
```typescript
// ❌ 직접 SQL (지양)
await this.connection.query('SELECT * FROM recipes WHERE id = ?', [id]);

// ✅ Repository 패턴 (권장)
await this.recipeRepository.findOne({ where: { id } });

// 장점:
// 1. 타입 안전성
// 2. SQL Injection 방지
// 3. 객체-관계 매핑 자동화
// 4. 코드 가독성 향상
```

#### **7. 🎯 Service 계층의 핵심 원칙**

**단일 책임 원칙 (SRP):**
```typescript
// ✅ 올바른 Service - 비즈니스 로직에만 집중
@Injectable()
export class RecipesService {
  // 레시피 관련 비즈니스 로직만 담당
  async create(dto: CreateRecipeDto) { /* ... */ }
  async findAll() { /* ... */ }
}

// ❌ 잘못된 Service - 여러 책임 혼재
@Injectable()
export class RecipesService {
  async create(dto: CreateRecipeDto) { /* ... */ }
  async sendEmail() { /* ... */ }      // 이메일은 별도 서비스
  async generatePdf() { /* ... */ }    // PDF는 별도 서비스
}
```

**정리:**
- **비즈니스 로직 중심**: 도메인 규칙과 정책을 코드로 구현
- **Repository 추상화**: 데이터 접근 계층을 캡슐화
- **에러 처리**: NestJS 표준 예외로 적절한 HTTP 응답 자동 생성
- **확장 가능성**: QueryBuilder로 복잡한 검색 로직 구현 가능
- **타입 안전성**: TypeScript + TypeORM으로 컴파일 타임 검증

---

### 📡 **RecipesController - HTTP 인터페이스 계층**

#### **Controller의 핵심 책임과 구조**

```typescript
@ApiTags('recipes')
@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  // REST API 엔드포인트들...
}
```

**Controller 클래스의 핵심 구성 요소:**
- **@Controller('recipes')**: 라우팅 경로 설정 (/recipes)
- **@ApiTags('recipes')**: Swagger UI에서 API 그룹화
- **Service 의존성 주입**: 비즈니스 로직 계층과 연결
- **얇은 계층 원칙**: HTTP 요청/응답 처리만 담당

#### **1. 🌐 HTTP 메서드 매핑과 REST API 설계**

```typescript
// 📝 POST /recipes - 리소스 생성
@Post()
async create(@Body() createRecipeDto: CreateRecipeDto): Promise<Recipe> {
  return this.recipesService.create(createRecipeDto);
}

// 📋 GET /recipes - 리소스 목록 조회
@Get()
async findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
  return this.recipesService.findAll(page, limit);
}

// 🔍 GET /recipes/:id - 특정 리소스 조회
@Get(':id')
async findOne(@Param('id', ParseIntPipe) id: number): Promise<Recipe> {
  return this.recipesService.findOne(id);
}

// 🔄 PATCH /recipes/:id - 리소스 부분 수정
@Patch(':id')
async update(@Param('id', ParseIntPipe) id: number, @Body() updateRecipeDto: UpdateRecipeDto) {
  return this.recipesService.update(id, updateRecipeDto);
}

// 🗑️ DELETE /recipes/:id - 리소스 삭제
@Delete(':id')
@HttpCode(HttpStatus.NO_CONTENT)
async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
  return this.recipesService.remove(id);
}
```

**REST API 설계 원칙:**
- **명사형 URL**: `/recipes` (동사가 아닌 명사 사용)
- **HTTP 메서드 활용**: GET(조회), POST(생성), PATCH(수정), DELETE(삭제)
- **계층적 구조**: `/recipes/:id/comments` (리소스 간 관계 표현)
- **상태 코드**: 201(생성), 200(조회/수정), 204(삭제), 404(없음)

#### **2. 📝 Swagger API 문서화**

```typescript
@ApiOperation({
  summary: '레시피 생성',           // 간단한 요약
  description: '새로운 레시피를 생성합니다.'  // 상세 설명
})
@ApiResponse({
  status: 201,                     // HTTP 상태 코드
  description: '레시피가 성공적으로 생성되었습니다.',
  type: Recipe,                    // 응답 타입
})
@ApiResponse({
  status: 400,                     // 에러 케이스 문서화
  description: '잘못된 요청 데이터 (비즈니스 규칙 위반)',
})
```

**Swagger 어노테이션의 장점:**
```typescript
// 자동 생성되는 API 문서 구조
{
  "paths": {
    "/recipes": {
      "post": {
        "tags": ["recipes"],
        "summary": "레시피 생성",
        "description": "새로운 레시피를 생성합니다.",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/CreateRecipeDto" }
            }
          }
        },
        "responses": {
          "201": {
            "description": "레시피가 성공적으로 생성되었습니다.",
            "content": {
              "application/json": {
                "schema": { "$ref": "#/components/schemas/Recipe" }
              }
            }
          }
        }
      }
    }
  }
}
```

#### **3. 🎯 매개변수 추출 및 변환**

**URL 파라미터 추출:**
```typescript
// GET /recipes/123
@Get(':id')
async findOne(@Param('id', ParseIntPipe) id: number): Promise<Recipe> {
  //              ↑          ↑
  //          파라미터명   자동 타입 변환
  return this.recipesService.findOne(id);
}
```

**쿼리 파라미터 추출:**
```typescript
// GET /recipes?page=2&limit=20
@Get()
async findAll(
  @Query('page', new ParseIntPipe({ optional: true })) page?: number,
  @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
) {
  return this.recipesService.findAll(page, limit);
}
```

**요청 본문 추출:**
```typescript
// POST /recipes (JSON body)
@Post()
async create(@Body() createRecipeDto: CreateRecipeDto): Promise<Recipe> {
  // @Body()가 JSON을 CreateRecipeDto로 자동 변환 및 검증
  return this.recipesService.create(createRecipeDto);
}
```

#### **4. 🔧 Pipe 활용한 데이터 변환 및 검증**

```typescript
// ParseIntPipe - 문자열을 숫자로 변환
@Param('id', ParseIntPipe) id: number

// 내부 동작 원리
'123' → ParseIntPipe → 123 (number)
'abc' → ParseIntPipe → 400 Bad Request (검증 실패)
```

**Pipe의 처리 순서:**
```typescript
// 1. 클라이언트 요청
GET /recipes/abc

// 2. ParseIntPipe 검증
'abc' → 숫자로 변환 시도 → 실패

// 3. 자동 에러 응답
HTTP 400 Bad Request
{
  "statusCode": 400,
  "message": "Validation failed (numeric string is expected)",
  "error": "Bad Request"
}
```

#### **5. 🛣️ 고급 라우팅 패턴**

**중첩 경로 설계:**
```typescript
@Controller('recipes')
export class RecipesController {
  @Get(':id')                    // /recipes/123
  async findOne() { /* ... */ }

  @Get('category/:category')     // /recipes/category/한식
  async findByCategory() { /* ... */ }

  @Get('search/ingredient')      // /recipes/search/ingredient?q=감자
  async findByIngredient() { /* ... */ }
}
```

**라우팅 우선순위 주의사항:**
```typescript
// ❌ 잘못된 순서 - :id가 category를 가로챔
@Get(':id')                      // 이것이 먼저 정의되면
@Get('category/:category')       // /recipes/category/한식 → id='category'로 인식

// ✅ 올바른 순서 - 구체적인 경로를 먼저
@Get('category/:category')       // 구체적인 경로 먼저
@Get('search/ingredient')        // 구체적인 경로 먼저
@Get(':id')                      // 동적 경로는 나중에
```

#### **6. 📊 응답 상태 코드 관리**

```typescript
// 생성 성공 - 201 Created (기본값)
@Post()
async create() { /* ... */ }

// 삭제 성공 - 204 No Content (명시적 설정)
@Delete(':id')
@HttpCode(HttpStatus.NO_CONTENT)
async remove() { /* ... */ }

// 조회/수정 - 200 OK (기본값)
@Get()
@Patch(':id')
async findAll() { /* ... */ }
```

**상태 코드 자동 설정 규칙:**
- **POST**: 201 Created (생성 성공)
- **GET**: 200 OK (조회 성공)
- **PATCH/PUT**: 200 OK (수정 성공)
- **DELETE**: 200 OK (기본값) → 204 No Content (권장)

#### **7. 🔄 Controller와 Service 계층 분리**

```typescript
// ✅ 올바른 Controller - 얇은 계층
@Controller('recipes')
export class RecipesController {
  @Post()
  async create(@Body() createRecipeDto: CreateRecipeDto) {
    return this.recipesService.create(createRecipeDto);  // Service에 위임
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.recipesService.findOne(id);  // Service에 위임
  }
}

// ❌ 잘못된 Controller - 두꺼운 계층
@Controller('recipes')
export class RecipesController {
  @Post()
  async create(@Body() createRecipeDto: CreateRecipeDto) {
    // 🚫 Controller에서 비즈니스 로직 처리
    if (createRecipeDto.ingredients.length < 2) {
      throw new BadRequestException('재료가 부족합니다');
    }

    // 🚫 Controller에서 직접 DB 접근
    const recipe = this.recipeRepository.create(createRecipeDto);
    return this.recipeRepository.save(recipe);
  }
}
```

#### **8. 🎨 실제 API 엔드포인트 결과**

**구현된 REST API 엔드포인트:**
```http
POST   /recipes                    # 레시피 생성
GET    /recipes                    # 레시피 목록 조회 (페이지네이션)
GET    /recipes/:id                # 특정 레시피 조회
PATCH  /recipes/:id                # 레시피 수정
DELETE /recipes/:id                # 레시피 삭제
GET    /recipes/category/:category # 카테고리별 조회
GET    /recipes/search/ingredient  # 재료로 검색
```

**실제 사용 예시:**
```bash
# 레시피 생성
curl -X POST http://localhost:3000/recipes \
  -H "Content-Type: application/json" \
  -d '{"title":"김치찌개","ingredients":["김치","두부"],"instructions":["볶기","끓이기","완성"]}'

# 페이지네이션 조회
curl "http://localhost:3000/recipes?page=2&limit=5"

# 카테고리별 조회
curl "http://localhost:3000/recipes/category/한식"

# 재료 검색
curl "http://localhost:3000/recipes/search/ingredient?q=감자"
```

**정리:**
- **얇은 계층 원칙**: HTTP 요청/응답 처리만 담당, 비즈니스 로직은 Service에 위임
- **Swagger 자동 문서화**: API 스펙 자동 생성으로 개발 효율성 향상
- **타입 안전성**: ParseIntPipe 등으로 런타임 타입 검증
- **REST API 표준**: HTTP 메서드와 상태 코드 적절히 활용
- **라우팅 최적화**: 구체적 경로를 동적 경로보다 먼저 정의

---

### 🏛️ **RecipesModule - 의존성 주입 및 모듈화**

#### **Module의 핵심 역할과 구조**

```typescript
@Module({
  imports: [TypeOrmModule.forFeature([Recipe])],  // Repository 등록
  controllers: [RecipesController],                // Controller 등록
  providers: [RecipesService],                     // Service 등록
  exports: [RecipesService],                       // 외부 모듈에서 사용 가능
})
export class RecipesModule {}
```

**Module의 핵심 책임:**
- **🔗 의존성 주입**: Service, Controller, Repository 간 연결
- **📦 캡슐화**: 관련 기능들을 하나의 모듈로 묶음
- **🔄 모듈 간 통신**: exports로 다른 모듈에 서비스 제공
- **⚙️ 설정 관리**: 해당 도메인의 설정 집중 관리

#### **1. 📋 Module 구성 요소 상세 분석**

**imports - 의존하는 모듈 등록:**
```typescript
imports: [
  TypeOrmModule.forFeature([Recipe])  // Recipe Repository 사용 가능하게 등록
]

// 내부 동작 원리:
// 1. Recipe Entity를 기반으로 Repository<Recipe> 자동 생성
// 2. 생성된 Repository를 DI 컨테이너에 등록
// 3. @InjectRepository(Recipe)로 주입 가능하게 됨
```

**controllers - HTTP 인터페이스 등록:**
```typescript
controllers: [RecipesController]

// 효과:
// 1. RecipesController를 인스턴스화
// 2. 라우팅 정보를 NestJS에 등록
// 3. HTTP 요청을 해당 Controller로 라우팅
```

**providers - 서비스 제공자 등록:**
```typescript
providers: [RecipesService]

// 동등한 표현:
providers: [
  {
    provide: RecipesService,     // 토큰
    useClass: RecipesService,    // 실제 클래스
  }
]

// 효과:
// 1. RecipesService를 DI 컨테이너에 등록
// 2. 다른 클래스에서 생성자 주입으로 사용 가능
```

**exports - 외부 노출 설정:**
```typescript
exports: [RecipesService]

// 효과:
// 1. 다른 모듈에서 RecipesService 사용 가능
// 2. import한 모듈에서 @Inject() 또는 생성자 주입 가능
```

#### **2. 🔄 의존성 주입 동작 원리**

```typescript
// RecipesController에서 RecipesService 주입
@Controller('recipes')
export class RecipesController {
  constructor(
    private readonly recipesService: RecipesService  // 자동 주입
  ) {}
}

// RecipesService에서 Repository 주입
@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>  // 자동 주입
  ) {}
}
```

**의존성 해결 과정:**
```
1. RecipesModule 로딩
   ↓
2. TypeOrmModule.forFeature([Recipe]) 실행
   → Repository<Recipe> 생성 및 등록
   ↓
3. RecipesService 인스턴스화
   → Repository<Recipe> 주입
   ↓
4. RecipesController 인스턴스화
   → RecipesService 주입
   ↓
5. HTTP 라우팅 활성화
```

#### **3. 🏗️ AppModule과의 통합**

```typescript
// app.module.ts
@Module({
  imports: [
    ConfigModule.forRoot({ ... }),
    TypeOrmModule.forRootAsync({ ... }),
    RecipesModule,  // 🎯 RecipesModule 통합
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

**통합 시 발생하는 일:**
1. **Module 트리 구성**: AppModule이 루트, RecipesModule이 자식
2. **의존성 그래프 구축**: 모든 Provider 간 의존성 분석
3. **순환 의존성 검사**: 컴파일 타임에 순환 의존성 탐지
4. **인스턴스 생성**: 의존성 순서에 따라 인스턴스 생성

#### **4. 🎯 Module 설계 패턴과 모범 사례**

**단일 책임 원칙 (SRP) 적용:**
```typescript
// ✅ 올바른 모듈 설계 - 레시피 관련 기능만
@Module({
  imports: [TypeOrmModule.forFeature([Recipe])],
  controllers: [RecipesController],
  providers: [RecipesService],
  exports: [RecipesService],
})
export class RecipesModule {}

// ❌ 잘못된 모듈 설계 - 여러 도메인 혼재
@Module({
  imports: [TypeOrmModule.forFeature([Recipe, User, Order])],
  controllers: [RecipesController, UsersController, OrdersController],
  providers: [RecipesService, UsersService, OrdersService],
})
export class MixedModule {}  // 너무 많은 책임
```

**Feature Module vs Core Module:**
```typescript
// Feature Module (RecipesModule)
@Module({
  imports: [TypeOrmModule.forFeature([Recipe])],
  controllers: [RecipesController],
  providers: [RecipesService],
  exports: [RecipesService],
})
export class RecipesModule {}

// Core Module (DatabaseModule)
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({ /* DB 설정 */ }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
```

#### **5. 🔍 모듈 간 통신 패턴**

**다른 모듈에서 RecipesService 사용:**
```typescript
// users.module.ts
@Module({
  imports: [RecipesModule],  // RecipesModule import
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}

// users.service.ts
@Injectable()
export class UsersService {
  constructor(
    private readonly recipesService: RecipesService  // 사용 가능!
  ) {}

  async getUserWithRecipes(userId: number) {
    const recipes = await this.recipesService.findByUserId(userId);
    return { user: { id: userId }, recipes };
  }
}
```

#### **6. 🛠️ Dynamic Module과 Global Module**

**Dynamic Module 예시:**
```typescript
// ConfigModule처럼 설정을 받는 모듈
@Module({})
export class RecipesModule {
  static forRoot(options: RecipesOptions): DynamicModule {
    return {
      module: RecipesModule,
      providers: [
        {
          provide: 'RECIPES_OPTIONS',
          useValue: options,
        },
        RecipesService,
      ],
      exports: [RecipesService],
    };
  }
}
```

**Global Module 예시:**
```typescript
// 전역에서 사용 가능한 모듈
@Global()
@Module({
  providers: [RecipesService],
  exports: [RecipesService],
})
export class GlobalRecipesModule {}
```

#### **7. 📊 완성된 모듈 아키텍처**

```
AppModule (루트)
├── ConfigModule (전역 설정)
├── TypeOrmModule (데이터베이스)
└── RecipesModule (레시피 기능)
    ├── RecipesController → RecipesService
    ├── RecipesService → Repository<Recipe>
    └── Repository<Recipe> ← TypeOrmModule.forFeature([Recipe])
```

**의존성 그래프:**
```
RecipesController
       ↓ depends on
RecipesService
       ↓ depends on
Repository<Recipe>
       ↓ provided by
TypeOrmModule.forFeature([Recipe])
```

#### **8. 🎨 실제 동작 시나리오**

```typescript
// 클라이언트 요청: POST /recipes
// 1. NestJS 라우터가 RecipesController.create() 호출
// 2. RecipesController가 RecipesService.create() 호출
// 3. RecipesService가 Repository<Recipe>.save() 호출
// 4. TypeORM이 PostgreSQL에 INSERT 쿼리 실행
// 5. 응답이 역순으로 클라이언트에게 전달

HTTP Request → Controller → Service → Repository → Database
HTTP Response ← Controller ← Service ← Repository ← Database
```

**정리:**
- **모듈화**: 관련 기능들을 논리적으로 그룹화하여 관리
- **의존성 주입**: Constructor Injection으로 느슨한 결합 달성
- **캡슐화**: 모듈 내부 구현을 숨기고 인터페이스만 노출
- **재사용성**: exports를 통해 다른 모듈에서 기능 재사용
- **테스트 용이성**: Mock 객체로 쉽게 단위 테스트 작성 가능

---

## 🎯 **NestJS CRUD API 구현 전체 정리**

### 📝 **완성된 아키텍처 개요**

```
Frontend (Next.js) → Backend API → Database
                        ↓
            ┌─────────────────────────┐
            │     NestJS Backend      │
            ├─────────────────────────┤
            │  📡 Controller Layer    │  ← HTTP 요청/응답 처리
            │  🧠 Service Layer       │  ← 비즈니스 로직 처리
            │  🗄️ Repository Layer    │  ← 데이터 접근 처리
            │  🏗️ Entity Layer        │  ← 데이터 구조 정의
            └─────────────────────────┘
                        ↓
                  PostgreSQL DB
```

### 🛠️ **구현한 핵심 구성 요소**

**1. Entity (데이터 구조)**
- `Recipe.entity.ts`: 레시피 데이터 모델
- `User.entity.ts`: 사용자 데이터 모델
- TypeORM 어노테이션으로 데이터베이스 스키마 정의

**2. DTO (데이터 전송 객체)**
- `CreateRecipeDto`: 레시피 생성 시 검증
- `UpdateRecipeDto`: 레시피 수정 시 검증 (PartialType 활용)
- class-validator로 런타임 검증, Swagger로 문서화

**3. Service (비즈니스 로직)**
- 완전한 CRUD 기능 (create, findAll, findOne, update, remove)
- 비즈니스 규칙 검증 (재료 2개 이상, 조리순서 3단계 이상)
- 페이지네이션, 검색 기능, Repository 패턴 활용

**4. Controller (HTTP 인터페이스)**
- REST API 엔드포인트 구현 (POST, GET, PATCH, DELETE)
- Swagger API 문서화, 매개변수 검증 및 변환
- 얇은 계층 원칙 준수 (Service에 로직 위임)

**5. Module (의존성 주입)**
- 모든 구성 요소들의 의존성 관리
- TypeORM Repository 등록, Service/Controller 연결
- AppModule과 통합하여 전체 애플리케이션 구성

### 🎯 **학습한 핵심 개념**

**아키텍처 패턴:**
- 계층화 아키텍처 (Layered Architecture)
- 의존성 주입 (Dependency Injection)
- Repository 패턴 (Repository Pattern)
- DTO 패턴 (Data Transfer Object Pattern)

**TypeScript & NestJS 고급 기능:**
- 데코레이터 활용 (@Injectable, @Controller, @Entity)
- 타입 안전성 (컴파일 타임 + 런타임 검증)
- 모듈 시스템 (imports, providers, exports)
- Pipe를 통한 데이터 변환 (ParseIntPipe)

**데이터베이스 설계:**
- Entity-Relationship 모델링
- TypeORM을 통한 객체-관계 매핑
- 관계 설정 (@OneToMany, @ManyToOne)
- 페이지네이션 및 복잡한 쿼리 (QueryBuilder)

**API 설계:**
- REST API 설계 원칙
- HTTP 상태 코드 적절한 활용
- Swagger를 통한 자동 API 문서화
- 에러 처리 및 예외 관리

**개발 방법론:**
- TDD/DDD 지향적 설계
- 단일 책임 원칙 (SRP) 적용
- 관심사 분리 (Separation of Concerns)
- 코드 재사용성 및 유지보수성 고려

이제 **완전한 NestJS CRUD API**가 구현되었습니다! 🎉

---

## 👤 **User 기능 구현 - 인증 시스템 설계**

### 📝 **User DTO 설계 - 보안 중심 접근**

#### **CreateUserDto - 회원가입 데이터 검증**

```typescript
export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com', description: '사용자 이메일 주소' })
  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다' })
  @IsNotEmpty({ message: '이메일은 필수입니다' })
  email: string;

  @ApiProperty({ example: '김사용자', description: '사용자 이름' })
  @IsString({ message: '이름은 문자열이어야 합니다' })
  @IsNotEmpty({ message: '이름은 필수입니다' })
  name: string;

  @ApiProperty({ example: 'password123!', description: '사용자 패스워드 (최소 8자)' })
  @IsString({ message: '패스워드는 문자열이어야 합니다' })
  @MinLength(8, { message: '패스워드는 최소 8자 이상이어야 합니다' })
  @IsNotEmpty({ message: '패스워드는 필수입니다' })
  password: string;
}
```

#### **User DTO vs Recipe DTO 설계 차이점**

**보안성 중심 vs 사용성 중심:**
```typescript
// 👤 User DTO - 보안이 최우선
@IsEmail({}, { message: '올바른 이메일 형식이 아닙니다' })     // 이메일 형식 엄격 검증
@MinLength(8, { message: '패스워드는 최소 8자 이상이어야 합니다' })  // 패스워드 강도 검증

// 🍳 Recipe DTO - 사용성이 최우선
@IsArray()
@ArrayNotEmpty()                                           // 배열 구조 검증
@IsOptional()                                             // 선택적 필드 많음
```

**에러 메시지 세밀화:**
```typescript
// User DTO - 구체적인 보안 관련 메시지
{ message: '올바른 이메일 형식이 아닙니다' }
{ message: '패스워드는 최소 8자 이상이어야 합니다' }

// Recipe DTO - 일반적인 데이터 검증 메시지
@IsString()    // 기본 메시지 사용
@IsNotEmpty()  // 기본 메시지 사용
```

#### **인증 시스템 설계 고려사항**

**1. 패스워드 보안:**
- 최소 8자 이상 강제
- 실제 구현 시 해싱 필요 (bcrypt)
- 패스워드 복잡도 규칙 추가 가능

**2. 이메일 검증:**
- 형식 검증 + 고유성 검증
- 이메일 인증 시스템 확장 가능
- 대소문자 구분 없는 처리

**3. 사용자 식별:**
- 이메일을 Primary Key 대신 Unique Key로 사용
- ID는 내부 관리용, 이메일은 사용자 식별용

**User Entity와의 매핑 관계:**
```typescript
// CreateUserDto → User Entity 변환
CreateUserDto: {
  email: "user@example.com"     → User.email (unique 제약)
  name: "김사용자"              → User.name
  password: "password123!"      → User.password (해싱 후 저장)
}

// 자동 생성 필드들 (DTO에 포함하지 않음)
User.id         // 자동 증가 Primary Key
User.createdAt  // 생성 시간 자동 설정
User.updatedAt  // 수정 시간 자동 업데이트
User.recipes    // 관계 필드 (빈 배열로 시작)
```

#### **class-validator 고급 어노테이션 상세 분석**

**@IsEmail() 어노테이션 매개변수 해부:**
```typescript
@IsEmail({}, { message: '올바른 이메일 형식이 아닙니다.' })
//       ↑              ↑
//   첫 번째 매개변수    두 번째 매개변수
//   (검증 옵션)       (검증 실패 메시지)
```

#### **1. 🔧 첫 번째 매개변수 - 검증 옵션 (ValidationOptions)**

```typescript
// 기본 사용
@IsEmail()  // 기본 이메일 검증

// 빈 객체 (기본 설정 사용)
@IsEmail({})  // 모든 기본 옵션 사용

// 상세 옵션 설정
@IsEmail({
  allow_display_name: false,     // "홍길동 <user@example.com>" 형태 허용 안함
  require_display_name: false,   // Display name 필수 아님
  allow_utf8_local_part: true,   // UTF-8 문자 허용 (한글 이메일)
  require_tld: true,             // 최상위 도메인 필수 (.com, .kr 등)
  allow_ip_domain: false,        // IP 주소 도메인 허용 안함
  domain_specific_validation: false, // 도메인별 특수 검증 비활성화
})
```

**실제 검증 옵션 예시:**
```typescript
// 엄격한 이메일 검증
@IsEmail({
  require_tld: true,        // .com, .kr 등 최상위 도메인 필수
  allow_ip_domain: false,   // user@192.168.1.1 같은 IP 도메인 금지
})
email: string;

// 유연한 이메일 검증
@IsEmail({
  allow_utf8_local_part: true,  // 한글이메일@example.com 허용
  allow_display_name: true,     // "홍길동 <user@example.com>" 허용
})
email: string;
```

#### **2. 💬 두 번째 매개변수 - 검증 실패 메시지 (ValidationOptions)**

```typescript
@IsEmail({}, { message: '올바른 이메일 형식이 아닙니다.' })
//              ↑
//         사용자 정의 에러 메시지
```

**메시지 커스터마이징 패턴:**
```typescript
// 기본 메시지 사용
@IsEmail()
// 실패 시: "email must be an email"

// 한국어 커스텀 메시지
@IsEmail({}, { message: '올바른 이메일 형식이 아닙니다.' })
// 실패 시: "올바른 이메일 형식이 아닙니다."

// 동적 메시지 (입력값 포함)
@IsEmail({}, { message: '$value는 올바른 이메일 형식이 아닙니다.' })
// 실패 시: "invalid-email는 올바른 이메일 형식이 아닙니다."

// 속성명 포함 메시지
@IsEmail({}, { message: '$property 필드는 유효한 이메일이어야 합니다.' })
// 실패 시: "email 필드는 유효한 이메일이어야 합니다."
```

#### **3. 🎯 다른 검증 어노테이션의 매개변수 패턴**

**@MinLength() 매개변수:**
```typescript
@MinLength(8, { message: '패스워드는 최소 8자 이상이어야 합니다.' })
//         ↑              ↑
//    최소 길이 값      에러 메시지
password: string;

// 동적 메시지 사용
@MinLength(8, { message: '패스워드는 최소 $constraint1자 이상이어야 합니다.' })
// 실패 시: "패스워드는 최소 8자 이상이어야 합니다."
```

**@IsString() 고급 옵션:**
```typescript
@IsString({ message: '이름은 문자열이어야 합니다.' })
//         ↑
//    ValidationOptions만 (검증 옵션 없음)

// 다른 어노테이션의 복합 옵션
@Length(2, 50, {
  message: '이름은 2자 이상 50자 이하여야 합니다.'
})
//     ↑   ↑        ↑
//   최소  최대    에러 메시지
```

#### **4. 🔍 검증 실패 시 실제 응답 구조**

```typescript
// 클라이언트가 잘못된 데이터 전송 시
POST /users
{
  "email": "invalid-email",           // @IsEmail() 위반
  "name": "",                         // @IsNotEmpty() 위반
  "password": "123"                   // @MinLength(8) 위반
}

// NestJS 자동 응답
HTTP 400 Bad Request
{
  "statusCode": 400,
  "message": [
    "올바른 이메일 형식이 아닙니다.",              // 커스텀 메시지
    "이름은 필수입니다.",                        // 커스텀 메시지
    "패스워드는 최소 8자 이상이어야 합니다."      // 커스텀 메시지
  ],
  "error": "Bad Request"
}
```

#### **5. 🛡️ 보안 중심 검증 어노테이션 조합**

```typescript
export class CreateUserDto {
  // 엄격한 이메일 검증
  @IsEmail(
    { require_tld: true, allow_ip_domain: false },
    { message: '올바른 이메일 형식이 아닙니다.' }
  )
  @IsNotEmpty({ message: '이메일은 필수입니다.' })
  email: string;

  // 강한 패스워드 검증
  @IsString({ message: '패스워드는 문자열이어야 합니다.' })
  @MinLength(8, { message: '패스워드는 최소 8자 이상이어야 합니다.' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: '패스워드는 대소문자, 숫자, 특수문자를 포함해야 합니다.'
  })
  @IsNotEmpty({ message: '패스워드는 필수입니다.' })
  password: string;
}
```

**정리:**
- **첫 번째 매개변수**: 검증 동작을 제어하는 옵션 객체
- **두 번째 매개변수**: 검증 실패 시 사용자에게 보여줄 메시지
- **사용자 경험**: 명확하고 친화적인 한국어 에러 메시지 제공
- **보안성**: 엄격한 검증 옵션으로 데이터 무결성 보장

// Recipe Entity에서
@ManyToOne(() => User, user => user.recipes)
@JoinColumn({ name: 'userId' })
user: User;  // 레시피의 작성자

@Column()
userId: number;  // 외래키 컬럼 명시적 정의
```

#### **실제 데이터 예시**
```
users 테이블:
┌─────┬──────────────────┬─────────┐
│ id  │ email            │ name    │
├─────┼──────────────────┼─────────┤
│ 1   │ john@email.com   │ John    │
│ 2   │ jane@email.com   │ Jane    │
└─────┴──────────────────┴─────────┘

recipes 테이블:
┌─────┬─────────────────┬────────┬───────────────────┐
│ id  │ title           │ userId │ ingredients       │
├─────┼─────────────────┼────────┼───────────────────┤
│ 1   │ 토마토 파스타    │ 1      │ 토마토,파스타,마늘  │
│ 2   │ 감자 조림       │ 1      │ 감자,간장,설탕     │
│ 3   │ 샐러드          │ 2      │ 양상추,토마토      │
└─────┴─────────────────┴────────┴───────────────────┘
```

#### **JOIN 쿼리 동작 방식**
```sql
-- TypeORM이 자동 생성하는 JOIN 쿼리
SELECT u.*, r.*
FROM users u
LEFT JOIN recipes r ON u.id = r.userId
WHERE u.id = 1;

-- 결과: John(id:1)의 모든 레시피 조회
```

---

### 🎯 **Entity 설계 시 고려사항**

#### **1. 데이터 타입 선택**
- **simple-array**: 간단한 문자열 배열 (검색 불가)
- **json**: 복잡한 객체 구조 (부분 검색 가능)
- **별도 테이블**: 복잡한 관계나 검색이 필요한 경우

#### **2. 성능 최적화**
```typescript
@Column({ type: 'varchar', length: 255 })  // 문자열 길이 제한
email: string;

@Index(['email', 'createdAt'])  // 복합 인덱스
@Entity('users')
export class User {
  // ...
}
```

#### **3. 데이터 무결성**
```typescript
@Column({ unique: true })  // 중복 방지
email: string;

@Column({ nullable: false })  // NOT NULL 제약
name: string;

@ManyToOne(() => User, { onDelete: 'CASCADE' })  // 연쇄 삭제
user: User;
```

---

### 💡 **학습 포인트**

1. **ORM의 핵심**: 객체와 관계형 데이터베이스의 매핑
2. **관계 설계**: 1:N, N:1, N:M 관계의 올바른 표현
3. **데이터 타입**: PostgreSQL과 TypeScript 타입의 적절한 매핑
4. **성능 고려**: 인덱스와 쿼리 최적화
5. **무결성 보장**: 제약조건을 통한 데이터 품질 관리

### 라우팅 예시
- `/recipes/1` → `params.id = "1"`
- `/recipes/123` → `params.id = "123"`
- `/recipes/abc` → `params.id = "abc"`

## SOLID 원칙을 적용한 React 컴포넌트 설계

### SOLID 원칙과 React 컴포넌트

#### 1. **S**RP (Single Responsibility Principle) - 단일 책임 원칙
```typescript
// ❌ 나쁜 예시 - 하나의 컴포넌트가 너무 많은 책임을 가짐
function UserProfilePage() {
  // 사용자 데이터 관리
  // API 호출
  // UI 렌더링
  // 폼 검증
  // 상태 관리
  return (/* 복잡한 JSX */);
}

// ✅ 좋은 예시 - 각 컴포넌트가 하나의 책임만 가짐
function UserProfile({ user }) { /* 사용자 정보 표시만 담당 */ }
function UserForm({ onSubmit }) { /* 폼 처리만 담당 */ }
function UserAvatar({ src, alt }) { /* 아바타 표시만 담당 */ }
```

#### 2. **O**CP (Open/Closed Principle) - 개방/폐쇄 원칙
```typescript
// ✅ 확장에는 열려있고 수정에는 닫혀있는 컴포넌트
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

function Button({ variant = 'primary', size = 'md', children, ...props }: ButtonProps) {
  return (
    <button className={cn(baseStyles, variantStyles[variant], sizeStyles[size])} {...props}>
      {children}
    </button>
  );
}
```

#### 3. **L**SP (Liskov Substitution Principle) - 리스코프 치환 원칙
```typescript
// ✅ 부모 컴포넌트를 자식 컴포넌트로 치환해도 동작해야 함
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

function Card({ children, className }: CardProps) {
  return <div className={cn('card', className)}>{children}</div>;
}

function ClickableCard({ children, className, onClick }: CardProps & { onClick: () => void }) {
  return <div className={cn('card', className)} onClick={onClick}>{children}</div>;
}
```

#### 4. **I**SP (Interface Segregation Principle) - 인터페이스 분리 원칙
```typescript
// ❌ 나쁜 예시 - 너무 많은 props를 가진 인터페이스
interface MegaComponentProps {
  title: string;
  description: string;
  onSave: () => void;
  onDelete: () => void;
  onEdit: () => void;
  isLoading: boolean;
  error: string;
  // ... 너무 많은 props
}

// ✅ 좋은 예시 - 목적에 맞게 분리된 인터페이스
interface ContentProps {
  title: string;
  description: string;
}

interface ActionsProps {
  onSave: () => void;
  onDelete: () => void;
  onEdit: () => void;
}

interface StatusProps {
  isLoading: boolean;
  error?: string;
}
```

#### 5. **D**IP (Dependency Inversion Principle) - 의존성 역전 원칙
```typescript
// ✅ 구체적인 구현이 아닌 추상화에 의존
interface DataService {
  fetchUser(id: string): Promise<User>;
}

function UserProfile({ userId, dataService }: { userId: string; dataService: DataService }) {
  // dataService는 추상화(인터페이스)에 의존
  const [user, setUser] = useState<User>();

  useEffect(() => {
    dataService.fetchUser(userId).then(setUser);
  }, [userId, dataService]);

  return <div>{user?.name}</div>;
}
```

### 컴포넌트 분리 전략

#### 1. 페이지 레벨 분리
```
src/
├── components/
│   ├── ui/              # 재사용 가능한 기본 컴포넌트
│   ├── forms/           # 폼 관련 컴포넌트
│   ├── cards/           # 카드 관련 컴포넌트
│   └── sections/        # 페이지 섹션 컴포넌트
├── hooks/               # 커스텀 훅
├── types/               # 타입 정의
└── utils/               # 유틸리티 함수
```

#### 2. 관심사 분리
- **Presentation Components**: UI만 담당
- **Container Components**: 로직과 상태 관리
- **Custom Hooks**: 재사용 가능한 로직
- **Types**: 타입 정의 분리
- **Utils**: 순수 함수들

### 랜딩 페이지 리팩토링 실습

#### Before (기존) - 단일 책임 원칙 위반 ❌
```typescript
// page.tsx - 모든 것을 한 파일에서 처리
export default function Home() {
  return (
    <div>
      {/* Hero 섹션 - 150줄 */}
      <section>...</section>

      {/* Features 섹션 - 80줄 */}
      <section>...</section>

      {/* CTA 섹션 - 50줄 */}
      <section>...</section>
    </div>
  );
}
```

#### After (리팩토링 후) - SOLID 원칙 적용 ✅

**1. HeroSection - 단일 책임 원칙**
```typescript
// HeroSection.tsx - 히어로 섹션만 담당
export function HeroSection() {
  // 책임: 메인 타이틀, 부제목, 주요 버튼 표시
  return (
    <section className="container mx-auto px-4 pt-20 pb-16 text-center">
      <h1>AI가 추천하는 맞춤 레시피</h1>
      <p>냉장고 속 재료만 알려주세요...</p>
      <div>
        <Button>AI 레시피 받기</Button>
        <Button>레시피 둘러보기</Button>
      </div>
    </section>
  );
}
```

**2. FeaturesSection - 개방/폐쇄 원칙**
```typescript
// FeaturesSection.tsx - 기능 소개만 담당
const features: FeatureCard[] = [
  { emoji: "🥗", title: "스마트 재료 분석", description: "..." },
  { emoji: "👨‍🍳", title: "커뮤니티 중심", description: "..." },
  { emoji: "📊", title: "영양 분석", description: "..." }
];

export function FeaturesSection() {
  // 책임: 기능 카드들을 그리드로 표시
  // 확장성: features 배열에 항목 추가만으로 새 기능 추가 가능
  return (
    <section>
      {features.map((feature, index) => (
        <Card key={index}>...</Card>
      ))}
    </section>
  );
}
```

**3. CTASection - 인터페이스 분리 원칙**
```typescript
// CTASection.tsx - CTA만 담당
interface CTASection {
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
}

export function CTASection() {
  // 책임: 사용자 액션 유도
  // 분리된 타입으로 props 명확히 정의
  return (
    <section>
      <Card className="bg-primary">
        <CardTitle>{ctaData.title}</CardTitle>
        <CardDescription>{ctaData.description}</CardDescription>
        <Button>{ctaData.buttonText}</Button>
      </Card>
    </section>
  );
}
```

**4. 메인 페이지 - 컴포지션 패턴**
```typescript
// page.tsx - 섹션 조합만 담당
export default function Home() {
  return (
    <div>
      <HeroSection />      {/* 히어로 영역 */}
      <FeaturesSection />  {/* 기능 소개 영역 */}
      <CTASection />       {/* 액션 유도 영역 */}
    </div>
  );
}
```

#### 리팩토링의 이점

**1. 가독성 향상**
- 각 섹션의 역할이 명확
- 코드 이해하기 쉬워짐

**2. 유지보수성**
- 기능별로 파일 분리
- 특정 섹션 수정 시 해당 파일만 건드리면 됨

**3. 재사용성**
- HeroSection을 다른 페이지에서도 사용 가능
- FeaturesSection의 features 배열은 쉽게 확장 가능

**4. 테스트 용이성**
- 각 컴포넌트를 독립적으로 테스트 가능

**5. 협업 효율성**
- 다른 개발자가 특정 섹션만 담당하여 작업 가능

## 다음 학습 목표

- [x] 클라이언트 컴포넌트 vs 서버 컴포넌트 ✅
- [x] 하이드레이션 개념 ✅
- [x] 페이지 라우팅 추가 (recipes, recommend 등) ✅
- [x] 동적 라우팅 ([id] 폴더 구조) ✅
- [ ] SOLID 원칙 기반 컴포넌트 리팩토링 🔄
- [ ] API 연동 (fetch, axios)
- [ ] 사용자 인증 시스템