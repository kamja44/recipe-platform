import { AIRecipeResponse, GenerateRecipeRequest } from "@/types/recipe";
import { apiClient } from "./client";

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
