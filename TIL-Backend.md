# TIL Backend - AI Recipe Platform

## 📝 Backend 개발 시작 - NestJS & 마이크로서비스 학습 (2024-09-28)

### 🏗️ **마이크로서비스 아키텍처 설계**

#### **서비스 분리 전략**
- **NestJS 메인 서비스** (포트: 3000): 사용자 인증, 레시피 CRUD, 리뷰 관리
- **FastAPI AI 서비스** (포트: 8000): AI 레시피 추천, 재료 인식, 영양분석

#### **환경 설정 파일 관리**
```
project/
├── main-service/.env     # NestJS 전용 (DB, JWT 설정)
├── ai-service/.env       # FastAPI 전용 (OpenAI API, AI 모델)
└── docker-compose.yml    # 서비스 간 네트워크 및 포트 설정
```

### 🛠️ **NestJS 프로젝트 구조 설계**

```
main-service/src/
├── auth/           # 🔐 JWT 인증, 로그인/회원가입
├── users/          # 👤 사용자 관리 (프로필, 계정)
├── recipes/        # 🍳 레시피 CRUD (생성, 조회, 수정, 삭제)
├── reviews/        # ⭐ 리뷰 및 평점 시스템
├── common/        # 공통 모듈 (DTO, Guards, Decorators)
├── config/        # 설정 파일 (데이터베이스, JWT)
└── database/      # 데이터베이스 연결 및 설정
```

#### **NestJS 필수 패키지 이해**

**코어 패키지:**
- **@nestjs/typeorm**: ORM 연동
- **class-validator**: DTO 검증
- **class-transformer**: 데이터 변환
- **@nestjs/config**: 환경 설정 관리
- **@nestjs/swagger**: API 문서화 자동 생성

### 🔍 **TypeORM & PostgreSQL 연동 개념**

#### **핵심 구성 요소**
- **Entity**: 데이터베이스 테이블과 매핑되는 클래스
- **Repository**: 데이터 접근 계층 (CRUD 작업)
- **Relation**: 테이블 간 관계 설정 (1:N, N:M 등)

```typescript
// User Entity 예시
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Recipe, (recipe) => recipe.user)
  recipes: Recipe[];
}

// Recipe Entity 예시
@Entity('recipes')
export class Recipe {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.recipes)
  user: User;
}
```

### 🛠️ **NestJS 데이터베이스 연동 설정 상세 분석**

#### **1. 환경 설정 구조화**

```typescript
// config/database.config.ts
export default registerAs('database', () => ({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'recipe_platform',
}));
```

#### **2. AppModule에서 TypeORM 설정하는 이유**

**NestJS 의존성 주입(DI) 시스템:**
```typescript
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,  // 모든 모듈에서 ConfigService 사용 가능
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        // ConfigService를 통해 설정값 주입받음
        type: 'postgres',
        host: configService.get('database.host'),
      }),
      inject: [ConfigService],  // 의존성 명시
    }),
  ],
})
export class AppModule {}
```

**핵심 설정 옵션:**
- **isGlobal: true**: ConfigService를 앱 전체에서 사용 가능
- **useFactory**: 비동기 설정 로딩 지원
- **inject**: 의존성 주입 순서 보장

#### **3. synchronize 옵션의 의미**
- **true**: Entity 변경 시 자동으로 데이터베이스 스키마 동기화
- **false**: 프로덕션 환경에서 권장 (마이그레이션 수동 관리)

**주의사항:**
> 프로덕션에서는 `synchronize: false`로 설정하고 마이그레이션을 통해 스키마를 관리해야 함

#### **4. NestJS 모듈 시스템의 동작 원리**

```typescript
@Module({
  imports: [ConfigModule, TypeOrmModule.forRootAsync(...)],
  controllers: [AppController],            // HTTP 요청 처리
  providers: [AppService],                 // 비즈니스 로직 서비스
})
```

**초기화 순서:**
1. **ConfigModule 초기화** → 환경 변수 로딩
2. **TypeOrmModule 초기화** → ConfigService를 주입받아 DB 연결
3. **Controller/Provider 초기화** → 필요한 의존성들이 준비된 후 생성

