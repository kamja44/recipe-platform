import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

/**
 * 리뷰 생성 DTO
 */
export class CreateReviewDto {
  @ApiProperty({
    example: 5,
    description: '평점 (1-5)',
    minimum: 1,
    maximum: 5,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({
    example: '정말 맛있었어요! 가족 모두가 좋아했습니다.',
    description: '리뷰 내용',
  })
  @IsNotEmpty()
  @IsString()
  comment: string;
}
