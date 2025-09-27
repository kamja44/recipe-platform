import { ChefHat } from "lucide-react";
import { PageTitleSection } from "@/components/sections/PageTitleSection";
import { RecipeGrid } from "@/components/recipe/RecipeGrid";
import { EmptyState } from "@/components/common/EmptyState";

// 임시 더미 데이터
const recipes = [
  {
    id: "1",
    title: "감자 베이컨 볶음",
    description: "바삭한 베이컨과 고소한 감자의 환상적인 조합",
    image: "🥔",
    cookTime: 20,
    servings: 2,
    difficulty: "쉬움",
    category: "한식",
  },
  {
    id: "2",
    title: "양파 감자 수프",
    description: "따뜻하고 진한 맛의 홈메이드 수프",
    image: "🍲",
    cookTime: 30,
    servings: 4,
    difficulty: "보통",
    category: "서양식",
  },
  {
    id: "3",
    title: "치킨 샐러드",
    description: "신선한 채소와 부드러운 치킨의 헬시한 조합",
    image: "🥗",
    cookTime: 15,
    servings: 1,
    difficulty: "쉬움",
    category: "샐러드",
  },
];

export default function RecipesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageTitleSection
        title="📖 레시피 모음"
        description="다양한 요리 레시피를 둘러보고 새로운 요리에 도전해보세요"
      />

      <RecipeGrid recipes={recipes} />

      {/* 빈 상태 */}
      {recipes.length === 0 && (
        <EmptyState message="아직 레시피가 없습니다. 곧 다양한 레시피를 준비해드릴게요!">
          <ChefHat />
        </EmptyState>
      )}
    </div>
  );
}
