import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: '로그인 이메일 주소',
  })
  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다.' })
  @IsNotEmpty({ message: '이메일은 필수입니다.' })
  email: string;

  @ApiProperty({
    example: 'password',
    description: '로그인 패스워드',
  })
  @IsString({ message: '패스워드는 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '패스워드는 필수입니다.' })
  password: string;
}
