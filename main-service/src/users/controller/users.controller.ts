import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from '../service/users.service';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';
import { LoginUserDto } from '../dto/login-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { AuthService } from '../../auth/auth.service';
import { AuthResponse } from '../../auth/auth.types';
import { JwtAuthGuard } from '../../auth/auth.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  // 회원가입
  // POST /users/register
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: '회원가입',
    description: '새로운 사용자를 등록합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '사용자가 성공적으로 등록되었습니다.',
  })
  @ApiResponse({
    status: 409,
    description: '이미 사용 중인 이메일입니다.',
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청 데이터',
  })
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<Omit<User, 'password'>> {
    return this.usersService.register(createUserDto);
  }

  // 로그인
  // POST /users/login
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '로그인',
    description: '사용자 인증을 수행하고 JWT 토큰을 발급합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '로그인이 성공했습니다. JWT 토큰이 발급됩니다.',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: 1,
          email: 'user@example.com',
          name: '감자',
          createdAt: '2024-09-29T...',
          updatedAt: '2024-09-29T...',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '잘못된 인증 정보입니다.',
  })
  async login(@Body() loginUserDto: LoginUserDto): Promise<AuthResponse> {
    return this.authService.login(loginUserDto);
  }

  // 사용자 프로필 조회
  // GET /users/:id
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '사용자 프로필 조회',
    description: '특정 사용자의 프로필을 조회합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '사용자 ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: '사용자 프로필을 성공적으로 조회했습니다.',
  })
  @ApiResponse({
    status: 404,
    description: '사용자를 찾을 수 없습니다.',
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Omit<User, 'password'>> {
    return this.usersService.findOne(id);
  }

  // 사용자 프로필 수정
  // PATCH /users/:id
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '사용자 프로필 수정',
    description: '사용자의 프로필 정보를 수정합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '사용자 ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: '프로필이 성공적으로 수정되었습니다.',
  })
  @ApiResponse({
    status: 404,
    description: ' 사용자를 찾을 수 없습니다.',
  })
  @ApiResponse({
    status: 409,
    description: '이메일이 이미 사용 중입니다.',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    return this.usersService.update(id, updateUserDto);
  }
}
