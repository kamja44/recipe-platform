# TIL Frontend - AI Recipe Platform

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

---

## 📡 API 통신 라이브러리: Axios vs TanStack Query (2024-09-30)

### Axios란?

**Axios**는 HTTP 클라이언트 라이브러리입니다. 브라우저와 Node.js에서 HTTP 요청을 보내는 도구입니다.

#### Axios의 역할
```typescript
import axios from 'axios';

// GET 요청
const response = await axios.get('http://localhost:3001/recipes');

// POST 요청
const response = await axios.post('http://localhost:3001/recipes/generate-ai', {
  ingredients: ['토마토', '계란'],
  preferences: '매운맛으로'
});
```

**Axios가 하는 일:**
- ✅ HTTP 요청 보내기 (GET, POST, PUT, DELETE)
- ✅ 요청/응답 인터셉터 (헤더 추가, 에러 처리)
- ✅ 자동 JSON 변환
- ✅ 타임아웃 설정
- ✅ CSRF 보호

**Axios가 하지 않는 일:**
- ❌ 캐싱
- ❌ 자동 재요청
- ❌ 로딩 상태 관리
- ❌ 중복 요청 방지
- ❌ 백그라운드 데이터 동기화

---

### TanStack Query (React Query)란?

**TanStack Query**는 서버 상태 관리 라이브러리입니다. 데이터 페칭, 캐싱, 동기화를 자동화합니다.

#### TanStack Query의 역할
```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';

// GET 요청 + 자동 캐싱 + 로딩/에러 상태
const { data, isLoading, error } = useQuery({
  queryKey: ['recipes'],
  queryFn: () => axios.get('http://localhost:3001/recipes').then(res => res.data)
});

// POST 요청 + 자동 캐시 무효화
const mutation = useMutation({
  mutationFn: (newRecipe) => axios.post('http://localhost:3001/recipes', newRecipe),
  onSuccess: () => {
    // 캐시 무효화 → 자동 재조회
    queryClient.invalidateQueries({ queryKey: ['recipes'] });
  }
});
```

**TanStack Query가 하는 일:**
- ✅ 자동 캐싱 (같은 데이터 재요청 시 캐시 사용)
- ✅ 백그라운드 동기화 (stale 데이터 자동 갱신)
- ✅ 로딩/에러 상태 자동 관리
- ✅ 중복 요청 자동 제거 (deduplication)
- ✅ 무한 스크롤, 페이지네이션 지원
- ✅ Optimistic Updates (낙관적 업데이트)
- ✅ 자동 재시도 (retry)
- ✅ 윈도우 포커스 시 자동 갱신

**TanStack Query가 하지 않는 일:**
- ❌ HTTP 요청 자체 (axios나 fetch 필요)

---

### Axios vs TanStack Query 비교

| 구분 | Axios | TanStack Query |
|------|-------|----------------|
| **역할** | HTTP 클라이언트 | 서버 상태 관리 |
| **주요 기능** | 요청/응답 처리 | 캐싱, 동기화, 상태 관리 |
| **캐싱** | ❌ 없음 | ✅ 자동 캐싱 |
| **로딩 상태** | 수동 관리 | 자동 제공 |
| **에러 처리** | try-catch 필요 | 자동 제공 |
| **재요청** | 수동 호출 | 자동 백그라운드 갱신 |
| **중복 요청** | 발생 가능 | 자동 제거 |
| **사용 시기** | 단순 HTTP 요청 | 복잡한 데이터 페칭 |

---

### 왜 둘 다 사용하나요?

**TanStack Query는 Axios를 대체하지 않습니다. 보완합니다.**

```typescript
// TanStack Query가 "무엇을" 관리 (캐싱, 동기화, 상태)
// Axios가 "어떻게" 요청 (HTTP 통신)

const { data } = useQuery({
  queryKey: ['recipes', id],
  queryFn: async () => {
    // Axios로 HTTP 요청
    const response = await axios.get(`/recipes/${id}`);
    return response.data;
  }
});
```

**역할 분담:**
- **Axios**: HTTP 요청의 기술적 세부사항 (헤더, 인터셉터, 타임아웃)
- **TanStack Query**: 데이터의 생명주기 관리 (캐싱, 갱신, 상태)

---

### 실제 사용 예시

#### ❌ Axios만 사용 (수동 관리)
```typescript
"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';

function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    axios.get('/recipes')
      .then(res => setRecipes(res.data))
      .catch(err => setError(err))
      .finally(() => setIsLoading(false));
  }, []);

  // 캐싱 없음 → 페이지 재방문 시 다시 로딩
  // 백그라운드 동기화 없음 → 최신 데이터 보장 어려움
  // 수동 상태 관리 → 코드 복잡

  if (isLoading) return <div>로딩중...</div>;
  if (error) return <div>에러 발생</div>;
  return <div>{/* 레시피 목록 */}</div>;
}
```

#### ✅ Axios + TanStack Query (자동 관리)
```typescript
"use client";
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

function RecipesPage() {
  const { data: recipes, isLoading, error } = useQuery({
    queryKey: ['recipes'],
    queryFn: () => axios.get('/recipes').then(res => res.data),
    staleTime: 5000, // 5초간 캐시 사용
    refetchOnWindowFocus: true, // 윈도우 포커스 시 자동 갱신
  });

  // 캐싱 자동 → 빠른 페이지 전환
  // 백그라운드 동기화 → 항상 최신 데이터
  // 자동 상태 관리 → 코드 간결

  if (isLoading) return <div>로딩중...</div>;
  if (error) return <div>에러 발생</div>;
  return <div>{/* 레시피 목록 */}</div>;
}
```

---

### TanStack Query의 핵심 개념

#### 1. Query (조회)
```typescript
const { data, isLoading, error, refetch } = useQuery({
  queryKey: ['recipes', id], // 캐시 키 (고유 식별자)
  queryFn: fetchRecipe,      // 데이터 가져오는 함수
  staleTime: 5000,           // 데이터 신선도 (5초)
  cacheTime: 300000,         // 캐시 보관 시간 (5분)
});
```

#### 2. Mutation (변경)
```typescript
const mutation = useMutation({
  mutationFn: createRecipe,
  onSuccess: () => {
    // 성공 시 캐시 무효화 → 자동 재조회
    queryClient.invalidateQueries({ queryKey: ['recipes'] });
  }
});

// 사용
mutation.mutate({ name: '토마토 파스타' });
```

