# TIL - 사용자 인증 시스템 (Authentication)

## 📚 목차
1. [Context API란 무엇인가?](#1-context-api란-무엇인가)
2. [인증 시스템 전체 구조](#2-인증-시스템-전체-구조)
3. [AuthContext 상세 분석](#3-authcontext-상세-분석)
4. [useAuth 훅 분석](#4-useauth-훅-분석)
5. [localStorage와 토큰 관리](#5-localstorage와-토큰-관리)
6. [TanStack Query useMutation 활용](#6-tanstack-query-usemutation-활용)

---

## 1. Context API란 무엇인가?

### 🎯 Context API의 필요성

**문제 상황: Props Drilling (프롭스 지옥)**

```
┌─────────────────────────────────────────────────┐
│                  App (최상위)                    │
│            user = { id: 1, name: "홍길동" }      │
└────────────────────┬────────────────────────────┘
                     │ props로 전달
                     ↓
┌─────────────────────────────────────────────────┐
│              Layout 컴포넌트                     │
│         (user를 사용하지 않지만 전달만 함)        │
└────────────────────┬────────────────────────────┘
                     │ props로 전달
                     ↓
┌─────────────────────────────────────────────────┐
│            Header 컴포넌트                       │
│         (user를 사용하지 않지만 전달만 함)        │
└────────────────────┬────────────────────────────┘
                     │ props로 전달
                     ↓
┌─────────────────────────────────────────────────┐
│          UserProfile 컴포넌트                    │
│        여기서 비로소 user 정보 사용!             │
│        <div>{user.name}</div>                   │
└─────────────────────────────────────────────────┘
```

**문제점:**
- 중간 컴포넌트들이 사용하지 않는 데이터를 전달만 해야 함
- 컴포넌트 깊이가 깊어질수록 props 관리가 복잡해짐
- 코드 유지보수 어려움

---

**해결책: Context API**

```
┌─────────────────────────────────────────────────┐
│           AuthProvider (Context)                │
│            user = { id: 1, name: "홍길동" }      │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │           전역 상태 저장소                  │ │
│  │  - user 정보                               │ │
│  │  - token 정보                              │ │
│  │  - isAuthenticated                         │ │
│  └───────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
           │              │              │
           │              │              │
    직접 접근      직접 접근      직접 접근
           ↓              ↓              ↓
     ┌─────────┐    ┌─────────┐    ┌─────────┐
     │ Header  │    │ Profile │    │ Recipe  │
     │         │    │         │    │         │
     └─────────┘    └─────────┘    └─────────┘
     useAuth()      useAuth()      useAuth()
```

**장점:**
- 중간 컴포넌트를 거치지 않고 직접 접근
- 어디서든 `useAuth()`로 인증 상태 사용 가능
- 코드 간결하고 유지보수 용이

---

### 📖 Context API 핵심 개념

**1. Context 생성**
```typescript
const AuthContext = createContext<AuthContextType | undefined>(undefined);
```

**2. Provider로 값 제공**
```typescript
<AuthContext.Provider value={인증상태}>
  {children}
</AuthContext.Provider>
```

**3. Consumer로 값 사용**
```typescript
const auth = useContext(AuthContext);
```

---

## 2. 인증 시스템 전체 구조

### 🏗️ 폴더 구조

```
frontend/src/
├── contexts/
│   └── AuthContext.tsx        # Context 정의 + Provider
├── hooks/
│   └── useAuth.ts             # Context 사용 훅
├── lib/
│   └── api/
│       └── auth.ts            # API 함수 (Axios)
├── app/
│   ├── layout.tsx             # AuthProvider 감싸기
│   └── auth/
│       └── page.tsx           # 로그인/회원가입 페이지
└── components/
    └── ProtectedRoute.tsx     # 인증 필요한 라우트 보호
```

---

### 🔄 인증 플로우 시각화

```
┌─────────────────────────────────────────────────────────────┐
│                     1. 사용자 로그인                         │
└───────────────────────┬─────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│            2. useAuth().login(email, password)              │
└───────────────────────┬─────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│           3. AuthContext의 loginMutation 실행               │
└───────────────────────┬─────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│     4. lib/api/auth.ts의 login() 함수 호출 (Axios)         │
│        POST http://localhost:3001/auth/login                │
└───────────────────────┬─────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│              5. NestJS Backend 응답                         │
│     { access_token: "jwt...", user: {...} }                 │
└───────────────────────┬─────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│           6. onSuccess 콜백 실행                            │
│     - localStorage에 토큰/사용자 저장                       │
│     - Context 상태 업데이트                                 │
└───────────────────────┬─────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│              7. 모든 컴포넌트에서                           │
│          useAuth()로 로그인 상태 접근 가능                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. AuthContext 상세 분석

### 📝 파일: `contexts/AuthContext.tsx`

#### 3.1 타입 정의

```typescript
export interface AuthContextType {
  user: User | null;              // 현재 로그인한 사용자 정보
  token: string | null;           // JWT 토큰
  isLoading: boolean;             // 초기화 중인지 여부
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;       // 로그인 여부 (!!token)
}
```

**왜 이렇게 설계했나?**
- `user: User | null`: 로그아웃 상태는 `null`
- `isLoading`: 초기화 중에는 로그인 상태를 판단할 수 없음
- `isAuthenticated`: `!!token`으로 boolean 변환 (편의성)

---

#### 3.2 Context 생성

```typescript
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
```

**문법 분석:**
- `createContext<타입>()`: Context 생성 함수
- `undefined`: 초기값 (Provider 없이 사용하면 undefined)
- `export`: 다른 파일에서 import 가능

**왜 undefined?**
- Provider 밖에서 사용하면 에러를 발생시키기 위함
- `useAuth()` 훅에서 체크

---

#### 3.3 Provider 컴포넌트

**3.3.1 상태 정의**

```typescript
const [user, setUser] = useState<User | null>(null);
const [token, setToken] = useState<string | null>(null);
const [isLoading, setIsLoading] = useState(true);
```

**useState 문법:**
```typescript
const [변수명, setter함수] = useState<타입>(초기값);
```

**타입 지정 이유:**
- TypeScript에서 타입 안전성 확보
- `User | null`: user는 User 객체 또는 null만 가능

---

**3.3.2 초기화 (useEffect)**

```typescript
useEffect(() => {
  const savedToken = localStorage.getItem("access_token");
  const savedUser = localStorage.getItem("user");

  if (savedToken && savedUser) {
    setToken(savedToken);
    setUser(JSON.parse(savedUser));
  }

  setIsLoading(false);
}, []);
```

**useEffect 문법:**
```typescript
useEffect(() => {
  // 실행할 코드
}, [의존성배열]);
```

**의존성 배열이 빈 배열 `[]`인 이유:**
- 컴포넌트 마운트 시 **단 한 번만** 실행
- 새로고침 시 localStorage에서 토큰 복구

**플로우:**
```
페이지 새로고침
    ↓
useEffect 실행
    ↓
localStorage 확인
    ↓
토큰 있으면 → 로그인 상태 복구
토큰 없으면 → 로그아웃 상태 유지
    ↓
isLoading = false
```

---

**3.3.3 로그인 Mutation**

```typescript
const loginMutation = useMutation({
  mutationFn: authApi.login,
  onSuccess: (data) => {
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("user", JSON.stringify(data.user));

    setToken(data.access_token);
    setUser(data.user);
  },
  onError: (error) => {
    console.error("로그인 실패:", error);
    throw error;
  },
});
```

**useMutation 구조:**
```typescript
useMutation({
  mutationFn: API호출함수,    // 실제 API 함수
  onSuccess: (응답데이터) => { // 성공 시 실행
    // 상태 업데이트
  },
  onError: (에러) => {         // 실패 시 실행
    // 에러 처리
  },
});
```

**onSuccess 콜백 상세:**
```typescript
onSuccess: (data) => {
  // data = { access_token: "jwt...", user: {...} }

  // 1. localStorage에 저장 (새로고침 후에도 유지)
  localStorage.setItem("access_token", data.access_token);
  localStorage.setItem("user", JSON.stringify(data.user));

  // 2. Context 상태 업데이트 (즉시 반영)
  setToken(data.access_token);
  setUser(data.user);
}
```

**JSON.stringify의 필요성:**
```typescript
// ❌ 객체를 직접 저장하면 [object Object]로 저장됨
localStorage.setItem("user", data.user);

// ✅ JSON 문자열로 변환해서 저장
localStorage.setItem("user", JSON.stringify(data.user));

// 읽을 때는 JSON.parse로 다시 객체로 변환
const user = JSON.parse(localStorage.getItem("user"));
```

---

**3.3.4 로그인 함수**

```typescript
const login = async (email: string, password: string) => {
  try {
    await loginMutation.mutateAsync({ email, password });
  } catch (error) {
    throw error;
  }
};
```

**mutateAsync vs mutate 차이:**

| 구분 | mutate() | mutateAsync() |
|------|----------|---------------|
| 반환값 | void | Promise |
| await 사용 | 불가능 | 가능 |
| 에러 처리 | onError 콜백만 | try-catch 가능 |
| 사용 사례 | 단순 실행 | 순차적 작업 필요 시 |

**왜 mutateAsync를 사용했나?**
- 회원가입 후 자동 로그인을 위해 순차적 실행 필요
- try-catch로 에러를 상위로 전달

---

**3.3.5 회원가입 + 자동 로그인**

```typescript
const register = async (email: string, username: string, password: string) => {
  try {
    await registerMutation.mutateAsync({ email, username, password });
    // 회원가입 성공 후 자동 로그인
    await login(email, password);
  } catch (error) {
    throw error;
  }
};
```

**순차적 실행:**
```
1. registerMutation 실행 (회원가입 API)
    ↓ 성공
2. login 함수 실행 (로그인 API)
    ↓ 성공
3. 사용자는 회원가입과 동시에 로그인 완료
```

---

**3.3.6 로그아웃**

```typescript
const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
  setToken(null);
  setUser(null);
};
```

**동작:**
1. localStorage 데이터 삭제
2. Context 상태 초기화
3. 모든 컴포넌트에 변경 사항 즉시 반영

---

**3.3.7 Provider 반환**

```typescript
const value = {
  user,
  token,
  isLoading,
  login,
  register,
  logout,
  isAuthenticated: !!token,
};

return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
```

**!! (Double NOT) 연산자:**
```typescript
!!token
// ↓ 동작 과정
!token         // token이 있으면 false, 없으면 true
!!token        // 다시 반전 → token이 있으면 true, 없으면 false

// 예시
!!null         // false
!!undefined    // false
!!""           // false
!!"jwt..."     // true
```

**children이란?**
```typescript
<AuthProvider>
  <App />          ← 이 부분이 children
</AuthProvider>
```

---

## 4. useAuth 훅 분석

### 📝 파일: `hooks/useAuth.ts`

```typescript
"use client";

import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
```

---

### 🔍 코드 분석

**1. useContext 사용**
```typescript
const context = useContext(AuthContext);
```

**useContext의 역할:**
- Context에서 값을 가져옴
- AuthProvider 안에서 사용하면 value를 받음
- AuthProvider 밖에서 사용하면 undefined

---

**2. 에러 체크**
```typescript
if (context === undefined) {
  throw new Error("useAuth must be used within AuthProvider");
}
```

**왜 필요한가?**

```typescript
// ❌ 잘못된 사용 (AuthProvider 밖)
function SomeComponent() {
  const auth = useAuth();  // 에러 발생!
  // → "useAuth must be used within AuthProvider"
}

// ✅ 올바른 사용 (AuthProvider 안)
<AuthProvider>
  <SomeComponent />  {/* 여기서는 useAuth() 사용 가능 */}
</AuthProvider>
```

**개발자 친화적 에러 메시지:**
- 실수를 즉시 발견 가능
- 어떻게 수정해야 하는지 명확

---

**3. 타입 좁히기 (Type Narrowing)**

```typescript
// context의 타입: AuthContextType | undefined

if (context === undefined) {
  throw new Error(...);
}

// 이 시점부터 context의 타입: AuthContextType (undefined 제외)
return context;
```

**TypeScript의 Type Guard:**
- `if` 체크 후에는 TypeScript가 타입을 자동으로 좁힘
- `context.user` 접근 시 undefined 체크 불필요

---

### 🎯 사용 예시

```typescript
// 로그인 페이지
function LoginPage() {
  const { login, isAuthenticated } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return <form onSubmit={handleSubmit}>...</form>;
}

// 프로필 페이지
function ProfilePage() {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>{user?.username}</h1>
      <button onClick={logout}>로그아웃</button>
    </div>
  );
}

// 네비게이션 바
function Navigation() {
  const { isAuthenticated, user } = useAuth();

  return (
    <nav>
      {isAuthenticated ? (
        <span>환영합니다, {user?.username}님</span>
      ) : (
        <Link href="/auth">로그인</Link>
      )}
    </nav>
  );
}
```

---

## 5. localStorage와 토큰 관리

### 💾 localStorage vs sessionStorage

#### 📊 브라우저 저장소 종류

**브라우저는 3가지 저장소를 제공합니다:**

```
┌─────────────────────────────────────────────────────────┐
│              브라우저 저장소 비교                          │
├─────────────────┬─────────────────┬─────────────────────┤
│   localStorage  │  sessionStorage │      Cookie         │
├─────────────────┼─────────────────┼─────────────────────┤
│  영구 저장       │   탭 단위 저장   │   만료 시간 설정    │
│  (수동 삭제)     │  (탭 닫으면 삭제)│   (서버로 자동 전송)│
└─────────────────┴─────────────────┴─────────────────────┘
```

---

#### 🔍 localStorage vs sessionStorage 상세 비교

| 구분 | localStorage | sessionStorage |
|------|-------------|----------------|
| **데이터 유지 기간** | 영구적 (수동 삭제 전까지) | 세션 종료 시 삭제 |
| **브라우저 탭 공유** | ✅ 모든 탭에서 공유 | ❌ 각 탭마다 독립적 |
| **브라우저 닫기** | 데이터 유지 | 데이터 삭제 |
| **저장 용량** | 5~10MB | 5~10MB |
| **API** | 동일 (setItem, getItem, removeItem) | 동일 |
| **사용 사례** | 자동 로그인, 사용자 설정 | 일회성 데이터, 임시 토큰 |

---

#### 🎯 각 저장소의 생명주기 시각화

**localStorage 생명주기:**
```
┌─────────────────────────────────────────────────────┐
│          localStorage (영구 저장)                    │
└───────────────────┬─────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│   1. 로그인 → 토큰 저장                              │
│   localStorage.setItem("token", "jwt...")           │
└───────────────────┬─────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│   2. 브라우저 닫기 → 데이터 유지 ✅                  │
└───────────────────┬─────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│   3. 다음날 브라우저 다시 열기 → 데이터 유지 ✅      │
└───────────────────┬─────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│   4. 로그아웃 또는 수동 삭제 → 데이터 삭제           │
│   localStorage.removeItem("token")                  │
└─────────────────────────────────────────────────────┘
```

**sessionStorage 생명주기:**
```
┌─────────────────────────────────────────────────────┐
│       sessionStorage (세션 단위 저장)                │
└───────────────────┬─────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│   1. 로그인 → 토큰 저장                              │
│   sessionStorage.setItem("token", "jwt...")         │
└───────────────────┬─────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│   2. 새 탭 열기 → 데이터 공유 안 됨 ❌               │
└───────────────────┬─────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│   3. 브라우저 닫기 → 데이터 삭제 ❌                  │
└───────────────────┬─────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│   4. 다시 열기 → 데이터 없음 (새 세션)               │
└─────────────────────────────────────────────────────┘
```

---

#### 💡 실제 동작 예시

**localStorage 예시:**
```typescript
// 탭 A에서 실행
localStorage.setItem("user", "홍길동");

// 탭 B를 새로 열어서 실행
console.log(localStorage.getItem("user")); // "홍길동" ✅

// 브라우저 종료 후 다시 시작
console.log(localStorage.getItem("user")); // "홍길동" ✅
```

**sessionStorage 예시:**
```typescript
// 탭 A에서 실행
sessionStorage.setItem("user", "홍길동");

// 탭 B를 새로 열어서 실행
console.log(sessionStorage.getItem("user")); // null ❌

// 탭 A에서 다시 확인
console.log(sessionStorage.getItem("user")); // "홍길동" ✅

// 브라우저 종료 후 다시 시작
console.log(sessionStorage.getItem("user")); // null ❌
```

---

#### 🤔 로그인에 어떤 저장소를 사용해야 할까?

**상황별 추천:**

**1. localStorage 사용 (현재 프로젝트 방식) ✅**

**장점:**
```
✅ 자동 로그인 (기억하기) 기능 구현 가능
✅ 사용자 편의성 높음
✅ 새 탭에서도 로그인 상태 유지
✅ 브라우저 종료 후에도 로그인 유지
```

**단점:**
```
❌ 공용 PC에서 보안 취약
❌ XSS 공격에 취약
❌ 사용자가 직접 로그아웃해야 함
```

**사용 사례:**
- 개인 디바이스 (스마트폰, 개인 PC)
- 자동 로그인 기능 제공
- 대부분의 웹/앱 서비스 (네이버, 구글, 페이스북 등)

---

**2. sessionStorage 사용**

**장점:**
```
✅ 탭 닫으면 자동 로그아웃
✅ 공용 PC에서 상대적으로 안전
✅ 브라우저 종료 시 자동 삭제
```

**단점:**
```
❌ 자동 로그인 불가능
❌ 새 탭마다 다시 로그인 필요
❌ 사용자 편의성 낮음
```

**사용 사례:**
- 은행/금융 서비스 (높은 보안 필요)
- 공용 PC 환경
- 일회성 작업 (설문조사, 투표 등)

---

**3. HttpOnly Cookie (가장 안전) 🔐**

**장점:**
```
✅ JavaScript 접근 불가 (XSS 공격 방어)
✅ 서버에서 자동으로 쿠키 전송
✅ 만료 시간 설정 가능
```

**단점:**
```
❌ 서버 구현 필요
❌ CSRF 공격 대비 필요
❌ 복잡한 설정
```

**사용 사례:**
- 프로덕션 환경 (실제 서비스)
- 높은 보안이 필요한 경우

---

#### 📌 우리 프로젝트에서 localStorage를 선택한 이유

**1. 학습 목적:**
```typescript
// localStorage는 가장 간단하게 구현 가능
localStorage.setItem("token", token);
const token = localStorage.getItem("token");
```

**2. 사용자 편의성:**
- 브라우저 종료 후에도 로그인 유지
- 자동 로그인 기능 구현 용이

**3. 구현 용이성:**
- 서버 설정 불필요
- 클라이언트만으로 완결

**4. 개발 환경:**
- 개인 PC 환경 (공용 PC 아님)
- 학습/개발 단계 (프로덕션 아님)

---

#### 🔒 보안 강화 방법 (프로덕션 환경)

**실제 서비스라면 이렇게 개선:**

```
┌─────────────────────────────────────────────────────┐
│           보안 강화 전략                             │
├─────────────────────────────────────────────────────┤
│  1. HttpOnly Cookie 사용                            │
│     → JavaScript 접근 차단                          │
│                                                     │
│  2. Access Token (짧은 만료시간)                    │
│     → 15분~1시간                                    │
│                                                     │
│  3. Refresh Token (긴 만료시간)                     │
│     → 1주~1개월, HttpOnly Cookie에 저장             │
│                                                     │
│  4. HTTPS 필수                                      │
│     → 중간자 공격 방어                              │
│                                                     │
│  5. CSRF Token                                      │
│     → Cross-Site 요청 위조 방어                     │
└─────────────────────────────────────────────────────┘
```

---

#### 🎓 핵심 정리

| 저장소 | 유지 기간 | 탭 공유 | 사용 사례 |
|--------|----------|---------|----------|
| **localStorage** | 영구 | ✅ | 자동 로그인 |
| **sessionStorage** | 세션 | ❌ | 일회성 데이터 |
| **Cookie** | 설정 가능 | ✅ | 서버 인증 |

**우리의 선택: localStorage**
- 간단한 구현
- 자동 로그인 지원
- 학습 목적에 적합

**프로덕션 추천: HttpOnly Cookie + Refresh Token**
- 최고 수준의 보안
- 자동 로그인 + 보안 양립

---

### 🔄 토큰 저장/복구 플로우

```
┌─────────────────────────────────────────────────┐
│            1. 사용자 로그인 성공                 │
└───────────────────┬─────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│     2. localStorage에 토큰 저장                 │
│     localStorage.setItem("access_token", "jwt")│
│     localStorage.setItem("user", "{...}")      │
└───────────────────┬─────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│         3. Context 상태 업데이트                │
│         setToken("jwt")                         │
│         setUser({...})                          │
└───────────────────┬─────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│       4. 사용자가 페이지를 새로고침              │
└───────────────────┬─────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│      5. useEffect가 실행 (컴포넌트 마운트)       │
└───────────────────┬─────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│    6. localStorage에서 토큰 읽기                │
│    const token = localStorage.getItem("...")    │
└───────────────────┬─────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│       7. Context 상태 복구                      │
│       setToken(token)                           │
│       setUser(JSON.parse(user))                 │
└───────────────────┬─────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│     8. 로그인 상태 유지! (새로고침 후에도)       │
└─────────────────────────────────────────────────┘
```

---

### 🔐 보안 고려사항

**localStorage의 한계:**
```
┌──────────────────────────────────────────────┐
│           XSS 공격에 취약                     │
│  악성 스크립트가 localStorage 접근 가능       │
└──────────────────────────────────────────────┘
```

**대안:**
1. **HttpOnly Cookie** (더 안전)
   - JavaScript 접근 불가
   - 브라우저가 자동으로 Cookie 전송

2. **토큰 만료 시간 짧게 설정**
   - Access Token: 15분~1시간
   - Refresh Token으로 갱신

3. **민감한 정보는 저장하지 않기**
   - 비밀번호 절대 저장 금지
   - 토큰만 저장

---

## 6. TanStack Query useMutation 활용

### 🎯 useMutation이란?

**데이터 변경 작업에 특화된 훅:**
- POST, PUT, DELETE 요청에 사용
- 로딩, 에러, 성공 상태 자동 관리
- 콜백 함수로 부가 작업 수행

---

### 📊 useMutation vs useQuery 비교

| 구분 | useQuery | useMutation |
|------|----------|-------------|
| **용도** | 데이터 조회 (GET) | 데이터 변경 (POST/PUT/DELETE) |
| **실행 시점** | 자동 실행 | 수동 실행 (mutate 호출) |
| **캐싱** | 자동 캐싱 | 캐싱 안 함 |
| **재시도** | 자동 재시도 | 수동 설정 |
| **사용 사례** | 목록 조회, 상세 조회 | 생성, 수정, 삭제 |

---

### 🔍 loginMutation 상세 분석

```typescript
const loginMutation = useMutation({
  mutationFn: authApi.login,
  onSuccess: (data) => {
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setToken(data.access_token);
    setUser(data.user);
  },
  onError: (error) => {
    console.error("로그인 실패:", error);
    throw error;
  },
});
```

**각 속성 설명:**

**1. mutationFn (필수)**
```typescript
mutationFn: authApi.login
```
- 실제 API 호출 함수
- `authApi.login()`은 Axios로 POST 요청

**2. onSuccess (선택)**
```typescript
onSuccess: (data) => {
  // data = API 응답 데이터
  // 성공 시 실행할 로직
}
```
- API 호출 성공 시 자동 실행
- 상태 업데이트, 리다이렉트 등

**3. onError (선택)**
```typescript
onError: (error) => {
  // error = 에러 객체
  // 실패 시 실행할 로직
}
```
- API 호출 실패 시 자동 실행
- 에러 로깅, 사용자 알림 등

---

### 🚀 mutation 실행 방법

**1. mutate() - Promise 반환 안 함**
```typescript
loginMutation.mutate({ email, password });
// 바로 다음 코드 실행 (비동기 대기 안 함)
console.log("API 호출 시작!");
```

**2. mutateAsync() - Promise 반환**
```typescript
await loginMutation.mutateAsync({ email, password });
// API 완료 후 다음 코드 실행
console.log("API 호출 완료!");
```

---

### 📈 mutation 상태 활용

```typescript
const loginMutation = useMutation({ ... });

// 상태 값들
loginMutation.isPending   // 로딩 중 (true/false)
loginMutation.isSuccess   // 성공 (true/false)
loginMutation.isError     // 에러 (true/false)
loginMutation.data        // 응답 데이터
loginMutation.error       // 에러 객체
```

**UI 예시:**
```typescript
<button
  onClick={() => loginMutation.mutate({ email, password })}
  disabled={loginMutation.isPending}
>
  {loginMutation.isPending ? "로그인 중..." : "로그인"}
</button>

{loginMutation.isError && (
  <p className="error">{loginMutation.error.message}</p>
)}
```

---

## 🎓 핵심 개념 정리

### 1. Context API
```
전역 상태 관리 도구
├── createContext() - Context 생성
├── Provider - 값 제공
└── useContext() - 값 사용
```

### 2. 인증 플로우
```
로그인 → API 호출 → 토큰 받기 → localStorage 저장 → Context 업데이트
```

### 3. 새로고침 후 복구
```
useEffect (빈 배열) → localStorage 읽기 → Context 복구
```

### 4. useMutation
```
데이터 변경 작업
├── mutationFn - API 함수
├── onSuccess - 성공 콜백
└── onError - 에러 콜백
```

### 5. 커스텀 훅 패턴
```
contexts/ - Context 정의 + Provider
hooks/ - Context 사용 훅
lib/api/ - API 함수
```

---

## 7. React Hook Form 완벽 가이드

### 🎯 React Hook Form이란?

**폼 상태 관리 라이브러리:**
- 복잡한 폼 상태를 간단하게 관리
- 검증(Validation) 자동화
- 불필요한 리렌더링 최소화
- TypeScript 완벽 지원

---

### 📊 기존 방식 vs React Hook Form

#### ❌ 기존 방식 (useState 사용)

```typescript
function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // 검증 로직
    if (!email) setEmailError("이메일을 입력해주세요");
    if (!password) setPasswordError("비밀번호를 입력해주세요");

    // API 호출
    login(email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {emailError && <p>{emailError}</p>}

      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {passwordError && <p>{passwordError}</p>}
    </form>
  );
}
```

**문제점:**
```
❌ 8개 이상의 상태 관리 필요 (필드 + 에러)
❌ onChange 이벤트 핸들러 수동 작성
❌ 검증 로직 수동 구현
❌ 모든 입력마다 리렌더링 발생
❌ 코드 중복 많음
```

---

#### ✅ React Hook Form 방식

```typescript
function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormData) => {
    login(data.email, data.password);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("email", {
          required: "이메일을 입력해주세요",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "올바른 이메일 형식이 아닙니다",
          },
        })}
      />
      {errors.email && <p>{errors.email.message}</p>}

      <input {...register("password", { required: "비밀번호를 입력해주세요" })} />
      {errors.password && <p>{errors.password.message}</p>}
    </form>
  );
}
```

**장점:**
```
✅ 단 1개의 훅으로 모든 상태 관리
✅ onChange 자동 처리
✅ 검증 규칙 선언적으로 정의
✅ 리렌더링 최적화 (uncontrolled input)
✅ 코드 간결
```

---

### 🔍 useForm 훅 상세 분석

#### 1️⃣ 기본 사용법

```typescript
const { register, handleSubmit, formState } = useForm<FormData>({
  defaultValues: { /* 초기값 */ },
});
```

**반환값 구조:**
```
useForm()
├── register()          - Input 등록 함수
├── handleSubmit()      - 폼 제출 핸들러
├── formState           - 폼 상태 객체
│   ├── errors          - 검증 에러
│   ├── isDirty         - 변경 여부
│   ├── isSubmitting    - 제출 중 여부
│   └── isValid         - 유효성 검사 통과 여부
├── watch()             - 필드 값 실시간 감시
├── reset()             - 폼 초기화
└── setValue()          - 값 직접 설정
```

---

#### 2️⃣ register() 함수 - Input 등록

**기본 구조:**
```typescript
{...register("필드명", {
  required: "에러 메시지",
  minLength: { value: 6, message: "최소 6자" },
  maxLength: { value: 20, message: "최대 20자" },
  pattern: { value: /정규식/, message: "형식 오류" },
  validate: (value) => value === "조건" || "에러 메시지",
})}
```

**동작 원리:**
```typescript
// {...register("email")}는 아래와 같이 확장됨:

