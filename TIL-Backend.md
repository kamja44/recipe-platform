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

## 🔧 **UsersModule & AppModule 통합 완료** (2024-09-29)

### **UsersModule 의존성 주입 구현**

#### **완전한 모듈 구성**
```typescript
@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // User Repository 등록
  ],
  controllers: [UsersController],     // HTTP 인터페이스 등록
  providers: [UsersService],          // 비즈니스 로직 서비스 등록
  exports: [UsersService],            // 다른 모듈에서 사용 가능하도록 내보내기
})
export class UsersModule {}
```

**핵심 요소 분석:**
- **imports**: `TypeOrmModule.forFeature([User])` → Repository 패턴 활성화
- **controllers**: HTTP 요청 처리를 위한 Controller 등록
- **providers**: 의존성 주입 컨테이너에 Service 등록
- **exports**: 다른 모듈에서 UsersService 재사용 가능

### **AppModule 전체 시스템 통합**

#### **완전한 마이크로서비스 구성**
```typescript
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      // PostgreSQL 연결 설정
    }),
    RecipesModule,  // 레시피 API
    UsersModule,    // 사용자 인증 API
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

**시스템 아키텍처:**
```
AppModule
├── ConfigModule (전역 환경변수)
├── TypeOrmModule (PostgreSQL 연결)
├── RecipesModule (레시피 CRUD API)
└── UsersModule (사용자 인증 API)
```

### **NestJS 모듈 시스템 동작 원리**

#### **의존성 주입 생명주기**
```
1. ConfigModule 초기화 → 환경변수 로딩
2. TypeOrmModule 초기화 → 데이터베이스 연결
3. Entity Repository 생성 → User, Recipe Repository
4. Service 인스턴스화 → UsersService, RecipesService
5. Controller 인스턴스화 → 의존성 자동 주입
6. HTTP 라우팅 등록 → /users, /recipes 경로 활성화
```

#### **모듈 간 통신 패턴**
```typescript
// UsersModule에서 exports한 Service를 다른 모듈에서 사용
@Module({
  imports: [UsersModule],  // UsersService 가져오기
})
export class AuthModule {
  constructor(private usersService: UsersService) {}  // 자동 주입
}
```

---

## 🐳 **Docker Compose 환경 설정 학습** (2024-09-29)

### **마이크로서비스 컨테이너 아키텍처**

#### **서비스 구성도**
```yaml
services:
  frontend:     # Next.js (포트: 3000)
  main-service: # NestJS (포트: 3001)
  ai-service:   # FastAPI (포트: 8000)
  postgres:     # PostgreSQL (포트: 5432)
  redis:        # Redis (포트: 6379)
```

### **환경변수 관리 패턴**

#### **이중 환경변수 구조 이해**
```
project/
├── .env                    # Docker Compose용 환경변수
└── main-service/
    └── .env                # NestJS 애플리케이션용 환경변수
```

**각각의 역할:**
- **프로젝트 루트/.env**: Docker Compose가 컨테이너 생성 시 사용
- **main-service/.env**: NestJS 런타임에서 ConfigService가 읽음

#### **환경변수 흐름**
```
1. Docker Compose 실행 시:
   project/.env → docker-compose.yml → 컨테이너 환경변수

2. NestJS 애플리케이션 실행 시:
   main-service/.env → ConfigService → 애플리케이션 설정
```

### **PostgreSQL Docker 컨테이너 관리**

#### **컨테이너 생명주기 명령어**
```bash
# PostgreSQL 컨테이너만 실행
docker-compose up -d postgres

# 전체 서비스 실행
docker-compose up -d

# 상태 확인
docker-compose ps

# 로그 확인
docker-compose logs postgres

# 컨테이너 정리
docker-compose down
```

#### **데이터 영속성 관리**
```yaml
volumes:
  postgres_data:  # 데이터베이스 데이터 영구 보존
  redis_data:     # Redis 데이터 영구 보존
