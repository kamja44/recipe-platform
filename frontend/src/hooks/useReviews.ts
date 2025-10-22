import {
  createReview,
  deleteReview,
  getAverageRating,
  getReviewsByRecipe,
  updateReview,
} from "@/lib/api/reviews";
import { CreateReviewRequest, UpdateReviewRequest } from "@/types/review";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * 레시피별 리뷰 목록 조회 훅
 * - 용도: 특정 레시피의 모든 리뷰 가져오기
 */
export function useReviews(recipeId: number) {
  return useQuery({
    queryKey: ["reviews", recipeId],
    queryFn: () => getReviewsByRecipe(recipeId),
  });
}

/**
 * 평균 평점 조회 훅
 * - 용도: 레시피의 평균 별점 및 리뷰 개수
 */
export function useAverageRating(recipeId: number) {
  return useQuery({
    queryKey: ["averageRating", recipeId],
    queryFn: () => getAverageRating(recipeId),
  });
}

/**
 * 리뷰 생성 훅
 * - 용도: 새 리뷰 작성
 * - 성공 시: 리뷰 목록 및 평균 평점 캐시 무효화
 */
export function useCreateReview(recipeId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReviewRequest) => createReview(recipeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", recipeId] });
      queryClient.invalidateQueries({ queryKey: ["averageRating", recipeId] });
    },
  });
}

/**
 * 리뷰 수정 훅
 * - 용도: 기존 리뷰 수정
 * - 성공 시: 리뷰 목록 및 평균 평점 캐시 무효화
 */
export function useUpdateReview(recipeId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reviewId,
      data,
    }: {
      reviewId: number;
      data: UpdateReviewRequest;
    }) => updateReview(reviewId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", recipeId] });
      queryClient.invalidateQueries({ queryKey: ["averageRating", recipeId] });
    },
  });
}

/**
 * 리뷰 삭제 훅
 * - 용도: 리뷰 삭제
 * - 성공 시: 리뷰 목록 및 평균 평점 캐시 무효화
 */
export function useDeleteReview(recipeId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: number) => deleteReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", recipeId] });
      queryClient.invalidateQueries({ queryKey: ["averageRating", recipeId] });
    },
  });
}
