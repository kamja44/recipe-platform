import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, ChefHat } from "lucide-react";

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
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">📖 레시피 모음</h1>
        <p className="text-lg text-muted-foreground">
          다양한 요리 레시피를 둘러보고 새로운 요리에 도전해보세요
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <Link key={recipe.id} href={`/recipes/${recipe.id}`}>
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="text-6xl text-center mb-4">{recipe.image}</div>
                <CardTitle className="text-xl">{recipe.title}</CardTitle>
                <CardDescription>{recipe.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {recipe.cookTime}분
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {recipe.servings}인분
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary">{recipe.category}</Badge>
                  <Badge variant="outline">{recipe.difficulty}</Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* 빈 상태 */}
      {recipes.length === 0 && (
        <div className="text-center py-16">
          <ChefHat className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">아직 레시피가 없습니다</h3>
          <p className="text-muted-foreground">
            곧 다양한 레시피를 준비해드릴게요!
          </p>
        </div>
      )}
    </div>
  );
}
