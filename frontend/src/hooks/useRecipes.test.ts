import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRecipes } from "./useRecipes";
import * as recipeApi from "@/lib/api/recipes";
import { mockRecipes } from "@/test/mockData";

// API 모킹
vi.mock("@/lib/api/recipes");

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("useRecipes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch recipes successfully", async () => {
    // Given: API가 성공적으로 레시피를 반환
    const mockResponse = {
      recipes: mockRecipes,
      total: 3,
      page: 1,
      limit: 10,
    };
    vi.mocked(recipeApi.getRecipes).mockResolvedValue(mockResponse);

    // When: useRecipes 훅을 호출
    const { result } = renderHook(() => useRecipes(1, 10), {
      wrapper: createWrapper(),
    });

    // Then: 초기 로딩 상태
    expect(result.current.isLoading).toBe(true);

    // Then: 데이터 로드 완료
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.data?.recipes).toHaveLength(3);
  });

  it("should fetch recipes with search query", async () => {
    // Given: 검색어가 있는 경우
    const searchQuery = "토마토";
    const mockResponse = {
      recipes: [mockRecipes[0]],
      total: 1,
      page: 1,
      limit: 10,
    };
    vi.mocked(recipeApi.getRecipes).mockResolvedValue(mockResponse);

    // When: 검색어와 함께 훅 호출
    const { result } = renderHook(
      () => useRecipes(1, 10, searchQuery, null),
      { wrapper: createWrapper() }
    );

    // Then: API가 검색어와 함께 호출됨
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(recipeApi.getRecipes).toHaveBeenCalledWith(
      1,
      10,
      searchQuery,
      null
    );
    expect(result.current.data?.recipes).toHaveLength(1);
  });

  it("should fetch recipes with category filter", async () => {
    // Given: 카테고리 필터가 있는 경우
    const category = "양식";
    const mockResponse = {
      recipes: [mockRecipes[0]],
      total: 1,
      page: 1,
      limit: 10,
    };
    vi.mocked(recipeApi.getRecipes).mockResolvedValue(mockResponse);

    // When: 카테고리와 함께 훅 호출
    const { result } = renderHook(
      () => useRecipes(1, 10, undefined, category),
      { wrapper: createWrapper() }
    );

    // Then: API가 카테고리와 함께 호출됨
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(recipeApi.getRecipes).toHaveBeenCalledWith(
      1,
      10,
      undefined,
      category
    );
  });

  it("should handle API error", async () => {
    // Given: API가 에러를 반환
    const errorMessage = "서버 에러";
    vi.mocked(recipeApi.getRecipes).mockRejectedValue(
      new Error(errorMessage)
    );

    // When: 훅 호출
    const { result } = renderHook(() => useRecipes(1, 10), {
      wrapper: createWrapper(),
    });

    // Then: 에러 상태 확인
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
  });

  it("should cache data with correct queryKey", async () => {
    // Given: API 호출 성공
    const mockResponse = {
      recipes: mockRecipes,
      total: 3,
      page: 1,
      limit: 10,
    };
    vi.mocked(recipeApi.getRecipes).mockResolvedValue(mockResponse);

    // When: 동일한 파라미터로 두 번 호출
    const { result: result1 } = renderHook(() => useRecipes(1, 10), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result1.current.isSuccess).toBe(true));

    const { result: result2 } = renderHook(() => useRecipes(1, 10), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result2.current.isSuccess).toBe(true));

    // Then: API는 한 번만 호출됨 (캐싱)
    expect(recipeApi.getRecipes).toHaveBeenCalledTimes(1);
  });
});