{
  name: "email",
  ref: (element) => { /* Input 요소 참조 저장 */ },
  onChange: (e) => { /* 값 변경 처리 */ },
  onBlur: (e) => { /* 포커스 아웃 처리 */ },
}
```

**ASCII 시각화:**
```
┌─────────────────────────────────────────────┐
│  {...register("email", { required: true })} │
└────────────────┬────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────┐
│         Spread Operator 확장                │
│  name="email"                               │
│  ref={함수}                                  │
│  onChange={자동생성핸들러}                   │
│  onBlur={자동생성핸들러}                     │
└────────────────┬────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────┐
│  <input name="email" ref={...} ... />       │
└─────────────────────────────────────────────┘
```

---

#### 3️⃣ 검증 규칙 (Validation Rules)

**모든 검증 규칙:**

| 규칙 | 설명 | 예시 |
|------|------|------|
| `required` | 필수 입력 | `required: "필수 항목입니다"` |
| `minLength` | 최소 길이 | `minLength: { value: 6, message: "최소 6자" }` |
| `maxLength` | 최대 길이 | `maxLength: { value: 20, message: "최대 20자" }` |
| `min` | 최소 값 | `min: { value: 18, message: "18세 이상" }` |
| `max` | 최대 값 | `max: { value: 100, message: "100 이하" }` |
| `pattern` | 정규식 패턴 | `pattern: { value: /정규식/, message: "형식 오류" }` |
| `validate` | 커스텀 검증 | `validate: (value) => value === "조건"` |

**실전 예시:**

```typescript
// 이메일 검증
{...register("email", {
  required: "이메일을 입력해주세요",
  pattern: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: "올바른 이메일 형식이 아닙니다",
  },
})}

