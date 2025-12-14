import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users } from "lucide-react";
import { RecipeListItem } from "@/types/common";

interface RecipeCardProps {
  recipe: RecipeListItem;
  href?: string;
}

export function RecipeCard({
  recipe,
  href = `/recipes/${recipe.id}`,
}: RecipeCardProps) {
  const cardContent = (
    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader>
        <div className="text-6xl text-center mb-4">{recipe.image || "🍳"}</div>
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
  );

  if (href) {
    return <Link href={href}>{cardContent}</Link>;
  }

  return cardContent;
}
