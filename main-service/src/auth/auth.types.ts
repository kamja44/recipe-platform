import { User } from '../users/entities/user.entity';

// JWT 페이로드 타입
export interface JwtPayload {
  sub: number; // 사용자 ID
  email: string;
  name: string;
  iat?: number; // issued at (토큰 발급 시간)
  exp?: number; // expiration time (만료 시간)
}

// 로그인 응답 타입
export interface AuthResponse {
  access_token: string;
  user: Omit<User, 'password'>;
}
