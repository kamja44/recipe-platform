// AI 텍스트 응답을 구조화된 데이터로 파싱
export function parseAIRecipe(text: string) {
  // 요리명 추출
  const titleMatch = text.match(/(?:요리명|레시피명):\s*(.+)/);
  const title = titleMatch ? titleMatch[1].trim() : "AI 추천 레시피";

  // 설명 생성 (첫 문장)
  const description = title + "를 만들어보세요";

  // 재료 추출
  const ingredientsMatch = text.match(
    /재료:\s*([\s\S]*?)(?=조리법|만드는법|조리순서|$)/
  );

  let ingredients: string[] = [];
  if (ingredientsMatch) {
    const rawIngredients = ingredientsMatch[1]
      .split("\n")
      .map((line) => line.replace(/^[-\s*]+/, "").trim())
      .filter((line) => line && line !== "-");

    // 쉼표로 구분된 경우 처리
    ingredients = rawIngredients
      .flatMap((line) =>
        line.includes(",") ? line.split(",").map((item) => item.trim()) : [line]
      )
      .filter((item) => item);
  }

  // 조리법 추출
  const instructionsMatch = text.match(
    /(?:조리법|만드는법|조리순서):\s*([\s\S]*?)(?=조리시간|난이도|$)/
  );
  const instructions = instructionsMatch
    ? instructionsMatch[1]
        .split("\n")
        .map((line) => line.replace(/^[-\d.\s)]+/, "").trim())
        .filter((line) => line && line !== "-")
    : [];

  // 조리시간 추출
  const timeMatch = text.match(/조리시간:\s*(\d+)/);
  const cookTime = timeMatch ? parseInt(timeMatch[1]) : 30;

  // 난이도 추출
  const difficultyMatch = text.match(/난이도:\s*(.+)/);
  const difficulty = difficultyMatch ? difficultyMatch[1].trim() : "보통";

  // 인분 추출 (없으면 기본 2인분)
  const servingsMatch = text.match(/(\d+)인분/);
  const servings = servingsMatch ? parseInt(servingsMatch[1]) : 2;

  return {
    title,
    description,
    ingredients,
    instructions,
    cookTime,
    servings,
    difficulty,
  };
}
