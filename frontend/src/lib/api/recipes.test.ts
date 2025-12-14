import { describe, it, expect, vi, beforeEach } from "vitest";
import { getRecipes, getRecipeById, createRecipe, updateRecipe, deleteRecipe } from "./recipes";
import { apiClient } from "./client";
import { mockRecipes, mockRecipeDetail } from "@/test/mockData";

// apiClient 모킹
vi.mock("./client");

describe("Recipe API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getRecipes", () => {
    it("should fetch recipes with pagination", async () => {
      // Given: API 응답 모킹
      const mockResponse = {
        data: {
          recipes: mockRecipes,
          total: 3,
          page: 1,
          limit: 10,
        },
      };
      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      // When: getRecipes 호출
      const result = await getRecipes(1, 10);

      // Then: 올바른 엔드포인트 호출 및 데이터 반환
      expect(apiClient.get).toHaveBeenCalledWith("/recipes", {
        params: { page: 1, limit: 10 },
      });
      expect(result).toEqual(mockResponse.data);
    });

    it("should fetch recipes with search query", async () => {
      // Given: 검색어가 있는 경우
      const searchQuery = "토마토";
      const mockResponse = {
        data: {
          recipes: [mockRecipes[0]],
          total: 1,
          page: 1,
          limit: 10,
        },
      };
      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      // When: 검색어와 함께 호출
      const result = await getRecipes(1, 10, searchQuery);

      // Then: 검색 엔드포인트 호출
      expect(apiClient.get).toHaveBeenCalledWith(
        `/recipes/search/ingredient?q=${encodeURIComponent(searchQuery)}`,
        { params: { page: 1, limit: 10 } }
      );
      expect(result.recipes).toHaveLength(1);
    });

    it("should fetch recipes with category filter", async () => {
      // Given: 카테고리 필터가 있는 경우
      const category = "양식";
      const mockResponse = {
        data: {
          recipes: [mockRecipes[0]],
          total: 1,
          page: 1,
          limit: 10,
        },
      };
      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      // When: 카테고리와 함께 호출
      const result = await getRecipes(1, 10, undefined, category);

      // Then: 카테고리 엔드포인트 호출
      expect(apiClient.get).toHaveBeenCalledWith(`/recipes/category/${category}`, {
        params: { page: 1, limit: 10 },
      });
    });
  });

  describe("getRecipeById", () => {
    it("should fetch recipe detail by id", async () => {
      // Given: API 응답 모킹
      const mockResponse = { data: mockRecipeDetail };
      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      // When: getRecipeById 호출
      const result = await getRecipeById(1);

      // Then: 올바른 엔드포인트 호출 및 데이터 반환
      expect(apiClient.get).toHaveBeenCalledWith("/recipes/1");
      expect(result).toEqual(mockRecipeDetail);
      expect(result.id).toBe(1);
      expect(result.ingredients).toBeDefined();
    });

    it("should throw error when recipe not found", async () => {
      // Given: 404 에러 응답
      const error = new Error("Recipe not found");
      vi.mocked(apiClient.get).mockRejectedValue(error);

      // When & Then: 에러가 발생함
      await expect(getRecipeById(999)).rejects.toThrow("Recipe not found");
    });
  });

  describe("createRecipe", () => {
    it("should create new recipe", async () => {
      // Given: 새 레시피 데이터
      const newRecipe = {
        title: "새로운 레시피",
        description: "테스트 레시피",
        category: "한식",
        difficulty: "쉬움",
        cookTime: 30,
        servings: 2,
        ingredients: ["재료1", "재료2"],
        instructions: ["1단계", "2단계"],
      };
      const mockResponse = { data: { ...newRecipe, id: 4 } };
      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

      // When: createRecipe 호출
      const result = await createRecipe(newRecipe);

      // Then: POST 요청 및 생성된 레시피 반환
      expect(apiClient.post).toHaveBeenCalledWith("/recipes", newRecipe);
      expect(result.id).toBe(4);
      expect(result.title).toBe(newRecipe.title);
    });

    it("should validate required fields", async () => {
      // Given: 필수 필드가 없는 데이터
      const invalidRecipe = {
        title: "",
        ingredients: [],
      };
      const error = new Error("Validation failed");
      vi.mocked(apiClient.post).mockRejectedValue(error);

      // When & Then: 유효성 검증 에러
      await expect(createRecipe(invalidRecipe as any)).rejects.toThrow();
    });
  });

  describe("updateRecipe", () => {
    it("should update existing recipe", async () => {
      // Given: 수정할 데이터
      const updateData = {
        title: "수정된 제목",
        description: "수정된 설명",
      };
      const mockResponse = {
        data: { ...mockRecipeDetail, ...updateData },
      };
      vi.mocked(apiClient.patch).mockResolvedValue(mockResponse);

      // When: updateRecipe 호출
      const result = await updateRecipe(1, updateData);

      // Then: PATCH 요청 및 수정된 레시피 반환
      expect(apiClient.patch).toHaveBeenCalledWith("/recipes/1", updateData);
      expect(result.title).toBe(updateData.title);
      expect(result.description).toBe(updateData.description);
    });

    it("should throw error when recipe not found", async () => {
      // Given: 존재하지 않는 레시피
      const error = new Error("Recipe not found");
      vi.mocked(apiClient.patch).mockRejectedValue(error);

      // When & Then: 에러 발생
      await expect(updateRecipe(999, {})).rejects.toThrow("Recipe not found");
    });
  });

  describe("deleteRecipe", () => {
    it("should delete recipe successfully", async () => {
      // Given: 삭제 성공 응답
      vi.mocked(apiClient.delete).mockResolvedValue({ data: null });

      // When: deleteRecipe 호출
      await deleteRecipe(1);

      // Then: DELETE 요청
      expect(apiClient.delete).toHaveBeenCalledWith("/recipes/1");
    });

    it("should throw error when recipe not found", async () => {
      // Given: 존재하지 않는 레시피
      const error = new Error("Recipe not found");
      vi.mocked(apiClient.delete).mockRejectedValue(error);

      // When & Then: 에러 발생
      await expect(deleteRecipe(999)).rejects.toThrow("Recipe not found");
    });

    it("should throw error when unauthorized", async () => {
      // Given: 권한 없음 (401)
      const error = new Error("Unauthorized");
      vi.mocked(apiClient.delete).mockRejectedValue(error);

      // When & Then: 권한 에러 발생
      await expect(deleteRecipe(1)).rejects.toThrow("Unauthorized");
    });
  });
});
