import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChefHat } from "lucide-react";
import { RecommendationResultsProps } from "@/types/common";
import { EmptyState } from "../common/EmptyState";
import { LoadingState } from "../common/LoadingState";
import { RecipeList } from "./RecipeList";

export function RecommendationResults({
  recipes,
  isLoading,
  onSaveRecipe,
  isSaving,
}: RecommendationResultsProps) {
  if (recipes.length === 0 && !isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>✨ AI 추천 레시피</CardTitle>
          <CardDescription>
            입력한 재료를 활용한 추천 레시피입니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState message="재료를 추가하고 추천받기 버튼을 눌러주세요">
            <ChefHat className="h-12 w-12 mx-auto mb-4 opacity-50" />
          </EmptyState>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>✨ AI 추천 레시피</CardTitle>
        <CardDescription>
          입력한 재료를 활용한 추천 레시피입니다
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <LoadingState message="AI가 최적의 레시피를 찾고 있어요...">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          </LoadingState>
        ) : (
          <RecipeList
            recipes={recipes}
            onSaveRecipe={onSaveRecipe}
            isSaving={isSaving}
          />
        )}
      </CardContent>
    </Card>
  );
}