**핵심 원칙:**
1. **관심사 분리**: 설정, 비즈니스 로직, 데이터 접근 계층 분리
2. **의존성 주입**: NestJS의 DI 컨테이너 활용
3. **환경별 설정**: 개발/스테이징/프로덕션 환경 분리
4. **타입 안전성**: TypeScript + 설정 인터페이스 활용

---

## 📝 TypeORM Entity 설계 - 데이터베이스 모델링 학습 (2024-09-28)

### 🎯 **Entity를 만드는 이유**

#### **Entity란?**
- **데이터베이스 테이블과 TypeScript 클래스를 매핑하는 객체**
- **ORM(Object-Relational Mapping)의 핵심 구성 요소**
- **비즈니스 로직과 데이터 구조를 하나의 클래스로 통합**

#### **왜 Entity를 설계해야 하는가?**

```typescript
// ❌ Entity 없이 직접 SQL 사용 (문제점)
const user = await database.query(
  'INSERT INTO users (email, name) VALUES (?, ?)',
  [email, name]
);
// 문제: 타입 안전성 없음, SQL 인젝션 위험, 코드 재사용 어려움

// ✅ Entity 사용 (해결)
const user = userRepository.create({ email, name });
await userRepository.save(user);
// 장점: 타입 안전성, 자동 검증, 객체지향적 접근
```

**Entity 사용의 핵심 이점:**
- **타입 안전성**: 컴파일 타임에 데이터 구조 검증
- **자동 검증**: 데코레이터를 통한 데이터 유효성 검증
- **코드 재사용**: 비즈니스 로직을 Entity에 포함 가능
- **관계 관리**: 테이블 간 관계를 객체 관계로 자연스럽게 표현
- **쿼리 최적화**: TypeORM이 효율적인 SQL 자동 생성

### 🏗️ **TypeORM Annotation 상세 분석**

#### **1. 기본 Entity Annotations**

```typescript
@Entity('users')  // 테이블 이름 지정
export class User {
  @PrimaryGeneratedColumn()  // 자동 증가 기본키
  id: number;

  @Column({ unique: true })  // 유니크 제약조건
  email: string;

  @Column({ length: 100 })  // 문자열 길이 제한
  name: string;

  @Column({ select: false })  // 기본 조회에서 제외 (비밀번호 등)
  password: string;

  @CreateDateColumn()  // 생성 시간 자동 설정
  createdAt: Date;

  @UpdateDateColumn()  // 수정 시간 자동 갱신
  updatedAt: Date;

  @Column('simple-array')  // 배열 데이터
  tags: string[];

  @Column('json', { nullable: true })  // JSON 형태 데이터
  preferences: Record<string, any>;
}
```

#### **2. 고급 Column 옵션들**

```typescript
@Column({
  type: 'varchar',        // 데이터 타입 명시
  length: 255,           // 길이 제한
  nullable: true,        // NULL 허용
  unique: true,          // 유니크 제약
  default: 'basic',      // 기본값
  comment: '사용자 등급', // 컬럼 설명
})
level: string;

@Column('decimal', { precision: 10, scale: 2 })  // 소수점 정밀도
price: number;

@Column('enum', { enum: RecipeCategory })  // Enum 타입
category: RecipeCategory;
```

### 🔍 **TypeORM 관계 어노테이션 문법 상세 분석**

#### **@OneToMany 상세 분석**

```typescript
@OneToMany(
  () => Recipe,           // 1️⃣ 관련 Entity 타입 (Lazy Loading)
  (recipe) => recipe.user, // 2️⃣ 역방향 관계 설정
  {
    cascade: true,         // 3️⃣ 연쇄 작업 설정
    eager: false,          // 4️⃣ 즉시 로딩 여부
    onDelete: 'CASCADE',   // 5️⃣ 삭제 시 동작
  }
)
recipes: Recipe[];
```

**문법 구성 요소:**
- **첫 번째 인자**: `() => Recipe` → 순환 참조 방지를 위한 Lazy Loading
- **두 번째 인자**: `(recipe) => recipe.user` → 반대편 Entity의 어떤 속성이 이 관계를 담당하는지 명시
- **세 번째 인자**: 옵션 객체 → 관계 동작 방식 설정