```

### **개발 환경 vs 프로덕션 환경**

#### **개발 환경 특징**
- `synchronize: true` → Entity 변경 시 자동 스키마 동기화
- 볼륨 마운팅 → 코드 변경 시 자동 재로딩
- 로컬 포트 바인딩 → 직접 접근 가능

#### **컨테이너화의 장점**
1. **환경 일관성**: 모든 개발자가 동일한 PostgreSQL 버전 사용
2. **빠른 설정**: 복잡한 데이터베이스 설치 과정 불필요
3. **격리**: 로컬 시스템에 영향 없이 개발 환경 구성
4. **확장성**: Redis, AI 서비스 등 쉽게 추가 가능

### **핵심 학습 성과**

#### **Docker Compose 숙련도**
- 마이크로서비스 환경 구성 이해
- 환경변수 관리 패턴 학습
- 컨테이너 간 네트워킹 개념

#### **DevOps 기초 역량**
- 개발 환경 컨테이너화
- 데이터 영속성 관리
- 서비스 의존성 관리 (`depends_on`)

---

---

## 🚀 **NestJS 서버 실행 및 Swagger 설정 완료** (2024-09-29)

### **환경변수 문제 해결**

#### **문제 상황: 환경변수 이름 불일치**
```typescript
// ❌ database.config.ts에서
host: process.env.DATABASE_HOST

// ❌ .env 파일에서
DB_HOST=localhost
```

**해결:**
```typescript
// ✅ database.config.ts 수정
host: process.env.DB_HOST || 'localhost',
port: parseInt(process.env.DB_PORT || '5432', 10),
username: process.env.DB_USERNAME,
password: process.env.DB_PASSWORD,
database: process.env.DB_DATABASE,
```

### **포트 충돌 해결**

#### **문제: Frontend와 Backend 포트 충돌**
- Frontend: 포트 3000 사용 중
- Backend: 포트 3000 시도 → `EADDRINUSE` 에러

**해결:**
```bash
# main-service/.env
PORT=3001  # 3000 → 3001로 변경
```

### **Swagger API 문서화 설정**

#### **main.ts 완전 구성**
```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 전역 파이프 설정 (DTO 검증)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('AI Recipe Platform API')
    .setDescription('AI 레시피 추천 플랫폼 API 문서')
    .setVersion('1.0')
    .addTag('recipes', '레시피 관련 API')
    .addTag('users', '사용자 관련 API')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

### **API 엔드포인트 확인**

#### **서비스 접근 URL**
- **기본 API**: http://localhost:3001 → "Hello World!"
- **Swagger 문서**: http://localhost:3001/api → 완전한 API 문서
- **레시피 API**: http://localhost:3001/recipes
- **사용자 API**: http://localhost:3001/users

### **ValidationPipe 전역 설정 상세 분석**

#### **전역 파이프 설정의 핵심 보안 메커니즘**
```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,              // DTO에 정의되지 않은 속성 자동 제거
    forbidNonWhitelisted: true,   // 허용되지 않은 속성 발견 시 에러 발생
    transform: true,              // 타입 자동 변환 (string → number, boolean)
  }),
);
```

#### **1. whitelist: true - 보안 필드 자동 제거**

```typescript
// DTO 정의
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;
}

// 클라이언트 요청 (악의적 필드 포함)
POST /users/register
{
  "email": "test@test.com",
  "name": "홍길동",
  "isAdmin": true,           // ← 관리자 권한 탈취 시도
  "role": "SUPER_ADMIN",     // ← 권한 상승 시도
  "balance": 1000000,        // ← 잔액 조작 시도
  "maliciousField": "hack"   // ← 악의적 데이터
}

// 실제 DTO로 전달되는 데이터 (자동 필터링됨)
{
  "email": "test@test.com",
  "name": "홍길동"
  // isAdmin, role, balance, maliciousField 모두 자동 제거
}
```

**보안 효과:**
- Mass Assignment 공격 방지
- 예상치 못한 필드 주입 차단
- DTO 기반 화이트리스트 방식 보안

#### **2. forbidNonWhitelisted: true - 엄격한 검증**

