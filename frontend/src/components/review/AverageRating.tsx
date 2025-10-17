"use client";

import type { AverageRating as AverageRatingType } from "@/types/review";
import { Card } from "../ui/card";
import { StarRating } from "./StarRating";
/**
 * AverageRating 컴포넌트
 * - 역할: 레시피의 평균 별점 및 리뷰 개수 표시
 * - 기능:
 *   - 평균 별점 (StarRating)
 *   - 리뷰 개수
 *   - 숫자로 평균 점수 표시
 */

interface AverageRatingProps {
  data: AverageRatingType;
}

export function AverageRating({ data }: AverageRatingProps) {
  const { averageRating, totalReviews } = data;

  return (
    <Card className="p-6">
      <div className="flex items-center gap-6">
        {/* 평균 별점 숫자 */}
        <div className="text-center">
          <div className="text-4xl font-bold text-primary mb-1">
            {(averageRating || 0).toFixed(1)}
          </div>
          <div className="text-sm text-muted-foreground">평균 평점</div>
        </div>
        {/* 구분선 */}
        <div className="h-16 w-px bg-border"></div>

        {/* 별점 및 리뷰 개수 */}
        <div className="flex-1">
          <div className="flex itemx-center gap-2 mb-2">
            <StarRating rating={averageRating} readOnly size="md" />
          </div>
          <p className="text-sm text-muted-foreground">
            총 {totalReviews}개의 리뷰
          </p>
        </div>
        {/* 리뷰가 없는 경우 */}
        {totalReviews === 0 && (
          <div className="mt-4 pt-4 border-t text-center text-sm text-muted-foreground">
            아직 리뷰가 없습니다. 첫 번째 리뷰를 작성해보세요!
          </div>
        )}
      </div>
    </Card>
  );
}