#### **@ManyToOne과 @JoinColumn**

```typescript
// User Entity의 recipes 속성이
// Recipe Entity의 어떤 속성과 연결되는지 명시
@OneToMany(() => Recipe, (recipe) => recipe.user)
recipes: Recipe[];

// Recipe Entity에서
@ManyToOne(() => User, (user) => user.recipes)
@JoinColumn({ name: 'user_id' })  // 외래키 컬럼명 지정
user: User;
```

**관계 설정 동작 원리:**
```typescript
// User Entity (One 쪽)
// "이 사용자는 여러 레시피를 가질 수 있다"
@OneToMany(() => Recipe, recipe => recipe.user)
recipes: Recipe[];

// Recipe Entity (Many 쪽)
// "이 레시피는 한 명의 사용자에게 속한다"
@ManyToOne(() => User, user => user.recipes)
user: User;
```

**실제 데이터베이스 동작:**
```sql
-- 1. users 테이블과 recipes 테이블 생성
-- 2. recipes 테이블에 user_id 외래키 생성
-- 3. 저장 시 TypeORM이 자동으로 관계 동기화
```

#### **관계 설정의 핵심 이점**

**1. 자동 JOIN 쿼리 생성**
```typescript
// TypeORM이 자동으로 JOIN 쿼리 생성
const user = await userRepository.findOne({
  where: { id: 1 },
  relations: ['recipes']  // 관련 레시피도 함께 조회
});
```

**2. 객체지향적 데이터 접근**
```typescript
// 관계를 통한 자연스러운 객체 탐색
console.log(user.recipes[0].title);  // 첫 번째 레시피 제목
console.log(recipe.user.name);       // 레시피 작성자 이름
```

**3. 데이터 무결성 보장**
- 외래키 제약조건 자동 생성
- cascade 옵션으로 관련 데이터 자동 관리
- TypeORM이 자동으로 관계 동기화 및 외래키 관리

### 🔧 **AppModule에 Entity 등록하기**

```typescript
// app.module.ts
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        entities: [User, Recipe], // 🎯 Entity 등록
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

#### **Entity 등록의 핵심 역할**

**1. 📋 TypeORM 메타데이터 등록**
```typescript
// TypeORM이 Entity 클래스를 스캔하고 메타데이터 수집
// @Entity, @Column, @PrimaryGeneratedColumn 등의 데코레이터 정보 분석
```

**2. 🛠️ 데이터베이스 스키마 동기화**
```sql
-- synchronize: true 옵션으로 Entity 기반 테이블 자동 생성
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**3. 🔍 Repository 패턴 활성화**
```typescript
// Entity 등록 후 Repository 사용 가능
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)  // Entity 등록으로 자동 주입 가능
    private userRepository: Repository<User>,
  ) {}
}
```

**4. 🔗 관계 매핑 활성화**
```typescript
// Entity 간 관계가 활성화되어 JOIN 쿼리 가능
const userWithRecipes = await this.userRepository.findOne({
  where: { id: 1 },
  relations: ['recipes'],  // 관계 로딩
});
```

#### **Entity 등록 없이 발생하는 문제들**

```typescript
// ❌ Entity 미등록 시 발생하는 에러들
// Error: Entity "User" not found
// Error: Repository for "User" not found
// Error: Cannot create connection to database
```

#### **Entity 등록 방식 비교**

**1. 직접 등록 (권장 - 소규모 프로젝트)**
```typescript
entities: [User, Recipe, Review, Category]
// 장점: 명시적, 타입 안전성
// 단점: Entity 추가 시마다 수동 등록 필요
```

**2. 자동 스캔 (대규모 프로젝트)**
```typescript
entities: ['dist/**/*.entity{.ts,.js}']
// 장점: 자동화, 확장성
// 단점: 런타임 에러 가능성, 빌드 경로 의존성
```

**3. 환경별 설정**
```typescript
entities: process.env.NODE_ENV === 'production'
  ? ['dist/**/*.entity.js']  // 프로덕션: 컴파일된 JS
  : ['src/**/*.entity.ts'],  // 개발: TypeScript 소스

  synchronize: true,  // Entity 변경 시 자동 테이블 업데이트
```

