import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional, IsEnum } from 'class-validator';

export enum AIProvider {
  OPENAI = 'openai',
  CLAUDE = 'claude',
}

export class GenerateRecipeDto {
  @ApiProperty({
    description: '재료 목록',
    example: ['토마토', '계란', '양파'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  ingredients: string[];

  @ApiProperty({
    description: '추가 요구사항 (선택)',
    example: '매운맛으로, 10분 이내로',
    required: false,
  })
  @IsOptional()
  @IsString()
  preferences?: string;

  @ApiProperty({
    description: 'AI 제공자 선택',
    enum: AIProvider,
    default: AIProvider.OPENAI,
    required: false,
  })
  @IsOptional()
  @IsEnum(AIProvider)
  provider?: AIProvider;
}
