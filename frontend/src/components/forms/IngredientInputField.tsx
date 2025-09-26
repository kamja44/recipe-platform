import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface IngredientInputFieldProps {
  value: string;
  onChange: (value: string) => void;
  onAdd: () => void;
  placeholder?: string;
}

export function IngredientInputField({
  value,
  onChange,
  onAdd,
  placeholder,
}: IngredientInputFieldProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onAdd();
    }
  };
  return (
    <div className="flex gap-2">
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      <Button onClick={onAdd} size="icon">
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
