"use client";

import { ChefHat } from "lucide-react";
import { PageTitleSection } from "@/components/sections/PageTitleSection";
import { RecipeGrid } from "@/components/recipe/RecipeGrid";
import { EmptyState } from "@/components/common/EmptyState";
import { useRecipes } from "@/hooks/useRecipes";
import { LoadingState } from "@/components/common/LoadingState";

export default function RecipesPage() {
  const { data, isLoading, error } = useRecipes(1, 10);

  const recipes = data?.data || [];
  return (
    <div className="container mx-auto px-4 py-8">
      <PageTitleSection
        title="📖 레시피 모음"
        description="다양한 요리 레시피를 둘러보고 새로운 요리에 도전해보세요"
      />

      {/* 로딩 상태 */}
      {isLoading && (
        <LoadingState message="레시피를 불러오는 중...">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
        </LoadingState>
      )}

      {/* 에러 상태 */}
      {error && (
        <EmptyState message="레시피를 불러오는데 실패했습니다.">
          <ChefHat className="h-12 w-12 mx-auto mb-4 opacity-50" />
        </EmptyState>
      )}

      {/* 레시피 목록 */}
      {!isLoading && !error && recipes.length > 0 && (
        <RecipeGrid recipes={recipes} />
      )}

      {/* 빈 상태 */}
      {recipes.length === 0 && (
        <EmptyState message="아직 레시피가 없습니다. 곧 다양한 레시피를 준비해드릴게요!">
          <ChefHat />
        </EmptyState>
      )}
    </div>
  );
}
