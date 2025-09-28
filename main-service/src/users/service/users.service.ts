import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from '../dto/login-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UsersService {
  private readonly saltRounds = 10; // Salt Round

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // 회원가입
  async register(
    createUserDto: CreateUserDto,
  ): Promise<Omit<User, 'password'>> {
    // 이메일 중복 확인
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }

    // 패스워드 해싱
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      this.saltRounds,
    );

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);

    // 패스워드 제외하고 반환(보안)
    const { password, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }

  // 로그인
  async login(loginUserDto: LoginUserDto): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findOne({
      where: { email: loginUserDto.email },
    });

    if (!user) {
      throw new UnauthorizedException(
        '이메일 또는 패스워드가 올바르지 않습니다.',
      );
    }

    // 패스워드 검증
    const isPasswordValid = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        '이메일 또는 패스워드가 올바르지 않습니다.',
      );
    }

    // 패스워드 제외하고 반환
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // 프로필 조회
  async findOne(id: number): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['recipes'], // 사용자의 레시피도 함께 조회
    });

    if (!user) {
      throw new NotFoundException(`ID ${id}번 사용자를 찾을 수 없습니다.`);
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // 이메일로 사용자 조회
  async findByEmail(email: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['recipes'],
    });

    if (!user) {
      return null;
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // 프로필 수정
  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    const existingUser = await this.userRepository.findOne({ where: { id } });

    if (!existingUser) {
      throw new NotFoundException(`ID ${id}번 사용자를 찾을 수 없습니다.`);
    }

    // 이메일 변경 시 중복 확인
    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const emailExists = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });

      if (emailExists) {
        throw new ConflictException('이미 존재하는 이메일입니다.');
      }
    }

    // 패스워드 변경 시 해싱
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        this.saltRounds,
      );
    }

    const updatedUser = {
      ...existingUser,
      ...updateUserDto,
    };

    const savedUser = await this.userRepository.save(updatedUser);
    const { password, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }

  // 회원 탈퇴
  async remove(id: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`ID ${id}번 사용자를 찾을 수 없습니다.`);
    }

    await this.userRepository.remove(user);
  }

  // 사용자별 레시피 개수 조회
  async getUserRecipeCount(
    id: number,
  ): Promise<{ user: Omit<User, 'password'>; recipeCount: number }> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['recipes'],
    });

    if (!user) {
      throw new NotFoundException(`ID ${id}번 사용자를 찾을 수 없습니다.`);
    }

    const { password, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      recipeCount: user.recipes.length,
    };
  }

  // 패스워드 검증 헬퍼 메서드
  async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