#### 3. Query Invalidation (캐시 무효화)
```typescript
// 레시피 생성 후 목록 다시 불러오기
queryClient.invalidateQueries({ queryKey: ['recipes'] });

// 특정 레시피만 다시 불러오기
queryClient.invalidateQueries({ queryKey: ['recipes', id] });
```

---

### 언제 무엇을 사용할까?

#### Axios만 사용
- 일회성 요청 (로그인, 회원가입)
- 서버 액션 (Server Actions)
- 간단한 폼 제출

#### TanStack Query + Axios
- 목록 페이지 (레시피 목록, 검색 결과)
- 상세 페이지 (레시피 상세 정보)
- 실시간 데이터 (댓글, 좋아요 수)
- 무한 스크롤, 페이지네이션
- 복잡한 CRUD 작업

---

### 핵심 정리 🎯

**Axios:**
- HTTP 요청을 보내는 도구
- "어떻게" 데이터를 가져올지 담당

**TanStack Query:**
- 서버 상태를 관리하는 도구
- "언제" 데이터를 가져오고, "어떻게" 캐싱할지 담당

**함께 사용:**
```typescript
// Axios가 HTTP 요청 담당
const fetchRecipes = () => axios.get('/recipes').then(res => res.data);

// TanStack Query가 상태 관리 담당
const { data } = useQuery({
  queryKey: ['recipes'],
  queryFn: fetchRecipes
});
```

> 💡 **비유**: Axios는 "택배 기사" (물건 배달), TanStack Query는 "물류 관리 시스템" (언제 배송, 창고 관리, 재고 확인)

---

## 🎯 TanStack Query Provider 설정 (2024-09-30)

### 왜 Provider로 앱 전체를 감싸야 할까?

#### React Context API 패턴
TanStack Query는 **React Context API**를 사용하여 전역 상태를 관리합니다.

```
QueryClientProvider (Context Provider)
  └── QueryClient (전역 캐시 저장소)
      ├── 모든 useQuery 훅이 이 캐시에 접근
      ├── 모든 useMutation 훅이 이 캐시를 업데이트
      └── 캐시 무효화, 재조회 등 모두 여기서 관리
```

#### Provider가 필요한 이유

**1. 전역 캐시 공유**
```typescript
// ❌ Provider 없이 사용 불가
function RecipesPage() {
  const { data } = useQuery({ ... }); // 에러: QueryClient를 찾을 수 없음
}

// ✅ Provider로 감싸면 모든 컴포넌트에서 접근 가능
<QueryClientProvider client={queryClient}>
  <RecipesPage />  {/* useQuery 사용 가능 */}
  <DetailPage />   {/* useQuery 사용 가능 */}
  <SearchPage />   {/* useQuery 사용 가능 */}
</QueryClientProvider>
```

**2. 캐시 일관성 유지**
```typescript
// 페이지 A에서 레시피 목록 조회 → 캐시에 저장
function RecipesPage() {
  const { data } = useQuery({ queryKey: ['recipes'], ... });
}

// 페이지 B에서 동일한 데이터 요청 → 캐시에서 즉시 반환 (네트워크 요청 X)
function SearchPage() {
  const { data } = useQuery({ queryKey: ['recipes'], ... });
  // ↑ 같은 QueryClient 캐시를 공유하므로 즉시 데이터 반환
}
```

**3. 중앙 집중식 설정**
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,        // 모든 쿼리에 적용
      refetchOnWindowFocus: false, // 모든 쿼리에 적용
    },
  },
});

// 앱 전체에서 동일한 설정 사용
```

---

### QueryProvider 컴포넌트 구조 분석

```typescript
"use client";  // 1️⃣ 클라이언트 컴포넌트 선언

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

export function QueryProvider({ children }: { children: ReactNode }) {
  // 2️⃣ useState로 QueryClient 생성
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,        // 3️⃣ 캐시 신선도
            refetchOnWindowFocus: false, // 4️⃣ 자동 재조회 설정
          },
        },
      })
  );

  // 5️⃣ Provider로 children 감싸기
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
```

---

### 1️⃣ "use client" 지시어

**왜 필요한가?**
- TanStack Query는 **브라우저 전용 기능** 사용 (캐시, 상태 관리)
- React Hooks (`useState`, `useQuery`) 사용 → 클라이언트 컴포넌트 필수

```typescript
"use client";  // 이게 없으면 에러 발생
```

---

### 2️⃣ useState로 QueryClient 생성

**왜 useState를 사용하나?**

#### ❌ 잘못된 방법 (직접 생성)
```typescript
// 서버 렌더링 시마다 새로운 QueryClient 생성 → 캐시 초기화
const queryClient = new QueryClient();

export function QueryProvider({ children }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
```

**문제점:**
- Next.js는 서버에서 먼저 렌더링 → 클라이언트에서 하이드레이션
- 서버 렌더링마다 `queryClient`가 재생성됨
- 캐시가 사라지고 상태 불일치 발생

#### ✅ 올바른 방법 (useState 사용)
```typescript
const [queryClient] = useState(() => new QueryClient());
```

**장점:**
- 컴포넌트 인스턴스당 **딱 한 번만** QueryClient 생성
- 서버-클라이언트 간 동일한 인스턴스 유지
- 캐시 일관성 보장

**useState의 Lazy Initialization (지연 초기화):**
```typescript
useState(() => new QueryClient())
// ↑ 함수를 전달하면 최초 렌더링 시에만 실행됨
```

---

### 3️⃣ staleTime: 캐시 신선도

**개념:**
- **Fresh**: 데이터가 신선함 → 캐시에서 바로 반환 (네트워크 요청 X)
- **Stale**: 데이터가 오래됨 → 백그라운드에서 재조회

```typescript
staleTime: 60 * 1000  // 60초 = 1분
```

**동작 방식:**
```
0초: useQuery 호출 → 네트워크 요청 → 캐시 저장 (Fresh 상태)
30초: 다시 useQuery 호출 → 캐시에서 즉시 반환 (여전히 Fresh)
70초: 다시 useQuery 호출 → 캐시 반환 + 백그라운드 재조회 (Stale 상태)
```

**예시:**
```typescript
// staleTime: 60초
const { data } = useQuery({
  queryKey: ['recipes'],
  queryFn: fetchRecipes,
});

// 1분 이내 재방문 시 캐시 사용 → 빠른 로딩
// 1분 이후 재방문 시 자동 갱신 → 최신 데이터
```

---

### 4️⃣ refetchOnWindowFocus: 윈도우 포커스 재조회

```typescript
refetchOnWindowFocus: false
```

**기본 동작 (true):**
- 다른 탭 갔다가 돌아오면 자동으로 데이터 재조회
- 최신 상태 유지에 유용

**비활성화 이유 (false):**
- 불필요한 네트워크 요청 방지
- 사용자 경험 개선 (갑자기 로딩되는 것 방지)
- 레시피 데이터는 실시간성이 중요하지 않음

**다른 옵션들:**
```typescript
defaultOptions: {
  queries: {
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,    // 윈도우 포커스 시 재조회 X
    refetchOnReconnect: true,       // 인터넷 재연결 시 재조회 O
    retry: 3,                       // 실패 시 3번 재시도
    retryDelay: 1000,               // 재시도 간격 1초
  },
}
```

---

### 5️⃣ Provider로 앱 감싸기

#### layout.tsx에 적용
```typescript
// app/layout.tsx
import { QueryProvider } from "@/components/providers/QueryProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <QueryProvider>  {/* 앱 전체를 감쌈 */}
          <Layout>{children}</Layout>
        </QueryProvider>
      </body>
    </html>
  );
}
```

**컴포넌트 트리:**
```
RootLayout (서버 컴포넌트)
  └── QueryProvider (클라이언트 컴포넌트)
      └── Layout
          └── 모든 페이지들 (useQuery 사용 가능)
