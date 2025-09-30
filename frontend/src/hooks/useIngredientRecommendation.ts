"use client";

import { generateRecipe } from "@/lib/api/recipes";
import { RecipeData } from "@/types/recipe";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export function useIngredientRecommendation() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState("");
  const [recipes, setRecipes] = useState<RecipeData[]>([]);

  const mutation = useMutation({
    mutationFn: generateRecipe,
    onSuccess: (data) => {
      // API 응답에서 레시피 데이터 추출
      setRecipes([data.data]);
    },
    onError: (error) => {
      console.error("레시피 생성 실패: ", error);
      alert("레시피 생성에 실패했습니다. 다시 시도해주세요.");
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

    mutation.mutate({
      ingredients,
      provider: "openai",
    });
  };

  return {
    // 상태
    ingredients,
    currentIngredient,
    isLoading: mutation.isPending, // TanStack Query의 로딩 상태
    recipes,
    // 액션
    setCurrentIngredient,
    addIngredient,
    removeIngredient,
    getRecommendations,
  };
}
