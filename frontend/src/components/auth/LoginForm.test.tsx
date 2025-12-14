import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@/test/testUtils";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "./LoginForm";

describe("LoginForm", () => {
  it("should render login form with all fields", () => {
    // Given: LoginForm 렌더링
    const mockOnSuccess = vi.fn();
    render(<LoginForm onSuccess={mockOnSuccess} isLoading={false} />);

    // Then: 필수 요소들이 렌더링됨
    expect(screen.getByText("로그인")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("이메일을 입력하세요")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("비밀번호를 입력하세요")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /로그인/i })).toBeInTheDocument();
  });

  it("should validate required fields", async () => {
    // Given: LoginForm 렌더링
    const mockOnSuccess = vi.fn();
    render(<LoginForm onSuccess={mockOnSuccess} isLoading={false} />);
    const user = userEvent.setup();

    // When: 빈 폼 제출
    const submitButton = screen.getByRole("button", { name: /로그인/i });
    await user.click(submitButton);

    // Then: 유효성 검증 에러 메시지 표시
    await waitFor(() => {
      expect(screen.getByText("이메일을 입력해주세요")).toBeInTheDocument();
    });
  });

  it("should validate email format", async () => {
    // Given: LoginForm 렌더링
    const mockOnSuccess = vi.fn();
    render(<LoginForm onSuccess={mockOnSuccess} isLoading={false} />);
    const user = userEvent.setup();

    // When: 잘못된 이메일 형식 입력
    const emailInput = screen.getByPlaceholderText("이메일을 입력하세요");
    await user.type(emailInput, "invalid-email");

    const submitButton = screen.getByRole("button", { name: /로그인/i });
    await user.click(submitButton);

    // Then: 이메일 형식 에러 메시지 표시
    await waitFor(() => {
      expect(
        screen.getByText("올바른 이메일 형식이 아닙니다")
      ).toBeInTheDocument();
    });
  });

  it("should call onSuccess with validated data on submit", async () => {
    // Given: LoginForm 렌더링
    const mockOnSuccess = vi.fn();
    render(<LoginForm onSuccess={mockOnSuccess} isLoading={false} />);
    const user = userEvent.setup();

    // When: 올바른 데이터 입력 및 제출
    const emailInput = screen.getByPlaceholderText("이메일을 입력하세요");
    const passwordInput = screen.getByPlaceholderText("비밀번호를 입력하세요");

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");

    const submitButton = screen.getByRole("button", { name: /로그인/i });
    await user.click(submitButton);

    // Then: onSuccess가 검증된 데이터와 함께 호출됨
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  it("should disable submit button when loading", () => {
    // Given: 로딩 상태로 렌더링
    const mockOnSuccess = vi.fn();
    render(<LoginForm onSuccess={mockOnSuccess} isLoading={true} />);

    // Then: 제출 버튼이 비활성화됨
    const submitButton = screen.getByRole("button", { name: /로그인/i });
    expect(submitButton).toBeDisabled();
  });

  it("should toggle password visibility", async () => {
    // Given: LoginForm 렌더링
    const mockOnSuccess = vi.fn();
    render(<LoginForm onSuccess={mockOnSuccess} isLoading={false} />);
    const user = userEvent.setup();

    // When: 비밀번호 입력
    const passwordInput = screen.getByPlaceholderText(
      "비밀번호를 입력하세요"
    ) as HTMLInputElement;
    await user.type(passwordInput, "password123");

    // Then: 초기에는 password 타입
    expect(passwordInput.type).toBe("password");

    // When: 눈 아이콘 클릭
    const toggleButton = passwordInput.parentElement?.querySelector("button");
    if (toggleButton) {
      await user.click(toggleButton);
      // Then: text 타입으로 변경 (비밀번호 표시)
      expect(passwordInput.type).toBe("text");
    }
  });

  it("should prevent submission when loading", async () => {
    // Given: 로딩 상태로 렌더링
    const mockOnSuccess = vi.fn();
    render(<LoginForm onSuccess={mockOnSuccess} isLoading={true} />);
    const user = userEvent.setup();

    // When: 폼 입력 시도
    const emailInput = screen.getByPlaceholderText("이메일을 입력하세요");
    await user.type(emailInput, "test@example.com");

    const submitButton = screen.getByRole("button", { name: /로그인/i });
    await user.click(submitButton);

    // Then: onSuccess가 호출되지 않음
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });
});
