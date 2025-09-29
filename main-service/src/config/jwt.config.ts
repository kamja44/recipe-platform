import { registerAs } from '@nestjs/config';

export default registerAs('jst', () => ({
  secret:
    process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
}));
