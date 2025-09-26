import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IngredientsInputProps } from "@/types/common";
import { IngredientInputField } from "./IngredientInputField";
import { IngredientsList } from "./IngredientsList";
import { RecommendButton } from "./RecommendButton";

export function IngredientsInput({
  ingredients,
  currentIngredient,
  onCurrentIngredientChange,
  onAddIngredient,
  onRemoveIngredient,
  onGetRecommendations,
  isLoading,
}: IngredientsInputProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>📦 보유 재료</CardTitle>
        <CardDescription>
          냉장고나 식료품 저장고에 있는 재료를 입력해주세요
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <IngredientInputField
          value={currentIngredient}
          onChange={onCurrentIngredientChange}
          onAdd={onAddIngredient}
          placeholder="재료명을 입력하세요 (예: 감자, 양파, 베이컨)"
        />
        <IngredientsList
          ingredients={ingredients}
          onRemove={onRemoveIngredient}
        />
        <RecommendButton
          onClick={onGetRecommendations}
          disabled={ingredients.length === 0 || isLoading}
          isLoading={isLoading}
        />

        {/* <Button
          onClick={onGetRecommendations}
          disabled={ingredients.length === 0 || isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? "AI가 레시피를 찾고 있어요..." : "🔍 레시피 추천받기"}
        </Button> */}
      </CardContent>
    </Card>
  );
}
