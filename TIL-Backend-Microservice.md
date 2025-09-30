# TIL Backend - 마이크로서비스 통합 (NestJS ↔ FastAPI)

## 2024-09-30: NestJS와 FastAPI 마이크로서비스 통합

### 🎯 목표
NestJS 메인 서비스에서 FastAPI AI 서비스를 호출하여 AI 레시피 생성 기능 통합

### 📋 마이크로서비스 통신 아키텍처

```
Client (Frontend)
        ↓
┌──────────────────────┐
│   NestJS 메인 서비스   │  (포트: 3001)
│   - 사용자 인증        │
│   - 레시피 CRUD       │
│   - API 게이트웨이     │
└──────────────────────┘
        ↓ HTTP 요청
┌──────────────────────┐
│   FastAPI AI 서비스   │  (포트: 8000)
│   - AI 레시피 생성     │
│   - OpenAI/Claude 연동│
└──────────────────────┘
```

**통신 흐름:**
1. 클라이언트 → NestJS `/recipes/generate-ai` 요청
2. NestJS → FastAPI `/api/recipes/generate` 호출
3. FastAPI → OpenAI/Claude API 호출
4. OpenAI/Claude → FastAPI 응답
5. FastAPI → NestJS 응답
6. NestJS → 클라이언트 응답

---

## 1. RecipesService에 FastAPI 호출 로직 구현

### 📝 파일: `main-service/src/recipes/service/recipes.service.ts`

### 🔧 구현한 코드

```typescript
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,
    private readonly httpService: HttpService,      // ← 추가
    private readonly configService: ConfigService,   // ← 추가
  ) {}

  // AI를 활용하여 레시피 생성
  async generateRecipeWithAI(
    ingredients: string[],
    preferences?: string,
    provider: 'openai' | 'claude' = 'openai',
  ): Promise<any> {
    try {
      // FastAPI 서비스 URL (환경 변수에서 가져오기)
      const aiServiceUrl =
        this.configService.get<string>('AI_SERVICE_URL') ||
        'http://localhost:8000';

      // FastAPI 호출
      const response = await firstValueFrom(
        this.httpService.post(`${aiServiceUrl}/api/recipes/generate`, {
          ingredients,
          preferences,
          provider,
        }),
      );

      return response.data;
    } catch (error) {
      // 타입 가드를 사용한 안전한 에러 처리
      if (error instanceof Error) {
        throw new Error(`AI 레시피 생성 실패: ${error.message}`);
      }
      throw new Error('AI 레시피 생성 중 알 수 없는 오류가 발생했습니다.');
    }
  }
}
```

---

### 💡 코드 설명

#### 1. **의존성 주입 (Dependency Injection)**

```typescript
constructor(
  private readonly httpService: HttpService,      // HTTP 클라이언트
  private readonly configService: ConfigService,   // 환경변수 관리
) {}
```

**HttpService:**
- `@nestjs/axios` 패키지에서 제공
- axios 기반 HTTP 클라이언트
- RxJS Observable 반환

**ConfigService:**
- `@nestjs/config` 패키지에서 제공
- `.env` 파일의 환경변수 접근
- 타입 안전성 제공

#### 2. **환경변수로 FastAPI URL 관리**

```typescript
const aiServiceUrl =
  this.configService.get<string>('AI_SERVICE_URL') ||
  'http://localhost:8000';
```

**왜 환경변수로 관리하는가?**
- **개발 환경**: `http://localhost:8000`
- **Docker Compose**: `http://ai-service:8000`
- **프로덕션**: `https://ai-api.your-domain.com`

환경에 따라 유연하게 URL 변경 가능!

#### 3. **firstValueFrom - RxJS Observable → Promise 변환**

```typescript
const response = await firstValueFrom(
  this.httpService.post(...),
);
```

**왜 필요한가?**
- `httpService.post()`: RxJS **Observable** 반환
- NestJS async/await 패턴에서는 **Promise** 필요
- `firstValueFrom()`: Observable의 첫 번째 값을 Promise로 변환

**동작 원리:**
```typescript
// ❌ 이렇게 하면 에러
const response = await this.httpService.post(...);  // Observable은 await 불가

// ✅ Observable → Promise 변환
const response = await firstValueFrom(this.httpService.post(...));
```

#### 4. **타입 가드를 통한 안전한 에러 처리**

```typescript
catch (error) {
  if (error instanceof Error) {
    throw new Error(`AI 레시피 생성 실패: ${error.message}`);
  }
  throw new Error('AI 레시피 생성 중 알 수 없는 오류가 발생했습니다.');
}
```

