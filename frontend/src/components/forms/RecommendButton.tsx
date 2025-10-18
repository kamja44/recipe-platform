import { Button } from "../ui/button";

interface RecommendButtonProps {
  onClick: () => void;
  disabled: boolean;
  isLoading: boolean;
}

export function RecommendButton({
  onClick,
  disabled,
  isLoading,
}: RecommendButtonProps) {
  return (
    <Button onClick={onClick} disabled={disabled} className="w-full" size="lg">
      {isLoading ? "AI가 레시피를 찾고 있어요..." : "🔍 레시피 추천받기"}
    </Button>
  );
}
