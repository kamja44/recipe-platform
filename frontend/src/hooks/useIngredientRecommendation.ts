"use client";

import { generateRecipe, saveRecipe } from "@/lib/api/recipes";
import { CreateRecipeRequest, RecipeData } from "@/types/recipe";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

// RecipeData를 CreateRecipeRequest로 변환하는 함수
function convertToCreateRecipeRequest(
  recipeData: RecipeData
): CreateRecipeRequest {
  // cooking_time에서 숫자 추출
  const cookTimeMatch = recipeData.cooking_time.match(/\d+/);
  const cookTime = cookTimeMatch ? parseInt(cookTimeMatch[0]) : undefined;

  return {
    title: recipeData.recipe_name,
    description: `${recipeData.difficulty} 난이도의 레시피입니다.`,
    ingredients: recipeData.ingredients_list,
    instructions: recipeData.instructions,
    difficulty: recipeData.difficulty,
    cookTime: cookTime,
    servings: 2, // 기본값
    category: "AI 생성", // 기본값
  };
}

export function useIngredientRecommendation() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState("");
  const [recipes, setRecipes] = useState<RecipeData[]>([]);

  // AI 레시피 생성 mutation
  const generateMutation = useMutation({
    mutationFn: generateRecipe,
    onSuccess: (data) => {
      setRecipes([data.data]);
    },
    onError: (error) => {
      console.error("레시피 생성 실패: ", error);
      alert("레시피 생성에 실패했습니다. 다시 시도해주세요.");
    },
  });

  // 레시피 저장 mutation
  const saveMutation = useMutation({
    mutationFn: saveRecipe,
    onSuccess: () => {
      alert("레시피가 성공적으로 저장되었습니다!");
    },
    onError: (error) => {
      console.error("레시피 저장 실패: ", error);
      alert("레시피 저장에 실패했습니다. 다시 시도해주세요.");
    },
  });

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

  const getRecommendations = () => {
    if (ingredients.length === 0) {
      return;
    }

    generateMutation.mutate({
      ingredients,
      provider: "openai",
    });
  };

  const handleSaveRecipe = (recipe: RecipeData) => {
    const createRecipeRequest = convertToCreateRecipeRequest(recipe);
    // 디버깅: 파싱된 데이터 확인
    console.log("파싱된 레시피:", createRecipeRequest);
    console.log("재료:", createRecipeRequest.ingredients);
    console.log("조리법:", createRecipeRequest.instructions);

    // 검증: 필수 필드 체크
    if (createRecipeRequest.ingredients.length === 0) {
      alert("재료를 파싱할 수 없습니다. AI 응답 형식을 확인해주세요.");
      return;
    }

    if (createRecipeRequest.instructions.length === 0) {
      alert("조리법을 파싱할 수 없습니다. AI 응답 형식을 확인해주세요.");
      return;
    }
    saveMutation.mutate(createRecipeRequest);
  };

  return {
    // 상태
    ingredients,
    currentIngredient,
    isLoading: generateMutation.isPending, // TanStack Query의 로딩 상태
    isSaving: saveMutation.isPending,
    recipes,
    // 액션
    setCurrentIngredient,
    addIngredient,
    removeIngredient,
    getRecommendations,
    handleSaveRecipe,
  };
}