**왜 이렇게 처리하는가?**
- TypeScript에서 `catch` 블록의 `error`는 **any 타입**
- `error.message` 직접 접근 시 TypeScript 에러 발생
- `instanceof Error` 체크로 타입 안전성 확보

**TypeScript 에러 메시지:**
```
Unsafe member access .message on an `any` value.
eslint@typescript-eslint/no-unsafe-member-access
```

---

### 🏗️ 마이크로서비스 통신 패턴

#### **동기 HTTP 통신**
- NestJS가 FastAPI를 직접 호출
- 응답을 기다림 (await)
- 간단하고 직관적

**장점:**
- 구현이 단순
- 응답을 즉시 받음
- 디버깅 용이

**단점:**
- FastAPI가 다운되면 NestJS도 영향
- 타임아웃 발생 가능
- 동기 대기로 인한 성능 저하

#### **향후 개선 방향 (선택적)**
- **메시지 큐 (RabbitMQ, Kafka)**: 비동기 통신
- **서킷 브레이커 (Circuit Breaker)**: 장애 격리
- **재시도 로직 (Retry)**: 일시적 오류 대응

---

### 🔍 NestJS vs FastAPI HTTP 클라이언트 비교

| 구분 | NestJS | FastAPI |
|------|--------|---------|
| HTTP 클라이언트 | `HttpService` (axios 래퍼) | `httpx` |
| 비동기 패턴 | RxJS Observable → Promise | Python async/await |
| 타입 안전성 | TypeScript 타입 체크 | Pydantic 모델 |
| 에러 처리 | try-catch + 타입 가드 | try-except |
| 환경변수 | `ConfigService` | `pydantic-settings` |

---

### 📦 필요한 패키지

**설치 명령어:**
```bash
npm install @nestjs/axios axios
```

**패키지 역할:**
- `@nestjs/axios`: NestJS용 HTTP 모듈 제공
- `axios`: 실제 HTTP 클라이언트 라이브러리

---

---

## 2. DTO 설계 - 타입 안전성 확보

### 📝 구현한 파일들
- `generate-recipe.dto.ts` - 요청 DTO
- `ai-recipe-response.dto.ts` - 응답 DTO

### 🚫 any 타입의 문제점

**초기 구현 (잘못된 방법):**
```typescript
async generateRecipeWithAI(...): Promise<any> {  // ❌
  const response = await this.httpService.post(...);  // response.data는 any
  return response.data;  // ❌ Unsafe return
}
```

**문제점:**
- ❌ 타입 안전성 상실
- ❌ IDE 자동완성 불가
- ❌ 컴파일 타임 에러 감지 불가
- ❌ 런타임 오류 발생 가능

### ✅ 명시적 타입 정의 (올바른 방법)

#### 1. 요청 DTO - GenerateRecipeDto

**파일:** `generate-recipe.dto.ts`

```typescript
export enum AIProvider {
  OPENAI = 'openai',
  CLAUDE = 'claude',
}

export class GenerateRecipeDto {
  @ApiProperty({
    description: '재료 목록',
    example: ['토마토', '계란', '양파'],
  })
  @IsArray()
  @IsString({ each: true })
  ingredients: string[];

  @ApiProperty({
    description: '추가 요구사항 (선택)',
    required: false,
  })
  @IsOptional()
  @IsString()
  preferences?: string;

  @ApiProperty({
    description: 'AI 제공자 선택',
    enum: AIProvider,
    default: AIProvider.OPENAI,
    required: false,
  })
  @IsOptional()
  @IsEnum(AIProvider)
  provider?: AIProvider;
}
```

**class-validator 데코레이터:**
- `@IsArray()`: 배열 타입 검증
- `@IsString({ each: true })`: 배열 각 요소가 문자열인지 검증
- `@IsOptional()`: 선택적 필드
- `@IsEnum()`: enum 타입 검증

#### 2. 응답 DTO - 중첩 객체 타입 정의

**초기 시도 (에러 발생):**
```typescript
@ApiProperty({
  type: 'object',  // ❌ additionalProperties 필수
})
data: {
  recipe_name: string;
  // ...
};
```

**에러 메시지:**
```
additionalProperties 속성이 필수입니다.
```

**올바른 해결 방법: 중첩 클래스 정의**

