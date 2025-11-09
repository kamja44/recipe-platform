import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { JwtPayload } from './auth.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private authService: AuthService,
  ) {
    const jwtSecret = configService.get<string>('jwt.secret');

    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Bearer 토큰에서 추출
      ignoreExpiration: false, // 만료된 토큰 거부
      secretOrKey: jwtSecret, // JWT 시크릿 키 (fallback 제거)
    });
  }

  async validate(payload: any) {
    const user = await this.authService.validateUser(payload as JwtPayload);

    if (!user) {
      throw new UnauthorizedException('토큰이 유효하지 않스빈다.');
    }
    // req.user에 사용자 정보가 자동으로 설정됨
    return user;
  }
}
