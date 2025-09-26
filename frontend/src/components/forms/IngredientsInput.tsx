import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { IngredientsInputProps } from "@/types/common";

export function IngredientsInput({
  ingredients,
  currentIngredient,
  onCurrentIngredientChange,
  onAddIngredient,
  onRemoveIngredient,
  onGetRecommendations,
  isLoading,
}: IngredientsInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onAddIngredient();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>📦 보유 재료</CardTitle>
        <CardDescription>
          냉장고나 식료품 저장고에 있는 재료를 입력해주세요
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="재료명을 입력하세요 (예: 감자, 양파, 베이컨)"
            value={currentIngredient}
            onChange={(e) => onCurrentIngredientChange(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button onClick={onAddIngredient} size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {ingredients.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              추가된 재료 ({ingredients.length}개)
            </p>
            <div className="flex flex-wrap gap-2">
              {ingredients.map((ingredient) => (
                <Badge
                  key={ingredient}
                  variant="secondary"
                  className="text-sm py-1 px-3"
                >
                  {ingredient}
                  <button
                    onClick={() => onRemoveIngredient(ingredient)}
                    className="ml-2 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Button
          onClick={onGetRecommendations}
          disabled={ingredients.length === 0 || isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? "AI가 레시피를 찾고 있어요..." : "🔍 레시피 추천받기"}
        </Button>
      </CardContent>
    </Card>
  );
}
