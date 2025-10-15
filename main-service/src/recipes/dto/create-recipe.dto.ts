import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateRecipeDto {
  @ApiProperty({
    example: '김치찌개',
    description: '레시피 제목',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: '얼큰하고 맛있는 김치찌개',
    description: '레시피 설명',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: ['김치 300g', '돼지고기 200g', '두부 1모'],
    description: '재료 목록',
  })
  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  ingredients: string[];

  @ApiProperty({
    example: ['김치를 볶습니다', '물을 넣고 끓입니다', '두부를 넣습니다'],
    description: '조리 순서',
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  instructions: string[];

  @ApiPropertyOptional({
    example: {
      calories: 250,
      protein: 15,
      carbs: 20,
      fat: 10,
    },
    description: '영양 정보',
  })
  @IsOptional()
  @IsObject()
  nutrition?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };

  @ApiPropertyOptional({
    example: 'easy',
    description: '난이도 (easy, medium, hard',
  })
  @IsOptional()
  @IsString()
  difficulty?: string;

  @ApiPropertyOptional({
    example: 30,
    description: '조리 시간 (분)',
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  cookTime?: number;

  @ApiPropertyOptional({
    example: 2,
    description: '인분 수',
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  servings?: number;

  @ApiPropertyOptional({
    example: '한식',
    description: '카테고리',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    example: 1,
    description: '작성자 ID',
  })
  @IsOptional()
  @IsNumber()
  userId?: number;
}
