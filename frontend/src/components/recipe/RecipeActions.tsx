"use client";

import { useAuth } from "@/hooks/useAuth";
import { deleteRecipe } from "@/lib/api/recipes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import { Edit, Trash2 } from "lucide-react";
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

/**
 * RecipeActions 컴포넌트
 * - 역할: 레시피 수정/삭제 버튼
 * - 기능: 권한 체크, 삭제 모달, 수정 페이지 이동
 */

interface RecipeActionsProps {
  recipeId: number;
  authorId: number;
}

export function RecipeActions({ recipeId, authorId }: RecipeActionsProps) {
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  // 권한 체크: 본인 레시피만 수정/삭제 가능
  const canEdit = user?.id === authorId;

  // 삭제 Mutation
  const deleteMutation = useMutation({
    mutationFn: () => deleteRecipe(recipeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      router.push("/recipes");
    },
    onError: (error) => {
      console.error("삭제 실패", error);
      alert("삭제에 실패했습니다.");
    },
  });

  if (!canEdit || !authorId) {
    return null;
  }

  // 수정 페이지로 이동
  const handleEdit = () => {
    router.push(`/recipes/${recipeId}/edit`);
  };

  // 삭제 실행
  const handleDelete = () => {
    deleteMutation.mutate();
    setIsOpen(false);
  };

  return (
    <div className="flex gap-2 justify-end">
      {/* 수정 버튼 */}
      <Button onClick={handleEdit} variant="outline">
        <Edit className="h-4 w-4 mr-2" />
        수정
      </Button>

      {/* 삭제 버튼 */}
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            삭제
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>레시피를 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              이 작업은 되돌릴 수 없습니다. 레시피가 영구적으로 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "삭제 중..." : "삭제"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