### **핵심 정리**

**Entity 설계의 핵심 원칙:**
- **비즈니스 도메인 반영**: 실제 비즈니스 요구사항을 Entity 구조로 모델링
- **관계 명확성**: Entity 간 관계를 명확하게 정의하여 데이터 무결성 보장
- **확장성 고려**: 미래 요구사항 변경에 대비한 유연한 구조 설계

- Entity 등록은 TypeORM이 클래스를 인식하고 데이터베이스와 매핑하기 위한 필수 과정
- Repository 패턴, 관계 매핑, 자동 테이블 생성이 모두 Entity 등록에 의존
- 프로젝트 규모와 팀 상황에 맞는 적절한 등록 방식 선택이 중요

---

## 🏗️ **NestJS CRUD API 구현 아키텍처**

### 📋 **NestJS의 핵심 구성 요소와 역할**

```
┌─────────────────────────────────────────┐
│            HTTP 요청/응답               │
├─────────────────────────────────────────┤
│   Controller    │ ←─ 📡 HTTP 요청/응답 처리
├─────────────────┤
        ↓ DTO 검증
├─────────────────┤
│     Service     │ ←─ 🧠 핵심 비즈니스 로직
├─────────────────┤
        ↓ Entity 조작
├─────────────────┤
│   Repository    │ ←─ 🗄️ 데이터 접근 계층
├─────────────────┤
        ↓ SQL 쿼리
├─────────────────┤
│    Database     │ ←─ 💾 PostgreSQL
└─────────────────┘
```

### 🎯 **1. DTO (Data Transfer Object) - 데이터 전송 객체**

#### **DTO의 정의와 역할**

```typescript
// 📝 DTO는 계층 간 데이터 전송을 위한 객체
export class CreateRecipeDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '레시피 제목' })
  title: string;

  @IsArray()
  @ArrayMinSize(2)
  @ApiProperty({ description: '재료 목록' })
  ingredients: string[];

  @IsArray()
  @ArrayMinSize(3)
  @ApiProperty({ description: '조리 순서' })
  instructions: string[];
}
```

**DTO의 핵심 목적:**
- **🔍 입력 검증**: class-validator로 데이터 유효성 검증
- **🛡️ 보안**: Entity 직접 노출 방지
- **📚 문서화**: Swagger API 문서 자동 생성
- **🎯 계층 분리**: Controller와 Service 간 명확한 데이터 계약

#### **DTO vs Entity 차이점**

```typescript
// 🏗️ Entity: 데이터베이스 스키마와 1:1 매핑
@Entity('recipes')
export class Recipe {
  @PrimaryGeneratedColumn()
  id: number;                    // DB에서 자동 생성

  @CreateDateColumn()
  createdAt: Date;               // 시스템에서 자동 설정

  @ManyToOne(() => User)
  user: User;                    // 인증을 통해 자동 연결
}

// 📦 DTO: 클라이언트와의 데이터 교환용
export class CreateRecipeDto {
  // id, createdAt, user는 제외
  // 클라이언트가 입력하는 데이터만 포함
  title: string;
  ingredients: string[];
  instructions: string[];
}
```

### 🧠 **2. Service - 비즈니스 로직 계층**

#### **Service의 정의와 역할**

```typescript
@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,
  ) {}

  async createRecipe(createRecipeDto: CreateRecipeDto): Promise<Recipe> {
    // 🔍 비즈니스 규칙 검증
    if (createRecipeDto.ingredients.length < 2) {
      throw new BadRequestException('재료는 최소 2개 이상이어야 합니다');
    }

    // 🏗️ Entity 생성 및 저장
    const recipe = this.recipeRepository.create(createRecipeDto);
    return await this.recipeRepository.save(recipe);
  }
}
```

**Service가 담당하는 책임:**
- **🧠 비즈니스 로직**: 도메인 규칙과 정책 구현
- **🔄 데이터 처리**: Entity와 DTO 간 변환
- **🗄️ 데이터 접근**: Repository를 통한 데이터베이스 작업
- **⚠️ 예외 처리**: 비즈니스 예외 상황 처리

#### **Service가 없다면?**

