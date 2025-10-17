"use client";

import { Review, UpdateReviewRequest } from "@/types/review";
import { EmptyState } from "../common/EmptyState";
import { MessageSquare } from "lucide-react";
import { ReviewItem } from "./ReviewItem";

/**
 * ReviewList 컴포넌트
 * - 역할: 리뷰 목록 표시
 * - 기능: ReviewItem 컴포넌트를 반복 렌더링
 */

interface ReviewListProps {
  reviews: Review[];
  currentUserId?: number;
  onUpdate?: (reviewId: number, data: UpdateReviewRequest) => void;
  onDelete?: (reviewId: number) => void;
  isUpdating?: boolean;
  isDeleting?: boolean;
}

export function ReviewList({
  reviews,
  currentUserId,
  onUpdate,
  onDelete,
  isUpdating,
  isDeleting,
}: ReviewListProps) {
  // 리뷰가 없는 겨웅
  if (reviews.length === 0) {
    return (
      <EmptyState
        icon={MessageSquare}
        title="아직 리뷰가 없습니다"
        description="첫 번째 리뷰를 작성해보세요!"
      />
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">리뷰 ({reviews.length}개)</h3>
      {reviews.map((review) => (
        <ReviewItem
          key={review.id}
          review={review}
          currentUserId={currentUserId}
          onUpdate={onUpdate}
          onDelete={onDelete}
          isUpdating={isUpdating}
          isDeleting={isDeleting}
        />
      ))}
    </div>
  );
}
