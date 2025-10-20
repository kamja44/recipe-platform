import { useState } from "react";

interface StreamEvent {
  content?: string;
  done?: boolean;
  error?: string;
}

export function useRecipeStream() {
  const [recipe, setRecipe] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateRecipe = async (
    ingredients: string[],
    preferences?: string
  ) => {
    setRecipe("");
    setIsStreaming(true);
    setError(null);

    const eventSource = new EventSource(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
      }/recipes/generate-ai-stream?` +
        new URLSearchParams({
          ingredients: JSON.stringify(ingredients),
          preferences: preferences || "",
        })
    );

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data) as StreamEvent;

      if (data.done) {
        eventSource.close();
        setIsStreaming(false);
      } else if (data.error) {
        setError(data.error);
        eventSource.close();
        setIsStreaming(false);
      } else if (data.content) {
        setRecipe((prev) => prev + data.content);
      }
    };

    eventSource.onerror = () => {
      setError("스트리밍 연결 오류");
      eventSource.close();
      setIsStreaming(false);
    };
  };

  return { recipe, isStreaming, error, generateRecipe };
}
