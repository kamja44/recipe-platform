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
      useFactory: (configService: ConfigService) => {
        const databaseUrl = process.env.DATABASE_URL;
        const isProduction = process.env.NODE_ENV === 'production';

        // 프로덕션: DATABASE_URL 사용 (Neon, Fly.io)
        if (databaseUrl) {
          return {
            type: 'postgres',
            url: databaseUrl,
            entities: [User, Recipe, Review],
            synchronize: !isProduction, // 프로덕션에서는 false
            ssl: isProduction ? { rejectUnauthorized: true } : false,
            logging: !isProduction,
          };
        }

        // 로컬 개발: 개별 환경변수 사용
        return {
          type: 'postgres',
          host: configService.get('database.host'),
          port: configService.get('database.port'),
          username: configService.get('database.username'),
          password: configService.get('database.password'),
          database: configService.get('database.database'),
          entities: [User, Recipe, Review],
          synchronize: true, // 로컬에서만 true
          logging: true,
        };
      },
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
