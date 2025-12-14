import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useIngredientInput } from "./useIngredientInput";

describe("useIngredientInput", () => {
  it("should initialize with empty state", () => {
    // When: 훅 초기화
    const { result } = renderHook(() => useIngredientInput());

    // Then: 초기 상태 확인
    expect(result.current.ingredients).toEqual([]);
    expect(result.current.currentIngredient).toBe("");
  });

  describe("addIngredient", () => {
    it("should add ingredient to list", () => {
      // Given: 훅 초기화
      const { result } = renderHook(() => useIngredientInput());

      // When: 재료 입력 후 추가
      act(() => {
        result.current.setCurrentIngredient("토마토");
      });

      act(() => {
        result.current.addIngredient();
      });

      // Then: 재료가 추가되고 입력 필드가 초기화됨
      expect(result.current.ingredients).toEqual(["토마토"]);
      expect(result.current.currentIngredient).toBe("");
    });

    it("should trim whitespace when adding ingredient", () => {
      // Given: 훅 초기화
      const { result } = renderHook(() => useIngredientInput());

      // When: 공백이 있는 재료 입력
      act(() => {
        result.current.setCurrentIngredient("  토마토  ");
      });

      act(() => {
        result.current.addIngredient();
      });

      // Then: 공백이 제거된 재료가 추가됨
      expect(result.current.ingredients).toEqual(["토마토"]);
    });

    it("should not add empty ingredient", () => {
      // Given: 훅 초기화
      const { result } = renderHook(() => useIngredientInput());

      // When: 빈 문자열로 추가 시도
      act(() => {
        result.current.setCurrentIngredient("");
      });

      act(() => {
        result.current.addIngredient();
      });

      // Then: 재료가 추가되지 않음
      expect(result.current.ingredients).toEqual([]);
    });

    it("should not add whitespace-only ingredient", () => {
      // Given: 훅 초기화
      const { result } = renderHook(() => useIngredientInput());

      // When: 공백만 있는 문자열로 추가 시도
      act(() => {
        result.current.setCurrentIngredient("   ");
      });

      act(() => {
        result.current.addIngredient();
      });

      // Then: 재료가 추가되지 않음
      expect(result.current.ingredients).toEqual([]);
    });

    it("should not add duplicate ingredient", () => {
      // Given: 이미 재료가 추가된 상태
      const { result } = renderHook(() => useIngredientInput());

      act(() => {
        result.current.setCurrentIngredient("토마토");
        result.current.addIngredient();
      });

      // When: 동일한 재료 추가 시도
      act(() => {
        result.current.setCurrentIngredient("토마토");
        result.current.addIngredient();
      });

      // Then: 중복이 추가되지 않음
      expect(result.current.ingredients).toEqual(["토마토"]);
    });

    it("should add multiple different ingredients", () => {
      // Given: 훅 초기화
      const { result } = renderHook(() => useIngredientInput());

      // When: 여러 재료 추가
      act(() => {
        result.current.setCurrentIngredient("토마토");
        result.current.addIngredient();
      });

      act(() => {
        result.current.setCurrentIngredient("양파");
        result.current.addIngredient();
      });

      act(() => {
        result.current.setCurrentIngredient("감자");
        result.current.addIngredient();
      });

      // Then: 모든 재료가 순서대로 추가됨
      expect(result.current.ingredients).toEqual(["토마토", "양파", "감자"]);
    });
  });

  describe("removeIngredient", () => {
    it("should remove ingredient from list", () => {
      // Given: 재료가 추가된 상태
      const { result } = renderHook(() => useIngredientInput());

      act(() => {
        result.current.setCurrentIngredient("토마토");
        result.current.addIngredient();
        result.current.setCurrentIngredient("양파");
        result.current.addIngredient();
      });

      // When: 재료 삭제
      act(() => {
        result.current.removeIngredient("토마토");
      });

      // Then: 해당 재료만 삭제됨
      expect(result.current.ingredients).toEqual(["양파"]);
    });

    it("should remove specific ingredient from multiple ingredients", () => {
      // Given: 여러 재료가 추가된 상태
      const { result } = renderHook(() => useIngredientInput());

      act(() => {
        result.current.setCurrentIngredient("토마토");
        result.current.addIngredient();
        result.current.setCurrentIngredient("양파");
        result.current.addIngredient();
        result.current.setCurrentIngredient("감자");
        result.current.addIngredient();
      });

      // When: 중간 재료 삭제
      act(() => {
        result.current.removeIngredient("양파");
      });

      // Then: 해당 재료만 삭제되고 순서 유지
      expect(result.current.ingredients).toEqual(["토마토", "감자"]);
    });

    it("should do nothing when removing non-existent ingredient", () => {
      // Given: 재료가 추가된 상태
      const { result } = renderHook(() => useIngredientInput());

      act(() => {
        result.current.setCurrentIngredient("토마토");
        result.current.addIngredient();
      });

      // When: 존재하지 않는 재료 삭제 시도
      act(() => {
        result.current.removeIngredient("양파");
      });

      // Then: 아무 변화 없음
      expect(result.current.ingredients).toEqual(["토마토"]);
    });
  });

  describe("handleKeyPress", () => {
    it("should add ingredient when Enter key is pressed", () => {
      // Given: 훅 초기화 및 재료 입력
      const { result } = renderHook(() => useIngredientInput());

      act(() => {
        result.current.setCurrentIngredient("토마토");
      });

      // When: Enter 키 이벤트
      const enterEvent = {
        key: "Enter",
        preventDefault: () => {},
      } as React.KeyboardEvent<HTMLInputElement>;

      act(() => {
        result.current.handleKeyPress(enterEvent);
      });

      // Then: 재료가 추가됨
      expect(result.current.ingredients).toEqual(["토마토"]);
      expect(result.current.currentIngredient).toBe("");
    });

    it("should not add ingredient when other key is pressed", () => {
      // Given: 훅 초기화 및 재료 입력
      const { result } = renderHook(() => useIngredientInput());

      act(() => {
        result.current.setCurrentIngredient("토마토");
      });

      // When: Space 키 이벤트
      const spaceEvent = {
        key: " ",
        preventDefault: () => {},
      } as React.KeyboardEvent<HTMLInputElement>;

      act(() => {
        result.current.handleKeyPress(spaceEvent);
      });

      // Then: 재료가 추가되지 않음
      expect(result.current.ingredients).toEqual([]);
      expect(result.current.currentIngredient).toBe("토마토");
    });
  });

  describe("clearIngredients", () => {
    it("should clear all ingredients and current input", () => {
      // Given: 재료가 추가되고 입력 중인 상태
      const { result } = renderHook(() => useIngredientInput());

      act(() => {
        result.current.setCurrentIngredient("토마토");
        result.current.addIngredient();
        result.current.setCurrentIngredient("양파");
        result.current.addIngredient();
        result.current.setCurrentIngredient("감자");
      });

      // When: 모두 초기화
      act(() => {
        result.current.clearIngredients();
      });

      // Then: 모든 상태가 초기화됨
      expect(result.current.ingredients).toEqual([]);
      expect(result.current.currentIngredient).toBe("");
    });

    it("should work correctly when called on empty state", () => {
      // Given: 빈 상태
      const { result } = renderHook(() => useIngredientInput());

      // When: 초기화 호출
      act(() => {
        result.current.clearIngredients();
      });

      // Then: 에러 없이 빈 상태 유지
      expect(result.current.ingredients).toEqual([]);
      expect(result.current.currentIngredient).toBe("");
    });
  });

  describe("setCurrentIngredient", () => {
    it("should update current ingredient", () => {
      // Given: 훅 초기화
      const { result } = renderHook(() => useIngredientInput());

      // When: 현재 재료 입력
      act(() => {
        result.current.setCurrentIngredient("토마토");
      });

      // Then: 현재 재료가 업데이트됨
      expect(result.current.currentIngredient).toBe("토마토");
    });

    it("should allow empty string", () => {
      // Given: 재료가 입력된 상태
      const { result } = renderHook(() => useIngredientInput());

      act(() => {
        result.current.setCurrentIngredient("토마토");
      });

      // When: 빈 문자열로 변경
      act(() => {
        result.current.setCurrentIngredient("");
      });

      // Then: 빈 문자열로 변경됨
      expect(result.current.currentIngredient).toBe("");
    });
  });

  describe("Complex scenarios", () => {
    it("should handle add, remove, and re-add workflow", () => {
      // Given: 훅 초기화
      const { result } = renderHook(() => useIngredientInput());

      // When: 재료 추가
      act(() => {
        result.current.setCurrentIngredient("토마토");
        result.current.addIngredient();
      });

      // When: 재료 삭제
      act(() => {
        result.current.removeIngredient("토마토");
      });

      // When: 같은 재료 다시 추가
      act(() => {
        result.current.setCurrentIngredient("토마토");
        result.current.addIngredient();
      });

      // Then: 재료가 다시 추가됨
      expect(result.current.ingredients).toEqual(["토마토"]);
    });

    it("should maintain order when adding and removing", () => {
      // Given: 여러 재료 추가
      const { result } = renderHook(() => useIngredientInput());

      act(() => {
        ["토마토", "양파", "감자", "당근"].forEach((ingredient) => {
          result.current.setCurrentIngredient(ingredient);
          result.current.addIngredient();
        });
      });

      // When: 중간 재료들 삭제
      act(() => {
        result.current.removeIngredient("양파");
        result.current.removeIngredient("감자");
      });

      // Then: 순서가 유지됨
      expect(result.current.ingredients).toEqual(["토마토", "당근"]);
    });
  });
});
