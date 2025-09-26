import { Recipe } from "@/types/common";
import { Card, CardContent } from "../ui/card";
import { Clock, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RecipeListProps {
  recipes: Recipe[];
}

export function RecipeList({ recipes }: RecipeListProps) {
  return (
    <div className="space-y-4">
      {recipes.map((recipe) => (
        <Card
          key={recipe.id}
          className="border-2 hover:border-primary/50 transition-colors"
        >
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-2">{recipe.title}</h3>
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
  );
}
