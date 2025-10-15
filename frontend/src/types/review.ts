/**
 * 리뷰 데이터
 */
export interface Review {
  id: number;
  rating: number;
  comment: string;
  userId: number;
  user: {
    id: number;
    username: string;
    email: string;
  };
  recipeId: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * 리뷰 생성 요청 데이터
 */
export interface CreateReviewRequest {
  rating: number;
  comment: string;
}

/**
 * 리뷰 수정 요청 데이터
 */
export interface UpdateReviewRequest {
  rating?: number;
  comment?: string;
}

/**
 * 평균 평점 데이터
 */
export interface AverageRating {
  averageRating: number;
  totalReviews: number;
}