```typescript
// 중첩된 레시피 데이터 클래스
export class RecipeDataDto {
  @ApiProperty({ description: '요리명' })
  recipe_name: string;

  @ApiProperty({ description: '재료 목록', type: [String] })
  ingredients_list: string[];

  @ApiProperty({ description: '조리 순서', type: [String] })
  instructions: string[];

  @ApiProperty({ description: '조리 시간' })
  cooking_time: string;

  @ApiProperty({ description: '난이도' })
  difficulty: string;

  @ApiProperty({ description: 'AI 원본 응답' })
  raw_response: string;
}

export class AIRecipeResponseDto {
  @ApiProperty({ description: '성공 여부' })
  success: boolean;

  @ApiProperty({ description: '응답 메시지' })
  message: string;

  @ApiProperty({
    description: '레시피 데이터',
    type: RecipeDataDto,  // ✅ 명시적 타입 클래스
  })
  data: RecipeDataDto;
}
```

**장점:**
- ✅ 완전한 타입 안전성
- ✅ Swagger에서 중첩 객체 구조 명확히 표시
- ✅ IDE 자동완성 지원
- ✅ 리팩토링 안전성

### 🔧 Service에서 제네릭 타입 명시

**타입 에러 발생:**
```typescript
const response = await firstValueFrom(
  this.httpService.post(url, data)  // response.data는 any
);
return response.data;  // ❌ Unsafe return of any
```

**해결: 제네릭 타입 명시**
```typescript
const response = await firstValueFrom(
  this.httpService.post<AIRecipeResponseDto>(url, data)  // ✅ 타입 명시
);
return response.data;  // ✅ AIRecipeResponseDto 타입
```

### 📊 any vs 명시적 타입 비교

| 구분 | any 사용 | 명시적 타입 |
|------|---------|------------|
| 타입 안전성 | ❌ 없음 | ✅ 완전 보장 |
| 자동완성 | ❌ 불가 | ✅ 완벽 지원 |
| 컴파일 에러 감지 | ❌ 불가 | ✅ 즉시 감지 |
| Swagger 문서 | ❌ 불명확 | ✅ 완전 자동화 |
| 리팩토링 | ❌ 위험 | ✅ 안전 |

---

## 3. Controller 엔드포인트 구현

### 📝 파일: `recipes.controller.ts`

### 🔧 구현한 코드

```typescript
@Post('generate-ai')
@ApiOperation({
  summary: 'AI를 활용한 레시피 생성',
  description: '재료 목록을 기반으로 AI가 레시피를 자동 생성합니다.',
})
@ApiResponse({
  status: 201,
  description: 'AI 레시피 생성 성공',
  type: AIRecipeResponseDto,  // ✅ 응답 타입 명시
})
@ApiResponse({
  status: 400,
  description: '잘못된 요청 (재료 목록 누락 등)',
})
@ApiResponse({
  status: 500,
  description: 'AI 서비스 호출 실패',
})
async generateWithAI(
  @Body() generateRecipeDto: GenerateRecipeDto,
): Promise<AIRecipeResponseDto> {  // ✅ 명시적 반환 타입
  return this.recipesService.generateRecipeWithAI(
    generateRecipeDto.ingredients,
    generateRecipeDto.preferences,
    generateRecipeDto.provider,
  );
}
```

### 💡 Swagger 문서화의 중요성

**@ApiResponse 데코레이터:**
- `status: 201`: HTTP 상태 코드
- `description`: 응답 설명
- `type: AIRecipeResponseDto`: 응답 스키마 자동 생성

**Swagger UI 효과:**
- API 문서 자동 생성
- Try it out 기능으로 실시간 테스트
- 요청/응답 예시 자동 표시

---

## 4. 환경변수 설정

### 📝 파일: `main-service/.env`

```env
# AI Service Configuration
AI_SERVICE_URL=http://localhost:8000
```

### 🌍 환경별 설정

**개발 환경:**
```env
AI_SERVICE_URL=http://localhost:8000
```

**Docker Compose:**
```env
AI_SERVICE_URL=http://ai-service:8000
```
- 컨테이너 이름으로 통신

**프로덕션:**
```env
AI_SERVICE_URL=https://ai-api.your-domain.com
```

### 🔧 ConfigService 활용

```typescript
const aiServiceUrl =
  this.configService.get<string>('AI_SERVICE_URL') ||
  'http://localhost:8000';  // 기본값
```

**장점:**
- 환경에 따라 유연한 설정
- 코드 수정 없이 배포 환경 전환
- 보안 강화 (환경변수로 민감 정보 관리)