```typescript
// whitelist와 함께 사용시 더 엄격한 보안
POST /users/register
{
  "email": "test@test.com",
  "name": "홍길동",
  "hackerField": "악의적데이터"  // ← 즉시 에러 발생
}

// 응답 (400 Bad Request)
{
  "statusCode": 400,
  "message": ["property hackerField should not exist"],
  "error": "Bad Request"
}
```

**동작 차이:**
- **whitelist만**: 불필요한 필드 조용히 제거
- **forbidNonWhitelisted 추가**: 불필요한 필드 발견시 즉시 에러

#### **3. transform: true - 자동 타입 변환**

##### **URL 매개변수 자동 변환**
```typescript
@Get(':id')
async findOne(@Param('id') id: number) {
  // URL: /users/123
  // 문자열 "123" → 숫자 123 자동 변환
  console.log(typeof id);  // "number"
  console.log(id + 1);     // 124 (숫자 연산 가능)
}

// 변환 실패시 자동 에러
GET /users/abc  // → 400 Bad Request: "id must be a number"
```

##### **쿼리 파라미터 자동 변환**
```typescript
@Get()
async findMany(
  @Query('page') page: number,
  @Query('limit') limit: number,
  @Query('published') published: boolean
) {
  // URL: /recipes?page=2&limit=10&published=true
  console.log(page);      // 2 (number)
  console.log(limit);     // 10 (number)
  console.log(published); // true (boolean)
}
```

##### **DTO 필드 자동 변환**
```typescript
export class CreateRecipeDto {
  @IsString()
  title: string;

  @IsNumber()
  @Transform(({ value }) => parseInt(value))  // 명시적 변환
  cookingTime: number;

  @IsBoolean()
  @Transform(({ value }) => value === 'true') // 문자열 → 불린 변환
  isPublic: boolean;
}

// 요청 데이터 (모든 값이 문자열로 전달)
{
  "title": "김치찌개",
  "cookingTime": "30",     // "30" → 30 자동 변환
  "isPublic": "true"       // "true" → true 자동 변환
}
```

### **보안 강화 전후 비교**

#### **❌ 전역 파이프 없을 때 (위험)**
```typescript
@Post()
async create(@Body() body: any) {
  // 매번 수동 검증 필요
  if (!body.email || !isEmail(body.email)) {
    throw new BadRequestException('잘못된 이메일');
  }
  if (!body.name || typeof body.name !== 'string') {
    throw new BadRequestException('이름이 필요합니다');
  }
  if (body.isAdmin) {
    // 보안 위험: 관리자 권한 탈취 가능
    throw new BadRequestException('관리자 권한 설정 불가');
  }

  // 모든 컨트롤러에서 반복적인 검증 코드...
  return this.usersService.create(body);
}
```

#### **✅ 전역 파이프 적용 후 (안전)**
```typescript
@Post()
async create(@Body() createUserDto: CreateUserDto) {
  // DTO 어노테이션만으로 모든 검증 자동 처리
  // 1. class-validator 규칙 자동 적용
  // 2. 정의되지 않은 필드 자동 제거 또는 에러
  // 3. 타입 자동 변환
  // 4. 검증 실패시 자동으로 400 에러 반환

  return this.usersService.create(createUserDto);
}
```

### **개발 효율성 향상**

#### **반복 코드 제거**
```typescript
// Before: 모든 엔드포인트에서 반복
@Post('/recipes')
async createRecipe(@Body() body: any) {
  this.validateRecipeData(body);  // 수동 검증
}

@Post('/users')
async createUser(@Body() body: any) {
  this.validateUserData(body);    // 수동 검증
}

// After: DTO만 정의하면 자동 검증
@Post('/recipes')
async createRecipe(@Body() dto: CreateRecipeDto) {
  // 검증 코드 불필요
}

@Post('/users')
async createUser(@Body() dto: CreateUserDto) {
  // 검증 코드 불필요
}
```

### **핵심 정리**

**ValidationPipe 전역 설정의 핵심 이점:**

1. **보안 강화**
   - Mass Assignment 공격 방지
   - 예상치 못한 필드 주입 차단
   - 화이트리스트 기반 엄격한 검증

2. **타입 안전성**
   - 런타임 타입 변환 및 검증
   - 컴파일 타임과 런타임 타입 일치 보장
   - 타입 에러 조기 발견