// 비밀번호 검증
{...register("password", {
  required: "비밀번호를 입력해주세요",
  minLength: {
    value: 8,
    message: "비밀번호는 최소 8자 이상이어야 합니다",
  },
})}

// 비밀번호 확인 검증 (커스텀)
{...register("confirmPassword", {
  required: "비밀번호 확인을 입력해주세요",
  validate: (value) => value === password || "비밀번호가 일치하지 않습니다",
})}
```

---

#### 4️⃣ watch() - 실시간 값 감시

**용도: 다른 필드 값과 비교할 때**

```typescript
const password = watch("password");

{...register("confirmPassword", {
  validate: (value) => value === password || "비밀번호가 일치하지 않습니다",
})}
```

**동작 원리:**
```
┌─────────────────────────────────────────────┐
│  사용자가 password 필드에 "abc123" 입력      │
└────────────────┬────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────┐
│  const password = watch("password")         │
│  → password = "abc123"                      │
└────────────────┬────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────┐
│  confirmPassword 검증 시 password와 비교     │
│  validate: (value) => value === password    │
└─────────────────────────────────────────────┘
```

---

#### 5️⃣ handleSubmit() - 폼 제출

**구조:**
```typescript
<form onSubmit={handleSubmit(onSubmit, onError)}>
```

**동작 플로우:**
```
┌─────────────────────────────────────────────┐
│         사용자가 Submit 버튼 클릭            │
└────────────────┬────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────┐
│     handleSubmit()이 검증 시작               │
└────────────────┬────────────────────────────┘
                 ↓
         검증 성공?     검증 실패?
              ↓              ↓
    ┌─────────────┐   ┌─────────────┐
    │ onSubmit()  │   │  onError()  │
    │ 실행        │   │  (선택사항)  │
    └─────────────┘   └─────────────┘
