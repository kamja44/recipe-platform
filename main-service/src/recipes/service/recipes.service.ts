import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Recipe } from '../entities/recipe.entity';
import { Repository } from 'typeorm';
import { CreateRecipeDto } from '../dto/create-recipe.dto';
import { UpdateRecipeDto } from '../dto/update-recipe.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AIRecipeResponseDto } from '../dto/ai-recipe-response.dto';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  // 레시피 생성
  async create(createRecipeDto: CreateRecipeDto): Promise<Recipe> {
    // 재료는 최소 2개 이상
    if (createRecipeDto.ingredients.length < 2) {
      throw new BadRequestException(
        '레시피에는 최소 2개 이상의 재료가 필요합니다.',
      );
    }

    // 조리 순서는 최소 3단계 이상
    if (createRecipeDto.instructions.length < 3) {
      throw new BadRequestException(
        '조리 순서는 최소 3단계 이상이어야 합니다.',
      );
    }

    // DTO => Entity 변환 및 저장
    const recipe = this.recipeRepository.create(createRecipeDto);
    return this.recipeRepository.save(recipe);
  }

  // 모든 레시피 조회(페이지네이션 지원)
  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: Recipe[];
    total: number;
    page: number;
    limit: number;
  }> {
    const [data, total] = await this.recipeRepository.findAndCount({
      relations: ['user'], // User정보도 함께 가져오기
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  // 특정 레시피 조회
  async findOne(id: number): Promise<Recipe> {
    const recipe = await this.recipeRepository.findOne({
      where: { id },
      relations: ['user'], // User정보도 함께 가져오기
    });

    if (!recipe) {
      throw new NotFoundException(`ID ${id}번 레시피를 찾을 수 없습니다.`);
    }

    return recipe;
  }

  // 레시피 수정
  async update(id: number, updateRecipeDto: UpdateRecipeDto): Promise<Recipe> {
    // 기존 레시피 존재 확인
    const existingRecipe = await this.findOne(id);

    // 비즈니스 규칙 검증(수정 시에도 동일)
    const updatedIngredients =
      updateRecipeDto.ingredients || existingRecipe.ingredients;
    const updatedInstructions =
      updateRecipeDto.instructions || existingRecipe.instructions;

    if (updatedIngredients.length < 2) {
      throw new BadRequestException('레시피에는 최소 2개의 재료가 필요합니다');
    }

    if (updatedInstructions.length < 3) {
      throw new BadRequestException('조리 순서는 최소 3단계 이상이어야 합니다');
    }

    // 업데이트 적용
    const updatedRecipe = {
      ...existingRecipe,
      ...updateRecipeDto,
    };

    return this.recipeRepository.save(updatedRecipe);
  }

  // 레시피 삭제
  async remove(id: number): Promise<void> {
    const recipe = await this.findOne(id);

    await this.recipeRepository.remove(recipe);
  }

  // 카테고리별 레시피 조회
  async findByCategory(category: string): Promise<Recipe[]> {
    return this.recipeRepository.find({
      where: { category },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  // 재료로 레시피 검색
  async findByIngredient(ingredient: string): Promise<Recipe[]> {
    return this.recipeRepository
      .createQueryBuilder('recipe')
      .leftJoinAndSelect('recipe.user', 'user')
      .where('LOWER(recipe.ingredients) LIKE LOWER(:ingredient)', {
        ingredient: `%${ingredient}%`,
      })
      .orderBy('recipe.createdAt', 'DESC')
      .getMany();
  }

  // AI를 활용하여 레시피 생성
  async generateRecipeWithAI(
    ingredients: string[],
    preferences?: string,
    provider?: 'openai' | 'claude',
  ): Promise<AIRecipeResponseDto> {
    try {
      // FastAPI 서비스 URL (환경 변수에서 가져오기)
      const aiServiceUrl =
        this.configService.get<string>('AI_SERVICE_URL') ||
        'http://localhost:8000';

      const response = await firstValueFrom(
        this.httpService.post<AIRecipeResponseDto>(
          `${aiServiceUrl}/api/recipes/generate`,
          {
            ingredients,
            preferences,
            provider: provider || 'openai',
          },
        ),
      );

      return response.data;
    } catch (error) {
      // error 타입 가드
      if (error instanceof Error) {
        throw new Error(`AI 레시피 생성 실패: ${error.message}`);
      }
      throw new Error('AI 레시피 생성 중 알 수 없는 오류가 발생했습니다.');
    }
  }
}
