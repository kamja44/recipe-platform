"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { RecipeHeader } from "@/components/recipe/RecipeHeader";
import { RecipeIngredients } from "@/components/recipe/RecipeIngredients";
import { RecipeNutrition } from "@/components/recipe/RecipeNutrition";
import { RecipeInstructions } from "@/components/recipe/RecipeInstructions";
import { RecipeTips } from "@/components/recipe/RecipeTips";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getRecipeById } from "@/lib/api/recipes";
import { LoadingState } from "@/components/common/LoadingState";

export default function RecipeDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const {
    data: recipe,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["recipe", id],
    queryFn: () => getRecipeById(id),
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <LoadingState message="레시피를 불러오는 중...">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        </LoadingState>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">레시피를 찾을 수 없습니다</h1>
        <p className="text-muted-foreground mb-8">
          {error instanceof Error
            ? error.message
            : "요청하신 레시피가 존재하지 않습니다."}
        </p>
        <Link href="/recipes">
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" />
            레시피 목록으로 돌아가기
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <RecipeHeader recipe={recipe} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 재료 */}
        <div className="lg:col-span-1">
          <RecipeIngredients
            ingredients={recipe.ingredients}
            servings={recipe.servings}
          />

          {/* 영양 정보 */}
          {recipe.nutrition && (
            <div className="mt-6">
              <RecipeNutrition nutrition={recipe.nutrition} />
            </div>
          )}
        </div>

        {/* 조리법 & 팁 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 조리 순서 */}
          <RecipeInstructions instructions={recipe.instructions} />
          {/* 요리 팁 */}
          {recipe.tips && recipe.tips.length > 0 && (
            <RecipeTips tips={recipe.tips} />
          )}
        </div>
      </div>
    </div>
  );
}
