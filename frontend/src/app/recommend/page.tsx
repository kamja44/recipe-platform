"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { X, Plus, ChefHat, Clock, Users } from "lucide-react";

export default function RecommendPage() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recipes, setRecipes] = useState<any[]>([]);

  const addIngredient = () => {
    if (
      currentIngredient.trim() &&
      !ingredients.includes(currentIngredient.trim())
    ) {
      setIngredients([...ingredients, currentIngredient.trim()]);
      setCurrentIngredient("");
    }
  };

  const removeIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter((item) => item !== ingredient));
  };

  const getRecommendations = async () => {
    if (ingredients.length === 0) return;

    setIsLoading(true);
    // TODO: AI 서비스 연동
    setTimeout(() => {
      // 임시 더미 데이터
      setRecipes([
        {
          id: 1,
          title: "감자 베이컨 볶음",
          description: "감자와 베이컨을 활용한 간단한 요리",
          cookTime: 20,
          servings: 2,
          difficulty: "쉬움",
        },
        {
          id: 2,
          title: "양파 감자 수프",
          description: "따뜻하고 든든한 수프 요리",
          cookTime: 30,
          servings: 4,
          difficulty: "보통",
        },
      ]);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">🤖 AI 레시피 추천</h1>
        <p className="text-lg text-muted-foreground">
          냉장고에 있는 재료를 입력하고 AI가 추천하는 맞춤 레시피를 받아보세요
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 재료 입력 섹션 */}
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
                onChange={(e) => setCurrentIngredient(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addIngredient()}
              />
              <Button onClick={addIngredient} size="icon">
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
                        onClick={() => removeIngredient(ingredient)}
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
              onClick={getRecommendations}
              disabled={ingredients.length === 0 || isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading
                ? "AI가 레시피를 찾고 있어요..."
                : "🔍 레시피 추천받기"}
            </Button>
          </CardContent>
        </Card>

        {/* 추천 결과 섹션 */}
        <Card>
          <CardHeader>
            <CardTitle>✨ AI 추천 레시피</CardTitle>
            <CardDescription>
              입력한 재료를 활용한 추천 레시피입니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recipes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ChefHat className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>재료를 추가하고 추천받기 버튼을 눌러주세요</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recipes.map((recipe) => (
                  <Card
                    key={recipe.id}
                    className="border-2 hover:border-primary/50 transition-colors"
                  >
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2">
                        {recipe.title}
                      </h3>
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
      </div>
    </div>
  );
}