```

---

### 핵심 정리 🎯

**왜 Provider가 필요한가?**
1. **전역 캐시 공유**: 모든 컴포넌트가 동일한 캐시 접근
2. **일관성 보장**: 중복 요청 방지, 캐시 동기화
3. **중앙 설정**: 한 곳에서 모든 쿼리 옵션 관리

**왜 useState로 생성하나?**
- 서버-클라이언트 간 인스턴스 일관성 유지
- 캐시 초기화 방지

**staleTime vs cacheTime**
- `staleTime`: 데이터가 신선한 시간 (이 시간 내에는 재조회 안 함)
- `cacheTime`: 캐시가 메모리에 보관되는 시간 (기본 5분)

**refetchOnWindowFocus**
- `true`: 탭 전환 시 자동 갱신 (실시간 데이터)
- `false`: 자동 갱신 안 함 (정적 데이터)

---

## 🚀 Frontend-Backend API 완전 통합 (2024-09-30)

### 프로젝트 구조: lib/api 폴더 설계 원칙

#### 왜 lib/api 구조를 사용하나?

**폴더 구조:**
```
src/
├── lib/                    # 재사용 가능한 유틸리티
│   ├── api/               # API 관련 로직
│   │   ├── client.ts      # Axios 클라이언트 설정
│   │   └── recipes.ts     # 레시피 API 함수들
│   ├── utils.ts           # 일반 유틸리티 함수
│   └── constants.ts       # 상수 정의
├── components/            # UI 컴포넌트
├── app/                   # 페이지 (App Router)
├── hooks/                 # 커스텀 훅
└── types/                 # 타입 정의
```

#### 설계 원칙

**1. 관심사 분리 (Separation of Concerns)**
```
lib/api/     → API 통신 로직만 담당
components/  → UI 렌더링만 담당
hooks/       → 상태 관리 로직만 담당
```

**2. 재사용성**
```typescript
// 여러 컴포넌트에서 동일한 API 클라이언트 사용
import { apiClient } from "@/lib/api/client";
import { generateRecipe } from "@/lib/api/recipes";
```

**3. 유지보수성**
- API URL 변경 시 `client.ts` 한 곳만 수정
- 인증 로직 추가 시 인터셉터만 수정
- 에러 처리 로직 중앙 집중화

**4. 테스트 용이성**
- API 로직을 독립적으로 테스트 가능
- Mock 함수 교체 쉬움

**5. 확장성**
```
lib/api/
├── client.ts        # 공통 설정
├── recipes.ts       # 레시피 API
├── auth.ts          # 인증 API (향후 추가)
└── reviews.ts       # 리뷰 API (향후 추가)
```

#### 대안 구조와 비교

| 구조 | 장점 | 단점 | 적합한 프로젝트 |
|------|------|------|----------------|
| `lib/api/` | API 파일 그룹화, 확장성 좋음 | 폴더 깊이 증가 | 중대형 프로젝트 |
| `lib/apiClient.ts` | 폴더 깊이 얕음 | 파일 많아지면 관리 어려움 | 소규모 프로젝트 |
| `services/` | 백엔드 아키텍처와 일관성 | 프론트엔드 관례와 다름 | 풀스택 팀 |

---

### Axios 클라이언트 설정 상세 분석

#### client.ts 전체 구조

```typescript
import axios from "axios";

// 1️⃣ API Base URL 설정
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// 2️⃣ Axios 인스턴스 생성
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 3️⃣ 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    // JWT 토큰 추가 로직 (향후)
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 4️⃣ 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("인증 실패");
    }
    return Promise.reject(error);
  }
);
```

---

#### 1️⃣ API Base URL 설정

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
```

**환경변수 이름 규칙:**
- Next.js는 `NEXT_PUBLIC_` 접두사가 있는 환경변수만 브라우저에 노출
- 없으면 서버에서만 접근 가능

**사용 방법:**
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**왜 이렇게 하나?**
- 개발/프로덕션 환경에서 다른 URL 사용 가능
- 하드코딩 방지

---

#### 2️⃣ Axios 인스턴스 생성

```typescript
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
```

**axios.create() vs axios 직접 사용**

```typescript
// ❌ 나쁜 방법 (매번 URL 작성)
await axios.post("http://localhost:3001/recipes/generate-ai", data);
await axios.get("http://localhost:3001/recipes");

// ✅ 좋은 방법 (baseURL 자동 추가)
await apiClient.post("/recipes/generate-ai", data);
await apiClient.get("/recipes");
```

**옵션 설명:**
- `baseURL`: 모든 요청에 자동으로 앞에 붙음
- `timeout`: 10초 이상 걸리면 에러 발생
- `headers`: 모든 요청에 기본 헤더 추가

---

#### 3️⃣ 요청 인터셉터 (Request Interceptor)

**개념:**
요청이 서버로 전송되기 **전에** 실행되는 미들웨어

```typescript
apiClient.interceptors.request.use(
  (config) => {
    // 요청 전 실행 (성공 케이스)
    return config;
  },
  (error) => {
    // 요청 전 에러 (실패 케이스)
    return Promise.reject(error);
  }
);
```