```

**예시:**
```typescript
const onSubmit = (data: LoginFormData) => {
  console.log("검증 통과!", data);
  // { email: "test@test.com", password: "password123" }
};

const onError = (errors) => {
  console.log("검증 실패!", errors);
  // { email: { type: "required", message: "이메일을 입력해주세요" } }
};

<form onSubmit={handleSubmit(onSubmit, onError)}>
```

---

### 🏗️ SOLID 원칙 적용: 컴포넌트 내부에서 폼 선언

#### 🤔 왜 컴포넌트 내부에서 선언해야 할까?

**문제 상황:**
```typescript
// ❌ 안 좋은 방식: page.tsx에서 폼 선언
function AuthPage() {
  const loginForm = useForm<LoginFormData>();
  const signupForm = useForm<SignupFormData>();

  return (
    <>
      <LoginForm form={loginForm} />     {/* 폼을 props로 전달 */}
      <SignupForm form={signupForm} />
    </>
  );
}
```

**문제점:**
```
❌ Page 컴포넌트가 폼 구현 세부사항을 알아야 함
❌ LoginForm 필드가 추가되면 page.tsx도 수정 필요
❌ 컴포넌트 재사용성 저하
❌ 단일 책임 원칙(SRP) 위반
```

---

**해결책:**
```typescript
// ✅ 좋은 방식: 컴포넌트 내부에서 폼 선언
function LoginForm({ onSuccess, isLoading }) {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data: LoginFormData) => {
    onSuccess(data);  // 부모에게 결과만 전달
  };

  return <form onSubmit={handleSubmit(onSubmit)}>...</form>;
}

