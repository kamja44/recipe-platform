import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/testUtils";
import { RecipeCard } from "./RecipeCard";
import { mockRecipe } from "@/test/mockData";

describe("RecipeCard", () => {
  it("should render recipe information correctly", () => {
    // Given: RecipeCard 렌더링
    render(<RecipeCard recipe={mockRecipe} />);

    // Then: 레시피 정보가 표시됨
    expect(screen.getByText(mockRecipe.title)).toBeInTheDocument();
    expect(screen.getByText(mockRecipe.description)).toBeInTheDocument();
    expect(screen.getByText(mockRecipe.category)).toBeInTheDocument();
    expect(screen.getByText(mockRecipe.difficulty)).toBeInTheDocument();
  });

  it("should display cooking time and servings", () => {
    // Given: RecipeCard 렌더링
    render(<RecipeCard recipe={mockRecipe} />);

    // Then: 조리 시간과 인분 수가 표시됨
    expect(screen.getByText(`${mockRecipe.cookTime}분`)).toBeInTheDocument();
    expect(
      screen.getByText(`${mockRecipe.servings}인분`)
    ).toBeInTheDocument();
  });

  it("should render as link when href is provided", () => {
    // Given: href prop과 함께 렌더링
    const href = `/recipes/${mockRecipe.id}`;
    render(<RecipeCard recipe={mockRecipe} href={href} />);

    // Then: Link 컴포넌트로 래핑됨
    const linkElement = screen.getByRole("link");
    expect(linkElement).toHaveAttribute("href", href);
  });

  it("should render without link when href is not provided", () => {
    // Given: href 없이 렌더링
    render(<RecipeCard recipe={mockRecipe} />);

    // Then: Link가 없음
    const linkElements = screen.queryAllByRole("link");
    expect(linkElements).toHaveLength(0);
  });

  it("should apply correct CSS classes", () => {
    // Given: RecipeCard 렌더링
    const { container } = render(<RecipeCard recipe={mockRecipe} />);

    // Then: 카드 스타일이 적용됨
    const card = container.querySelector(".rounded-lg");
    expect(card).toBeInTheDocument();
  });
});