**실제 사용 예시: JWT 토큰 추가**

```typescript
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
```

**요청 플로우:**
```
컴포넌트 → apiClient.post() → 인터셉터 → 서버
                                  ↑
                            JWT 토큰 추가
```

---

#### 4️⃣ 응답 인터셉터 (Response Interceptor)

**개념:**
서버 응답을 받은 **후에** 실행되는 미들웨어

```typescript
apiClient.interceptors.response.use(
  (response) => response,  // 성공 응답
  (error) => {             // 에러 응답
    if (error.response?.status === 401) {
      console.error("인증 실패");
      // 로그인 페이지로 리다이렉트
    }
    return Promise.reject(error);
  }
);
```

**전역 에러 처리 예시:**

```typescript
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 인증 실패
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }

    // 서버 에러
    if (error.response?.status === 500) {
      alert('서버 오류가 발생했습니다.');
    }

    // 네트워크 에러
    if (!error.response) {
      alert('네트워크 연결을 확인해주세요.');
    }

    return Promise.reject(error);
  }
);
```

**응답 플로우:**
```
서버 → 응답 → 인터셉터 → 컴포넌트
               ↓
         에러 처리 (401, 500 등)
```

---

### TanStack Query useMutation 완전 분석

#### useMutation이란?

**Query vs Mutation**
- `useQuery`: 데이터 조회 (GET)
- `useMutation`: 데이터 변경 (POST, PUT, DELETE)

```typescript
// Query (조회)
const { data } = useQuery({
  queryKey: ['recipes'],
  queryFn: fetchRecipes
});

// Mutation (변경)
const mutation = useMutation({
  mutationFn: createRecipe
});
```

---

#### useIngredientRecommendation 훅 상세 분석

```typescript
"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { generateRecipe } from "@/lib/api/recipes";
import { RecipeData } from "@/types/recipe";

export function useIngredientRecommendation() {
  // 1️⃣ 로컬 상태 관리
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState("");
  const [recipes, setRecipes] = useState<RecipeData[]>([]);

  // 2️⃣ TanStack Query Mutation
  const mutation = useMutation({
    mutationFn: generateRecipe,
    onSuccess: (data) => {
      setRecipes([data.data]);
    },
    onError: (error) => {
      console.error("레시피 생성 실패:", error);
      alert("레시피 생성에 실패했습니다. 다시 시도해주세요.");
    },
  });

  // 3️⃣ 재료 관리 함수
  const addIngredient = () => {
    if (
      currentIngredient.trim() &&
      !ingredients.includes(currentIngredient.trim())
    ) {
      setIngredients([...ingredients, currentIngredient.trim()]);
      setCurrentIngredient("");
    }
  };

  const removeIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter((item) => item !== ingredient));
  };

  // 4️⃣ API 호출 함수
  const getRecommendations = () => {
    if (ingredients.length === 0) return;

    mutation.mutate({
      ingredients,
      provider: "openai",
    });
  };

  // 5️⃣ 반환값
  return {
    ingredients,
    currentIngredient,
    isLoading: mutation.isPending,
    recipes,
    setCurrentIngredient,
    addIngredient,
    removeIngredient,
    getRecommendations,
  };
}
```

---

#### 1️⃣ 로컬 상태 관리

```typescript
const [ingredients, setIngredients] = useState<string[]>([]);
const [currentIngredient, setCurrentIngredient] = useState("");
const [recipes, setRecipes] = useState<RecipeData[]>([]);
```

**왜 서버 상태(recipes)를 useState로 관리하나?**
- `useMutation`은 자동 캐싱을 하지 않음
- 결과를 수동으로 저장해야 UI에 표시 가능
- `useQuery`와 달리 일회성 요청

---

#### 2️⃣ useMutation 옵션

```typescript
const mutation = useMutation({
  mutationFn: generateRecipe,  // 실제 API 호출 함수
  onSuccess: (data) => {        // 성공 시 콜백
    setRecipes([data.data]);
  },
  onError: (error) => {         // 실패 시 콜백
    console.error("레시피 생성 실패:", error);
    alert("레시피 생성에 실패했습니다.");
  },
});
```

**mutationFn 동작 방식:**

```typescript
// lib/api/recipes.ts
export const generateRecipe = async (
  data: GenerateRecipeRequest
): Promise<AIRecipeResponse> => {
  const response = await apiClient.post<AIRecipeResponse>(
    "/recipes/generate-ai",
    data
  );
  return response.data;
};
```

**데이터 플로우:**
```
mutation.mutate({ ingredients: [...] })
  ↓
mutationFn: generateRecipe({ ingredients: [...] })
  ↓
apiClient.post("/recipes/generate-ai", data)
  ↓
onSuccess(response)
  ↓
setRecipes([response.data])
```

---

#### 3️⃣ mutation 객체의 속성

```typescript
mutation.mutate()        // API 호출 실행
mutation.isPending       // 로딩 상태 (boolean)
mutation.isSuccess       // 성공 상태 (boolean)
mutation.isError         // 에러 상태 (boolean)
mutation.data            // 응답 데이터
mutation.error           // 에러 객체
mutation.reset()         // 상태 초기화
```

**실제 사용 예시:**

```typescript
// 로딩 상태
isLoading: mutation.isPending

// 버튼 비활성화
<button disabled={mutation.isPending}>
  {mutation.isPending ? "생성 중..." : "추천받기"}
</button>

// 에러 표시
{mutation.isError && (
  <div>에러: {mutation.error.message}</div>
)}
```

---

#### 4️⃣ mutation.mutate() vs mutation.mutateAsync()

**mutate() - Promise 반환 안 함**
```typescript
const getRecommendations = () => {
  mutation.mutate({
    ingredients,
    provider: "openai",
  });
  // 여기서 결과를 바로 받을 수 없음
  // onSuccess 콜백에서 처리
};
```

**mutateAsync() - Promise 반환**
```typescript
const getRecommendations = async () => {
  try {
    const result = await mutation.mutateAsync({
      ingredients,
      provider: "openai",
    });
    console.log(result); // 결과를 바로 받음
  } catch (error) {
    console.error(error);
  }
};
```

---

### Mock 데이터 → 실제 API 연동 과정

#### Before: Mock 데이터

