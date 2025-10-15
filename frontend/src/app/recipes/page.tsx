"use client";

import { ChefHat } from "lucide-react";
import { PageTitleSection } from "@/components/sections/PageTitleSection";
import { RecipeGrid } from "@/components/recipe/RecipeGrid";
import { EmptyState } from "@/components/common/EmptyState";
import { useRecipes } from "@/hooks/useRecipes";
import { LoadingState } from "@/components/common/LoadingState";
import { useState } from "react";
import { Pagination } from "@/components/common/Pagination";
import { SearchBar } from "@/components/recipe/SearchBar";
import { CategoryFilter } from "@/components/recipe/CategoryFilter";

export default function RecipesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // 실제 검색어 사용
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data, isLoading, error } = useRecipes(
    currentPage,
    limit,
    searchQuery,
    selectedCategory
  );

  const recipes = data?.data || [];
  const total = data?.total || 0;

  const totalPages = Math.ceil(total / limit); // 전체 페이지 수

  // 검색 실행
  const handleSearch = () => {
    setSearchQuery(searchKeyword);
    setCurrentPage(1); // 검색 시 1페이지로 리셋
  };

  // 검색 초기화
  const handleClearSearch = () => {
    setSearchKeyword("");
    setSearchQuery("");
    setCurrentPage(1);
  };

  // 카테고리 변경
  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    setCurrentPage(1); // 카테고리 변경 시 1페이지로 리셋
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageTitleSection
        title="📖 레시피 모음"
        description="다양한 요리 레시피를 둘러보고 새로운 요리에 도전해보세요"
      />

      {/* 검색/필터 영역 */}
      <div className="mb-8 space-y-4">
        {/* 검색 창 */}
        <div className="flex justify-center">
          <SearchBar
            value={searchKeyword}
            onChange={setSearchKeyword}
            onSearch={handleSearch}
            onClear={handleClearSearch}
          />
        </div>

        {/* 카테고리 필터 */}
        <div className="flex justify-center">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>
      </div>

      {/* 로딩 상태 */}
      {isLoading && (
        <LoadingState message="레시피를 불러오는 중...">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
        </LoadingState>
      )}

      {/* 에러 상태 */}
      {error && (
        <EmptyState message="레시피를 불러오는데 실패했습니다.">
          <ChefHat className="h-12 w-12 mx-auto mb-4 opacity-50" />
        </EmptyState>
      )}

      {/* 레시피 목록 */}
      {!isLoading && !error && recipes.length > 0 && (
        <>
          <RecipeGrid recipes={recipes} />

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}

      {/* 빈 상태 */}
      {recipes.length === 0 && (
        <EmptyState message="아직 레시피가 없습니다. 곧 다양한 레시피를 준비해드릴게요!">
          <ChefHat />
        </EmptyState>
      )}
    </div>
  );
}
