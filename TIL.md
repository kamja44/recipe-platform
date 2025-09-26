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

### 라우팅 예시
- `/recipes/1` → `params.id = "1"`
- `/recipes/123` → `params.id = "123"`
- `/recipes/abc` → `params.id = "abc"`

## 다음 학습 목표

- [x] 클라이언트 컴포넌트 vs 서버 컴포넌트 ✅
- [x] 하이드레이션 개념 ✅
- [x] 페이지 라우팅 추가 (recipes, recommend 등) ✅
- [x] 동적 라우팅 ([id] 폴더 구조) ✅
- [ ] API 연동 (fetch, axios)
- [ ] 사용자 인증 시스템