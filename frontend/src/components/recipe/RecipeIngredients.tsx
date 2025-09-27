import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RecipeIngredientsProps {
  ingredients: string[];
  servings: number;
}

export function RecipeIngretions({
  ingredients,
  servings,
}: RecipeIngredientsProps) {
  return (
    <div className="lg:col-span-1">
      <Card>
        <CardHeader>
          <CardTitle>📦 재료 ({recipe.servings}인분 기준)</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                {ingredient}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* 영양 정보 */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>🍎 영양 정보 (1인분 기준)</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {recipe.nutrition.calories}
            </div>
            <div className="text-sm text-muted-foreground">칼로리</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {recipe.nutrition.protein}g
            </div>
            <div className="text-sm text-muted-foreground">단백질</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {recipe.nutrition.carbs}g
            </div>
            <div className="text-sm text-muted-foreground">탄수화물</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {recipe.nutrition.fat}g
            </div>
            <div className="text-sm text-muted-foreground">지방</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