```typescript
// ❌ Controller에 비즈니스 로직이 섞인 나쁜 예
@Controller('recipes')
export class RecipesController {
  @Post()
  async create(@Body() createRecipeDto: CreateRecipeDto) {
    // 🚫 Controller에서 직접 DB 접근
    const recipe = this.recipeRepository.create(createRecipeDto);

    // 🚫 Controller에서 비즈니스 로직 처리
    if (recipe.ingredients.length < 2) {
      throw new BadRequestException('재료 부족');
    }

    return await this.recipeRepository.save(recipe);
  }
}
// 문제점: 재사용 불가, 테스트 어려움, 책임 혼재
```

### 📡 **3. Controller - HTTP 인터페이스 계층**

#### **Controller의 정의와 역할**

```typescript
@Controller('recipes')
@ApiTags('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post()
  @ApiOperation({ summary: '새 레시피 생성' })
  async create(@Body() createRecipeDto: CreateRecipeDto) {
    // 🎯 HTTP 요청 → Service 호출 → HTTP 응답
    return this.recipesService.createRecipe(createRecipeDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.recipesService.findOne(+id);
  }
}
```

**Controller의 핵심 책임:**
- **📡 HTTP 매핑**: URL 경로와 HTTP 메서드를 실제 함수로 연결
- **🔄 응답 변환**: Service 결과 → HTTP 응답 형태로 변환
- **📚 API 문서화**: Swagger 어노테이션으로 API 스펙 정의
- **🔍 입력 검증**: Pipe를 통한 기본적인 데이터 변환

#### **Controller의 계층 분리 원칙**

```typescript
// ✅ 올바른 Controller: 얇은 계층 (Thin Layer)
@Controller('recipes')
export class RecipesController {
  @Post()
  async create(@Body() dto: CreateRecipeDto) {
    return this.recipesService.createRecipe(dto);  // Service에 위임
  }
}

// ❌ 잘못된 Controller: 두꺼운 계층 (Fat Layer)
@Controller('recipes')
export class RecipesController {
  @Post()
  async create(@Body() dto: CreateRecipeDto) {
    // 🚫 Controller에서 복잡한 비즈니스 로직 처리
    // 🚫 Controller에서 직접 데이터베이스 접근
    // 🚫 Controller에서 외부 API 호출
  }
}
```

---

## 🔐 **UsersService - 인증 및 보안 구현**

### **핵심 인증 로직 구현**

```typescript
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // 🔐 회원가입: 패스워드 해싱 및 이메일 중복 확인
  async register(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email }
    });

    if (existingUser) {
      throw new ConflictException('이미 사용 중인 이메일입니다');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);
    const { password, ...result } = savedUser;
    return result;
  }

  // 🔑 로그인: 패스워드 검증
  async validateUser(loginUserDto: LoginUserDto): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findOne({
      where: { email: loginUserDto.email }
    });

    if (!user) {
      throw new UnauthorizedException('잘못된 인증 정보입니다');
    }

    const isPasswordValid = await bcrypt.compare(loginUserDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('잘못된 인증 정보입니다');
    }

    const { password, ...result } = user;
    return result;
  }
}
```

### **7. NestJS 예외 처리 전략**

```typescript
// ✅ NestJS 표준 예외 사용
throw new ConflictException('이미 사용 중인 이메일입니다');
// → HTTP 409 Conflict 자동 응답

throw new UnauthorizedException('잘못된 인증 정보입니다');
// → HTTP 401 Unauthorized 자동 응답

// ❌ 일반 Error 사용 (비권장)
throw new Error('에러 발생');
// → HTTP 500 Internal Server Error (의도하지 않은 응답)
```

**보안 모범 사례:**
- 패스워드 해싱: bcrypt 라이브러리 사용
- 정보 누출 방지: 에러 메시지에서 민감한 정보 제거
- 응답에서 패스워드 제외: 구조 분해 할당 활용

---

## 🔧 **Module 시스템 - 의존성 주입 및 구성**

### **모듈의 핵심 구조**

```typescript
@Module({
  imports: [TypeOrmModule.forFeature([Recipe])],  // Repository 등록
  controllers: [RecipesController],                // Controller 등록
  providers: [RecipesService],                     // Service 등록
  exports: [RecipesService],                       // 다른 모듈에서 사용 가능
})
export class RecipesModule {}
```

