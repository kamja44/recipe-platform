import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RecipeIngredientsProps {
  ingredients: string[];
  servings?: number;
}

export function RecipeIngredients({
  ingredients,
  servings,
}: RecipeIngredientsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>📦 재료 ({servings}인분 기준)</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {ingredients.map((ingredient, index) => (
            <li key={index} className="flex items-center">
              <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
              {ingredient}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
