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
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Bearer 토큰에서추출
      ignoreExpiration: false, // 만료된 토큰 거부
      secretOrKey: configService.get<string>('jwt.secret') || 'fallback-secret', // JWT 시크릿 키
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