3. **개발 효율성**
   - 반복적인 검증 코드 제거
   - DTO 중심의 선언적 검증
   - 일관된 에러 메시지 자동 생성

4. **유지보수성**
   - 모든 엔드포인트에서 동일한 검증 적용
   - 중앙집중식 설정 관리
   - 검증 로직의 일관성 보장

이 설정을 통해 개발자는 **DTO 정의에만 집중**하면 되고, **보안, 검증, 타입 변환은 NestJS가 자동 처리**합니다! 🛡️

### **완전한 NestJS 마이크로서비스 완성**

#### **구현 완료된 기능들**
✅ **PostgreSQL 연동**: TypeORM을 통한 완전한 데이터베이스 연결
✅ **사용자 인증 API**: 회원가입, 로그인, 프로필 관리 (bcrypt 해싱)
✅ **레시피 CRUD API**: 생성, 조회, 수정, 삭제 + 검색 기능
✅ **Swagger 문서화**: 완전한 API 스펙 및 테스트 인터페이스
✅ **입력 검증**: DTO 기반 자동 데이터 검증
✅ **에러 처리**: NestJS 표준 예외 처리
✅ **모듈 시스템**: 완전한 의존성 주입 및 모듈 분리

#### **기술적 성취**
- **완전한 Backend API**: Production 수준의 NestJS 서비스
- **보안 모범 사례**: 패스워드 해싱, 입력 검증, 정보 누출 방지
- **확장 가능한 아키텍처**: 모듈화된 구조로 기능 추가 용이
- **자동 문서화**: 개발과 동시에 API 문서 자동 업데이트

---

## 🔐 **JWT 토큰 기반 인증 시스템 구현 완료** (2024-09-29)

### **JWT 인증 시스템 아키텍처**

#### **핵심 구성 요소**
```
로그인 요청 → AuthService → JWT 토큰 발급 → 클라이언트 저장 → API 요청 시 Bearer 토큰 → JwtStrategy 검증 → 사용자 인증 완료
```

### **1. JWT 설정 및 환경변수 관리**

#### **JWT 보안 키 생성**
```bash
# 안전한 JWT_SECRET 생성
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**환경변수 설정:**
```env
# JWT Configuration
JWT_SECRET=d844ad74ecc85eb6c7fe37813d0e9630d68fa3b5f22bf00db48a4e83a5ca9fe2...
JWT_EXPIRES_IN=7d
```

#### **JWT 설정 파일 구조화**
```typescript
// src/config/jwt.config.ts
import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'fallback-secret-key',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
}));
```

### **2. Auth 모듈 설계 패턴**

#### **파일 구조**
```
src/auth/
├── auth.types.ts        # JWT 페이로드 및 응답 타입
├── auth.service.ts      # JWT 토큰 생성/검증 서비스
├── jwt.strategy.ts      # Passport JWT 전략
├── auth.guard.ts        # JWT 인증 가드
└── auth.module.ts       # Auth 모듈 설정
```

### **3. 타입 안전성 확보**

#### **JWT 타입 정의**
```typescript
// auth.types.ts
export interface JwtPayload {
  sub: number;    // 사용자 ID
  email: string;
  name: string;
  iat?: number;   // issued at
  exp?: number;   // expiration time
}

export interface AuthResponse {
  access_token: string;
  user: Omit<User, 'password'>;
}
```

**핵심 설계 원칙:**
- **타입 분리**: auth.types.ts로 재사용 가능한 타입 관리
- **제네릭 활용**: `configService.get<string>('jwt.secret')`
- **타입 가드**: 런타임 타입 검증으로 안전성 확보

### **4. AuthService - JWT 토큰 생성 로직**

#### **핵심 비즈니스 로직**
```typescript
@Injectable()
export class AuthService {
  async login(loginUserDto: LoginUserDto): Promise<AuthResponse> {
    // 1. 사용자 인증 (기존 UsersService 활용)
    const user = await this.usersService.login(loginUserDto);

    // 2. JWT 페이로드 생성 (타입 안전)
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      name: user.name
    };

