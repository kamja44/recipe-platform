"use client";

import { useState } from "react";
import { PageTitleSection } from "@/components/sections/PageTitleSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useRecipeStream } from "@/hooks/useRecipeStream";

export default function RecommendPage() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState("");
  const [preferences, setPreferences] = useState("");
  const { recipe, isStreaming, error, generateRecipe } = useRecipeStream();

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
    setIngredients(ingredients.filter((i) => i !== ingredient));
  };

  const handleRecommend = () => {
    if (ingredients.length > 0) {
      generateRecipe(ingredients, preferences);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addIngredient();
    }
  };
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-12">
        <PageTitleSection
          title="🤖 AI 레시피 추천"
          description="냉장고에 있는 재료를 입력하고 AI가 추천하는 맞춤 레시피를 받아보세요"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 재료 입력 섹션 */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">재료 입력</h3>

          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="예: 양파, 감자, 당근..."
                value={currentIngredient}
                onChange={(e) => setCurrentIngredient(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isStreaming}
              />
              <Button onClick={addIngredient} disabled={isStreaming}>
                추가
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {ingredients.map((ingredient) => (
                <Badge
                  key={ingredient}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => removeIngredient(ingredient)}
                >
                  {ingredient} ✕
                </Badge>
              ))}
            </div>

            <Input
              placeholder="선호사항 (선택사항, 예: 한식, 매운맛)"
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              disabled={isStreaming}
            />

            <Button
              onClick={handleRecommend}
              disabled={ingredients.length === 0 || isStreaming}
              className="w-full"
            >
              {isStreaming ? "AI가 레시피 생성 중..." : "AI 레시피 추천 받기"}
            </Button>
          </div>
        </Card>

        {/* 결과 섹션 */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">추천 레시피</h3>

          {isStreaming && (
            <div className="flex items-center gap-2 mb-4">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span className="text-sm text-muted-foreground">
                AI가 레시피를 생성하는 중...
              </span>
            </div>
          )}

          {error && (
            <div className="text-red-500 p-4 bg-red-50 rounded">{error}</div>
          )}

          {recipe && (
            <div className="prose prose-slate max-w-none">
              <div className="whitespace-pre-wrap text-sm">
                {recipe}
                {isStreaming && <span className="animate-pulse">▊</span>}
              </div>
            </div>
          )}

          {!recipe && !isStreaming && !error && (
            <div className="text-center text-muted-foreground py-12">
              재료를 입력하고 AI 추천을 받아보세요
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
