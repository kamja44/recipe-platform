import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface RecipeInstructionsProps {
  instructions: string[];
}

export function RecipeInstructions({ instructions }: RecipeInstructionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>👨‍🍳 조리 순서</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="space-y-4">
          {instructions.map((instruction, index) => (
            <li key={index} className="flex gap-4">
              <div
                className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center
  justify-center text-sm font-bold"
              >
                {index + 1}
              </div>
              <p className="pt-1">{instruction}</p>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
