import { Card, CardContent } from "../ui/card";
import { ChefHat, Clock, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RecipeData } from "@/types/recipe";
import { Button } from "../ui/button";

interface RecipeListProps {
  recipes: RecipeData[];
  onSaveRecipe?: (recipe: RecipeData) => void;
  isSaving?: boolean;
}

export function RecipeList({
  recipes,
  onSaveRecipe,
  isSaving,
}: RecipeListProps) {
  return (
    <div className="space-y-4">
      {recipes.map((recipe, index) => (
        <Card
          key={index}
          className="border-2 hover:border-primary/50 transition-colors"
        >
          <CardContent className="p-6">
            {/* 레시피 이름과 저장 버튼 */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-xl  flex items-center gap-2">
                <ChefHat className="h-5 w-5 text-primary" />
                {recipe.recipe_name}
              </h3>
              {onSaveRecipe && (
                <Button
                  onClick={() => onSaveRecipe(recipe)}
                  disabled={isSaving}
                  size="sm"
                  variant="outline"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "저장 중..." : "저장"}
                </Button>
              )}
            </div>

            {/* 조리 시간과 난이도 */}
            <div className="flex gap-4 mb-4">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {recipe.cooking_time}
              </div>
              <Badge variant="outline" className="text-xs">
                {recipe.difficulty}
              </Badge>
            </div>

            {/* 재료 목록 */}
            <div className="mb-4">
              <h4 className="font-semibold mb-2">📝 재료</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {recipe.ingredients_list.map((ingredient, idx) => (
                  <li key={idx}>{ingredient}</li>
                ))}
              </ul>
            </div>

            {/* 조리 방법 */}
            <div>
              <h4 className="font-semibold mb-2">👨‍🍳 조리 방법</h4>
              <ol className=" list-inside space-y-2 text-sm text-muted-foreground">
                {recipe.instructions.map((instruction, idx) => (
                  <li key={idx}>{instruction}</li>
                ))}
              </ol>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
