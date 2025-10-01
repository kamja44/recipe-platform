import { Recipe } from 'src/recipes/entities/recipe.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Review Entity
 * - 역할: 레시피 리뷰 및 평점 데이터
 * - 관계:
 *   - User (ManyToOne): 작성자
 *   - Recipe (ManyToOne): 대상 레시피
 */
@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * 평점 (1-5)
   */
  @Column('int')
  rating: number;

  /**
   * 리뷰 내용
   */
  @Column('text')
  comment: string;

  /**
   * 작성자 (User)
   */
  @ManyToOne(() => User, (user) => user.reviews, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  /**
   * 대상 레시피 (Recipe)
   */
  @ManyToOne(() => Recipe, (recipe) => recipe.reviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipeId' })
  recipe: Recipe;

  @Column()
  recipeId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
