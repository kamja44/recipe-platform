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