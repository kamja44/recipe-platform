import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: '사용자 이메일 주소',
  })
  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다.' })
  @IsNotEmpty({ message: '이메일은 필수입니다.' })
  email: string;

  @ApiProperty({
    example: '사용자',
    description: '사용자 이름',
  })
  @IsString({ message: '이른은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '이름은 필수입니다.' })
  username: string;

  @ApiProperty({
    example: 'password',
    description: '사용자 패스워드 (최소 8자)',
  })
  @IsString({ message: '패스워드는 문자열이어야 합니다.' })
  @MinLength(8, { message: '패스워드는 최소 8자 이상이어야 합니다.' })
  @IsNotEmpty({ message: '패스워드는 필수입니다.' })
  password: string;
}
