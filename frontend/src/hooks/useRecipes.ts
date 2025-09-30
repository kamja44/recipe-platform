import { getRecipes } from "@/lib/api/recipes";
import { useQuery } from "@tanstack/react-query";

export function useRecipes(page = 1, limit = 10) {
  return useQuery({
    queryKey: ["recipes", page, limit],
    queryFn: () => getRecipes(page, limit),
    staleTime: 60 * 1000,
  });
}
