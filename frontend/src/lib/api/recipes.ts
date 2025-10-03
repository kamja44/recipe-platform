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
 * @returns 레시피 목록
 */
export const getRecipes = async (page = 1, limit = 10) => {
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
