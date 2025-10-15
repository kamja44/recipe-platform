import {
  AIRecipeResponse,
  CreateRecipeRequest,
  GenerateRecipeRequest,
  SavedRecipe,
} from "@/types/recipe";
import { apiClient } from "./client";
import { RecipeDetail } from "@/types/common";

/**
 * AI 레시피 생성 API 호출
 * @param data 재료 목록 및 선호사항
 * @returns AI가 생성한 레시피 데이터
 */
export const generateRecipe = async (
  data: GenerateRecipeRequest
): Promise<AIRecipeResponse> => {
  const response = await apiClient.post<AIRecipeResponse>(
    "/recipes/generate-ai",
    data
  );
  return response.data;
};

/**
 * 레시피 저장 API 호출
 * @param data 저장할 레시피 데이터
 * @returns 저장된 레시피 데이터
 */
export const saveRecipe = async (
  data: CreateRecipeRequest
): Promise<SavedRecipe> => {
  const response = await apiClient.post<SavedRecipe>("/recipes", data);
  return response.data;
};

/**
 * 레시피 목록 조회 API 호출
 * @param page 페이지 번호
 * @param limit 페이지당 항목 수
 * @param searchQuery 재료 검색어 (선택)
 * @param category 카테고리 (선택)
 * @returns 레시피 목록
 */
export const getRecipes = async (
  page = 1,
  limit = 10,
  searchQuery?: string,
  category?: string | null
) => {
  // 검색어나 카테고리가 있으면 다른 엔드포인트 사용
  if (searchQuery) {
    // 재료로 검색
    const response = await apiClient.get<SavedRecipe[]>(
      `/recipes/search/ingredient`,
      {
        params: { q: searchQuery },
      }
    );

    // BE가 배열만 반환하기에, 페이지네이션 형식으로 변환
    return {
      data: response.data,
      total: response.data.length,
      page: 1,
      limit: response.data.length,
    };
  }

  if (category) {
    // 카테고리로 필터링
    const response = await apiClient.get<SavedRecipe[]>(
      `/recipes/category/${category}`
    );
    return {
      data: response.data,
      total: response.data.length,
      page: 1,
      limit: response.data.length,
    };
  }

  // 기본 목록 조회(페이지네이션)
  const response = await apiClient.get<{
    data: SavedRecipe[];
    total: number;
    page: number;
    limit: number;
  }>("/recipes", {
    params: {
      page,
      limit,
    },
  });
  return response.data;
};

// 레시피 상세 조회
export const getRecipeById = async (id: number): Promise<RecipeDetail> => {
  const response = await apiClient.get<RecipeDetail>(`/recipes/${id}`);
  return response.data;
};

// 레시피 저장
export const createRecipe = async (
  data: CreateRecipeRequest
): Promise<SavedRecipe> => {
  const response = await apiClient.post<SavedRecipe>(`/recipes`, data);
  return response.data;
};

/**
 * 레시피 수정 API 호출
 * @param id 레시피 ID
 * @param data 수정할 데이터
 * @returns 수정된 레시피
 */
export const updateRecipe = async (
  id: number,
  data: Partial<CreateRecipeRequest>
): Promise<SavedRecipe> => {
  const response = await apiClient.patch<SavedRecipe>(`/recipes/${id}`, data);
  return response.data;
};

/**
 * 레시피 삭제 API 호출
 * @param id 레시피 ID
 */
export const deleteRecipe = async (id: number): Promise<void> => {
  await apiClient.delete(`/recipes/${id}`);
};