// 부모는 결과만 받음
function AuthPage() {
  const handleLogin = async (data: LoginFormData) => {
    await login(data.email, data.password);
  };

  return <LoginForm onSuccess={handleLogin} isLoading={false} />;
}
```

**장점:**
```
✅ LoginForm이 자신의 폼만 책임 (SRP)
✅ 캡슐화: 폼 구현 세부사항 숨김
✅ 재사용성: 다른 곳에서도 쉽게 사용
✅ 유지보수성: LoginForm 수정 시 page.tsx 영향 없음
```

---

**아키텍처 비교:**

```
❌ 안 좋은 방식 (page에서 폼 관리)
┌──────────────────────────────────┐
│   page.tsx                       │
│   ├─ loginForm = useForm()       │  ← 폼 구현 세부사항 알아야 함
│   ├─ signupForm = useForm()      │
│   ├─ handleLogin()               │
│   └─ <LoginForm form={...} />   │  ← 폼을 props로 전달
└──────────────────────────────────┘

✅ 좋은 방식 (컴포넌트가 자체 관리)
┌──────────────────────────────────┐
│   page.tsx                       │
│   ├─ handleLogin(data)           │  ← 결과만 받음
│   └─ <LoginForm onSuccess={...}/>│  ← 콜백만 전달
└──────────────────────────────────┘
         ↓