    // 3. JWT 토큰 생성 및 반환
    return {
      access_token: this.jwtService.sign(payload),
      user: user,
    };
  }
}
```

**설계 특징:**
- **기존 서비스 재활용**: UsersService.login() 메서드 활용
- **명확한 책임 분리**: 인증(Users) vs 토큰 생성(Auth)
- **타입 안전한 페이로드**: JwtPayload 인터페이스 활용

### **5. JwtStrategy - Passport 인증 전략**

#### **JWT 검증 메커니즘**
```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private authService: AuthService,
  ) {
    // JWT_SECRET 존재 확인 및 설정
    const secret = configService.get<string>('jwt.secret') || 'fallback-secret';

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Bearer 토큰
      ignoreExpiration: false,  // 만료 토큰 거부
      secretOrKey: secret,      // 검증용 시크릿 키
    });
  }

  async validate(payload: any) {
    const user = await this.authService.validateUser(payload as JwtPayload);
    if (!user) {
      throw new UnauthorizedException('토큰이 유효하지 않습니다');
    }
    return user; // req.user에 자동 설정
  }
}
```

**핵심 동작:**
1. **Bearer 토큰 추출**: `Authorization: Bearer <token>`
2. **JWT 서명 검증**: secret 키로 토큰 유효성 확인
3. **사용자 존재 확인**: 데이터베이스에서 사용자 조회
4. **req.user 설정**: 검증된 사용자 정보를 요청 객체에 저장

### **6. TypeScript 타입 안전성 문제 해결**

#### **Constructor에서 ConfigService 접근 문제**
```typescript
// ❌ 문제: super() 내에서 this.configService 접근 불가
super({
  secretOrKey: this.configService.get('jwt.secret') // Error!
});

// ✅ 해결: super() 호출 전에 값 추출
constructor(configService: ConfigService, ...) {
  const secret = configService.get<string>('jwt.secret') || 'fallback-secret';
  super({
    secretOrKey: secret // 안전한 접근
  });
}
```

#### **타입 경고 해결**
```typescript
// ❌ 문제: 사용하지 않는 private 속성 경고
constructor(private configService: ConfigService) // 경고 발생

// ✅ 해결: 초기화에만 사용하는 경우 private 제거
constructor(configService: ConfigService) // 경고 해결
```

### **7. Auth 모듈 의존성 주입 설계**

#### **완전한 모듈 구성**
```typescript
@Module({
  imports: [
    ConfigModule.forFeature(jwtConfig),  // JWT 설정 로드
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwt.secret'),
        signOptions: { expiresIn: configService.get('jwt.expiresIn') }
      }),
      inject: [ConfigService],
    }),
    UsersModule, // UsersService 의존성
  ],
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
  exports: [AuthService, JwtAuthGuard], // 다른 모듈에서 사용
})
export class AuthModule {}
```

**의존성 관계:**
- `AuthService` → `UsersService` (사용자 검증)
- `JwtStrategy` → `AuthService` (토큰 검증)
- `JwtModule` → `ConfigService` (JWT 설정)

### **8. AppModule 통합 및 전역 설정**

#### **설정 파일 통합**
```typescript
ConfigModule.forRoot({
  isGlobal: true,
  load: [databaseConfig, jwtConfig], // JWT 설정 추가
}),
```

#### **모듈 의존성 구조**
```
AppModule
├── ConfigModule (환경변수: DB + JWT)
├── TypeOrmModule (PostgreSQL 연결)
├── RecipesModule (레시피 API)
├── UsersModule (사용자 API)
└── AuthModule (JWT 인증)
```

### **핵심 학습 성과**

#### **JWT 인증 시스템 완전 이해**
1. **보안 설계**: 안전한 JWT_SECRET 생성 및 관리
2. **아키텍처 패턴**: Service-Strategy-Guard 분리
3. **타입 안전성**: TypeScript 타입 시스템 완전 활용
4. **모듈 설계**: 의존성 주입 및 관심사 분리

#### **NestJS 고급 패턴 숙련도**
- **Passport 통합**: JWT Strategy 구현
- **Guard 패턴**: 인증 미들웨어 설계
- **Configuration**: 환경별 설정 관리
- **Module 시스템**: 복잡한 의존성 관리

#### **실제 프로덕션 수준 보안**
- 암호화된 JWT 토큰 생성/검증
- Bearer 토큰 기반 API 보호
- 만료 시간 관리 및 토큰 갱신 준비
- 타입 안전한 페이로드 처리

---

## 🔐 **JWT API 통합 및 보호된 라우트 구현 완료** (2024-09-29)

### **JWT 인증 API 완전 통합**

#### **1. UsersController JWT 토큰 응답 구현**

##### **로그인 엔드포인트 JWT 토큰 발급**
```typescript
// 기존: 사용자 정보만 반환
async login(@Body() loginUserDto: LoginUserDto): Promise<Omit<User, 'password'>> {
  return this.usersService.login(loginUserDto);
}

