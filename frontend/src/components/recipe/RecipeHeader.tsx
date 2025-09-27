import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowLeft, Clock, Heart, Share2, Users } from "lucide-react";
import { Badge } from "../ui/badge";
import { RecipeDetail } from "@/types/common";

interface RecipeHeaderProps {
  recipe: RecipeDetail;
}

export function RecipeHeader({ recipe }: RecipeHeaderProps) {
  return (
    <div className="mb-8">
      <Link href="/recipes">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          레시피 목록
        </Button>
      </Link>

      <div className="text-center mb-8">
        <div className="text-8xl mb-4">{recipe.image}</div>
        <h1 className="text-4xl font-bold mb-4">{recipe.title}</h1>
        <p className="text-xl text-muted-foreground mb-6">
          {recipe.description}
        </p>

        <div className="flex justify-center items-center gap-6 mb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <span>{recipe.cookTime}분</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <span>{recipe.servings}인분</span>
          </div>
          <Badge variant="outline">{recipe.difficulty}</Badge>
          <Badge variant="secondary">{recipe.category}</Badge>
        </div>

        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm">
            <Heart className="h-4 w-4 mr-2" />
            즐겨찾기
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            공유하기
          </Button>
        </div>
      </div>
    </div>
  );
}
