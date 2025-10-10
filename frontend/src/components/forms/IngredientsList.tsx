import { X } from "lucide-react";
import { Badge } from "../ui/badge";

interface IngredientsListProps {
  ingredients: string[];
  onRemove: (ingredient: string) => void;
}

export function IngredientsList({
  ingredients,
  onRemove,
}: IngredientsListProps) {
  if (ingredients.length === 0) {
    return null;
  }
  return (
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
              onClick={() => onRemove(ingredient)}
              className="ml-2 hover:text-destructive"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}