// 변경: JWT 토큰 + 사용자 정보 반환
async login(@Body() loginUserDto: LoginUserDto): Promise<AuthResponse> {
  return this.authService.login(loginUserDto);
}
```

**핵심 변경사항:**
- **AuthService 주입**: `private readonly authService: AuthService`
- **반환 타입 변경**: `AuthResponse` 인터페이스 사용
- **JWT 토큰 발급**: 로그인 성공 시 access_token 포함 응답

##### **Swagger API 문서화 개선**
```typescript
@ApiResponse({
  status: 200,
  description: '로그인이 성공했습니다. JWT 토큰이 발급됩니다.',
  schema: {
    example: {
      access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      user: {
        id: 1,
        email: 'user@example.com',
        name: '홍길동',
        createdAt: '2024-09-29T...',
        updatedAt: '2024-09-29T...'
      }
    }
  }
})
```

### **2. 보호된 라우트 구현**

#### **JwtAuthGuard 적용**
```typescript
// 보호된 사용자 프로필 조회
@Get(':id')
@UseGuards(JwtAuthGuard)  // JWT 인증 필수
@ApiBearerAuth()         // Swagger Bearer 토큰 표시
async findOne(@Param('id', ParseIntPipe) id: number) {
  return this.usersService.findOne(id);
}

// 보호된 프로필 수정
@Patch(':id')
@UseGuards(JwtAuthGuard)  // JWT 인증 필수
@ApiBearerAuth()         // Swagger Bearer 토큰 표시
async update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
  return this.usersService.update(id, updateUserDto);
}
```

**보호된 라우트 특징:**
- **Bearer 토큰 필수**: `Authorization: Bearer <JWT_TOKEN>`
- **자동 사용자 검증**: JwtStrategy가 토큰 유효성 확인
- **req.user 자동 설정**: 검증된 사용자 정보 주입
- **Swagger 문서화**: Bearer 토큰 입력 필드 자동 생성

### **3. NestJS 순환 의존성 문제 해결**

#### **순환 의존성 문제 발생**
```typescript
// 문제 상황
AuthModule → UsersModule (UsersService 의존)
UsersModule → AuthModule (AuthService 의존)

// 에러: UndefinedModuleException
// The module at index [3] of the AuthModule "imports" array is undefined.
```

#### **forwardRef() 해결 패턴**
```typescript
// AuthModule 수정
@Module({
  imports: [
    // ... 기타 imports
    forwardRef(() => UsersModule), // 순환 의존성 해결
  ],
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
  exports: [AuthService, JwtAuthGuard],
})
export class AuthModule {}

// UsersModule 수정
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule), // 순환 의존성 해결
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
```

**forwardRef() 동작 원리:**
1. **지연 로딩**: 모듈 인스턴스화를 지연시켜 순환 참조 방지
2. **런타임 해결**: 애플리케이션 초기화 시 의존성 그래프 정리
3. **타입 안전성**: TypeScript 타입 체크 유지

#### **순환 의존성 해결 패턴 학습**

**일반적인 순환 의존성 시나리오:**
```typescript
// Case 1: 모듈간 서비스 상호 참조
ModuleA → ServiceB
ModuleB → ServiceA

