"use client";

import { useState } from "react";
import { Recipe } from "@/types/common";

export function useIngredientRecommendation() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

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

  const getRecommendations = async () => {
    if (ingredients.length === 0) return;

    setIsLoading(true);
    // TODO: 실제 API 호출로 교체
    setTimeout(() => {
      const mockRecipes: Recipe[] = [
        {
          id: 1,
          title: "감자 베이컨 볶음",
          description: "감자와 베이컨을 활용한 간단한 요리",
          cookTime: 20,
          servings: 2,
          difficulty: "쉬움",
        },
        {
          id: 2,
          title: "양파 감자 수프",
          description: "따뜻하고 든든한 수프 요리",
          cookTime: 30,
          servings: 4,
          difficulty: "보통",
        },
      ];
      setRecipes(mockRecipes);
      setIsLoading(false);
    }, 2000);
  };

  return {
    // 상태
    ingredients,
    currentIngredient,
    isLoading,
    recipes,
    // 액션
    setCurrentIngredient,
    addIngredient,
    removeIngredient,
    getRecommendations,
  };
}
