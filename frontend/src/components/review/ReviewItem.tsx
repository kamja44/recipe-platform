"use client";

import { Review, UpdateReviewRequest } from "@/types/review";
import { useState } from "react";
import { Card } from "../ui/card";
import { formatDate } from "@/lib/utils/date";
import { StarRating } from "./StarRating";
import { Button } from "../ui/button";
import { Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "../ui/textarea";

/**
 * ReviewItem 컴포넌트
 * - 역할: 개별 리뷰 표시
 * - 기능:
 *   - 작성자 정보
 *   - 별점 표시
 *   - 댓글 내용
 *   - 수정/삭제 버튼 (본인만)
 */

interface ReviewItemProps {
  review: Review;
  currentUserId?: number;
  onUpdate?: (reviewId: number, data: UpdateReviewRequest) => void;
  onDelete?: (reviewId: number) => void;
  isUpdating?: boolean;
  isDeleting?: boolean;
}

export function ReviewItem({
  review,
  currentUserId,
  onUpdate,
  onDelete,
  isUpdating,
  isDeleting,
}: ReviewItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editRating, setEditRating] = useState(review.rating);
  const [editComment, setEditComment] = useState(review.comment);

  // 본인이 작성한 리뷰인지 여부
  const isOwnReview = currentUserId === review.userId;

  // 수정 취소
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  // 수정 완료
  const handleSaveEdit = () => {
    if (onUpdate && editComment.trim().length >= 10) {
      onUpdate(review.id, {
        rating: editRating,
        comment: editComment,
      });
      setIsEditing(false);
    } else {
      alert("댓글은 최소 10자 이상 입력해주세요.");
    }
  };

  // 삭제
  const handleDelete = () => {
    if (onDelete) {
      onDelete(review.id);
    }
  };
  return (
    <Card className="p-4">
      {/* 작성자 정보 및 별점 */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="font-semibold">{review.user.username}</p>
            <span className="text-xs text-gray-500">
              {formatDate(review.createdAt)}
            </span>
          </div>
          {!isEditing ? (
            <StarRating rating={review.rating} readOnly size="sm" />
          ) : (
            <StarRating
              rating={editRating}
              onChange={setEditRating}
              size="sm"
            />
          )}
        </div>
        {/* 수정/삭제 버튼(본인 만) */}
        {isOwnReview && !isEditing && (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              disabled={isUpdating || isDeleting}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={isUpdating || isDeleting}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>리뷰 삭제</AlertDialogTitle>
                  <AlertDialogDescription>
                    정말로 이 리뷰를 삭제하시겠습니까? 이 작업은 되돌릴 수
                    없습니다.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>취소</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    삭제
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
      {/* 댓글 내용 */}
      {!isEditing ? (
        <p className="text-gray-700">{review.comment}</p>
      ) : (
        <div className="space-y-3">
          <Textarea
            value={editComment}
            onChange={(e) => setEditComment(e.target.value)}
            rows={3}
            className="resize-none"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={handleCancelEdit}>
              취소
            </Button>
            <Button size="sm" onClick={handleSaveEdit} disabled={isUpdating}>
              {isUpdating ? "수정 중..." : "저장"}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