**모듈의 핵심 역할:**
- **🔗 의존성 주입**: Service, Controller, Repository 연결
- **📦 캡슐화**: 관련 기능들을 하나의 모듈로 그룹화
- **🔄 재사용성**: exports를 통해 다른 모듈에서 활용 가능

### **의존성 주입 동작 원리**

```typescript
// 1. Recipe Entity를 기반으로 Repository<Recipe> 자동 생성
TypeOrmModule.forFeature([Recipe])

// 2. RecipesService에서 Repository 주입
@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>, // 자동 주입
  ) {}
}

// 3. RecipesController에서 RecipesService 주입
@Controller('recipes')
export class RecipesController {
  constructor(
    private readonly recipesService: RecipesService  // 자동 주입
  ) {}
}
```

**NestJS 의존성 주입 생명주기:**
```
1. TypeOrmModule에서 Repository<Recipe> 생성
2. RecipesService 인스턴스화
   → Repository<Recipe> 주입
3. RecipesService 인스턴스화
   → RecipesService 주입
4. RecipesController 인스턴스화
   → RecipesService 주입
```

### **모듈 구성 패턴**

#### **단일 기능 모듈 (권장)**
```typescript
// recipes.module.ts
@Module({
  imports: [TypeOrmModule.forFeature([Recipe])],
  controllers: [RecipesController],
  providers: [RecipesService],
  exports: [RecipesService],
})
export class RecipesModule {}
```

#### **메인 앱 모듈**
```typescript
// app.module.ts
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(...),
    RecipesModule,  // 기능 모듈 임포트
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

**권장 개발 순서: DTO → Service → Controller → Module**

```
1️⃣ DTO 작성
   ↓ 데이터 계약 정의
2️⃣ Service 작성
   ↓ 비즈니스 로직 구현
3️⃣ Controller 작성
   ↓ HTTP 인터페이스 구현
4️⃣ Module 작성
   ↓ 의존성 연결 및 등록
```

**1단계: DTO 먼저**
- ✅ **데이터 계약 정의**: Service와 Controller가 어떤 데이터를 주고받을지 명확화
- ✅ **검증 규칙 설정**: 입력 데이터의 제약사항 사전 정의
- ✅ **API 문서화**: Swagger 어노테이션으로 API 스펙 문서화

**2단계: Service 두 번째**
- ✅ **핵심 로직 구현**: DTO를 활용한 비즈니스 로직 작성
- ✅ **독립적 테스트**: Controller 없이도 Service 로직 테스트 가능
- ✅ **재사용성 확보**: 여러 Controller에서 동일한 Service 활용

**3단계: Controller 세 번째**
- ✅ **HTTP 인터페이스**: 완성된 Service를 HTTP로 노출
- ✅ **얇은 계층 유지**: Service에 모든 로직이 구현되어 있어 Controller는 단순해짐

**4단계: Module 마지막**
- ✅ **의존성 연결**: 모든 구성 요소가 준비된 상태에서 연결
- ✅ **확실한 구성**: 실제 동작하는 코드들을 바탕으로 모듈 구성

### **핵심 정리**

**NestJS CRUD API의 핵심 아키텍처:**
- **DTO 패턴 (Data Transfer Object Pattern)**
- **Repository 패턴 (Data Access Layer Pattern)**

**TypeScript & NestJS 고급 기능:**
- 데코레이터 활용 (@Injectable, @Controller, @Entity)
- 의존성 주입 (Dependency Injection)
- 타입 안전성 (Type Safety)

**데이터베이스 설계:**
- Entity-Relationship 모델링
- TypeORM을 통한 객체-관계 매핑

**API 설계:**
- RESTful API 원칙
- HTTP 상태 코드 활용
- Swagger를 통한 API 문서화

**보안:**
- bcrypt를 통한 패스워드 해싱
- 입력 검증 및 예외 처리

이제 **완전한 NestJS CRUD API**가 구현되었습니다! 🎉

---

## 📝 **User DTO 설계 - 보안 중심 접근**

### **User DTO vs Recipe DTO 설계 차이점**

```typescript
// 👤 User DTO - 보안이 최우선
export class CreateUserDto {
  @IsEmail()  // 구체적인 이메일 검증
  email: string;

