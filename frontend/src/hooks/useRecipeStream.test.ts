import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useRecipeStream } from "./useRecipeStream";

// EventSource 모킹
class MockEventSource {
  url: string;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  readyState = 0;

  constructor(url: string) {
    this.url = url;
    this.readyState = 1; // OPEN
  }

  close() {
    this.readyState = 2; // CLOSED
  }
}

global.EventSource = MockEventSource as unknown as typeof EventSource;

describe("useRecipeStream", () => {
  let mockEventSource: MockEventSource;

  beforeEach(() => {
    vi.clearAllMocks();
    mockEventSource = new MockEventSource("test-url");
  });

  afterEach(() => {
    if (mockEventSource) {
      mockEventSource.close();
    }
  });

  it("should initialize with empty state", () => {
    // When: 훅 초기화
    const { result } = renderHook(() => useRecipeStream());

    // Then: 초기 상태 확인
    expect(result.current.recipe).toBe("");
    expect(result.current.isStreaming).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("should start streaming when generateRecipe is called", async () => {
    // Given: 재료 목록
    const ingredients = ["토마토", "파스타"];
    const { result } = renderHook(() => useRecipeStream());

    // When: generateRecipe 호출
    await act(async () => {
      result.current.generateRecipe(ingredients);
    });

    // Then: 스트리밍 시작
    expect(result.current.isStreaming).toBe(true);
    expect(result.current.recipe).toBe("");
  });

  it("should accumulate streaming content", async () => {
    // Given: 스트리밍 시작
    const { result } = renderHook(() => useRecipeStream());

    await act(async () => {
      result.current.generateRecipe(["토마토"]);
    });

    // When: 스트리밍 데이터 수신
    const eventSource = mockEventSource;
    if (eventSource.onmessage) {
      await act(async () => {
        eventSource.onmessage(
          new MessageEvent("message", {
            data: JSON.stringify({ content: "토마토 " }),
          })
        );
      });

      await act(async () => {
        eventSource.onmessage(
          new MessageEvent("message", {
            data: JSON.stringify({ content: "파스타" }),
          })
        );
      });
    }

    // Then: 내용이 누적됨
    expect(result.current.recipe).toContain("토마토");
    expect(result.current.recipe).toContain("파스타");
  });

  it("should stop streaming when done", async () => {
    // Given: 스트리밍 중
    const { result } = renderHook(() => useRecipeStream());

    await act(async () => {
      result.current.generateRecipe(["토마토"]);
    });

    // When: 완료 메시지 수신
    const eventSource = mockEventSource;
    if (eventSource.onmessage) {
      await act(async () => {
        eventSource.onmessage(
          new MessageEvent("message", {
            data: JSON.stringify({ done: true }),
          })
        );
      });
    }

    // Then: 스트리밍 종료
    expect(result.current.isStreaming).toBe(false);
  });

  it("should handle streaming error", async () => {
    // Given: 스트리밍 시작
    const { result } = renderHook(() => useRecipeStream());

    await act(async () => {
      result.current.generateRecipe(["토마토"]);
    });

    // When: 에러 발생
    const eventSource = mockEventSource;
    if (eventSource.onerror) {
      await act(async () => {
        eventSource.onerror(new Event("error"));
      });
    }

    // Then: 에러 상태 설정
    expect(result.current.error).not.toBeNull();
    expect(result.current.isStreaming).toBe(false);
  });

  it("should reset state on new generate call", async () => {
    // Given: 이전 레시피 존재
    const { result } = renderHook(() => useRecipeStream());

    await act(async () => {
      result.current.generateRecipe(["토마토"]);
    });

    const eventSource = mockEventSource;
    if (eventSource.onmessage) {
      await act(async () => {
        eventSource.onmessage(
          new MessageEvent("message", {
            data: JSON.stringify({ content: "이전 레시피" }),
          })
        );
      });
    }

    // When: 새로운 generateRecipe 호출
    await act(async () => {
      result.current.generateRecipe(["김치"]);
    });

    // Then: 상태 초기화
    expect(result.current.recipe).toBe("");
    expect(result.current.error).toBeNull();
  });
});
