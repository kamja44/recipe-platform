"use client";

import { LoadingState } from "@/components/common/LoadingState";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { getRecipeById, updateRecipe } from "@/lib/api/recipes";
import { RecipeDetail } from "@/types/common";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

/**
 * 난이도 한글 ↔ 영어 변환
 */
const DIFFICULTY_MAP = {
  ko: {
    easy: "쉬움",
    medium: "보통",
    hard: "어려움",
  },
  en: {
    쉬움: "easy",
    보통: "medium",
    어려움: "hard",
  },
} as const;

// 한글 → 영어
const difficultyToEn = (ko: string): string => {
  return DIFFICULTY_MAP.en[ko as keyof typeof DIFFICULTY_MAP.en] || "easy";
};

// 영어 → 한글
const difficultyToKo = (en: string): string => {
  return DIFFICULTY_MAP.ko[en as keyof typeof DIFFICULTY_MAP.ko] || "쉬움";
};

/**
 * 레시피 수정 폼 데이터 타입
 */
interface RecipeEditFormData {
  title: string;
  description: string;
  ingredients: string;
  instructions: string;
  cookTime: number;
  servings: number;
  difficulty: string;
  category: string;
}

export default function RecipeEditPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const id = Number(params.id);

  // 기존 레시피 데이터 로딩
  const { data: recipe, isLoading } = useQuery<RecipeDetail>({
    queryKey: ["recipe", id],
    queryFn: () => getRecipeById(id),
  });

  // 폼 상태
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RecipeEditFormData>({
    defaultValues: {
      title: "",
      description: "",
      ingredients: "",
      instructions: "",
      cookTime: 0,
      servings: 1,
      difficulty: "easy",
      category: "",
    },
  });

  // 기존 데이터로 폼 초기화
  useEffect(() => {
    if (recipe) {
      reset({
        title: recipe.title,
        description: recipe.description,
        ingredients: recipe.ingredients.join("\n"),
        instructions: recipe.instructions.join("\n"),
        cookTime: recipe.cookTime,
        servings: recipe.servings,
        difficulty: difficultyToEn(recipe.difficulty),
        category: recipe.category,
      });
    }
  }, [recipe, reset]);

  // 권한 체크
  useEffect(() => {
    if (recipe && user?.id !== recipe.userId) {
      alert("수정 권한이 없습니다.");
      router.push(`/recipes/${id}`);
    }
  }, [recipe, user, id, router]);

  // 수정 Mutation
  const updateMutation = useMutation({
    mutationFn: (data: RecipeEditFormData) =>
      updateRecipe(id, {
        title: data.title,
        description: data.description,
        ingredients: data.ingredients.split("\n").filter((i) => i.trim()),
        instructions: data.instructions.split("\n").filter((i) => i.trim()),
        cookTime: data.cookTime,
        servings: data.servings,
        difficulty: difficultyToKo(data.difficulty),
        category: data.category,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipe", id] });
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      router.push(`/recipes/${id}`);
    },
    onError: (error) => {
      console.error("수정 실패:", error);
      alert("레시피 수정에 실패했습니다.");
    },
  });

  // 폼 제출
  const onSubmit = (data: RecipeEditFormData) => {
    // 유효성 검사
    const ingredientsArray = data.ingredients
      .split("\n")
      .filter((i) => i.trim());
    const instructionsArray = data.instructions
      .split("\n")
      .filter((i) => i.trim());

    if (ingredientsArray.length < 2) {
      alert("재료는 최소 2개 이상 입력해주세요.");
      return;
    }

    if (instructionsArray.length < 3) {
      alert("조리 순서는 최소 3단계 이상 입력해주세요.");
      return;
    }

    updateMutation.mutate(data);
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

  if (!recipe) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">레시피를 찾을 수 없습니다</h1>
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
      <div className="mb-8">
        <Link href={`/recipes/${id}`}>
          <Button variant="ghost">
            <ArrowLeft className="h-4 w-4 mr-2" />
            뒤로가기
          </Button>
        </Link>
        <h1 className="text-3xl font-bold mt-4">레시피 수정</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="p-6 space-y-6">
          {/* 제목 */}
          <div>
            <label className="block text-sm font-medium mb-2">
              제목 <span className="text-red-500">*</span>
            </label>
            <Input
              {...register("title", {
                required: "제목을 입력해주세요",
                minLength: {
                  value: 2,
                  message: "제목은 최소 2글자 이상이어야 합니다",
                },
              })}
              placeholder="레시피 제목"
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* 설명 */}
          <div>
            <label className="block text-sm font-medium mb-2">설명</label>
            <Textarea
              {...register("description")}
              placeholder="레시피 설명"
              rows={3}
            />
          </div>

          {/* 재료 */}
          <div>
            <label className="block text-sm font-medium mb-2">
              재료 (한 줄에 하나씩) <span className="text-red-500">*</span>
            </label>
            <Textarea
              {...register("ingredients", {
                required: "재료를 입력해주세요",
              })}
              placeholder="예:&#10;감자 2개&#10;양파 1개&#10;당근 1개"
              rows={6}
            />
            {errors.ingredients && (
              <p className="text-sm text-red-500 mt-1">
                {errors.ingredients.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              최소 2개 이상 입력해주세요
            </p>
          </div>

          {/* 조리 순서 */}
          <div>
            <label className="block text-sm font-medium mb-2">
              조리 순서 (한 줄에 하나씩) <span className="text-red-500">*</span>
            </label>
            <Textarea
              {...register("instructions", {
                required: "조리 순서를 입력해주세요",
              })}
              placeholder="예:&#10;1. 감자와 양파를 깍둑썰기합니다&#10;2. 냄비에 기름을 두르고 양파를 볶습니다&#10;3. 감자를 넣고 함께 볶습니다"
              rows={8}
            />
            {errors.instructions && (
              <p className="text-sm text-red-500 mt-1">
                {errors.instructions.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              최소 3단계 이상 입력해주세요
            </p>
          </div>

          {/* 조리 시간, 인분, 난이도 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                조리 시간 (분)
              </label>
              <Input
                type="number"
                {...register("cookTime", {
                  valueAsNumber: true,
                  min: { value: 0, message: "0 이상이어야 합니다" },
                })}
              />
              {errors.cookTime && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.cookTime.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">인분</label>
              <Input
                type="number"
                {...register("servings", {
                  valueAsNumber: true,
                  min: { value: 1, message: "1 이상이어야 합니다" },
                })}
              />
              {errors.servings && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.servings.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">난이도</label>
              <select
                {...register("difficulty")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="easy">쉬움</option>
                <option value="medium">보통</option>
                <option value="hard">어려움</option>
              </select>
            </div>
          </div>

          {/* 카테고리 */}
          <div>
            <label className="block text-sm font-medium mb-2">카테고리</label>
            <Input
              {...register("category")}
              placeholder="예: 한식, 중식, 일식"
            />
          </div>

          {/* 버튼 */}
          <div className="flex gap-2 justify-end">
            <Link href={`/recipes/${id}`}>
              <Button type="button" variant="outline">
                취소
              </Button>
            </Link>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "수정 중..." : "수정 완료"}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
