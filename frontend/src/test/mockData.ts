import { SavedRecipe as Recipe } from "@/types/recipe";
import { RecipeDetail } from "@/types/common";
import { Review, AverageRating } from "@/types/review";
import { User } from "@/types/auth";

export const mockUser: User = {
  id: 1,
  email: "test@example.com",
  username: "testuser",
  createdAt: "2025-01-01T00:00:00Z",
};

export const mockRecipe: Recipe = {
  id: 1,
  title: "토마토 파스타",
  description: "신선한 토마토로 만드는 간단한 파스타",
  category: "양식",
  difficulty: "쉬움",
  cookTime: 30,
  servings: 2,
  ingredients: ["토마토 3개", "파스타면 200g"],
  instructions: ["면을 삶는다", "소스를 만든다"],
  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: "2025-01-01T00:00:00Z",
};

export const mockRecipeDetail: RecipeDetail = {
  id: 1,
  title: "토마토 파스타",
  description: "신선한 토마토로 만드는 간단한 파스타",
  image: "🍝",
  category: "양식",
  difficulty: "쉬움",
  cookTime: 30,
  servings: 2,
  ingredients: ["토마토 3개", "파스타면 200g", "올리브오일 2스푼", "마늘 3쪽"],
  instructions: [
    "냄비에 물을 끓인다",
    "파스타면을 7분간 삶는다",
    "토마토를 잘게 썬다",
    "팬에 올리브오일과 마늘을 볶는다",
    "토마토를 넣고 졸인다",
    "삶은 파스타를 넣고 버무린다",
  ],
  tips: ["파스타면은 알덴테로 삶으세요"],
  nutrition: {
    calories: 450,
    protein: 12,
    carbs: 65,
    fat: 15,
  },
  userId: 1,
};

export const mockRecipes: Recipe[] = [
  mockRecipe,
  {
    id: 2,
    title: "김치찌개",
    description: "얼큰한 김치찌개",
    category: "한식",
    difficulty: "보통",
    cookTime: 40,
    servings: 4,
    ingredients: ["김치", "돼지고기"],
    instructions: ["볶는다", "끓인다"],
    createdAt: "2025-01-02T00:00:00Z",
    updatedAt: "2025-01-02T00:00:00Z",
  },
  {
    id: 3,
    title: "초콜릿 케이크",
    description: "촉촉한 초콜릿 케이크",
    category: "디저트",
    difficulty: "어려움",
    cookTime: 60,
    servings: 8,
    ingredients: ["초콜릿", "밀가루"],
    instructions: ["섞는다", "굽는다"],
    createdAt: "2025-01-03T00:00:00Z",
    updatedAt: "2025-01-03T00:00:00Z",
  },
];

export const mockReview: Review = {
  id: 1,
  recipeId: 1,
  userId: 1,
  user: {
    id: 1,
    email: "test@example.com",
    username: "testuser",
  },
  rating: 5,
  comment: "정말 맛있어요!",
  createdAt: "2025-01-05T00:00:00Z",
  updatedAt: "2025-01-05T00:00:00Z",
};

export const mockReviews: Review[] = [
  mockReview,
  {
    id: 2,
    recipeId: 1,
    userId: 2,
    user: {
      id: 2,
      email: "user2@example.com",
      username: "user2",
    },
    rating: 4,
    comment: "맛있었습니다",
    createdAt: "2025-01-06T00:00:00Z",
    updatedAt: "2025-01-06T00:00:00Z",
  },
];

export const mockAverageRating: AverageRating = {
  averageRating: 4.5,
  totalReviews: 2,
};