---

## 5. 실제 통신 테스트 성공 🎉

### 📊 테스트 결과

**요청:**
```json
POST http://localhost:3001/recipes/generate-ai
{
  "ingredients": ["토마토", "계란", "양파"],
  "preferences": "매운맛으로",
  "provider": "openai"
}
```

**응답:**
```json
{
  "success": true,
  "message": "레시피 생성이 완료되었습니다.",
  "data": {
    "recipe_name": "매운 토마토 계란 볶음",
    "ingredients_list": [
      "토마토, 계란, 양파, 고추장, 고춧가루, 식용유, 소금"
    ],
    "instructions": [
      "1. 양파를 얇게 채썰고, 토마토를 굵게 다지기.",
      "2. 팬에 식용유를 두르고 양파를 볶다가 토마토를 넣고 볶는다.",
      "3. 고추장 1큰술, 고춧가루 1작은술을 넣고 볶는다.",
      "4. 계란 2개를 풀어 넣고 중불에서 계란이 익을 때까지 볶는다.",
      "5. 소금으로 간을 해주고, 필요시 고춧가루를 더 넣어 매운맛을 조절한다."
    ],
    "cooking_time": "10분 내외",
    "difficulty": "초급",
    "raw_response": "- 요리명: 매운 토마토 계란 볶음\n..."
  }
}
```

### ✅ 통신 흐름 검증

```
1. Client → NestJS
   POST /recipes/generate-ai
        ↓
2. NestJS RecipesController
   @Body() validation
        ↓
3. NestJS RecipesService
   HttpService.post<AIRecipeResponseDto>()
        ↓
4. FastAPI AI Service
   POST /api/recipes/generate
        ↓
5. OpenAI API
   GPT-3.5-turbo
        ↓
6. AI 응답 → FastAPI 파싱
        ↓
7. FastAPI → NestJS
   AIRecipeResponseDto 타입
        ↓
8. NestJS → Client
   완성된 레시피 응답
```

---

## 핵심 학습 정리

### 1. 마이크로서비스 통신 패턴
- **동기 HTTP 통신**: 간단하고 직관적
- **환경변수 기반 URL 관리**: 환경별 유연한 설정
- **타입 안전한 통신**: 제네릭 타입으로 완전한 타입 체크

### 2. TypeScript 타입 안전성
- **any 타입 절대 금지**: 타입 안전성 상실
- **명시적 타입 정의**: DTO 클래스로 완전한 타입 정의
- **제네릭 타입 활용**: `httpService.post<T>()`
- **타입 가드**: `error instanceof Error`

### 3. NestJS HttpService 사용법
- **RxJS Observable → Promise**: `firstValueFrom()`
- **제네릭 타입 명시**: `post<ResponseType>()`
- **에러 처리**: try-catch + 타입 가드

### 4. DTO 설계 원칙
- **중첩 객체는 별도 클래스**: `RecipeDataDto`
- **Swagger 문서화**: `@ApiProperty()`
- **입력 검증**: `class-validator` 데코레이터
- **enum 타입 활용**: 유효한 값만 허용

### 5. 환경변수 관리
- **ConfigService 활용**: 타입 안전한 환경변수 접근
- **기본값 제공**: fallback 값으로 안정성 확보
- **환경별 분리**: 개발/Docker/프로덕션

---

## 🎯 완료된 단계

1. ✅ **RecipesModule에 HttpModule 추가**
2. ✅ **RecipesService FastAPI 호출 로직 구현**
3. ✅ **DTO 타입 안전성 확보** - any 제거
4. ✅ **Controller 엔드포인트 추가** - POST /recipes/generate-ai
5. ✅ **환경변수 설정** - AI_SERVICE_URL
6. ✅ **실제 마이크로서비스 통신 테스트 성공**

---

## 🚀 다음 단계 (선택 사항)

### 향후 개선 가능 사항
1. **에러 처리 강화**
   - 타임아웃 설정
   - 재시도 로직 (Retry)
   - 서킷 브레이커 패턴

2. **AI 레시피 DB 저장**
   - 생성된 레시피를 Recipe 엔티티로 저장
   - 사용자와 연결

3. **Frontend 통합**
   - Next.js에서 NestJS API 호출
   - UI/UX 구현

4. **비동기 통신 (선택적)**
   - 메시지 큐 (RabbitMQ, Kafka)
   - 이벤트 기반 아키텍처

---

🎉 **NestJS ↔ FastAPI 마이크로서비스 통합 완료!**