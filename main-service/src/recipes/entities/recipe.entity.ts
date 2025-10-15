import { Review } from 'src/reviews/entities/review.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('recipes')
export class Recipe {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('simple-array')
  ingredients: string[];

  @Column('simple-array')
  instructions: string[];

  @Column('simple-array', { nullable: true })
  tips: string[];

  @Column({ default: 0 })
  cookTime: number;

  @Column({ default: 1 })
  servings: number;

  @Column({ default: 'easy' })
  difficulty: string;

  @Column({ default: 'general' })
  category: string;

  @Column('simple-json', { nullable: true })
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.recipes)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  userId: number;

  @OneToMany(() => Review, (review) => review.recipe)
  reviews: Review[];
}
