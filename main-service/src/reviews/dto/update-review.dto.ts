import { PartialType } from '@nestjs/mapped-types';
import { CreateReviewDto } from './create-review.dto';

/**
 * 리뷰 수정 DTO
 * - CreateReviewDto의 모든 필드를 optional로 변경
 */
export class UpdateReviewDto extends PartialType(CreateReviewDto) {}
