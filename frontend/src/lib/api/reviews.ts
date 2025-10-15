import {
  AverageRating,
  CreateReviewRequest,
  Review,
  UpdateReviewRequest,
} from "@/types/review";
import { apiClient } from "./client";

/**
 * 리뷰 생성
 * - POST /reviews/recipes/:recipeId
 * - 인증 필요: JWT 토큰
 */
export const createReview = async (
  recipeId: number,
  data: CreateReviewRequest
): Promise<Review> => {
  const response = await apiClient.post<Review>(
    `/reviews/recipes/${recipeId}`,
    data
  );
  return response.data;
};

/**
 * 레시피별 리뷰 목록 조회
 * - GET /reviews/recipes/:recipeId
 */
export const getReviewsByRecipe = async (
  recipeId: number
): Promise<Review[]> => {
  const response = await apiClient.get<Review[]>(
    `/reviews/recipes/${recipeId}`
  );
  return response.data;
};

/**
 * 평균 평점 조회
 * - GET /reviews/recipes/:recipeId/average
 */
export const getAverageRating = async (
  recipeId: number
): Promise<AverageRating> => {
  const response = await apiClient.get<AverageRating>(
    `/reviews/recipes/${recipeId}/average`
  );
  return response.data;
};

/**
 * 리뷰 수정
 * - PATCH /reviews/:id
 * - 인증 필요: JWT 토큰
 */
export const updateReview = async (
  reviewId: number,
  data: UpdateReviewRequest
): Promise<Review> => {
  const response = await apiClient.patch<Review>(`/reviews/${reviewId}`, data);
  return response.data;
};

/**
 * 리뷰 삭제
 * - DELETE /reviews/:id
 * - 인증 필요: JWT 토큰
 */
export const deleteReview = async (reviewId: number): Promise<void> => {
  await apiClient.delete(`/reviews/${reviewId}`);
};
