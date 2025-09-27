import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, ChefHat, ArrowLeft, Heart, Share2 } from "lucide-react";
import Link from "next/link";
import { RecipeHeader } from "@/components/recipe/RecipeHeader";
import { RecipeIngredients } from "@/components/recipe/RecipeIngredients";
import { RecipeNutrition } from "@/components/recipe/RecipeNutrition";
import { RecipeInstructions } from "@/components/recipe/RecipeInstructions";
import { RecipeTips } from "@/components/recipe/RecipeTips";

// 임시 더미 데이터 (실제로는 DB에서 가져올 예정)
const getRecipeById = (id: string) => {
  const recipes = {
    "1": {
      id: "1",
      title: "감자 베이컨 볶음",
      description: "바삭한 베이컨과 고소한 감자의 환상적인 조합",
      image: "🥔",
      cookTime: 20,
      servings: 2,
      difficulty: "쉬움",
      category: "한식",
      ingredients: [
        "감자 2개 (중간 크기)",
        "베이컨 4줄",
        "양파 1/2개",
        "마늘 2쪽",
        "식용유 2큰술",
        "소금 약간",
        "후추 약간",
        "파슬리 (장식용)",
      ],
      instructions: [
        "감자는 껍질을 벗기고 한 입 크기로 깍둑썰기 합니다.",
        "베이컨은 1cm 폭으로 썰고, 양파와 마늘은 잘게 다집니다.",
        "팬에 식용유를 두르고 중불에서 감자를 노릇하게 볶습니다.",
        "감자가 익으면 베이컨을 넣고 바삭하게 볶습니다.",
        "양파와 마늘을 넣고 향이 날 때까지 볶습니다.",
        "소금과 후추로 간을 맞추고 파슬리를 뿌려 완성합니다.",
      ],
      tips: [
        "감자는 찬물에 담가 전분을 제거하면 더 바삭합니다.",
        "베이컨에서 나오는 기름을 활용하면 더 맛있어요.",
        "중불에서 천천히 볶아야 감자가 겉바속촉하게 익습니다.",
      ],
      nutrition: {
        calories: 285,
        protein: 12,
        carbs: 24,
        fat: 16,
      },
    },
    "2": {
      id: "2",
      title: "양파 감자 수프",
      description: "따뜻하고 진한 맛의 홈메이드 수프",
      image: "🍲",
      cookTime: 30,
      servings: 4,
      difficulty: "보통",
      category: "서양식",
      ingredients: [
        "양파 2개 (큰 것)",
        "감자 3개",
        "버터 2큰술",
        "닭육수 500ml",
        "우유 200ml",
        "소금 1작은술",
        "후추 약간",
        "타임 약간",
      ],
      instructions: [
        "양파는 얇게 채썰고, 감자는 껍질을 벗겨 깍둑썰기 합니다.",
        "팬에 버터를 두르고 양파를 투명해질 때까지 볶습니다.",
        "감자를 넣고 2-3분 더 볶습니다.",
        "닭육수를 붓고 끓인 후 중불에서 15분간 끓입니다.",
        "감자가 부드러워지면 블렌더로 곱게 갈아줍니다.",
        "우유를 넣고 소금, 후추, 타임으로 간을 맞춰 완성합니다.",
      ],
      tips: [
        "양파를 충분히 볶아야 단맛이 납니다.",
        "블렌더 대신 으깰 수도 있어요.",
        "생크림을 넣으면 더 진한 맛이 납니다.",
      ],
      nutrition: {
        calories: 165,
        protein: 4,
        carbs: 28,
        fat: 5,
      },
    },
  };

  return recipes[id as keyof typeof recipes] || null;
};

interface RecipeDetailPageProps {
  params: {
    id: string;
  };
}

export default function RecipeDetailPage({ params }: RecipeDetailPageProps) {
  const recipe = getRecipeById(params.id);

  if (!recipe) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">레시피를 찾을 수 없습니다</h1>
        <p className="text-muted-foreground mb-8">
          요청하신 레시피가 존재하지 않습니다.
        </p>
        <Link href="/recipes">
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" />
            레시피 목록으로 돌아가기
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <RecipeHeader recipe={recipe} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 재료 */}
        <div className="lg:col-span-1">
          <RecipeIngredients
            ingredients={recipe.ingredients}
            servings={recipe.servings}
          />

          {/* 영양 정보 */}
          <div className="mt-6">
            <RecipeNutrition nutrition={recipe.nutrition} />
          </div>
        </div>

        {/* 조리법 & 팁 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 조리 순서 */}
          <RecipeInstructions instructions={recipe.instructions} />
          {/* 요리 팁 */}
          <RecipeTips tips={recipe.tips} />
        </div>
      </div>
    </div>
  );
}
