/**
 * Reviews Controller
 * - 역할: 리뷰 API 엔드포인트 제공
 * - 인증: JWT 토큰 필수
 */

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReviewsService } from '../service/reviews.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { CreateReviewDto } from '../dto/create-review.dto';
import { UpdateReviewDto } from '../dto/update-review.dto';

/**
 * JWT 인증된 요청 타입
 * - req.user에 사용자 정보 포함
 */
interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    email: string;
  };
}

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  /**
   * 리뷰 생성
   * - POST /recipes/:recipeId/reviews
   */
  @Post('recipes/:recipeId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '리뷰 작성' })
  create(
    @Param('recipeId') recipeId: string,
    @Body() createReviewDto: CreateReviewDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.reviewsService.create(+recipeId, req.user.id, createReviewDto);
  }

  /**
   * 레시피별 리뷰 목록 조회
   * - GET /reviews/recipes/:recipeId
   */
  @Get('recipes/:recipeId')
  @ApiOperation({ summary: '레시피별 리뷰 목록 조회' })
  findByRecipe(@Param('recipeId') recipeId: string) {
    return this.reviewsService.findByRecipe(+recipeId);
  }

  /**
   * 평균 평점 조회
   * - GET /reviews/recipes/:recipeId/average
   */
  @Get('recipes/:recipeId/average')
  @ApiOperation({ summary: '레시피 평균 별점 조회' })
  getAverageRating(@Param('recipeId') recipeId: string) {
    return this.reviewsService.getAverageRating(+recipeId);
  }

  /**
   * 리뷰 수정
   * - PATCH /reviews/:id
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '리뷰 수정' })
  update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.reviewsService.update(+id, req.user.id, updateReviewDto);
  }

  /**
   * 리뷰 삭제
   * - DELETE /reviews/:id
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '리뷰 삭제',
  })
  async remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    await this.reviewsService.remove(+id, req.user.id);
    return {
      message: '리뷰가 삭제되었습니다.',
    };
  }
}
