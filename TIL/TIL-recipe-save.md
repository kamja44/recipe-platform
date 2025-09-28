# TIL - AI 생성 레시피 저장 및 데이터 파싱

## 📚 목차
1. [학습 개요](#학습-개요)
2. [레시피 상세 페이지 실제 데이터 연동](#레시피-상세-페이지-실제-데이터-연동)
3. [AI 응답 텍스트 파싱](#ai-응답-텍스트-파싱)
4. [TanStack Query Mutation](#tanstack-query-mutation)
5. [리다이렉트 처리](#리다이렉트-처리)
6. [핵심 개념 정리](#핵심-개념-정리)

---

## 학습 개요

**목표:** AI가 생성한 텍스트 레시피를 DB에 저장하고, 저장된 레시피를 조회하는 기능 구현

**완성된 플로우:**
```
1. 사용자가 재료 입력
2. AI가 스트리밍으로 레시피 생성
3. "레시피 저장하기" 버튼 클릭
4. AI 텍스트 → 구조화된 데이터로 파싱
5. Backend API 호출하여 DB 저장
6. 저장 성공 시 레시피 상세 페이지로 이동
7. 실제 DB 데이터로 레시피 표시
```

---

## 레시피 상세 페이지 실제 데이터 연동

### 문제 상황

레시피 상세 페이지(`/recipes/[id]`)가 하드코딩된 목업 데이터를 사용하고 있었습니다.

```typescript
// ❌ 기존 방식: 하드코딩된 데이터
const getRecipeById = (id: string) => {
  const recipes = {
    "1": { title: "감자 베이컨 볶음", ... },
    "2": { title: "양파 감자 수프", ... },
  };
  return recipes[id];
};
```

### 해결: TanStack Query로 API 연동

**frontend/src/lib/api/recipes.ts:**
```typescript
import { RecipeDetail } from "@/types/common";
import { apiClient } from "./client";

// 레시피 상세 조회
export const getRecipeById = async (id: number): Promise<RecipeDetail> => {
  const response = await apiClient.get<RecipeDetail>(`/recipes/${id}`);
  return response.data;
};
```

**frontend/src/app/recipes/[id]/page.tsx:**
```typescript
"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getRecipeById } from "@/lib/api/recipes";

export default function RecipeDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  // ✅ TanStack Query로 데이터 페칭
  const { data: recipe, isLoading, error } = useQuery({
    queryKey: ['recipe', id],
    queryFn: () => getRecipeById(id),
  });

  if (isLoading) return <LoadingState />;
  if (error || !recipe) return <ErrorState />;

  return <RecipeDetailUI recipe={recipe} />;
}
```

### TanStack Query의 장점

```
┌──────────────────────────────────────────────────────┐
│            useEffect vs TanStack Query               │
└──────────────────────────────────────────────────────┘

❌ useEffect 방식:
  - useState로 loading, error, data 각각 관리
  - useEffect로 데이터 페칭
  - 의존성 배열 관리
  - 캐싱 없음 (매번 새로 요청)
  - 수동 에러 처리

✅ TanStack Query:
  - 한 줄로 loading, error, data 관리
  - 자동 캐싱 (같은 레시피 재방문 시 즉시 표시)
  - 자동 리페치 (창 포커스 시)
  - 선언적 API
  - devtools로 디버깅 가능
```

**코드 비교:**

```typescript
// ❌ useEffect 방식 (복잡함)
const [recipe, setRecipe] = useState(null);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const fetchRecipe = async () => {
    try {
      setIsLoading(true);
      const data = await getRecipeById(id);
      setRecipe(data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };
  fetchRecipe();
}, [id]);

// ✅ TanStack Query (간결함)
const { data: recipe, isLoading, error } = useQuery({
  queryKey: ['recipe', id],
  queryFn: () => getRecipeById(id),
});
```

---

## AI 응답 텍스트 파싱

### 문제: AI 텍스트를 구조화된 데이터로 변환

AI는 다음과 같은 자유형식 텍스트를 생성합니다:

```
요리명: 토란 만두
재료: 토란, 계란, 감자, 만두피
조리법:
1. 먼저 토란을 깨끗이 씻고 껍질을 벗긴 뒤 감자와 함께 다져줍니다.
2. 간장과 소금, 후추로 간을 해준 후 계란을 넣고 골고루 섞어줍니다.
3. 만두피 위에 토란과 감자 혼합재료를 올리고 돌돌 말아 만두 모양을 만들어줍니다.
조리시간: 30분
난이도: 쉬움
```

Backend는 구조화된 데이터를 기대합니다:

```typescript
{
  title: "토란 만두",
  description: "토란 만두를 만들어보세요",
  ingredients: ["토란", "계란", "감자", "만두피"],  // 배열
  instructions: [
    "먼저 토란을 깨끗이 씻고 껍질을 벗긴 뒤 감자와 함께 다져줍니다.",
    "간장과 소금, 후추로 간을 해준 후 계란을 넣고 골고루 섞어줍니다.",
    // ...
  ],
  cookTime: 30,  // 숫자
  difficulty: "쉬움",
}
```

### 해결: 정규표현식 파싱 함수

**frontend/src/lib/utils/parseRecipe.ts:**

```typescript
// AI 텍스트 응답을 구조화된 데이터로 파싱
export function parseAIRecipe(text: string) {
  // 1. 요리명 추출
  const titleMatch = text.match(/(?:요리명|레시피명):\s*(.+)/);
  const title = titleMatch ? titleMatch[1].trim() : "AI 추천 레시피";

  // 2. 설명 생성
  const description = title + "를 만들어보세요";

  // 3. 재료 추출
  const ingredientsMatch = text.match(
    /재료:\s*([\s\S]*?)(?=조리법|만드는법|조리순서|$)/
  );

  let ingredients: string[] = [];
  if (ingredientsMatch) {
    const rawIngredients = ingredientsMatch[1]
      .split("\n")
      .map((line) => line.replace(/^[-\s*]+/, "").trim())
      .filter((line) => line && line !== "-");

    // 쉼표로 구분된 경우 처리
    ingredients = rawIngredients.flatMap(line =>
      line.includes(',') ? line.split(',').map(item => item.trim()) : [line]
    ).filter(item => item);
  }

  // 4. 조리법 추출
  const instructionsMatch = text.match(
    /(?:조리법|만드는법|조리순서):\s*([\s\S]*?)(?=조리시간|난이도|$)/
  );
  const instructions = instructionsMatch
    ? instructionsMatch[1]
        .split("\n")
        .map((line) => line.replace(/^[-\d.\s)]+/, "").trim())
        .filter((line) => line && line !== "-")
    : [];

  // 5. 조리시간 추출
  const timeMatch = text.match(/조리시간:\s*(\d+)/);
  const cookTime = timeMatch ? parseInt(timeMatch[1]) : 30;

  // 6. 난이도 추출
  const difficultyMatch = text.match(/난이도:\s*(.+)/);
  const difficulty = difficultyMatch ? difficultyMatch[1].trim() : "보통";

  // 7. 인분 추출
  const servingsMatch = text.match(/(\d+)인분/);
  const servings = servingsMatch ? parseInt(servingsMatch[1]) : 2;

  return {
    title,
    description,
    ingredients,
    instructions,
    cookTime,
    servings,
    difficulty,
  };
}
```

### 핵심 패턴 분석

#### 1. 정규표현식 기본 패턴

```typescript
/요리명:\s*(.+)/
```

- `요리명:` - 리터럴 텍스트 매칭
- `\s*` - 0개 이상의 공백 (유연성)
- `(.+)` - 캡처 그룹: 1개 이상의 모든 문자

#### 2. 여러 키워드 매칭

```typescript
/(?:요리명|레시피명):\s*(.+)/
```

- `(?:...)` - 비캡처 그룹 (그룹화만, 캡처는 안 함)
- `요리명|레시피명` - OR 연산자

#### 3. 멀티라인 매칭

```typescript
/재료:\s*([\s\S]*?)(?=조리법|만드는법|조리순서|$)/
```

- `[\s\S]*?` - 모든 문자 (공백 포함) 최소 매칭
  - `\s` - 공백 문자
  - `\S` - 비공백 문자
  - `*?` - 0개 이상, 최소 매칭 (lazy)
- `(?=...)` - Lookahead: 뒤에 나올 패턴 (매칭에 포함 안 됨)
- `$` - 문자열 끝

**왜 `.*` 대신 `[\s\S]*?`?**

```typescript
// ❌ .은 개행 문자(\n)를 매칭하지 않음
/재료:\s*(.*?)(?=조리법)/

// ✅ [\s\S]는 모든 문자 (개행 포함)
/재료:\s*([\s\S]*?)(?=조리법)/
```

#### 4. 숫자 추출

```typescript
/조리시간:\s*(\d+)/
```

- `\d+` - 1개 이상의 숫자
- `parseInt()` - 문자열 → 숫자 변환

#### 5. 배열 분리 및 정제

```typescript
ingredientsMatch[1]
  .split("\n")                                // 줄바꿈으로 분리
  .map((line) => line.replace(/^[-\s*]+/, "").trim())  // 앞의 -, *, 공백 제거
  .filter((line) => line && line !== "-")    // 빈 줄, "-"만 있는 줄 제거
```

**단계별 처리:**
```
입력:
"- 토란\n- 계란\n\n- 감자"

.split("\n"):
["- 토란", "- 계란", "", "- 감자"]

.map(line => line.replace(/^[-\s*]+/, "").trim()):
["토란", "계란", "", "감자"]

.filter(line => line && line !== "-"):
["토란", "계란", "감자"]
```

#### 6. 쉼표 구분 재료 처리 (핵심!)

**문제:**
```
AI 응답: "재료: 토란, 계란, 감자, 만두피"
파싱 결과: ["토란, 계란, 감자, 만두피"]  // ❌ 하나의 문자열
```

**해결: flatMap 활용**

```typescript
ingredients = rawIngredients.flatMap(line =>
  line.includes(',') ? line.split(',').map(item => item.trim()) : [line]
).filter(item => item);
```

**flatMap 동작 원리:**

```
┌────────────────────────────────────────────────┐
│              Array.flatMap()                   │
└────────────────────────────────────────────────┘

입력: ["토란, 계란, 감자, 만두피"]

.flatMap(line => {
  if (line.includes(',')) {
    return line.split(',').map(item => item.trim());
    // ["토란", "계란", "감자", "만두피"]
  } else {
    return [line];
  }
})

결과: ["토란", "계란", "감자", "만두피"]  // ✅ 평탄화됨
```

**일반 map vs flatMap 비교:**

```typescript
// ❌ 일반 map (중첩 배열 생성)
const result = rawIngredients.map(line =>
  line.includes(',') ? line.split(',') : [line]
);
// [["토란", "계란", "감자", "만두피"]]  // 2차원 배열

// ✅ flatMap (평탄화)
const result = rawIngredients.flatMap(line =>
  line.includes(',') ? line.split(',') : [line]
);
// ["토란", "계란", "감자", "만두피"]  // 1차원 배열
```

**flatMap 시각화:**

```
rawIngredients: ["토란, 계란", "만두피"]
                    ↓
        flatMap(line => ...)
                    ↓
    line 1: "토란, 계란" → split(',') → ["토란", "계란"]
    line 2: "만두피"     → [line]     → ["만두피"]
                    ↓
              자동 평탄화
                    ↓
        ["토란", "계란", "만두피"]
```

---

## TanStack Query Mutation

### Query vs Mutation

```
┌──────────────────────────────────────────────────┐
│        TanStack Query 패턴 구분                   │
└──────────────────────────────────────────────────┘

useQuery:
  - 데이터 읽기 (GET)
  - 자동 캐싱
  - 자동 리페치
  예시: 레시피 조회, 목록 조회

useMutation:
  - 데이터 쓰기 (POST, PUT, DELETE)
  - 캐싱 안 함
  - 수동 호출 (mutate 함수)
  예시: 레시피 생성, 수정, 삭제
```

### 레시피 저장 Mutation 구현

**frontend/src/app/recommend/page.tsx:**

```typescript
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createRecipe } from "@/lib/api/recipes";

export default function RecommendPage() {
  const router = useRouter();

  // 레시피 저장 mutation
  const { mutate: saveRecipe, isPending: isSaving } = useMutation({
    mutationFn: createRecipe,
    onSuccess: (savedRecipe) => {
      // 저장 성공 시 상세 페이지로 이동
      router.push(`/recipes/${savedRecipe.id}`);
    },
    onError: (error) => {
      alert(`저장 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    },
  });

  const handleSaveRecipe = () => {
    const parsedRecipe = parseAIRecipe(recipe);

    // 필수 필드 검증
    if (parsedRecipe.ingredients.length === 0) {
      alert('재료를 파싱할 수 없습니다.');
      return;
    }

    // mutation 실행
    saveRecipe({
      title: parsedRecipe.title,
      description: parsedRecipe.description,
      ingredients: parsedRecipe.ingredients,
      instructions: parsedRecipe.instructions,
      // ...
    });
  };

  return (
    <>
      {recipe && !isStreaming && (
        <Button onClick={handleSaveRecipe} disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "저장 중..." : "레시피 저장하기"}
        </Button>
      )}
    </>
  );
}
```

### useMutation 파라미터 설명

```typescript
useMutation({
  mutationFn: createRecipe,     // 실행할 함수
  onSuccess: (data) => {},       // 성공 시 콜백
  onError: (error) => {},        // 실패 시 콜백
  onSettled: () => {},           // 성공/실패 관계없이 항상 실행
})
```

**반환 값:**
```typescript
const {
  mutate,        // mutation 실행 함수
  isPending,     // 로딩 상태
  isSuccess,     // 성공 상태
  isError,       // 에러 상태
  data,          // 응답 데이터
  error,         // 에러 객체
} = useMutation({...});
```

### mutation 실행 플로우

```
사용자가 "저장하기" 버튼 클릭
         ↓
handleSaveRecipe() 실행
         ↓
AI 텍스트 파싱 (parseAIRecipe)
         ↓
필수 필드 검증
         ↓
saveRecipe(data) 호출  ← mutate 함수
         ↓
isPending = true (버튼 비활성화)
         ↓
createRecipe(data) 실행 (Backend API 호출)
         ↓
   ┌────┴────┐
   성공      실패
    ↓         ↓
onSuccess  onError
    ↓         ↓
router.push() alert()
```

---

## 리다이렉트 처리

### Next.js App Router의 리다이렉트

**useRouter vs redirect:**

```typescript
// ✅ 클라이언트 컴포넌트: useRouter
"use client";
import { useRouter } from "next/navigation";

const router = useRouter();
router.push('/recipes/1');  // 클라이언트 사이드 네비게이션

// ✅ 서버 컴포넌트: redirect
import { redirect } from "next/navigation";

redirect('/recipes/1');  // 서버 사이드 리다이렉트
```

### 저장 성공 후 리다이렉트

```typescript
const { mutate: saveRecipe } = useMutation({
  mutationFn: createRecipe,
  onSuccess: (savedRecipe) => {
    // Backend가 생성된 레시피를 { id, title, ... } 형태로 반환
    router.push(`/recipes/${savedRecipe.id}`);
  },
});
```

**플로우:**
```
레시피 저장
    ↓
Backend 응답: { id: 5, title: "토란 만두", ... }
    ↓
onSuccess(savedRecipe)
    ↓
router.push('/recipes/5')
    ↓
레시피 상세 페이지로 이동
    ↓
useQuery로 /recipes/5 조회
    ↓
방금 저장한 레시피 표시
```

---

## 핵심 개념 정리

### 1. TanStack Query 패턴

| 작업 | 사용 훅 | 실행 방식 | 캐싱 |
|-----|---------|----------|------|
| 읽기 (GET) | `useQuery` | 자동 | ✅ |
| 쓰기 (POST/PUT/DELETE) | `useMutation` | 수동 (`mutate`) | ❌ |

### 2. 정규표현식 핵심 패턴

| 패턴 | 의미 | 사용 예시 |
|-----|------|----------|
| `\s*` | 0개 이상의 공백 | `요리명:\s*(.+)` |
| `(.+)` | 캡처 그룹 (1개 이상 문자) | `요리명:\s*(.+)` |
| `(?:...)` | 비캡처 그룹 | `(?:요리명\|레시피명)` |
| `[\s\S]*?` | 모든 문자 최소 매칭 | `재료:\s*([\s\S]*?)` |
| `(?=...)` | Lookahead | `(?=조리법)` |
| `\d+` | 1개 이상의 숫자 | `(\d+)분` |

### 3. flatMap 활용

```typescript
// 쉼표 구분 문자열을 배열로 변환하면서 평탄화
rawIngredients.flatMap(line =>
  line.includes(',') ? line.split(',').map(item => item.trim()) : [line]
)
```

### 4. 데이터 파싱 파이프라인

```
AI 텍스트
    ↓ 정규표현식 매칭
원시 데이터 추출
    ↓ split('\n')
줄바꿈 분리
    ↓ map(line => line.replace(...))
접두사 제거
    ↓ filter(line => line)
빈 줄 제거
    ↓ flatMap (쉼표 구분 처리)
최종 배열
```

### 5. Backend 검증과 Frontend 검증

```
Frontend:
  - 파싱 성공 여부 확인
  - 필수 필드 빈 배열 체크
  - 사용자에게 즉시 피드백

Backend:
  - DTO 검증 (@IsNotEmpty, @ArrayNotEmpty)
  - 타입 검증 (@IsString, @IsNumber)
  - 비즈니스 로직 검증 (예: 재료 최소 2개)
```

---

## 트러블슈팅

### 문제 1: 400 Bad Request

**증상:**
```
저장 실패: Request failed with status code 400
```

**원인:**
- Backend는 `ingredients: ["토란", "계란"]` 기대
- Frontend가 `ingredients: ["토란, 계란"]` 전송 (하나의 문자열)

**해결:**
```typescript
// flatMap으로 쉼표 구분 문자열 분리
ingredients = rawIngredients.flatMap(line =>
  line.includes(',') ? line.split(',').map(item => item.trim()) : [line]
);
```

### 문제 2: 빈 배열 저장 실패

**증상:**
```
저장 실패: ingredients must not be empty
```

**원인:**
- AI 응답 형식이 예상과 다름
- 정규표현식이 매칭 실패

**해결:**
```typescript
// 저장 전 검증
if (parsedRecipe.ingredients.length === 0) {
  alert('재료를 파싱할 수 없습니다. AI 응답 형식을 확인해주세요.');
  return;
}
```

### 문제 3: 타입 에러

**증상:**
```
Property 'image' does not exist on type 'Recipe'
```

**원인:**
- `RecipeHeader`가 `Recipe` 타입을 받는데 `image` 필드 없음
- `RecipeDetail` 타입을 사용해야 함

**해결:**
```typescript
// RecipeHeader.tsx
interface RecipeHeaderProps {
  recipe: RecipeDetail;  // Recipe → RecipeDetail
}
```

---

## 마무리

### 학습한 내용
1. ✅ TanStack Query로 실제 데이터 연동
2. ✅ useQuery vs useMutation 차이
3. ✅ 정규표현식으로 AI 텍스트 파싱
4. ✅ flatMap으로 배열 평탄화 및 변환
5. ✅ Frontend 검증 + Backend 검증 이중 방어
6. ✅ mutation 성공 후 리다이렉트
7. ✅ 디버깅 방법 (console.log로 파싱 결과 확인)

### 다음 학습 목표
- [ ] 레시피 수정/삭제 기능 (PUT, DELETE mutation)
- [ ] Optimistic Update (낙관적 업데이트)
- [ ] Query Invalidation (캐시 무효화)
- [ ] React Hook Form으로 폼 검증 강화
- [ ] 파싱 실패 시 수동 입력 UI

---

**작성일:** 2024-10-01
**작성자:** AI Recipe Platform Team
