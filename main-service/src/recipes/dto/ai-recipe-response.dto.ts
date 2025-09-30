import { ApiProperty } from '@nestjs/swagger';

// 중첩된 레시피 데이터 클래스
export class RecipeDataDto {
  @ApiProperty({
    description: '요리명',
    example: '토마토 스크램블 에그',
  })
  recipe_name: string;

  @ApiProperty({
    description: '재료 목록',
    example: ['토마토 2개', '계란 3개', '양파 1/2개'],
    type: [String],
  })
  ingredients_list: string[];

  @ApiProperty({
    description: '조리 순서',
    example: ['1. 토마토를 썬다', '2. 계란을 푼다'],
    type: [String],
  })
  instructions: string[];

  @ApiProperty({
    description: '조리 시간',
    example: '10분',
  })
  cooking_time: string;

  @ApiProperty({
    description: '난이도',
    example: '쉬움',
  })
  difficulty: string;

  @ApiProperty({
    description: 'AI 원본 응답',
    example: '요리명: 토마토 스크램블...',
  })
  raw_response: string;
}

export class AIRecipeResponseDto {
  @ApiProperty({
    description: '성공 여부',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: '응답 메시지',
    example: '레시피 생성이 완료되었습니다.',
  })
  message: string;

  @ApiProperty({
    description: '레시피 데이터',
    type: RecipeDataDto, // ← 명시적 타입 클래스
  })
  data: RecipeDataDto;
}
