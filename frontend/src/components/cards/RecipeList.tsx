import { Card, CardContent } from "../ui/card";
import { ChefHat, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RecipeData } from "@/types/recipe";

interface RecipeListProps {
  recipes: RecipeData[];
}

export function RecipeList({ recipes }: RecipeListProps) {
  return (
    <div className="space-y-4">
      {recipes.map((recipe, index) => (
        <Card
          key={index}
          className="border-2 hover:border-primary/50 transition-colors"
        >
          <CardContent className="p-6">
            {/* 레시피 이름 */}
            <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
              <ChefHat className="h-5 w-5 text-primary" />
              {recipe.recipe_name}
            </h3>

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