┌──────────────────────────────────┐
│   LoginForm.tsx                  │
│   ├─ useForm() 내부에서 선언      │  ← 자체 폼 관리
│   ├─ register()                  │
│   └─ handleSubmit()              │
└──────────────────────────────────┘
```

---

### 🔧 forwardRef 패턴 - PasswordField 컴포넌트

#### 🤔 왜 forwardRef가 필요한가?

**문제 상황:**
```typescript
// ❌ 일반 컴포넌트는 ref를 받을 수 없음
function PasswordField({ id, ...props }) {
  return <input id={id} {...props} />;
}

// register()는 ref를 전달하려고 함
<PasswordField {...register("password")} />
// 에러! ref가 전달되지 않음
```

---

**해결책: forwardRef 사용**
```typescript
import { forwardRef } from "react";

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ id, placeholder, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <Input
        id={id}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        ref={ref}              // ← ref 전달!
        {...props}             // ← register의 나머지 속성 전달
      />
    );
  }
);

PasswordField.displayName = "PasswordField";
```

---

**forwardRef 문법 분석:**
```typescript
forwardRef<요소타입, Props타입>(
  (props, ref) => {
    return <요소 ref={ref} {...props} />;
  }
)
```

**타입 매개변수:**
```typescript
forwardRef<HTMLInputElement, PasswordFieldProps>
//         ↑                ↑
//         ref 타입          props 타입
```

---

**동작 플로우:**
```
┌─────────────────────────────────────────────┐
│  <PasswordField {...register("password")} />│
└────────────────┬────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────┐
│  register()가 전달하는 것:                   │
│  {                                          │
│    name: "password",                        │
│    ref: (element) => {...},  ← ref!         │
│    onChange: ...,                           │
│    onBlur: ...                              │
│  }                                          │
└────────────────┬────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────┐
│  forwardRef로 ref를 두 번째 인자로 받음       │
│  (props, ref) => { ... }                    │
└────────────────┬────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────┐
│  <Input ref={ref} {...props} />             │
│  → Input에 ref 전달 성공!                    │
└─────────────────────────────────────────────┘
```

---

**왜 displayName이 필요한가?**
```typescript
PasswordField.displayName = "PasswordField";
```

**이유:**
- forwardRef로 감싸면 컴포넌트 이름이 "Anonymous"로 표시됨
- 디버깅 시 React DevTools에서 식별 어려움
- displayName 설정으로 명확한 컴포넌트 이름 표시

---

### 🎯 실전 구현 예시

#### LoginForm.tsx (완성 코드)

```typescript
"use client";

import { useForm } from "react-hook-form";
import { LoginFormData } from "@/types/auth";

interface LoginFormProps {
  onSuccess: (data: LoginFormData) => void;
  isLoading: boolean;
}

