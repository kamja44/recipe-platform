import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useReviews,
  useAverageRating,
  useCreateReview,
  useUpdateReview,
  useDeleteReview,
} from "./useReviews";
import * as reviewApi from "@/lib/api/reviews";
import { mockReviews, mockAverageRating, mockReview } from "@/test/mockData";

// API 모킹
vi.mock("@/lib/api/reviews");

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("useReviews", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("useReviews (Read)", () => {
    it("should fetch reviews successfully", async () => {
      // Given: API가 리뷰 목록을 반환
      vi.mocked(reviewApi.getReviewsByRecipe).mockResolvedValue(mockReviews);

      // When: useReviews 훅 호출
      const { result } = renderHook(() => useReviews(1), {
        wrapper: createWrapper(),
      });

      // Then: 데이터 로드 완료
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual(mockReviews);
      expect(result.current.data).toHaveLength(2);
    });

    it("should handle empty reviews", async () => {
      // Given: 리뷰가 없는 경우
      vi.mocked(reviewApi.getReviewsByRecipe).mockResolvedValue([]);

      // When: 훅 호출
      const { result } = renderHook(() => useReviews(1), {
        wrapper: createWrapper(),
      });

      // Then: 빈 배열 반환
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual([]);
    });
  });

  describe("useAverageRating", () => {
    it("should fetch average rating successfully", async () => {
      // Given: API가 평균 평점을 반환
      vi.mocked(reviewApi.getAverageRating).mockResolvedValue(
        mockAverageRating
      );

      // When: useAverageRating 훅 호출
      const { result } = renderHook(() => useAverageRating(1), {
        wrapper: createWrapper(),
      });

      // Then: 평균 평점 데이터 확인
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual(mockAverageRating);
      expect(result.current.data?.averageRating).toBe(4.5);
      expect(result.current.data?.totalReviews).toBe(2);
    });
  });

  describe("useCreateReview (Create)", () => {
    it("should create review successfully", async () => {
      // Given: API가 리뷰 생성 성공
      const newReview = { rating: 5, comment: "정말 맛있어요!" };
      vi.mocked(reviewApi.createReview).mockResolvedValue(mockReview);

      // When: useCreateReview 훅 호출 및 mutate
      const { result } = renderHook(() => useCreateReview(1), {
        wrapper: createWrapper(),
      });

      result.current.mutate(newReview);

      // Then: mutation 성공
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(reviewApi.createReview).toHaveBeenCalledWith(1, newReview);
    });

    it("should handle create review error", async () => {
      // Given: API가 에러 반환
      const errorMessage = "리뷰 작성 실패";
      vi.mocked(reviewApi.createReview).mockRejectedValue(
        new Error(errorMessage)
      );

      // When: 훅 호출 및 mutate
      const { result } = renderHook(() => useCreateReview(1), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ rating: 5, comment: "테스트" });

      // Then: 에러 처리
      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.error).toBeInstanceOf(Error);
    });
  });

  describe("useUpdateReview (Update)", () => {
    it("should update review successfully", async () => {
      // Given: API가 리뷰 수정 성공
      const updatedReview = {
        ...mockReview,
        rating: 4,
        comment: "수정된 리뷰",
      };
      vi.mocked(reviewApi.updateReview).mockResolvedValue(updatedReview);

      // When: useUpdateReview 훅 호출 및 mutate
      const { result } = renderHook(() => useUpdateReview(1), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        reviewId: 1,
        data: { rating: 4, comment: "수정된 리뷰" },
      });

      // Then: mutation 성공
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(reviewApi.updateReview).toHaveBeenCalledWith(1, {
        rating: 4,
        comment: "수정된 리뷰",
      });
    });
  });

  describe("useDeleteReview (Delete)", () => {
    it("should delete review successfully", async () => {
      // Given: API가 리뷰 삭제 성공
      vi.mocked(reviewApi.deleteReview).mockResolvedValue();

      // When: useDeleteReview 훅 호출 및 mutate
      const { result } = renderHook(() => useDeleteReview(1), {
        wrapper: createWrapper(),
      });

      result.current.mutate(1);

      // Then: mutation 성공
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(reviewApi.deleteReview).toHaveBeenCalledWith(1);
    });

    it("should handle delete review error", async () => {
      // Given: API가 에러 반환
      vi.mocked(reviewApi.deleteReview).mockRejectedValue(
        new Error("삭제 실패")
      );

      // When: 훅 호출 및 mutate
      const { result } = renderHook(() => useDeleteReview(1), {
        wrapper: createWrapper(),
      });

      result.current.mutate(1);

      // Then: 에러 처리
      await waitFor(() => expect(result.current.isError).toBe(true));
    });
  });
});
