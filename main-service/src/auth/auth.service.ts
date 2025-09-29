import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { UsersService } from 'src/users/service/users.service';
import { AuthResponse, JwtPayload } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async login(loginUserDto: LoginUserDto): Promise<AuthResponse> {
    // 사용자 검증(기존 UsersService의 validateUser 활용)
    const user = await this.usersService.login(loginUserDto);

    // JWT 페이로드 생성
    const payload: JwtPayload = {
      sub: user.id, // subject: 사용자 ID
      email: user.email,
      name: user.username,
    };

    // JWT 토큰 생성 및 반환
    return {
      access_token: this.jwtService.sign(payload),
      user: user,
    };
  }

  async validateUser(payload: JwtPayload) {
    // JWT에서 추출한 정보로 사용자 조회
    return this.usersService.findOne(payload.sub);
  }
}
