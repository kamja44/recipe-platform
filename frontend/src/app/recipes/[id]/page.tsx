"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { RecipeHeader } from "@/components/recipe/RecipeHeader";
import { RecipeIngredients } from "@/components/recipe/RecipeIngredients";
import { RecipeNutrition } from "@/components/recipe/RecipeNutrition";
import { RecipeInstructions } from "@/components/recipe/RecipeInstructions";
import { RecipeTips } from "@/components/recipe/RecipeTips";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getRecipeById } from "@/lib/api/recipes";
import { LoadingState } from "@/components/common/LoadingState";
import { RecipeActions } from "@/components/recipe/RecipeActions";
import { useAuth } from "@/hooks/useAuth";
import {
  useAverageRating,
  useCreateReview,
  useDeleteReview,
  useReviews,
  useUpdateReview,
} from "@/hooks/useReviews";
import { CreateReviewRequest, UpdateReviewRequest } from "@/types/review";
import { AverageRating } from "@/components/review/AverageRating";
import { ReviewForm } from "@/components/review/ReviewForm";
import { ReviewList } from "@/components/review/ReviewList";

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const { user } = useAuth();

  const {
    data: recipe,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["recipe", id],
    queryFn: () => getRecipeById(id),
  });

  // 리뷰 관련 훅
  const { data: averageRating } = useAverageRating(id);
  const { data: reviews = [] } = useReviews(id);
  const createReviewMutation = useCreateReview(id);
  const updateReviewMutation = useUpdateReview(id);
  const deleteReviewMutation = useDeleteReview(id);

  // 리뷰 작성 핸들러
  const handleReviewSubmit = (data: CreateReviewRequest) => {
    if (!user) {
      alert("로그인이 필요합니다.");
      router.push("/auth");
      return;
    }

    createReviewMutation.mutate(data, {
      onSuccess: () => {
        alert("리뷰가 작성되었습니다.");
      },
      onError: (error) => {
        console.error("리뷰 작성 실패: ", error);
        alert("리뷰 작성에 실패했습니다.");
      },
    });
  };

  // 리뷰 수정 핸들러
  const handleReviewUpdate = (reviewId: number, data: UpdateReviewRequest) => {
    updateReviewMutation.mutate(
      { reviewId, data },
      {
        onSuccess: () => {
          alert("리뷰가 수정되었습니다!");
        },
        onError: (error) => {
          console.error("리뷰 수정 실패:", error);
          alert("리뷰 수정에 실패했습니다.");
        },
      }
    );
  };

  // 리뷰 삭제 핸들러
  const handleReviewDelete = (reviewId: number) => {
    if (!confirm("정말로 이 리뷰를 삭제하시겠습니까?")) {
      return;
    }

    deleteReviewMutation.mutate(reviewId, {
      onSuccess: () => {
        alert("리뷰가 삭제되었습니다!");
      },
      onError: (error) => {
        console.error("리뷰 삭제 실패:", error);
        alert("리뷰 삭제에 실패했습니다.");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <LoadingState message="레시피를 불러오는 중...">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        </LoadingState>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">레시피를 찾을 수 없습니다</h1>
        <p className="text-muted-foreground mb-8">
          {error instanceof Error
            ? error.message
            : "요청하신 레시피가 존재하지 않습니다."}
        </p>
        <Link href="/recipes">
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" />
            레시피 목록으로 돌아가기
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* RecipeHeader 수정 */}
      <div className="mb-8">
        <RecipeHeader recipe={recipe} />
        {/* 수정/삭제 버튼 추가 */}
        <div className="mt-4">
          <RecipeActions recipeId={recipe.id} authorId={recipe.userId || 0} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 재료 */}
        <div className="lg:col-span-1">
          <RecipeIngredients
            ingredients={recipe.ingredients}
            servings={recipe.servings}
          />

          {/* 영양 정보 */}
          {recipe.nutrition && (
            <div className="mt-6">
              <RecipeNutrition nutrition={recipe.nutrition} />
            </div>
          )}
        </div>

        {/* 조리법 & 팁 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 조리 순서 */}
          <RecipeInstructions instructions={recipe.instructions} />
          {/* 요리 팁 */}
          {recipe.tips && recipe.tips.length > 0 && (
            <RecipeTips tips={recipe.tips} />
          )}
        </div>
      </div>

      {/* 리뷰 섹션 추가 */}
      <div className="mt-12 space-y-8">
        <h2 className="text-2xl font-bold">리뷰 & 평점</h2>

        {/* 평균 평점 */}
        {averageRating && <AverageRating data={averageRating} />}

        {/* 리뷰 작성 폼 (로그인한 사용자만) */}
        {user && (
          <ReviewForm
            onSubmit={handleReviewSubmit}
            isSubmitting={createReviewMutation.isPending}
          />
        )}

        {/* 로그인 안내 */}
        {!user && (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-muted-foreground mb-4">
              리뷰를 작성하려면 로그인이 필요합니다.
            </p>
            <Link href="/auth">
              <Button>로그인하기</Button>
            </Link>
          </div>
        )}

        {/* 리뷰 목록 */}
        <ReviewList
          reviews={reviews}
          currentUserId={user?.id}
          onUpdate={handleReviewUpdate}
          onDelete={handleReviewDelete}
          isUpdating={updateReviewMutation.isPending}
          isDeleting={deleteReviewMutation.isPending}
        />
      </div>
    </div>
  );
}
