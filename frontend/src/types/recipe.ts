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
  userId?: number;
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
