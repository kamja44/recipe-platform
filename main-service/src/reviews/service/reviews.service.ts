import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from '../entities/review.entity';
import { Repository } from 'typeorm';
import { CreateReviewDto } from '../dto/create-review.dto';
import { UpdateReviewDto } from '../dto/update-review.dto';

/**
 * Reviews Service
 * - 역할: 리뷰 비즈니스 로직 처리
 * - 기능: CRUD, 평균 평점 계산
 */
@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

  /**
   * 리뷰 생성
   * - 용도: 특정 레시피에 리뷰 작성
   */
  async create(
    recipeId: number,
    userId: number,
    createReviewDto: CreateReviewDto,
  ): Promise<Review> {
    const review = this.reviewRepository.create({
      ...createReviewDto,
      recipeId,
      userId,
    });
    return this.reviewRepository.save(review);
  }

  /**
   * 레시피별 리뷰 목록 조회
   * - 용도: 특정 레시피의 모든 리뷰 가져오기
   * - 정렬: 최신순
   */
  async findByRecipe(recipeId: number): Promise<Review[]> {
    return this.reviewRepository.find({
      where: { recipeId },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * 리뷰 단건 조회
   */
  async findOne(id: number): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException(`리뷰를 찾을 수 없습니다. (ID: ${id})`);
    }

    return review;
  }

  /**
   * 리뷰 수정
   * - 권한 체크: 본인이 작성한 리뷰만 수정 가능
   */
  async update(
    id: number,
    userId: number,
    updateReviewDto: UpdateReviewDto,
  ): Promise<Review> {
    const review = await this.findOne(id);

    // 권한 체크
    if (review.userId !== userId) {
      throw new ForbiddenException('본인이 작성한 리뷰만 수정할 수 있습니다.');
    }

    Object.assign(review, updateReviewDto);
    return this.reviewRepository.save(review);
  }

  /**
   * 리뷰 삭제
   * - 권한 체크: 본인이 작성한 리뷰만 삭제 가능
   */
  async remove(id: number, userId: number): Promise<void> {
    const review = await this.findOne(id);

    // 권한 체크
    if (review.userId !== userId) {
      throw new ForbiddenException('본인이 작성한 리뷰만 삭제할 수 있습니다.');
    }
    await this.reviewRepository.remove(review);
  }

  /**
   * 평균 평점 계산
   * - 용도: 특정 레시피의 평균 별점 및 리뷰 개수
   */
  async getAverageRating(
    recipeId: number,
  ): Promise<{ averageRating: number; totalReviews: number }> {
    const result = await this.reviewRepository
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'averageRating')
      .addSelect('COUNT(review.id)', 'totalReviews')
      .where('review.recipeId = :recipeId', { recipeId })
      .getRawOne<{ averageRating: string; totalReviews: string }>();

    return {
      averageRating: result ? parseFloat(result.averageRating) : 0,
      totalReviews: result ? parseInt(result.totalReviews, 10) : 0,
    };
  }
}
