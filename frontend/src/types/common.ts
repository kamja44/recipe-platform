import { RecipeData } from "./recipe";

export interface FeatureCard {
  emoji: string;
  title: string;
  description: string;
}

export interface CTASection {
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
}

export interface Recipe {
  id: number;
  title: string;
  description: string;
  cookTime: number;
  servings: number;
  difficulty: string;
}

export interface IngredientsInputProps {
  ingredients: string[];
  currentIngredient: string;
  onCurrentIngredientChange: (value: string) => void;
  onAddIngredient: () => void;
  onRemoveIngredient: (ingredient: string) => void;
  onGetRecommendations: () => void;
  isLoading: boolean;
}

export interface RecommendationResultsProps {
  recipes: RecipeData[];
  isLoading: boolean;
  onSaveRecipe?: (recipe: RecipeData) => void;
  isSaving?: boolean;
}

export interface RecipeListItem {
  id: number;
  title: string;
  description: string;
  image?: string;
  cookTime?: number;
  servings?: number;
  difficulty?: string;
  category?: string;
}

export interface RecipeDetail extends RecipeListItem {
  ingredients: string[];
  instructions: string[];
  tips: string[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  userId: number | null;
}
