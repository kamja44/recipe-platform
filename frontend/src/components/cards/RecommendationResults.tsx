import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, ChefHat } from "lucide-react";
import { RecommendationResultsProps } from "@/types/common";
import { EmptyState } from "../common/EmptyState";

export function RecommendationResults({
  recipes,
  isLoading,
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
          <div className="text-center py-8 text-muted-foreground">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>AI가 최적의 레시피를 찾고 있어요...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recipes.map((recipe) => (
              <Card
                key={recipe.id}
                className="border-2 hover:border-primary/50 transition-colors"
              >
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{recipe.title}</h3>
                  <p className="text-muted-foreground text-sm mb-3">
                    {recipe.description}
                  </p>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {recipe.cookTime}분
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {recipe.servings}인분
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {recipe.difficulty}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
