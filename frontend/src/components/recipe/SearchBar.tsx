/**
 * SearchBar 컴포넌트
 * - 역할: 재료명으로 레시피 검색
 * - 기능: 검색 입력, 검색 버튼, 초기화 버튼
 */

import { Search, X } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
}

export function SearchBar({
  value,
  onChange,
  onSearch,
  onClear,
}: SearchBarProps) {
  // Enter 키 검색
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="flex gap-2 w-full max-w-md">
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder="재료명으로 검색...(예: 감자, 양파)"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pr-10"
        />

        {/* X 버튼 (입력값 있을 때만 표시) */}
        {value && (
          <button
            onClick={onClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <Button onClick={onSearch} disabled={!value}>
        <Search className="h-4 w-4 mr-2" />
        검색
      </Button>
    </div>
  );
}