  @MinLength(8)  // 구체적인 패스워드 정책
  password: string;
}

// 🍳 Recipe DTO - 사용성이 최우선
export class CreateRecipeDto {
  @IsString()  // 일반적인 문자열 검증
  title: string;
}
```

**차이점 분석:**
```typescript
// User DTO - 구체적인 보안 관련 메시지
@IsEmail({}, { message: '올바른 이메일 형식이 아닙니다' })
@MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다' })

// Recipe DTO - 일반적인 데이터 검증 메시지
@IsString({ message: '제목을 입력해주세요' })
@ArrayMinSize(2, { message: '재료는 최소 2개 이상 필요합니다' })
```

**인증 시스템 설계 고려사항:**
- **패스워드 정책**: 길이, 복잡도 요구사항
- **이메일 검증**: 형식 및 중복 확인
- **개인정보 보호**: 민감한 데이터 처리 방법
- **에러 메시지**: 보안을 고려한 적절한 응답

**User Entity와의 매핑 관계:**

```typescript
// CreateUserDto → User Entity 변환
const user = this.userRepository.create({
  email: createUserDto.email,
  name: createUserDto.name,
  password: hashedPassword,  // DTO의 password를 해싱하여 저장
});

// 자동 생성 필드들 (DTO에 포함하지 않음)
// id: number              → DB에서 자동 생성
// createdAt: Date         → @CreateDateColumn()으로 자동 설정
// updatedAt: Date         → @UpdateDateColumn()으로 자동 갱신
```

### **사용자-레시피 관계 데이터 조회**

```typescript
// User Entity에서
@OneToMany(() => Recipe, (recipe) => recipe.user)
recipes: Recipe[];

// Recipe Entity에서
@ManyToOne(() => User, (user) => user.recipes)
user: User;

// 실제 쿼리 예시
const userWithRecipes = await this.userRepository.findOne({
  where: { id: userId },
  relations: ['recipes'],
});

