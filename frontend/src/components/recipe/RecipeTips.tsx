import { ChefHat } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface RecipeTipsProps {
  tips: string[];
}

export function RecipeTips({ tips }: RecipeTipsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>💡 요리 팁</CardTitle>
        <CardDescription>더 맛있게 만드는 비법을 알려드려요</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {tips.map((tip, index) => (
            <li key={index} className="flex gap-3">
              <ChefHat className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
