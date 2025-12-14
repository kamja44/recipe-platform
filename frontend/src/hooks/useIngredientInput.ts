import { useState } from "react";

/**
 * 재료 입력 관리 커스텀 훅
 *
 * @description
 * 재료 입력 UI 상태를 관리하는 훅입니다.
 * - 재료 목록 관리 (추가/삭제)
 * - 현재 입력 중인 재료 관리
 * - Enter 키 이벤트 처리
 *
 * @example
 * const { ingredients, currentIngredient, ... } = useIngredientInput();
 *
 * <Input value={currentIngredient} onChange={(e) => setCurrentIngredient(e.target.value)} />
 * <Button onClick={addIngredient}>추가</Button>
 */
export function useIngredientInput() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState("");

  /**
   * 재료 추가
   * - 빈 문자열은 추가하지 않음
   * - 중복된 재료는 추가하지 않음
   * - 추가 후 입력 필드 초기화
   */
  const addIngredient = () => {
    const trimmed = currentIngredient.trim();

    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed]);
      setCurrentIngredient("");
    }
  };

  /**
   * 재료 삭제
   * @param ingredient - 삭제할 재료명
   */
  const removeIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter((i) => i !== ingredient));
  };

  /**
   * Enter 키 이벤트 핸들러
   * Enter 키를 누르면 재료 추가
   */
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // 폼 제출 방지
      addIngredient();
    }
  };

  /**
   * 모든 재료 초기화
   */
  const clearIngredients = () => {
    setIngredients([]);
    setCurrentIngredient("");
  };

  return {
    ingredients,
    currentIngredient,
    setCurrentIngredient,
    addIngredient,
    removeIngredient,
    handleKeyPress,
    clearIngredients,
  };
}
