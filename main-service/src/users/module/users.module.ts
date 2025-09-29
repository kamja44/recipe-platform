import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UsersController } from '../controller/users.controller';
import { UsersService } from '../service/users.service';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // UserRepository 등록
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController], // HTTP 인터페이스 등록
  providers: [UsersService], //비즈니스 로직 서비스 등록
  exports: [UsersService], // 다른 모듈에서 사용 가능하도록 내보내기
})
export class UsersModule {}