```typescript
const getRecommendations = async () => {
  if (ingredients.length === 0) return;

  setIsLoading(true);

  // Mock 데이터 (하드코딩)
  setTimeout(() => {
    const mockRecipes: Recipe[] = [
      {
        id: 1,
        title: "감자 베이컨 볶음",
        description: "감자와 베이컨을 활용한 간단한 요리",
        cookTime: 20,
        servings: 2,
        difficulty: "쉬움",
      },
    ];
    setRecipes(mockRecipes);
    setIsLoading(false);
  }, 2000);
};
```

**문제점:**
- 실제 서버 통신 없음
- 고정된 데이터만 반환
- 로딩 상태 수동 관리
- 에러 처리 없음

---

#### After: 실제 API 연동

```typescript
const mutation = useMutation({
  mutationFn: generateRecipe,
  onSuccess: (data) => {
    setRecipes([data.data]);
  },
  onError: (error) => {
    console.error("레시피 생성 실패:", error);
    alert("레시피 생성에 실패했습니다.");
  },
});

const getRecommendations = () => {
  if (ingredients.length === 0) return;

  mutation.mutate({
    ingredients,
    provider: "openai",
  });
};
```

**개선점:**
- ✅ 실제 Backend API 호출
- ✅ TanStack Query 자동 상태 관리
- ✅ 에러 처리 자동화
- ✅ 로딩 상태 자동 관리 (`mutation.isPending`)
- ✅ 타입 안전성 보장

---

### CORS 문제 해결

#### CORS란?

**Cross-Origin Resource Sharing (교차 출처 리소스 공유)**

```
Frontend: http://localhost:3000
Backend:  http://localhost:3001
         ↑ 다른 포트 = 다른 출처 (Origin)
```

브라우저는 보안상 **다른 출처로의 요청을 기본적으로 차단**합니다.

---

#### CORS 에러 발생

```
Access to XMLHttpRequest at 'http://localhost:3001/recipes/generate-ai'
from origin 'http://localhost:3000' has been blocked by CORS policy
```

**원인:**
- Frontend (3000 포트)에서 Backend (3001 포트)로 요청
- Backend에서 CORS 허용 설정이 없음

---

#### 해결 방법: NestJS CORS 설정

```typescript
// main-service/src/main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS 설정 추가
  app.enableCors({
    origin: 'http://localhost:3000',  // Frontend URL
    credentials: true,                 // 쿠키 전송 허용
  });

  await app.listen(3001);
}
```

**옵션 설명:**
- `origin`: 허용할 출처 (Frontend URL)
- `credentials`: 쿠키/인증 헤더 전송 허용

**프로덕션 환경:**
```typescript
app.enableCors({
  origin: process.env.FRONTEND_URL || 'https://my-app.com',
  credentials: true,
});
```

---

### 전체 데이터 플로우 (End-to-End)

```
1️⃣ 사용자 입력
   ↓
[Frontend] RecommendPage
   ↓ 재료 입력 + "추천받기" 클릭
   ↓
2️⃣ 커스텀 훅
   ↓
[Hooks] useIngredientRecommendation
   ↓ mutation.mutate({ ingredients, provider })
   ↓
3️⃣ API 함수
   ↓
[lib/api] generateRecipe()
   ↓ apiClient.post("/recipes/generate-ai", data)
   ↓
4️⃣ Axios 인터셉터
   ↓
[lib/api] client.ts
   ↓ 요청 인터셉터 (헤더 추가)
   ↓
5️⃣ HTTP 요청
   ↓
[Network] http://localhost:3001/recipes/generate-ai
   ↓
6️⃣ NestJS Controller
   ↓
[Backend] RecipesController.generateWithAI()
   ↓ generateRecipeWithAI(ingredients, preferences, provider)
   ↓
7️⃣ NestJS Service
   ↓
[Backend] RecipesService
   ↓ httpService.post(FastAPI_URL)
   ↓
8️⃣ FastAPI API
   ↓
[AI Service] generate_recipe()
   ↓ ai_client.generate_recipe(ingredients)
   ↓
9️⃣ OpenAI API
   ↓
[External] OpenAI GPT-3.5
   ↓ AI 응답 생성
   ↓
🔟 응답 역순
   ↓
FastAPI → NestJS → Frontend
   ↓
[Frontend] useMutation onSuccess
   ↓ setRecipes([data.data])
   ↓
[UI] RecipeList 컴포넌트 렌더링
```

---

### 핵심 정리 🎯

**1. 폴더 구조 설계**
- `lib/api`: API 로직 중앙 집중화
- 관심사 분리, 재사용성, 확장성

**2. Axios 클라이언트**
- `axios.create()`: 재사용 가능한 인스턴스
- 인터셉터: 요청/응답 전후 처리

**3. TanStack Query useMutation**
- POST 요청에 특화
- 자동 로딩/에러 상태 관리
- `onSuccess`/`onError` 콜백

**4. Mock → Real API**
- 하드코딩 제거
- 타입 안전성 확보
- 자동 상태 관리

**5. CORS 해결**
- `app.enableCors()` 설정 필수
- origin 허용 설정

**6. 전체 플로우**
- Frontend → NestJS → FastAPI → OpenAI
- 완전한 마이크로서비스 통합

---

---

## 📝 레시피 저장 및 목록 기능 구현 (2024-09-30)

### 🎯 구현 목표
AI로 생성한 레시피를 데이터베이스에 저장하고, 저장된 레시피 목록을 조회하는 기능 구현

---

### 1. 레시피 저장 기능 구현

#### 📚 학습한 핵심 개념

**1. useMutation을 활용한 데이터 변경**
```typescript
const saveMutation = useMutation({
  mutationFn: saveRecipe,
  onSuccess: () => {
    alert("레시피가 성공적으로 저장되었습니다!");
  },
  onError: (error) => {
    console.error("레시피 저장 실패:", error);
    alert("레시피 저장에 실패했습니다.");
  },
});
```

**useMutation의 특징:**
- **데이터 변경 작업**: POST, PUT, DELETE 요청에 특화
- **자동 상태 관리**: `isPending`, `isSuccess`, `isError` 자동 제공
- **콜백 함수**: `onSuccess`, `onError`로 성공/실패 처리
- **수동 실행**: `mutation.mutate(data)` 호출 시에만 실행

