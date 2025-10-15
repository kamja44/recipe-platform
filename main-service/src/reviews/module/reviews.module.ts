import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from '../entities/review.entity';
import { ReviewsController } from '../controller/reviews.controller';
import { ReviewsService } from '../service/reviews.service';

/**
 * Reviews Module
 * - 역할: 리뷰 기능 모듈
 */
@Module({
  imports: [TypeOrmModule.forFeature([Review])],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
