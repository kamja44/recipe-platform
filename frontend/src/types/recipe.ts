// AI 레시피 생성 요청 DTO
export interface GenerateRecipeRequest {
  ingredients: string[];
  preferences?: string;
  provider?: "openai" | "claude";
}

// AI 레시피 생성 응답 DTO
export interface AIRecipeResponse {
  success: boolean;
  message: string;
  data: RecipeData;
}

// 레시피 데이터
export interface RecipeData {
  recipe_name: string;
  ingredients_list: string[];
  instructions: string[];
  cooking_time: string;
  difficulty: string;
  raw_response: string;
}