**2. 데이터 변환 로직**
```typescript
function convertToCreateRecipeRequest(recipeData: RecipeData): CreateRecipeRequest {
  const cookTimeMatch = recipeData.cooking_time.match(/\d+/);
  const cookTime = cookTimeMatch ? parseInt(cookTimeMatch[0]) : undefined;

  return {
    title: recipeData.recipe_name,
    description: `${recipeData.difficulty} 난이도의 레시피입니다.`,
    ingredients: recipeData.ingredients_list,
    instructions: recipeData.instructions,
    difficulty: recipeData.difficulty,
    cookTime: cookTime,
    servings: 2,
    category: "AI 생성",
  };
}
```

**변환 로직의 필요성:**
- AI 응답 형식 (`RecipeData`)과 Backend DTO (`CreateRecipeRequest`) 형식이 다름
- 정규표현식으로 조리시간 추출 (`"10분"` → `10`)
- 기본값 설정 (servings, category)

**3. Props 타입 재사용**

❌ **잘못된 방식** (새로운 타입 정의):
```typescript
// RecommendationResults.tsx에 직접 정의
interface RecommendationResultsProps {
  recipes: RecipeData[];
  isLoading: boolean;
  onSaveRecipe?: (recipe: RecipeData) => void;
  isSaving?: boolean;
}
```

✅ **올바른 방식** (기존 타입 확장):
```typescript
// types/common.ts 수정
export interface RecommendationResultsProps {
  recipes: RecipeData[];
  isLoading: boolean;
  onSaveRecipe?: (recipe: RecipeData) => void;  // 추가
  isSaving?: boolean;                            // 추가
}
```

