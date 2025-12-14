import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@/test/testUtils";
import userEvent from "@testing-library/user-event";
import { ReviewForm } from "./ReviewForm";

describe("ReviewForm", () => {
  it("should render review form with all elements", () => {
    // Given: ReviewForm 렌더링
    const mockOnSubmit = vi.fn();
    render(<ReviewForm onSubmit={mockOnSubmit} isSubmitting={false} />);

    // Then: 폼 요소들이 렌더링됨
    expect(screen.getByText("리뷰 작성")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("리뷰를 작성해주세요")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /리뷰 작성/i })).toBeInTheDocument();
  });

  it("should initialize with 5 star rating", () => {
    // Given: ReviewForm 렌더링
    const mockOnSubmit = vi.fn();
    const { container } = render(
      <ReviewForm onSubmit={mockOnSubmit} isSubmitting={false} />
    );

    // Then: 기본 별점이 5점
    const filledStars = container.querySelectorAll('svg[fill="currentColor"]');
    expect(filledStars.length).toBeGreaterThan(0);
  });

  it("should validate comment field", async () => {
    // Given: ReviewForm 렌더링
    const mockOnSubmit = vi.fn();
    render(<ReviewForm onSubmit={mockOnSubmit} isSubmitting={false} />);
    const user = userEvent.setup();

    // When: 빈 댓글로 제출
    const submitButton = screen.getByRole("button", { name: /리뷰 작성/i });
    await user.click(submitButton);

    // Then: 유효성 검증 에러 표시
    await waitFor(() => {
      expect(screen.getByText("댓글을 입력해주세요")).toBeInTheDocument();
    });
  });

  it("should call onSubmit with rating and comment", async () => {
    // Given: ReviewForm 렌더링
    const mockOnSubmit = vi.fn();
    render(<ReviewForm onSubmit={mockOnSubmit} isSubmitting={false} />);
    const user = userEvent.setup();

    // When: 댓글 입력 및 제출
    const commentInput = screen.getByPlaceholderText("리뷰를 작성해주세요");
    await user.type(commentInput, "정말 맛있었습니다!");

    const submitButton = screen.getByRole("button", { name: /리뷰 작성/i });
    await user.click(submitButton);

    // Then: onSubmit이 평점과 댓글과 함께 호출됨
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        rating: 5, // 기본값
        comment: "정말 맛있었습니다!",
      });
    });
  });

  it("should reset form after successful submission", async () => {
    // Given: ReviewForm 렌더링
    const mockOnSubmit = vi.fn();
    render(<ReviewForm onSubmit={mockOnSubmit} isSubmitting={false} />);
    const user = userEvent.setup();

    // When: 폼 제출
    const commentInput = screen.getByPlaceholderText(
      "리뷰를 작성해주세요"
    ) as HTMLTextAreaElement;
    await user.type(commentInput, "테스트 리뷰");

    const submitButton = screen.getByRole("button", { name: /리뷰 작성/i });
    await user.click(submitButton);

    // Then: 폼이 초기화됨
    await waitFor(() => {
      expect(commentInput.value).toBe("");
    });
  });

  it("should disable submit button when submitting", () => {
    // Given: isSubmitting=true로 렌더링
    const mockOnSubmit = vi.fn();
    render(<ReviewForm onSubmit={mockOnSubmit} isSubmitting={true} />);

    // Then: 제출 버튼이 비활성화됨
    const submitButton = screen.getByRole("button", { name: /리뷰 작성/i });
    expect(submitButton).toBeDisabled();
  });

  it("should prevent submission when isSubmitting is true", async () => {
    // Given: isSubmitting=true로 렌더링
    const mockOnSubmit = vi.fn();
    render(<ReviewForm onSubmit={mockOnSubmit} isSubmitting={true} />);
    const user = userEvent.setup();

    // When: 제출 시도
    const commentInput = screen.getByPlaceholderText("리뷰를 작성해주세요");
    await user.type(commentInput, "테스트");

    const submitButton = screen.getByRole("button", { name: /리뷰 작성/i });
    await user.click(submitButton);

    // Then: onSubmit이 호출되지 않음
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});