export function LoginForm({ onSuccess, isLoading }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormData) => {
    onSuccess(data);  // 부모에게 검증된 데이터 전달
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("email", {
          required: "이메일을 입력해주세요",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "올바른 이메일 형식이 아닙니다",
          },
        })}
      />
      {errors.email && <p>{errors.email.message}</p>}

      <input
        type="password"
        {...register("password", {
          required: "비밀번호를 입력해주세요",
          minLength: {
            value: 6,
            message: "비밀번호는 최소 6자 이상이어야 합니다",
          },
        })}
      />
      {errors.password && <p>{errors.password.message}</p>}

      <button type="submit" disabled={isLoading}>
        {isLoading ? "로그인 중..." : "로그인"}
      </button>
    </form>
  );
}
```

---

#### SignupForm.tsx (비밀번호 확인 검증)

```typescript
export function SignupForm({ onSuccess, isLoading }: SignupFormProps) {
  const {
    register,
    handleSubmit,
    watch,                    // ← password 감시용
    formState: { errors },
  } = useForm<SignupFormData>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");  // ← 실시간 password 값

  return (
    <form onSubmit={handleSubmit((data) => onSuccess(data))}>
      {/* username, email 필드 */}

      <input
        type="password"
        {...register("password", {
          required: "비밀번호를 입력해주세요",
          minLength: { value: 8, message: "최소 8자" },
        })}
      />

      <input
        type="password"
        {...register("confirmPassword", {
          required: "비밀번호 확인을 입력해주세요",
          validate: (value) =>
            value === password || "비밀번호가 일치하지 않습니다",
          //       ↑
          //    watch()로 감시한 password와 비교!
        })}
      />
      {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
    </form>
  );
}
```

**비밀번호 확인 검증 플로우:**
```
┌─────────────────────────────────────────────┐
│  사용자가 password에 "abc123" 입력           │
└────────────────┬────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────┐
│  const password = watch("password")         │
│  → password = "abc123"                      │
└────────────────┬────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────┐
│  사용자가 confirmPassword에 "abc" 입력       │
└────────────────┬────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────┐
│  validate 함수 실행:                         │
│  "abc" === "abc123"  → false                │
│  → "비밀번호가 일치하지 않습니다" 에러 표시   │
└─────────────────────────────────────────────┘
```

---

### 🎓 핵심 정리

#### React Hook Form 사용 이유
```
✅ useState 8개 → useForm 1개로 단순화
✅ 검증 로직 선언적으로 정의
✅ 리렌더링 최적화 (성능 향상)
✅ TypeScript 완벽 지원
✅ 코드 가독성 및 유지보수성 향상
```

#### 주요 API
```
useForm()
├── register()        - Input 등록 및 검증
├── handleSubmit()    - 폼 제출 + 자동 검증
├── watch()           - 필드 값 실시간 감시
└── formState.errors  - 검증 에러 메시지
```

#### SOLID 원칙 적용
```
✅ 각 컴포넌트가 자신의 폼 상태 관리 (SRP)
✅ 부모는 결과만 받음 (onSuccess 콜백)
✅ 폼 구현 세부사항 캡슐화
✅ 컴포넌트 재사용성 극대화
```

#### forwardRef 패턴
```
✅ 커스텀 Input 컴포넌트에서 ref 전달
✅ register()와 호환되는 컴포넌트 제작
✅ displayName으로 디버깅 용이성 확보
```

---

## 8. 비즈니스 로직과 UI 로직 분리 원칙

### 🤔 왜 handleLogin/handleSignup은 page.tsx에 있을까?

이것은 **관심사의 분리(Separation of Concerns)** 원칙의 핵심입니다.

---

### 📊 역할 분리 아키텍처

```
┌─────────────────────────────────────────────┐
│        page.tsx (비즈니스 로직 계층)         │
│                                             │
│  ✅ 책임:                                    │
│  - useAuth() 훅으로 API 함수 가져오기        │
│  - 로그인/회원가입 성공 후 처리              │
│  - 리다이렉트 (router.push)                 │
│  - 에러 처리 및 사용자 알림                  │
│  - 로딩 상태 관리                            │
│                                             │
└────────────────┬────────────────────────────┘
                 ↓ props
    ┌────────────┴────────────┐
    ↓                         ↓
┌─────────────────┐   ┌─────────────────┐
│  LoginForm      │   │  SignupForm     │
│  (UI 로직 계층)  │   │  (UI 로직 계층)  │
│                 │   │                 │
│  ✅ 책임:        │   │  ✅ 책임:        │
│  - 폼 렌더링     │   │  - 폼 렌더링     │
│  - 입력 검증     │   │  - 입력 검증     │
│  - 검증된 데이터 │   │  - 검증된 데이터 │
│    부모에게 전달 │   │    부모에게 전달 │
└─────────────────┘   └─────────────────┘
```

---

### 🎯 핵심 이유 4가지

#### 1️⃣ **비즈니스 로직과 UI 로직 분리**

**page.tsx (비즈니스 로직):**
```typescript
const handleLogin = async (data: LoginFormData) => {
  setIsLoading(true);
  try {
    await login(data.email, data.password);  // ← API 호출
    router.push("/");                        // ← 리다이렉트
  } catch (error) {
    alert("로그인 실패: " + error.message);  // ← 에러 처리
  } finally {
    setIsLoading(false);                     // ← 상태 관리
  }
};
```

**LoginForm (UI 로직):**
```typescript
const onSubmit = (data: LoginFormData) => {
  onSuccess(data);  // ← 검증만 책임, 이후 처리는 부모에게 위임
};
```

**분리 이유:**
- LoginForm은 "입력 받기 + 검증"만 책임
- page.tsx는 "검증된 데이터로 무엇을 할지" 책임
- 각자의 역할이 명확

---

#### 2️⃣ **LoginForm은 "어떻게 처리할지" 몰라도 됨**

**LoginForm의 관점:**
```typescript
interface LoginFormProps {
  onSuccess: (data: LoginFormData) => void;  // ← "성공하면 이걸 호출해"
  isLoading: boolean;                        // ← 로딩 상태만 받음
}
```

**LoginForm이 모르는 것들:**
```
❓ 로그인 성공 후 어디로 이동? → page.tsx가 결정
❓ 에러를 어떻게 표시? (alert? toast?) → page.tsx가 결정
❓ 로딩 상태를 언제 시작/종료? → page.tsx가 관리
```

---

**만약 LoginForm 안에 비즈니스 로직을 넣는다면:**

```typescript
// ❌ 나쁜 예시: LoginForm이 너무 많이 알아야 함
function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      router.push("/");  // ← 리다이렉트 경로 하드코딩
    } catch (error) {
      alert(error);      // ← 에러 처리 방식 고정
    }
  };
}
```

**문제점:**
```
❌ 리다이렉트 경로가 "/" 고정
   → 다른 페이지로 이동하고 싶으면 LoginForm 수정 필요

❌ 에러 처리가 alert() 고정
   → toast 알림을 쓰고 싶으면 LoginForm 수정 필요

❌ LoginForm이 useAuth, useRouter 의존
   → 테스트할 때 모킹(mocking) 어려움

❌ 재사용 불가능
   → 모달 로그인, 관리자 로그인 등 다른 상황에서 사용 못함
```

---

#### 3️⃣ **재사용성 극대화**

**현재 구조의 장점:**

```typescript
// 🎯 상황 1: 로그인 페이지 - 성공 시 홈으로
<LoginForm
  onSuccess={async (data) => {
    await login(data.email, data.password);
    router.push("/");
  }}
  isLoading={isLoading}
/>

// 🎯 상황 2: 모달 로그인 - 성공 시 모달만 닫기
<LoginForm
  onSuccess={async (data) => {
    await login(data.email, data.password);
    closeModal();
  }}
  isLoading={isLoading}
/>

// 🎯 상황 3: 관리자 페이지 - 성공 시 관리자 대시보드로
<LoginForm
  onSuccess={async (data) => {
    await adminLogin(data.email, data.password);
    router.push("/admin");
  }}
  isLoading={isLoading}
/>

// 🎯 상황 4: 체크아웃 페이지 - 성공 시 결제 진행
<LoginForm
  onSuccess={async (data) => {
    await login(data.email, data.password);
    proceedToCheckout();
  }}
  isLoading={isLoading}
/>
```

**같은 LoginForm 컴포넌트를 다양한 상황에서 다르게 사용 가능!**

---

#### 4️⃣ **상태 관리의 책임 소재 명확화**

**isLoading 상태 관리:**

```typescript
// page.tsx가 로딩 상태 관리 책임
const [isLoading, setIsLoading] = useState(false);

const handleLogin = async (data: LoginFormData) => {
  setIsLoading(true);   // ← 로딩 시작
  try {
    await login(data.email, data.password);
    router.push("/");
  } catch (error) {
    alert(error);
  } finally {
    setIsLoading(false); // ← 로딩 종료 (성공/실패 상관없이)
  }
};