**타입 재사용의 이점:**
- DRY 원칙 준수 (Don't Repeat Yourself)
- 타입 일관성 유지
- 중앙 집중식 타입 관리

#### 🔧 구현 단계

**1. 타입 정의** ([types/recipe.ts](frontend/src/types/recipe.ts))
```typescript
// 레시피 저장 요청 DTO
export interface CreateRecipeRequest {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  difficulty?: string;
  cookTime?: number;
  servings?: number;
  category?: string;
}

// 저장된 레시피 응답
export interface SavedRecipe {
  id: number;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  difficulty?: string;
  cookTime?: number;
  servings?: number;
  category?: string;
  createdAt: string;
  updatedAt: string;
}
```

**2. API 함수 추가** ([lib/api/recipes.ts](frontend/src/lib/api/recipes.ts))
```typescript
export const saveRecipe = async (
  data: CreateRecipeRequest
): Promise<SavedRecipe> => {
  const response = await apiClient.post<SavedRecipe>("/recipes", data);
  return response.data;
};
```

**3. useMutation 구현** ([hooks/useIngredientRecommendation.ts](frontend/src/hooks/useIngredientRecommendation.ts))
- `generateMutation`: AI 레시피 생성
- `saveMutation`: 레시피 저장
- `handleSaveRecipe`: 저장 로직 (데이터 변환 + mutation 실행)

**4. UI 버튼 추가** ([components/cards/RecipeList.tsx](frontend/src/components/cards/RecipeList.tsx))
```typescript
{onSaveRecipe && (
  <Button
    onClick={() => onSaveRecipe(recipe)}
    disabled={isSaving}
    size="sm"
    variant="outline"
  >
    <Save className="h-4 w-4 mr-2" />
    {isSaving ? "저장 중..." : "저장"}
  </Button>
)}
```

**5. Props 와이어링**
```
page.tsx (최상위)
  ↓ onSaveRecipe={handleSaveRecipe}, isSaving={isSaving}
RecommendationResults
  ↓ onSaveRecipe, isSaving
RecipeList
  ↓ onClick={() => onSaveRecipe(recipe)}
Button (저장 버튼)
```

#### ⚠️ 트러블슈팅

**문제 1: 400 에러 - 재료 형식 불일치**
```json
// 잘못된 형식 (단일 문자열)
{
  "ingredients": ["토마토, 양파, 베이컨"]
}

// 올바른 형식 (배열)
{
  "ingredients": ["토마토", "양파", "베이컨"]
}
```

**원인:** FastAPI가 쉼표로 구분된 재료를 단일 문자열로 반환
**해결:** FastAPI 파싱 로직에 쉼표 구분 처리 추가

**문제 2: 500 에러 - userId NOT NULL 제약**
```
QueryFailedError: null value in column "userId" violates not-null constraint
```

**원인:** Recipe Entity에서 userId가 필수였지만 인증 시스템이 아직 없음
**해결 1단계:** Entity 수정 (`@Column({ nullable: true })`)
**문제점:** TypeORM `synchronize: true`가 기존 제약 조건 수정 안 함
**해결 2단계:** 테이블 재생성
```bash
docker exec -it postgres psql -U postgres -d recipe_platform
DROP TABLE recipes CASCADE;
# NestJS 재시작 → 테이블 자동 재생성
```

---

### 2. 레시피 목록 페이지 구현

#### 📚 커스텀 훅 패턴의 중요성

**잘못된 접근 (페이지 내 useQuery):**
```typescript
// ❌ 페이지 컴포넌트에 직접 작성
export default function RecipesPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["recipes"],
    queryFn: () => getRecipes(1, 20),
  });
}
```

**사용자 피드백:**
> "지금 페이지 안에서 useQuery를 선언해서 사용하는데 이것보단, lib/api에 폴더를 만들어서 사용하는게 더 좋은 방안 아니니?"

**올바른 접근 (커스텀 훅 분리):**
```typescript
// ✅ hooks/useRecipes.ts
export function useRecipes(page = 1, limit = 20) {
  return useQuery({
    queryKey: ["recipes", page, limit],
    queryFn: () => getRecipes(page, limit),
    staleTime: 60 * 1000,
  });
}

// ✅ 페이지 컴포넌트
const { data, isLoading, error } = useRecipes(1, 20);
```

**커스텀 훅의 이점:**
1. **관심사 분리**: API 로직을 페이지에서 분리
2. **재사용성**: 다른 컴포넌트에서도 사용 가능
3. **테스트 용이성**: 독립적으로 테스트 가능
4. **일관성**: 기존 `useIngredientRecommendation` 패턴과 동일

#### 🏗️ 폴더 구조 선택

**옵션 1: `hooks/` 폴더** ✅ 선택
```
src/
├── hooks/
│   ├── useIngredientRecommendation.ts
│   └── useRecipes.ts
```

**옵션 2: `lib/api/hooks/` 폴더**
```
src/
├── lib/
│   └── api/
│       ├── client.ts
│       ├── recipes.ts
│       └── hooks/
│           └── useRecipes.ts
```

**선택 이유:**
- 기존 프로젝트 구조와 일관성 (`hooks/` 폴더 이미 존재)
- React 커뮤니티 관례 (`hooks/` 최상위 배치)
- 간단한 경로 (`@/hooks/useRecipes`)

#### 🔧 구현 내용

**1. 커스텀 훅 생성** ([hooks/useRecipes.ts](frontend/src/hooks/useRecipes.ts))
```typescript
"use client";

import { useQuery } from "@tanstack/react-query";
import { getRecipes } from "@/lib/api/recipes";

export function useRecipes(page = 1, limit = 20) {
  return useQuery({
    queryKey: ["recipes", page, limit],
    queryFn: () => getRecipes(page, limit),
    staleTime: 60 * 1000, // 1분간 캐시 유효
  });
}
```

**queryKey의 중요성:**
- `["recipes", page, limit]`: 캐시 식별자
- page나 limit이 바뀌면 새로운 쿼리로 인식
- 동일한 조건이면 캐시에서 즉시 반환

**2. 페이지 컴포넌트 수정** ([app/recipes/page.tsx](frontend/src/app/recipes/page.tsx))
```typescript
"use client";

import { useRecipes } from "@/hooks/useRecipes";

export default function RecipesPage() {
  const { data, isLoading, error } = useRecipes(1, 20);
  const recipes = data?.data || [];

  return (
    <div className="container mx-auto px-4 py-8">
      {isLoading && <LoadingState />}
      {error && <EmptyState message="레시피를 불러오는데 실패했습니다." />}
      {!isLoading && !error && recipes.length > 0 && (
        <RecipeGrid recipes={recipes} />
      )}
      {!isLoading && !error && recipes.length === 0 && (
        <EmptyState message="아직 저장된 레시피가 없습니다." />
      )}
    </div>
  );
}
```

**3. RecipeGrid 타입 수정** ([components/recipe/RecipeGrid.tsx](frontend/src/components/recipe/RecipeGrid.tsx))

**문제:** 타입 불일치
```typescript
// RecipeGrid가 기대하는 타입
interface RecipeListItem {
  image: string;  // 필수
  // ...
}

// API가 반환하는 타입
interface SavedRecipe {
  // image 필드 없음
  // ...
}
```

**해결:** RecipeGrid를 SavedRecipe 타입으로 변경
```typescript
import { SavedRecipe } from "@/types/recipe";

interface RecipeGridProps {
  recipes: SavedRecipe[];  // RecipeListItem[] → SavedRecipe[]
}

// 이미지 대신 이모지 사용
<div className="text-6xl text-center mb-4">👨‍🍳</div>
```

#### 🎨 UI/UX 개선

**1. 로딩 상태**
```typescript
{isLoading && (
  <LoadingState message="레시피를 불러오는 중...">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
  </LoadingState>
)}
```

**2. 에러 상태**
```typescript
{error && (
  <EmptyState message="레시피를 불러오는데 실패했습니다.">
    <ChefHat className="h-12 w-12 mx-auto mb-4 opacity-50" />
  </EmptyState>
)}
```

**3. 빈 상태**
```typescript
{recipes.length === 0 && (
  <EmptyState message="아직 저장된 레시피가 없습니다. AI 추천 페이지에서 레시피를 생성하고 저장해보세요!">
    <ChefHat className="h-12 w-12 mx-auto mb-4 opacity-50" />
  </EmptyState>
)}
```

---

### 💡 핵심 학습 정리

**1. TanStack Query 패턴**
- `useQuery`: 데이터 조회 (GET)
- `useMutation`: 데이터 변경 (POST, PUT, DELETE)
- 커스텀 훅으로 분리하여 재사용성 향상

**2. 타입 안전성**
- Backend DTO와 Frontend 타입 명확히 구분
- 데이터 변환 함수로 타입 불일치 해결
- 기존 타입 재사용으로 일관성 유지

**3. 에러 처리**
- API 에러: try-catch + alert
- TypeORM 제약 조건: Entity 수정 + 테이블 재생성
- 타입 불일치: 타입 변경 + UI 조정

**4. 코드 구조**
- 커스텀 훅: API 로직 분리
- 공통 컴포넌트: LoadingState, EmptyState 재활용
- Props 타입: 중앙 집중식 관리

---

## 비즈니스 로직과 UI 로직 분리 원칙 (Separation of Concerns)

### 🤔 핵심 질문: "왜 handleLogin은 page.tsx에 있을까?"

이것은 React/Next.js 개발에서 가장 중요한 **관심사의 분리(Separation of Concerns)** 원칙입니다.

---

### 📊 아키텍처 계층 분리

```
┌─────────────────────────────────────────────┐
│      page.tsx (비즈니스 로직 계층)           │
│                                             │
│  책임:                                       │
│  - API 호출 (useAuth, useMutation)          │
│  - 성공/실패 후 처리                         │
│  - 리다이렉트 (router.push)                 │
│  - 에러 처리 (alert, toast)                 │
│  - 전역 상태 관리 (isLoading)               │
│                                             │
└────────────────┬────────────────────────────┘
                 ↓ onSuccess, isLoading
┌─────────────────────────────────────────────┐
│      Form 컴포넌트 (UI 로직 계층)            │
│                                             │
│  책임:                                       │
│  - 폼 렌더링                                 │
│  - 입력 검증 (React Hook Form)              │
│  - 검증된 데이터를 부모에게 전달             │
│                                             │
└─────────────────────────────────────────────┘
```

---

### 🎯 분리해야 하는 4가지 이유

#### 1️⃣ **단일 책임 원칙 (SRP)**

**page.tsx 책임:**
```typescript
// ✅ 비즈니스 로직: "검증된 데이터로 무엇을 할 것인가?"
const handleLogin = async (data: LoginFormData) => {
  setIsLoading(true);
  try {
    await login(data.email, data.password);  // API 호출
    router.push("/");                        // 리다이렉트
  } catch (error) {
    alert("로그인 실패");                     // 에러 처리
  } finally {
    setIsLoading(false);                     // 상태 관리
  }
};
```

**LoginForm 책임:**
```typescript
// ✅ UI 로직: "입력 받고 검증하기"
const onSubmit = (data: LoginFormData) => {
  onSuccess(data);  // 검증된 데이터만 부모에게 전달
};
```

---

#### 2️⃣ **재사용성 극대화**

**같은 LoginForm, 다른 용도:**
```typescript
// 🎯 로그인 페이지: 홈으로 이동
<LoginForm onSuccess={(data) => {
  await login(data);
  router.push("/");
}} />

// 🎯 모달 로그인: 모달만 닫기
<LoginForm onSuccess={(data) => {
  await login(data);
  closeModal();
}} />

// 🎯 체크아웃: 결제 진행
<LoginForm onSuccess={(data) => {
  await login(data);
  proceedToCheckout();
}} />
```

**만약 LoginForm에 비즈니스 로직이 있다면?**
```typescript
// ❌ 재사용 불가능
function LoginForm() {
  const onSubmit = async (data) => {
    await login(data);
    router.push("/");  // ← "/" 경로 고정! 변경 불가!
  };
}
```

---

#### 3️⃣ **유지보수성 향상**

**변경 사항별 수정 범위:**

| 변경 사항 | 현재 구조 | LoginForm에 로직 있을 때 |
|-----------|----------|------------------------|
| 리다이렉트 경로 변경 | page.tsx만 수정 | LoginForm 수정 |
| 에러 표시 방식 변경<br>(alert → toast) | page.tsx만 수정 | LoginForm 수정 |
| 로딩 인디케이터 추가 | page.tsx만 수정 | LoginForm 수정 |
| 폼 필드 추가 | LoginForm만 수정 | LoginForm 수정 |

**현재 구조의 장점:**
- 비즈니스 로직 변경 → UI 영향 없음
- UI 변경 → 비즈니스 로직 영향 없음

---

#### 4️⃣ **테스트 용이성**

**분리된 테스트:**
```typescript
// LoginForm 테스트 (순수 함수)
it('이메일 검증 실패 시 에러 표시', () => {
  render(<LoginForm onSuccess={mockFn} isLoading={false} />);
  // props만 테스트, API 모킹 불필요
});

// page.tsx 테스트 (비즈니스 로직)
it('로그인 성공 시 홈으로 리다이렉트', async () => {
  // API, router 모킹하여 비즈니스 로직 테스트
});
```

**LoginForm에 로직이 있다면?**
```typescript
// ❌ 복잡한 테스트
it('로그인 테스트', () => {
  // useAuth, useRouter 모두 모킹 필요
  // API + UI 통합 테스트 강제
});
```

---

### 🚫 안티패턴: Form에 비즈니스 로직 포함

```typescript
// ❌ 절대 이렇게 하지 말 것!
function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      router.push("/");  // ← 경로 하드코딩
    } catch (error) {
      alert(error);      // ← 에러 처리 고정
    } finally {
      setIsLoading(false);
    }
  };
}
```

**문제점:**
- ❌ SRP 위반 (폼 검증 + API + 리다이렉트 + 에러 처리 + 상태 관리)
- ❌ useAuth, useRouter 의존성 추가
- ❌ 재사용 불가능
- ❌ 테스트 복잡도 증가
- ❌ 유지보수 어려움

---

### ✅ 올바른 패턴: 콜백 패턴

```typescript
// ✅ LoginForm: UI만 책임
function LoginForm({ onSuccess, isLoading }: LoginFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

  return (
    <form onSubmit={handleSubmit(onSuccess)}>
      {/* 폼 UI만 관리 */}
    </form>
  );
}

// ✅ page.tsx: 비즈니스 로직 책임
function AuthPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      router.push("/");  // 여기서 경로 결정
    } catch (error) {
      alert(error);      // 여기서 에러 처리 결정
    } finally {
      setIsLoading(false);
    }
  };

  return <LoginForm onSuccess={handleLogin} isLoading={isLoading} />;
}
```

**장점:**
- ✅ LoginForm은 순수 UI 컴포넌트 (외부 의존성 없음)
- ✅ page.tsx는 오케스트레이터 (여러 컴포넌트 조율)
- ✅ 명확한 데이터 흐름 (props down, callbacks up)
- ✅ 재사용성 극대화

---

### 💡 실생활 비유

**음식점 비유:**
```
page.tsx = 매니저
- 손님 주문 받기
- 주방에 전달
- 음식 서빙
- 계산 처리

LoginForm = 주문서
- 메뉴, 수량 입력란 제공
- 필수 항목 체크
- 작성된 주문서 전달
- (주방 가거나 계산 안 함)
```

**주문서가 모든 일을 한다면?**
- ❌ 주문서가 주방 가서 요리하고 계산까지 함
- ❌ 주문서의 책임이 너무 많음!

---

### 📐 설계 체크리스트

**컴포넌트 설계 시 질문:**
1. ✅ 이 컴포넌트의 **단 하나의 책임**은 무엇인가?
2. ✅ 다른 곳에서 **재사용** 가능한가?
3. ✅ **props만 변경**해서 다른 동작이 가능한가?
4. ✅ **외부 의존성**이 최소화되어 있는가?

**LoginForm 답변:**
```
✅ 단 하나의 책임: "로그인 입력 받고 검증하기"
✅ 재사용 가능: 모달, 페이지, 관리자 페이지 등
✅ props로 동작 변경: onSuccess로 다른 처리
✅ 의존성 최소: useForm만 사용
```

---

### 🎓 핵심 정리

| 측면 | LoginForm (UI) | page.tsx (비즈니스) |
|------|---------------|-------------------|
| **책임** | 폼 렌더링 + 검증 | API + 리다이렉트 + 에러 |
| **알아야 할 것** | 폼 필드, 검증 규칙 | API, 경로, 에러 처리 |
| **의존성** | useForm | useAuth, useRouter |
| **재사용성** | 높음 (어디서든) | 낮음 (페이지 전용) |
| **테스트** | 단순 (props) | 복잡 (API 모킹) |

**결론:**
- Form = 데이터 수집기 (what)
- Page = 의사결정자 (how, where, when)

---

## 다음 학습 목표

- [x] 클라이언트 컴포넌트 vs 서버 컴포넌트 ✅
- [x] 하이드레이션 개념 ✅
- [x] 페이지 라우팅 추가 (recipes, recommend 등) ✅
- [x] 동적 라우팅 ([id] 폴더 구조) ✅
- [x] SOLID 원칙 기반 컴포넌트 리팩토링 ✅
- [x] Axios vs TanStack Query 이해 ✅
- [x] API 연동 (Axios + TanStack Query) ✅
- [x] Frontend-Backend 완전 통합 ✅
- [x] 레시피 저장 및 목록 기능 ✅
- [x] 비즈니스 로직과 UI 로직 분리 원칙 ✅
- [ ] 사용자 인증 시스템 (진행 중)