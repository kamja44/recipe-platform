import { getRecipes } from "@/lib/api/recipes";
import { useQuery } from "@tanstack/react-query";

/**
 * 레시피 목록 조회 훅
 * - 페이지네이션, 검색, 카테고리 필터 지원
 */
export function useRecipes(
  page: number,
  limit: number,
  searchQuery?: string,
  category?: string | null
) {
  return useQuery({
    queryKey: ["recipes", page, limit, searchQuery, category],
    queryFn: () => getRecipes(page, limit, searchQuery, category),
    staleTime: 60 * 1000,
  });
}