const handleSignup = async (data: SignupFormData) => {
  setIsLoading(true);   // ← 같은 로딩 상태 공유
  // ...
};
```

**장점:**
```
✅ 로그인/회원가입 폼이 동시에 로딩 상태 공유
✅ 탭 전환 시에도 로딩 상태 유지
✅ 전역 로딩 인디케이터 구현 용이
```

---

### 📋 책임 분리 표

| 컴포넌트 | 역할 | 책임 | 알아야 하는 것 |
|----------|------|------|---------------|
| **page.tsx** | 비즈니스 로직 계층 | - API 호출<br>- 성공/실패 처리<br>- 리다이렉트<br>- 전역 상태 관리 | - useAuth() 훅<br>- 성공 후 이동 경로<br>- 에러 처리 방식<br>- 로딩 상태 |
| **LoginForm** | UI 로직 계층 | - 폼 렌더링<br>- 입력 검증<br>- 검증된 데이터 전달 | - 폼 필드 구조<br>- 검증 규칙<br>- onSuccess 콜백 |

---

### 🚫 안티패턴: LoginForm에 비즈니스 로직 포함

```typescript
// ❌ 절대 이렇게 하지 말 것!
function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      router.push("/");  // ← 하드코딩된 리다이렉트
    } catch (error) {
      alert(error);      // ← 고정된 에러 처리
    } finally {
      setIsLoading(false);
    }
  };

  return <form onSubmit={handleSubmit(onSubmit)}>...</form>;
}
```

**문제점:**
```
❌ LoginForm의 책임이 너무 많음 (SRP 위반)
   - 폼 검증 (원래 책임)
   - API 호출 (추가됨)
   - 리다이렉트 (추가됨)
   - 에러 처리 (추가됨)
   - 로딩 상태 (추가됨)

❌ 재사용 불가능
   - 다른 페이지에서 사용 시 "/" 경로로 고정됨
   - 에러 처리 방식 변경 불가

❌ 테스트 어려움
   - useAuth, useRouter 모킹 필요
   - 단위 테스트 복잡도 증가

❌ 유지보수 어려움
   - 리다이렉트 경로 변경 시 컴포넌트 수정
   - 에러 처리 방식 변경 시 컴포넌트 수정
```

---

### ✅ 올바른 패턴: 콜백 패턴 (Callback Pattern)

```typescript
// ✅ LoginForm: UI 로직만 책임
function LoginForm({ onSuccess, isLoading }: LoginFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

  const onSubmit = (data: LoginFormData) => {
    onSuccess(data);  // ← 검증된 데이터만 전달, 이후 처리는 부모 책임
  };

  return <form onSubmit={handleSubmit(onSubmit)}>...</form>;
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
      router.push("/");  // ← 여기서 경로 결정
    } catch (error) {
      alert(error);      // ← 여기서 에러 처리 방식 결정
    } finally {
      setIsLoading(false);
    }
  };

  return <LoginForm onSuccess={handleLogin} isLoading={isLoading} />;
}
```

**장점:**
```
✅ LoginForm은 순수한 UI 컴포넌트
   - props만 받아서 렌더링
   - 외부 의존성 최소화 (useAuth, useRouter 없음)

✅ page.tsx는 오케스트레이터(Orchestrator)
   - 여러 컴포넌트 조율
   - 비즈니스 로직 처리

✅ 명확한 데이터 흐름
   - 부모 → 자식: isLoading, onSuccess
   - 자식 → 부모: 검증된 데이터

✅ 재사용성 극대화
   - 다른 상황에서 다른 onSuccess 전달 가능
```

---

### 💡 실생활 비유: 음식점

```
┌─────────────────────────────────────────────┐
│          page.tsx = 매니저                   │
│                                             │
│  ✅ 역할:                                    │
│  - 손님 주문 받기                            │
│  - 주방에 전달                               │
│  - 음식 나오면 서빙                          │
│  - 계산 처리                                 │
│  - 문제 발생 시 해결                         │
│                                             │
└────────────────┬────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────┐
│       LoginForm = 주문서 양식                │
│                                             │
│  ✅ 역할:                                    │
│  - 메뉴 이름, 수량 입력란 제공               │
│  - 필수 항목 체크 (메뉴명, 수량)             │
│  - 작성된 주문서를 매니저에게 전달           │
│                                             │
│  ❌ 하지 않는 것:                            │
│  - 주방에 직접 가서 요리하지 않음            │
│  - 계산하지 않음                             │
│  - 서빙하지 않음                             │
│                                             │
└─────────────────────────────────────────────┘
```

**만약 주문서가 모든 일을 한다면?**
```
❌ 주문서가 직접 주방에 가서 요리하고
❌ 계산까지 하는 것과 같음
❌ 주문서의 책임이 너무 많아짐!
```

---

### 🎓 핵심 정리

#### 왜 handleLogin/handleSignup이 page.tsx에 있는가?

**1. 단일 책임 원칙 (SRP)**
```
LoginForm = UI + 검증만 책임
page.tsx = 비즈니스 로직 책임
```

**2. 재사용성**
```
같은 LoginForm을 다양한 상황에서 다르게 사용
(홈 이동 / 모달 닫기 / 체크아웃 진행 등)
```

**3. 유지보수성**
```
리다이렉트 경로 변경 → page.tsx만 수정
에러 처리 방식 변경 → page.tsx만 수정
LoginForm은 건드리지 않음
```

**4. 테스트 용이성**
```
LoginForm: 순수 함수 테스트 (props → 렌더링)
page.tsx: 비즈니스 로직 테스트 (API, 리다이렉트)
```

---

### 📐 설계 원칙

**React 컴포넌트 설계 시 항상 물어보기:**
```
1. 이 컴포넌트의 단 하나의 책임은 무엇인가?
2. 이 컴포넌트를 다른 곳에서 재사용할 수 있는가?
3. props만 바꿔서 다른 동작을 할 수 있는가?
4. 외부 의존성(훅, API)이 최소화되어 있는가?
```

**정답:**
```
✅ LoginForm의 단 하나의 책임: "로그인 입력 받고 검증하기"
✅ 재사용 가능: 모달, 페이지, 관리자 페이지 등 어디서든
✅ props로 동작 변경: onSuccess 콜백으로 다른 처리 가능
✅ 의존성 최소화: useForm만 사용, useAuth/useRouter 없음
```

---

## 🔄 다음 학습 예정

- [x] React Hook Form으로 로그인/회원가입 폼 구현
- [x] 비즈니스 로직과 UI 로직 분리 원칙 이해
- [ ] layout.tsx에 AuthProvider 추가
- [ ] Axios 인터셉터에 JWT 토큰 자동 추가
- [ ] 보호된 라우트 (ProtectedRoute) 구현
- [ ] 네비게이션에 로그인 상태 표시
- [ ] 토큰 갱신 (Refresh Token) 로직
