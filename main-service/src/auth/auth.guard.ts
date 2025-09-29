import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // 가본 AuthGuard('jwt')를 확장
  // 필요하면 추가 로직을 여기에 구현
}
