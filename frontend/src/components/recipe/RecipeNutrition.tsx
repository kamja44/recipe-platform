import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface RecipeNutritionProps {
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export function RecipeNutrition({ nutrition }: RecipeNutritionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>🍎 영양 정보 (1인분 기준)</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">
            {nutrition.calories}
          </div>
          <div className="text-sm text-muted-foreground">칼로리</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">
            {nutrition.protein}g
          </div>
          <div className="text-sm text-muted-foreground">단백질</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">
            {nutrition.carbs}g
          </div>
          <div className="text-sm text-muted-foreground">탄수화물</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">
            {nutrition.fat}g
          </div>
          <div className="text-sm text-muted-foreground">지방</div>
        </div>
      </CardContent>
    </Card>
  );
}
