import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RecipesService } from '../service/recipes.service';
import { Recipe } from '../entities/recipe.entity';
import { CreateRecipeDto } from '../dto/create-recipe.dto';
import { UpdateRecipeDto } from '../dto/update-recipe.dto';

@ApiTags('recipes')
@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  // POST /recipes => 레시피 생성
  @Post()
  @ApiOperation({
    summary: '레시피 생성',
    description: '새로운 레시피를 생성합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '레시피가 성공적으로 생성되었습니다.',
    type: Recipe,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청 데이터 (비즈니스 규칙 위반)',
  })
  async create(@Body() createRecipeDto: CreateRecipeDto): Promise<Recipe> {
    return this.recipesService.create(createRecipeDto);
  }

  // GET /recipes => 모든 레시피 조회 (페이지네이션)
  @Get()
  @ApiOperation({
    summary: '레시피 목록 조회',
    description: '페이지네이션을 지원하는 레시피 목록을 조회합니다.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: '페이지 번호 (기본값: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: '페이지당 항목 수 (기본값: 10)',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: '레시피 목록 조회 성공',
    schema: {
      properties: {
        data: { type: 'array', items: { $ref: '#/components/schemas/Recipe' } },
        total: { type: 'number', example: 50 },
        page: { type: 'number', example: 1 },
        limit: { type: 'number', example: 10 },
      },
    },
  })
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.recipesService.findAll(page, limit);
  }

  // GET /recipes/:id => 특정 레시피 조회
  @Get(':id')
  @ApiOperation({
    summary: '레시피 상세 조회',
    description: 'ID로 특정 레시피를 조회합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '레시피 ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: '레시피 조회 성공',
    type: Recipe,
  })
  @ApiResponse({
    status: 404,
    description: '레시피를 찾을 수 없습니다.',
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Recipe> {
    return this.recipesService.findOne(id);
  }

  // PATCH /recipes/:id => 레시피 부분 수정
  @Patch(':id')
  @ApiOperation({
    summary: '레시피 수정',
    description: '레시피 정보를 부분적으로 수정합니다',
  })
  @ApiParam({
    name: 'id',
    description: '수정할 레시피 ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: '레시피 수정 성공',
    type: Recipe,
  })
  @ApiResponse({
    status: 404,
    description: '레시피를 찾을 수 없습니다.',
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청 데이터',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRecipeDto: UpdateRecipeDto,
  ): Promise<Recipe> {
    return this.recipesService.update(id, updateRecipeDto);
  }

  // DELETE /recipes/:id => 레시피 삭제
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: '레시피 삭제',
    description: '레시피를 삭제합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '삭제할 레시피 ID',
    example: 1,
  })
  @ApiResponse({
    status: 204,
    description: '레시피 삭제 성공',
  })
  @ApiResponse({
    status: 404,
    description: '레시피를 찾을 수 없습니다.',
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.recipesService.remove(id);
  }

  // GET /recipes/category/:category => 카테고리별 레시피 조회
  @Get('category/:category')
  @ApiOperation({
    summary: '카테고리별 레시피 조회',
    description: '특정 카테고리의 레시피들을 조회합니다.',
  })
  @ApiParam({
    name: 'category',
    description: '레시피 카테고리',
    example: '한식',
  })
  @ApiResponse({
    status: 200,
    description: '카테고리별 레시피 조회 성공',
    type: [Recipe],
  })
  async findByCategory(@Param('category') category: string): Promise<Recipe[]> {
    return this.recipesService.findByCategory(category);
  }

  // GET /recipes/search/ingredient => 재료료 레시피 검색
  @Get('search/ingredient')
  @ApiOperation({
    summary: '재료로 레시피 검색',
    description: '특정 재료가 포함된 레시피들을 검색합니다.',
  })
  @ApiQuery({
    name: 'q',
    description: '검색할 재료명',
    example: '감자',
  })
  @ApiResponse({
    status: 200,
    description: '재료 검색 성공',
    type: [Recipe],
  })
  async findByIngredient(@Query('q') ingredient: string): Promise<Recipe[]> {
    return this.recipesService.findByIngredient(ingredient);
  }
}
