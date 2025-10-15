/**
 * CategoryFilter 컴포넌트
 * - 역할: 카테고리별 레시피 필터링
 * - 기능: 카테고리 버튼 그룹, 선택 상태 표시
 */

import { Button } from "../ui/button";

interface CategoryFilterProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

// 카테고리 목록
const CATEGORIES = [
  { id: null, label: "전체" },
  { id: "AI추천", label: "AI 추천" },
  { id: "한식", label: "한식" },
  { id: "중식", label: "중식" },
  { id: "일식", label: "일식" },
  { id: "양식", label: "양식" },
  { id: "분식", label: "분식" },
  { id: "디저트", label: "디저트" },
];

export function CategoryFilter({
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {CATEGORIES.map((category) => (
        <Button
          key={category.id || "all"}
          onClick={() => onCategoryChange(category.id)}
          variant={selectedCategory === category.id ? "default" : "outline"}
          size="sm"
        >
          {category.label}
        </Button>
      ))}
    </div>
  );
}
