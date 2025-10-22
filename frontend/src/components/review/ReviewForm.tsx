/**
 * ReviewForm 컴포넌트
 * - 역할: 리뷰 작성 폼
 * - 기능:
 *   - 별점 선택 (StarRating)
 *   - 댓글 입력 (Textarea)
 *   - 제출 버튼
 */

import { CreateReviewRequest } from "@/types/review";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card } from "../ui/card";
import { StarRating } from "./StarRating";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

interface ReviewFormProps {
  /**
   * 폼 제출 콜백
   * - 용도: 부모 컴포넌트에서 API 호출
   */
  onSubmit: (data: CreateReviewRequest) => void;
  /**
   * 제출 중 상태
   */
  isSubmitting?: boolean;
}

interface ReviewFormData {
  comment: string;
}

export function ReviewForm({ onSubmit, isSubmitting }: ReviewFormProps) {
  // 별점 상태 (기본값: 5)
  const [rating, setRating] = useState(5);

  // 폼 상태 관리
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ReviewFormData>({
    defaultValues: {
      comment: "",
    },
  });

  // 폼 제출 핸들러
  const handleFormSubmit = (data: ReviewFormData) => {
    // 별점과 댓글을 합쳐서 부모에게 전달
    onSubmit({
      rating,
      comment: data.comment,
    });

    // 폼 초기화
    reset();
    setRating(5);
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">리뷰 작성</h3>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* 별점 선택 */}
        <div>
          <label className="block text-sm font-medium mb-2">
            별점 <span className="text-red-500">*</span>
          </label>
          <StarRating rating={rating} onChange={setRating} size="lg" />
        </div>
        {/* 댓글 입력 */}
        <div>
          <label className="block text-sm font-medium mb-2">
            댓글 <span className="text-red-500">*</span>
          </label>
          <Textarea
            {...register("comment", {
              required: "댓글을 입력해주세요",
              minLength: {
                value: 10,
                message: "최소 10자 이상 입력해주세요",
              },
            })}
            placeholder="이 레시피에 대한 솔직한 리뷰를 남겨주세요 (최소 10자)"
            rows={4}
            className="resize-none"
          />
          {errors.comment && (
            <p className="text-sm text-red-500 mt-1">
              {errors.comment.message}
            </p>
          )}
        </div>
        {/* 제출 버튼 */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "작성 중..." : "리뷰 작성"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