// TypeORM이 자동 생성하는 JOIN 쿼리
SELECT u.*, r.* FROM users u
LEFT JOIN recipes r ON u.id = r.user_id
WHERE u.id = ?
```

### 🎯 **Entity 설계 시 고려사항**

#### **데이터 타입 매핑**

```typescript
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;                          // PostgreSQL: SERIAL → TypeScript: number

  @Column({ unique: true })
  email: string;                       // PostgreSQL: VARCHAR → TypeScript: string

  @Column({ length: 100 })
  name: string;                        // PostgreSQL: VARCHAR(100) → TypeScript: string

  @CreateDateColumn()
  createdAt: Date;                     // PostgreSQL: TIMESTAMP → TypeScript: Date

  @Column('simple-array', { nullable: true })
  interests: string[];                 // PostgreSQL: TEXT → TypeScript: string[]
}
```

3. **데이터 타입**: PostgreSQL과 TypeScript 타입의 적절한 매핑

**보안 모범 사례:**
- 패스워드는 항상 해싱하여 저장
- 민감한 정보는 select: false 옵션 활용
- API 응답에서 패스워드 필드 제외
- 적절한 예외 처리로 정보 누출 방지

---

## 📡 **UsersController - 인증 API 인터페이스 구현 완료** (2024-09-29)

### **핵심 엔드포인트 구현**

#### **1. 회원가입 API**
```typescript
@Post('register')
@HttpCode(HttpStatus.CREATED)
async register(@Body() createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
  return this.usersService.register(createUserDto);
}
```

**특징:**
- **HTTP 201 Created**: 리소스 생성 성공
- **보안 응답**: 패스워드 제외하고 반환
- **에러 처리**: 409(이메일 중복), 400(잘못된 데이터)

#### **2. 로그인 API**
```typescript
@Post('login')
@HttpCode(HttpStatus.OK)
async login(@Body() loginUserDto: LoginUserDto): Promise<Omit<User, 'password'>> {
  return this.usersService.login(loginUserDto);
}
```

**특징:**
- **HTTP 200 OK**: 인증 성공
- **bcrypt 검증**: 패스워드 해싱 비교
- **에러 처리**: 401(인증 실패)

#### **3. 프로필 조회 API**
```typescript
@Get(':id')
async findOne(@Param('id', ParseIntPipe) id: number): Promise<Omit<User, 'password'>> {
  return this.usersService.findOne(id);
}
```

**특징:**
- **동적 라우팅**: `:id` 매개변수 사용
- **타입 변환**: `ParseIntPipe`로 문자열 → 숫자
- **에러 처리**: 404(사용자 없음)

#### **4. 프로필 수정 API**
```typescript
@Patch(':id')
async update(
  @Param('id', ParseIntPipe) id: number,
  @Body() updateUserDto: UpdateUserDto,
): Promise<Omit<User, 'password'>> {
  return this.usersService.update(id, updateUserDto);
}
```

**특징:**
- **PATCH 메서드**: 부분 업데이트 지원
- **PartialType DTO**: 선택적 필드 업데이트
- **에러 처리**: 404(사용자 없음), 409(이메일 중복)

### **Swagger API 문서화 완성**

#### **완벽한 API 스펙 정의**
```typescript
@ApiTags('users')  // Swagger 그룹화
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
```

**문서화 요소:**
- **@ApiTags**: API 그룹 분류
- **@ApiOperation**: 엔드포인트 설명
- **@ApiResponse**: 각 상태 코드별 응답 정의
- **@ApiParam**: 경로 매개변수 문서화

### **REST API 설계 원칙 적용**

#### **1. 리소스 중심 URL 설계**
```
POST   /users/register    # 회원가입 (특별 액션)
POST   /users/login       # 로그인 (특별 액션)
GET    /users/:id         # 사용자 조회
PATCH  /users/:id         # 사용자 수정
```

#### **2. 적절한 HTTP 메서드 사용**
- **POST**: 리소스 생성 및 특별 액션
- **GET**: 데이터 조회 (안전, 멱등)
- **PATCH**: 부분 수정 (멱등)

#### **3. 명확한 HTTP 상태 코드**
- **2xx**: 성공 (200 OK, 201 Created)
- **4xx**: 클라이언트 오류 (400, 401, 404, 409)
- **5xx**: 서버 오류 (자동 처리)

### **보안 모범 사례 구현**

#### **1. 패스워드 보안**
```typescript
Promise<Omit<User, 'password'>>  // 모든 응답에서 패스워드 제외
```

#### **2. 타입 안전성**
```typescript
@Param('id', ParseIntPipe) id: number  // 자동 타입 변환 및 검증
```

#### **3. 입력 검증**
- DTO 클래스의 class-validator 어노테이션 활용
- NestJS 파이프라인의 자동 검증

### **핵심 학습 성과**

#### **Controller 계층 설계 원칙**
1. **얇은 계층 (Thin Layer)**: HTTP 관련 로직만 담당
2. **Service 위임**: 모든 비즈니스 로직은 Service에 위임
3. **타입 안전성**: TypeScript 타입 시스템 활용
4. **문서화**: Swagger를 통한 자동 API 문서 생성

#### **NestJS 데코레이터 숙련도**
- **@Controller, @Post, @Get, @Patch**: HTTP 라우팅
- **@Body, @Param**: 요청 데이터 추출
- **@HttpCode**: 명시적 상태 코드 설정
- **@Api***: Swagger 문서화

---

## 다음 학습 목표

- [x] NestJS 기본 구조 및 모듈 시스템 ✅
- [x] TypeORM Entity 설계 및 관계 설정 ✅
- [x] DTO 패턴 및 데이터 검증 ✅
- [x] Service 계층 비즈니스 로직 구현 ✅
- [x] Controller 계층 HTTP 인터페이스 구현 ✅
- [x] User 인증 시스템 설계 ✅
- [x] UsersController 완전 구현 ✅
- [ ] UsersModule 의존성 주입 설정 🔄
- [ ] AppModule 통합 및 전체 시스템 연결
- [ ] JWT 토큰 기반 인증 구현
- [ ] FastAPI AI 서비스 연동
- [ ] 통합 테스트 및 API 문서화