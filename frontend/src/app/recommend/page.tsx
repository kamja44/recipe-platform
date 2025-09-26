"use client";

import { IngredientsInput } from "@/components/forms/IngredientsInput";
import { RecommendationResults } from "@/components/cards/RecommendationResults";
import { useIngredientRecommendation } from "@/hooks/useIngredientRecommendation";

export default function RecommendPage() {
  const {
    ingredients,
    currentIngredient,
    isLoading,
    recipes,
    setCurrentIngredient,
    addIngredient,
    removeIngredient,
    getRecommendations,
  } = useIngredientRecommendation();

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">🤖 AI 레시피 추천</h1>
        <p className="text-lg text-muted-foreground">
          냉장고에 있는 재료를 입력하고 AI가 추천하는 맞춤 레시피를 받아보세요
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <IngredientsInput
          ingredients={ingredients}
          currentIngredient={currentIngredient}
          onCurrentIngredientChange={setCurrentIngredient}
          onAddIngredient={addIngredient}
          onRemoveIngredient={removeIngredient}
          onGetRecommendations={getRecommendations}
          isLoading={isLoading}
        />

        <RecommendationResults recipes={recipes} isLoading={isLoading} />
      </div>
    </div>
  );
}
