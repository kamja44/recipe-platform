"use client";

import { Star } from "lucide-react";
import { useState } from "react";

/**
 * StarRating 컴포넌트
 * - 역할: 별점 표시 및 선택
 * - 모드:
 *   - 읽기 전용 (readOnly=true): 별점만 표시
 *   - 입력 모드 (readOnly=false): 클릭으로 별점 선택
 */

interface StarRatingProps {
  rating: number; // 현재 별점
  onChange?: (rating: number) => void;
  readOnly?: boolean; // 읽기 전용 모드 여부
  size?: "sm" | "md" | "lg";
}

export function StarRating({
  rating,
  onChange,
  readOnly = false,
  size = "md",
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const handleClick = (star: number) => {
    if (!readOnly && onChange) {
      onChange(star);
    }
  };

  const handleMouseEnter = (star: number) => {
    if (!readOnly) {
      setHoverRating(star);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverRating(0);
    }
  };

  const getStarColor = (star: number) => {
    const currentRating = hoverRating || rating;

    if (currentRating >= star) {
      return "fill-yellow-400 text-yellow-400";
    } else if (currentRating >= star - 0.5) {
      // 반만 채워진 별(현재는 완전히 채워진 별과 동일)
      return "fill-yellow-400 text-yellow-400";
    } else {
      // 빈 별
      return "fill-none text-gray-300";
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleClick(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
          disabled={readOnly}
          className={`
            ${sizeClasses[size]}
            ${readOnly ? "cursor-default" : "cursor-pointer hover:scale-110"}
            transition-transform
          `}
        >
          <Star className={`${sizeClasses[size]} ${getStarColor(star)}`} />
        </button>
      ))}
      {readOnly && (
        <span className="ml-1 text-sm text-gray-600">
          {(rating || 0).toFixed(1)}
        </span>
      )}
    </div>
  );
}
