import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { Recipe } from '../entities/recipe.entity';
import { RecipesController } from '../controller/recipes.controller';
import { RecipesService } from '../service/recipes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Recipe]), // Recipe Repository 등록
    HttpModule, // FastAPI 호출을 위한 HTTP 모듈
  ],
  controllers: [RecipesController], // HTTP 인터페이스 등록
  providers: [RecipesService], // 비즈니스 로직 서비스 등록
  exports: [RecipesService], //다른 모듈에서 사용 가능하도록 내보내기
})
export class RecipesModule {}