// Case 2: 인증/권한 시스템
AuthModule → UserModule (사용자 정보 필요)
UserModule → AuthModule (인증 기능 필요)

// Case 3: 부모-자식 관계 엔티티
ParentModule → ChildModule
ChildModule → ParentModule
```

**해결 방법 비교:**
```typescript
// 1. forwardRef() - 모듈 레벨
forwardRef(() => ModuleB)

// 2. @Inject(forwardRef()) - 서비스 레벨
constructor(@Inject(forwardRef(() => ServiceB)) private serviceB: ServiceB) {}

// 3. 공통 모듈 분리 - 아키텍처 레벨
AuthModule → CommonModule ← UserModule
```

### **4. JWT 인증 완전한 플로우**

#### **전체 인증 플로우**
```
1. POST /users/register → 회원가입
2. POST /users/login → JWT 토큰 발급
3. 클라이언트 토큰 저장 (localStorage, cookie 등)
4. API 요청 시 Header: Authorization: Bearer <token>
5. JwtStrategy 토큰 검증 → req.user 설정
6. 보호된 라우트 접근 허용
```

#### **JWT 토큰 검증 과정**
```typescript
// 1. 토큰 추출
ExtractJwt.fromAuthHeaderAsBearerToken()

// 2. 서명 검증
secretOrKey: configService.get('jwt.secret')

// 3. 만료 시간 확인
ignoreExpiration: false

// 4. 사용자 존재 확인
const user = await this.authService.validateUser(payload);

// 5. req.user 설정
return user; // 자동으로 req.user에 할당
```

### **5. 실제 프로덕션 수준 보안 구현**

#### **Bearer 토큰 인증 구현**
```typescript
// 클라이언트 요청 예시
fetch('/users/1', {
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    'Content-Type': 'application/json'
  }
});

// 서버 검증 과정
// 1. Authorization 헤더 파싱
// 2. Bearer 스키마 확인
// 3. JWT 토큰 추출 및 검증
// 4. 페이로드 기반 사용자 조회
// 5. 유효한 사용자면 API 접근 허용
```

### **핵심 학습 성과**

#### **JWT 인증 시스템 완전 구현**
1. **토큰 발급**: 로그인 시 JWT 토큰 생성
2. **토큰 검증**: Bearer 토큰 기반 API 보호
3. **사용자 인증**: JwtStrategy를 통한 자동 사용자 검증
4. **API 문서화**: Swagger Bearer 토큰 지원

#### **NestJS 고급 모듈 패턴 숙련도**
- **순환 의존성 해결**: forwardRef() 패턴 완전 이해
- **Guard 패턴**: 선언적 라우트 보호 구현
- **의존성 주입**: 복잡한 모듈 간 관계 관리
- **타입 안전성**: TypeScript + NestJS 완전 활용

#### **실전 보안 시스템 구축**
- Production 수준의 JWT 인증 시스템
- RESTful API 보안 모범 사례 적용
- 확장 가능한 인증/권한 아키텍처 설계

**🎯 완성된 기능**: 완전한 JWT 기반 인증 시스템 + 보호된 API 라우트

---

## 다음 학습 목표

- [x] NestJS 기본 구조 및 모듈 시스템 ✅
- [x] TypeORM Entity 설계 및 관계 설정 ✅
- [x] DTO 패턴 및 데이터 검증 ✅
- [x] Service 계층 비즈니스 로직 구현 ✅
- [x] Controller 계층 HTTP 인터페이스 구현 ✅
- [x] User 인증 시스템 설계 ✅
- [x] UsersController 완전 구현 ✅
- [x] UsersModule 의존성 주입 설정 ✅
- [x] AppModule 통합 및 전체 시스템 연결 ✅
- [x] Docker Compose 환경 설정 ✅
- [x] NestJS 서버 실행 및 Swagger 설정 ✅
- [x] JWT 토큰 기반 인증 시스템 구현 ✅
- [x] JWT 인증 API 통합 및 보호된 라우트 구현 ✅
- [x] 순환 의존성 문제 해결 (forwardRef 패턴) ✅
- [ ] FastAPI AI 서비스 연동
- [ ] 통합 테스트 및 API 문서화