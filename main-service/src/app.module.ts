import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import databaseConfig from './config/database.config';
import { User } from './users/entities/user.entity';
import { Recipe } from './recipes/entities/recipe.entity';
import { RecipesModule } from './recipes/module/recipes.module';
import { UsersModule } from './users/module/users.module';
import jwtConfig from './config/jwt.config';
import { AuthModule } from './auth/auth.module';
import { ReviewsModule } from './reviews/module/reviews.module';
import { Review } from './reviews/entities/review.entity';

@Module({
  imports: [
    // 환경변수 설정
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig],
    }),

    // TypeORM 설정
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        entities: [User, Recipe, Review], // 나중에 Entity 추가
        synchronize: true, // 개발 환경에서만 true
      }),
      inject: [ConfigService],
    }),
    RecipesModule,
    UsersModule,
    AuthModule,
    ReviewsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
