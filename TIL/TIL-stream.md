# TIL - SSE (Server-Sent Events) 스트리밍 통신

## 📚 목차
1. [SSE란 무엇인가?](#sse란-무엇인가)
2. [WebSocket vs SSE 비교](#websocket-vs-sse-비교)
3. [스트리밍 아키텍처](#스트리밍-아키텍처)
4. [FastAPI SSE 구현](#fastapi-sse-구현)
5. [OpenAI 스트리밍 API](#openai-스트리밍-api)
6. [NestJS 스트리밍 프록시](#nestjs-스트리밍-프록시)
7. [Frontend EventSource](#frontend-eventsource)
8. [NestJS 라우트 순서의 중요성](#nestjs-라우트-순서의-중요성)
9. [핵심 개념 정리](#핵심-개념-정리)

---

## SSE란 무엇인가?

**Server-Sent Events (SSE)**는 서버에서 클라이언트로 **단방향 실시간 데이터 스트리밍**을 제공하는 웹 표준 기술입니다.

### 특징
- **단방향 통신**: 서버 → 클라이언트만 가능
- **HTTP 기반**: 기존 HTTP 인프라 활용
- **자동 재연결**: 연결 끊김 시 자동으로 재연결
- **텍스트 기반**: UTF-8 텍스트 데이터 전송
- **브라우저 네이티브 지원**: `EventSource` API 내장

### 사용 사례
- AI 챗봇 응답 (ChatGPT, Claude)
- 실시간 알림
- 주식 시세 업데이트
- 로그 스트리밍
- 진행률 표시

---

## WebSocket vs SSE 비교

### 핵심 차이점

#### 1. 통신 방향 🔄

**WebSocket = 전화 통화** 📞
```
┌──────────────┐         ┌──────────────┐
│ 클라이언트    │ ←────→  │    서버      │
└──────────────┘         └──────────────┘
    양방향 실시간 소통

예시:
  클라이언트: "안녕?"      → 서버
  서버:       "안녕!"      → 클라이언트
  클라이언트: "뭐해?"      → 서버
  서버:       "코딩 중!"   → 클라이언트
```

**SSE = 라디오 방송** 📻
```
┌──────────────┐         ┌──────────────┐
│ 클라이언트    │ ←────── │    서버      │
└──────────────┘         └──────────────┘
    서버만 데이터 전송 (단방향)

예시:
  클라이언트: "양파 레시피 추천해줘" (한 번 요청)
  서버:       "양"
  서버:       "파"
  서버:       " 수"
  서버:       "프"
  (클라이언트는 듣기만 함)
```

#### 2. 프로토콜

**WebSocket**
```
ws://example.com      (비보안)
wss://example.com     (보안)

완전히 새로운 프로토콜
HTTP에서 시작 → WebSocket으로 업그레이드
```

**SSE**
```
http://example.com    (비보안)
https://example.com   (보안)

기존 HTTP 프로토콜 사용
추가 설정 불필요
```

#### 3. 연결 방법 및 복잡도

**WebSocket (복잡함)**
```javascript
// 연결 생성
const ws = new WebSocket('ws://localhost:8000');

// 연결 성공
ws.onopen = () => {
  console.log('WebSocket 연결됨');
  ws.send('Hello Server!');  // 메시지 전송
};

// 메시지 수신
ws.onmessage = (event) => {
  console.log('받은 메시지:', event.data);
};

// 에러 처리
ws.onerror = (error) => {
  console.error('WebSocket 에러:', error);
};

// 연결 종료
ws.onclose = () => {
  console.log('WebSocket 연결 끊김');
  // ⚠️ 재연결 로직 직접 구현 필요!
  setTimeout(() => reconnect(), 3000);
};
```

**SSE (간단함)**
```javascript
// 연결 생성 (자동으로 GET 요청)
const eventSource = new EventSource('http://localhost:3000/stream');

// 메시지 수신
eventSource.onmessage = (event) => {
  console.log('받은 메시지:', event.data);
};

// 에러 처리
eventSource.onerror = (error) => {
  console.error('SSE 에러:', error);
  // ✅ 자동으로 3초 후 재연결 시도!
};

// 연결 종료
eventSource.close();
```

#### 4. 재연결 동작

**WebSocket**
```
연결 ──→ 통신 ──→ 끊김! ✕
                    ↓
              수동으로 재연결 코드 작성해야 함

function reconnect() {
  const ws = new WebSocket(url);
  // 재연결 로직 직접 구현
}
```

**SSE**
```
연결 ──→ 통신 ──→ 끊김! ✕
                    ↓
              3초 후 자동 재연결 시도 ✅
                    ↓
              성공하면 계속 통신
```

#### 5. 데이터 전송 방식

**WebSocket**
```javascript
// 양방향 전송 가능
ws.send('Hello');           // 클라이언트 → 서버
ws.send(binaryData);        // Binary 데이터도 가능
ws.send(JSON.stringify({})); // JSON도 가능
```

**SSE**
```javascript
// 서버에서만 전송
// 클라이언트는 받기만 함 (send() 메서드 없음)
eventSource.onmessage = (event) => {
  const data = event.data;  // 문자열(UTF-8)만 가능
};
```

### 비교 표

| 특성 | WebSocket | SSE |
|-----|-----------|-----|
| **통신 방향** | 양방향 (Full-duplex) | 단방향 (Server → Client) |
| **프로토콜** | `ws://` 또는 `wss://` | HTTP/HTTPS |
| **재연결** | 수동 구현 필요 | 자동 재연결 (3초 후) |
| **브라우저 지원** | 모든 모던 브라우저 | 모든 모던 브라우저 (IE 제외) |
| **데이터 형식** | Binary + Text | Text (UTF-8) |
| **복잡도** | 높음 (연결 관리 복잡) | 낮음 (브라우저가 자동 처리) |
| **사용 사례** | 채팅, 게임, 협업 툴 | 알림, 피드, AI 응답 |
| **서버 구현** | 복잡 (WebSocket 서버 필요) | 간단 (HTTP 서버면 충분) |
| **방화벽 통과** | 어려움 (특수 포트) | 쉬움 (HTTP 포트 사용) |

### 실제 사용 예시 비교

#### WebSocket 사용 사례
```
💬 실시간 채팅
  사용자A: "안녕?" → 서버 → 사용자B
  사용자B: "반가워!" → 서버 → 사용자A
  (계속 주고받음)

🎮 멀티플레이어 게임
  플레이어1: 이동 좌표 → 서버 → 플레이어2
  플레이어2: 공격 명령 → 서버 → 플레이어1

🎨 협업 도구 (Figma, Google Docs)
  사용자A: 도형 추가 → 서버 → 사용자B
  사용자B: 텍스트 수정 → 서버 → 사용자A
```

#### SSE 사용 사례
```
🤖 AI 챗봇 (ChatGPT, Claude)
  사용자: "레시피 추천해줘" (한 번 요청)
  서버: "양" → "파" → " 수" → "프" (계속 응답)

🔔 실시간 알림
  서버: "새 댓글이 달렸습니다" → 클라이언트
  서버: "좋아요 10개 달성!" → 클라이언트

📈 주식 시세
  서버: "삼성전자 75,000원" → 클라이언트
  서버: "삼성전자 75,100원" → 클라이언트

📊 로그 스트리밍
  서버: "[INFO] 서버 시작" → 클라이언트
  서버: "[WARN] 메모리 80%" → 클라이언트
```

### 선택 기준

```
┌─────────────────────────────────────────┐
│  클라이언트가 서버에게 계속 말해야 하나? │
└─────────────┬───────────────────────────┘
              ↓
        ┌─────┴─────┐
        YES          NO
         ↓            ↓
    WebSocket        SSE
    (양방향)      (단방향)

    채팅           AI 응답
    게임           알림
    협업 툴        주식 시세
```

### 우리 프로젝트는 왜 SSE를 선택했나?

```
사용자의 요청:
  "양파, 감자로 레시피 추천해줘"
         ↓ (한 번만 요청)

AI의 응답:
  "양파 감자 수프를 만들어보세요..." (계속 응답만 보냄)
         ↓

사용자는 추가로 말할 필요 없음!
→ SSE가 완벽한 선택 ✅
```

**만약 채팅 앱이었다면?**
```
사용자: "양파로 뭐 만들어?" → AI
AI:     "수프 어때요?"      → 사용자
사용자: "재료는?"           → AI
AI:     "양파, 감자, 버터..." → 사용자
(계속 주고받음)

→ 이 경우는 WebSocket 필요 🔄
```

### 성능 비교

| 측면 | WebSocket | SSE |
|-----|-----------|-----|
| **초기 연결** | 느림 (핸드셰이크 필요) | 빠름 (HTTP 바로 사용) |
| **메시지 오버헤드** | 작음 (프레임 헤더만) | 보통 (HTTP 헤더) |
| **서버 부하** | 높음 (지속 연결) | 중간 (HTTP Keep-Alive) |
| **확장성** | 어려움 | 쉬움 (HTTP 로드밸런싱) |

---

## 스트리밍 아키텍처

```
┌─────────────────────────────────────────────────────────────────┐
│                    전체 스트리밍 플로우                            │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐
│   Frontend   │
│  (Next.js)   │
└──────┬───────┘
       │
       │ 1. EventSource GET 요청
       │    http://localhost:3001/recipes/generate-ai-stream?
       │    ingredients=["양파","감자"]&preferences=한식
       ↓
┌──────────────┐
│    NestJS    │
│  (프록시)     │
└──────┬───────┘
       │
       │ 2. Query String 파싱
       │    ingredients: ["양파", "감자"]
       │    preferences: "한식"
       │
       │ 3. POST 요청으로 변환
       │    http://localhost:8000/api/recipes/generate-stream
       │    Body: { ingredients, preferences, provider }
       ↓
┌──────────────┐
│   FastAPI    │
│ (AI Service) │
└──────┬───────┘
       │
       │ 4. OpenAI 스트리밍 API 호출
       ↓
┌──────────────┐
│  OpenAI API  │
│ GPT-3.5-turbo│
└──────┬───────┘
       │
       │ 5. 청크(chunk) 단위로 응답
       │    "양" → "파" → " 감" → "자" → " 수" → "프" ...
       ↓
┌──────────────┐
│   FastAPI    │
│              │ 6. SSE 형식으로 변환
│              │    data: {"content": "양"}\n\n
│              │    data: {"content": "파"}\n\n
└──────┬───────┘
       │
       │ 7. Stream pipe (프록시)
       ↓
┌──────────────┐
│    NestJS    │
└──────┬───────┘
       │
       │ 8. 그대로 전달 (프록시)
       ↓
┌──────────────┐
│   Frontend   │
│              │ 9. EventSource.onmessage
│              │    recipe += chunk.content
│              │    화면 업데이트 (실시간)
└──────────────┘
```

---

## FastAPI SSE 구현

### SSE 응답 형식

SSE는 특정 형식을 따라야 합니다:

```
data: {"content": "양"}\n\n
data: {"content": "파"}\n\n
data: {"done": true}\n\n
```

**규칙:**
1. 각 메시지는 `data: ` 로 시작
2. 메시지 끝에는 `\n\n` (두 개의 개행)
3. JSON 형식 권장 (파싱 편의성)

### FastAPI 구현 코드

**ai-service/app/api/recipes/generate.py:**

```python
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
import json

router = APIRouter()

@router.post("/generate-stream")
async def generate_recipe_stream(request: RecipeRequest):
    """AI 레시피 스트리밍 생성"""

    async def event_generator():
        try:
            # AI 클라이언트 생성
            client = AIClientFactory.get_client(provider=request.provider)

            # 스트리밍 호출
            async for chunk in client.generate_recipe_stream(
                ingredients=request.ingredients,
                preferences=request.preferences
            ):
                # SSE 형식으로 전송
                yield f"data: {json.dumps({'content': chunk}, ensure_ascii=False)}\n\n"

            # 완료 시그널
            yield f"data: {json.dumps({'done': True}, ensure_ascii=False)}\n\n"

        except Exception as e:
            # 에러 전송
            yield f"data: {json.dumps({'error': str(e)}, ensure_ascii=False)}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        }
    )
```

### 핵심 문법 설명

#### 1. `async def event_generator()`
**비동기 제너레이터 함수**입니다.

```python
async def event_generator():
    yield "첫 번째 데이터"
    yield "두 번째 데이터"
    yield "세 번째 데이터"
```

- `yield`: 값을 반환하지만 함수를 종료하지 않음
- 호출자가 다음 값을 요청할 때까지 대기
- 메모리 효율적 (모든 데이터를 한 번에 로드하지 않음)

#### 2. `StreamingResponse`
FastAPI의 스트리밍 응답 클래스입니다.

```python
StreamingResponse(
    event_generator(),          # 제너레이터 함수
    media_type="text/event-stream",  # SSE MIME 타입
    headers={
        "Cache-Control": "no-cache",     # 캐싱 방지
        "Connection": "keep-alive",      # 연결 유지
    }
)
```

#### 3. `async for` 루프
비동기 반복자를 순회합니다.

```python
async for chunk in client.generate_recipe_stream(...):
    yield f"data: {chunk}\n\n"
```

- OpenAI API가 청크를 보낼 때마다 실행
- 블로킹 없이 청크를 받는 즉시 클라이언트로 전송

#### 4. `ensure_ascii=False`
한글이 깨지지 않도록 UTF-8 그대로 전송합니다.

```python
json.dumps({'content': '양파'}, ensure_ascii=False)
# 결과: {"content": "양파"}

json.dumps({'content': '양파'}, ensure_ascii=True)
# 결과: {"content": "\uc591\ud30c"}  (유니코드 이스케이프)
```

---

## OpenAI 스트리밍 API

### OpenAI 스트리밍 구현

**ai-service/app/services/ai_client.py:**

```python
from openai import AsyncOpenAI

class OpenAIClient:
    def __init__(self):
        self.client = AsyncOpenAI(api_key=settings.openai_api_key)

    async def generate_recipe_stream(self, ingredients: List[str], preferences: Optional[str] = None):
        """스트리밍 방식으로 레시피 생성"""
        prompt = build_recipe_prompt(ingredients, preferences)

        stream = await self.client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            stream=True,  # ⭐ 스트리밍 활성화
            temperature=0.7,
        )

        async for chunk in stream:
            content = chunk.choices[0].delta.content
            if content:
                yield content
```

### 핵심 개념

#### 1. `stream=True`
OpenAI API에 스트리밍 모드를 활성화합니다.

**일반 모드 (stream=False):**
```python
response = await client.chat.completions.create(...)
full_text = response.choices[0].message.content  # 전체 텍스트 한 번에
```

**스트리밍 모드 (stream=True):**
```python
stream = await client.chat.completions.create(..., stream=True)
async for chunk in stream:
    partial_text = chunk.choices[0].delta.content  # 부분 텍스트 실시간
```

#### 2. `delta` vs `message`
- **일반 모드**: `chunk.choices[0].message.content` (전체 메시지)
- **스트리밍 모드**: `chunk.choices[0].delta.content` (증분 데이터)

```
일반 모드:
  응답: "양파 감자 수프"

스트리밍 모드:
  청크 1: "양"
  청크 2: "파"
  청크 3: " 감"
  청크 4: "자"
  청크 5: " 수"
  청크 6: "프"
```

#### 3. `async for` 청크 처리
```python
async for chunk in stream:
    content = chunk.choices[0].delta.content
    if content:  # None 체크 (시작/끝 청크)
        yield content
```

OpenAI는 시작과 끝에 `content=None`인 청크를 보낼 수 있으므로 체크가 필요합니다.

---

## NestJS 스트리밍 프록시

### 프록시 역할

NestJS는 **중간 계층**으로서:
1. Frontend로부터 GET 요청 수신 (EventSource는 GET만 지원)
2. Query String 파싱
3. FastAPI로 POST 요청 전환 (Body 형식이 더 깔끔)
4. FastAPI의 스트림 응답을 그대로 Frontend로 전달

```
┌──────────┐  GET   ┌──────────┐  POST  ┌──────────┐
│ Frontend │ ────→  │  NestJS  │ ────→  │ FastAPI  │
└──────────┘        └──────────┘        └──────────┘
                         ↓
                    프로토콜 변환
                    (GET → POST)
```

### NestJS 구현 코드

**main-service/src/recipes/controller/recipes.controller.ts:**

```typescript
import { Get, Query, Res, Controller } from '@nestjs/common';
import { Response } from 'express';
import { Readable } from 'stream';
import { HttpService } from '@nestjs/axios';

@Controller('recipes')
export class RecipesController {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.aiServiceUrl = this.configService.get<string>('AI_SERVICE_URL') || 'http://localhost:8000';
  }

  @Get('generate-ai-stream')
  async generateRecipeStream(
    @Query() query: Record<string, string>,
    @Res() res: Response,
  ): Promise<void> {
    // SSE 헤더 설정
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
      const ingredientsJson = query.ingredients;
      const preferences = query.preferences;

      if (!ingredientsJson) {
        res.write(`data: ${JSON.stringify({ error: 'ingredients 파라미터가 필요합니다' })}\n\n`);
        res.end();
        return;
      }

      // JSON 파싱
      const ingredients = JSON.parse(ingredientsJson) as string[];

      // FastAPI로 POST 요청
      const response = await this.httpService.axiosRef.post(
        `${this.aiServiceUrl}/api/recipes/generate-stream`,
        {
          ingredients,
          preferences: preferences || undefined,
          provider: 'openai',
        },
        { responseType: 'stream' },
      );

      // Stream pipe (프록시)
      const stream = response.data as Readable;
      stream.pipe(res);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.write(`data: ${JSON.stringify({ error: errorMessage })}\n\n`);
      res.end();
    }
  }
}
```

### 핵심 문법 설명

#### 1. `@Query() query: Record<string, string>`
전체 Query 파라미터를 객체로 받습니다.

```typescript
// URL: /recipes/generate-ai-stream?ingredients=["양파"]&preferences=한식

@Query() query: Record<string, string>
// query = {
//   ingredients: '["양파"]',
//   preferences: '한식'
// }
```

**왜 `@Query('ingredients')`를 안 쓰나요?**
- NestJS의 글로벌 `ValidationPipe`가 자동으로 타입 변환 시도
- JSON 문자열을 숫자로 변환하려다 에러 발생
- 전체 객체로 받으면 ValidationPipe 우회

#### 2. `@Res() res: Response`
Express의 `Response` 객체를 직접 제어합니다.

```typescript
@Res() res: Response
```

**주의:** `@Res()`를 사용하면 NestJS의 자동 응답 처리가 비활성화됩니다.
- `return` 대신 `res.write()`, `res.end()` 사용
- 수동으로 응답 관리 필요

#### 3. `res.setHeader()`
HTTP 응답 헤더를 설정합니다.

```typescript
res.setHeader('Content-Type', 'text/event-stream');  // SSE MIME 타입
res.setHeader('Cache-Control', 'no-cache');          // 캐싱 방지
res.setHeader('Connection', 'keep-alive');           // 연결 유지
```

#### 4. `responseType: 'stream'`
Axios에게 응답을 스트림으로 처리하도록 지시합니다.

```typescript
const response = await this.httpService.axiosRef.post(
  url,
  body,
  { responseType: 'stream' }  // ⭐ 스트림 모드
);
```

**일반 모드:**
```typescript
const response = await axios.post(url, body);
console.log(response.data);  // 전체 데이터
```

**스트림 모드:**
```typescript
const response = await axios.post(url, body, { responseType: 'stream' });
response.data.pipe(destination);  // Node.js Readable Stream
```

#### 5. `stream.pipe(res)`
Node.js의 스트림 파이프입니다.

```typescript
const stream = response.data as Readable;
stream.pipe(res);
```

**파이프 개념:**
```
┌─────────┐       ┌─────────┐       ┌─────────┐
│ FastAPI │ ────→ │  NestJS │ ────→ │ Frontend│
│ Stream  │  pipe │  Stream │  pipe │         │
└─────────┘       └─────────┘       └─────────┘
```

- 데이터를 버퍼링 없이 즉시 전달
- 메모리 효율적
- 백프레셔(backpressure) 자동 처리

#### 6. `JSON.parse(ingredientsJson) as string[]`
타입 캐스팅으로 TypeScript 타입 안전성 확보합니다.

```typescript
const ingredients = JSON.parse(ingredientsJson) as string[];
```

- `JSON.parse()`는 `any` 타입 반환
- `as string[]`로 명시적 타입 지정
- TypeScript 컴파일러 경고 제거

---

## Frontend EventSource

### EventSource API

브라우저 네이티브 SSE 클라이언트입니다.

**frontend/src/hooks/useRecipeStream.ts:**

```typescript
import { useState } from 'react';

interface StreamEvent {
  content?: string;
  done?: boolean;
  error?: string;
}

export function useRecipeStream() {
  const [recipe, setRecipe] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateRecipe = async (ingredients: string[], preferences?: string) => {
    setRecipe('');
    setIsStreaming(true);
    setError(null);

    // Query String 생성
    const params = new URLSearchParams({
      ingredients: JSON.stringify(ingredients),
      preferences: preferences || '',
    });

    // EventSource 생성 (자동으로 GET 요청)
    const eventSource = new EventSource(
      `http://localhost:3001/recipes/generate-ai-stream?${params}`
    );

    // 메시지 수신 이벤트
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data) as StreamEvent;

      if (data.done) {
        eventSource.close();
        setIsStreaming(false);
      } else if (data.error) {
        setError(data.error);
        eventSource.close();
        setIsStreaming(false);
      } else if (data.content) {
        setRecipe((prev) => prev + data.content);  // 누적
      }
    };

    // 에러 이벤트
    eventSource.onerror = () => {
      setError('스트리밍 연결 오류');
      eventSource.close();
      setIsStreaming(false);
    };
  };

  return { recipe, isStreaming, error, generateRecipe };
}
```

### 핵심 문법 설명

#### 1. `EventSource` 생성자
SSE 연결을 시작합니다.

```typescript
const eventSource = new EventSource(url);
```

**동작:**
- 자동으로 GET 요청 전송
- `Accept: text/event-stream` 헤더 추가
- 연결 유지

**제약:**
- GET 요청만 지원 (POST 불가)
- 커스텀 헤더 추가 불가 (인증 토큰 전달 어려움)
- Query String으로만 데이터 전달

#### 2. `URLSearchParams`
Query String을 생성합니다.

```typescript
const params = new URLSearchParams({
  ingredients: JSON.stringify(['양파', '감자']),
  preferences: '한식'
});

console.log(params.toString());
// ingredients=%5B%22%EC%96%91%ED%8C%8C%22%2C%22%EA%B0%90%EC%9E%90%22%5D&preferences=%ED%95%9C%EC%8B%9D
```

- URL 인코딩 자동 처리
- 배열/객체는 `JSON.stringify()` 필요

#### 3. `eventSource.onmessage`
서버에서 메시지를 받을 때 실행됩니다.

```typescript
eventSource.onmessage = (event: MessageEvent) => {
  console.log(event.data);  // "{"content": "양"}"
  const data = JSON.parse(event.data);
};
```

**`event` 객체:**
- `event.data`: 서버가 보낸 데이터 (문자열)
- `event.lastEventId`: 이벤트 ID (재연결 시 사용)
- `event.type`: 이벤트 타입 (기본값: "message")

#### 4. `eventSource.onerror`
연결 오류 시 실행됩니다.

```typescript
eventSource.onerror = (event: Event) => {
  console.error('SSE 연결 오류', event);
  eventSource.close();
};
```

**발생 원인:**
- 네트워크 연결 끊김
- 서버 에러 (500, 404 등)
- 타임아웃

**자동 재연결:**
- EventSource는 기본적으로 3초 후 자동 재연결 시도
- `eventSource.close()` 호출 시 재연결 중지

#### 5. `eventSource.close()`
SSE 연결을 종료합니다.

```typescript
eventSource.close();
```

**주의:** React 컴포넌트 언마운트 시 반드시 호출해야 메모리 누수 방지

```typescript
useEffect(() => {
  const eventSource = new EventSource(url);

  return () => {
    eventSource.close();  // 클린업
  };
}, []);
```

#### 6. `setRecipe((prev) => prev + data.content)`
React 함수형 업데이트로 이전 상태에 추가합니다.

```typescript
setRecipe((prev) => prev + data.content);
```

**왜 함수형 업데이트?**
```typescript
// ❌ 잘못된 방법
setRecipe(recipe + data.content);
// recipe 변수가 클로저에 캡처되어 최신 값이 아닐 수 있음

// ✅ 올바른 방법
setRecipe((prev) => prev + data.content);
// prev는 항상 최신 상태값
```

**실행 예시:**
```typescript
// 초기 상태: ""
setRecipe((prev) => prev + "양");  // "양"
setRecipe((prev) => prev + "파");  // "양파"
setRecipe((prev) => prev + " 수");  // "양파 수"
setRecipe((prev) => prev + "프");  // "양파 수프"
```

#### 7. TypeScript 타입 정의

```typescript
interface StreamEvent {
  content?: string;
  done?: boolean;
  error?: string;
}
```

- **Optional 프로퍼티 (`?`)**: 모든 필드가 선택적
- FastAPI에서 보내는 세 가지 메시지 타입:
  - `{ content: "양" }` - 텍스트 청크
  - `{ done: true }` - 완료 시그널
  - `{ error: "..." }` - 에러 메시지

---

## NestJS 라우트 순서의 중요성

### 문제 상황

```typescript
@Controller('recipes')
export class RecipesController {
  @Get(':id')  // ⚠️ 동적 경로가 먼저
  async findOne(@Param('id', ParseIntPipe) id: number) { ... }

  @Get('generate-ai-stream')  // ❌ 이 경로가 :id에 매칭됨!
  async generateRecipeStream() { ... }
}
```

**문제:**
- `/recipes/generate-ai-stream` 요청 시
- `generate-ai-stream`이 `:id` 파라미터로 인식됨
- `ParseIntPipe`가 "generate-ai-stream"을 숫자로 변환하려다 에러 발생

```
요청: GET /recipes/generate-ai-stream
NestJS 해석: :id = "generate-ai-stream"
ParseIntPipe: "generate-ai-stream"을 숫자로 변환? → 400 에러!
```

### 해결 방법

**구체적인 경로를 먼저 정의**합니다.

```typescript
@Controller('recipes')
export class RecipesController {
  @Get('generate-ai-stream')  // ✅ 구체적 경로 먼저
  async generateRecipeStream() { ... }

  @Get('category/:category')  // ✅ 구체적 경로
  async findByCategory() { ... }

  @Get('search/ingredient')  // ✅ 구체적 경로
  async findByIngredient() { ... }

  @Get(':id')  // ✅ 동적 경로는 마지막
  async findOne(@Param('id', ParseIntPipe) id: number) { ... }
}
```

### 라우트 매칭 원리

NestJS는 **위에서 아래로 순차 검색**합니다.

```
┌─────────────────────────────────────────────┐
│     요청: GET /recipes/generate-ai-stream    │
└─────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────┐
│  @Get('generate-ai-stream')                 │
│  ✅ 매칭 성공!                               │
└─────────────────────────────────────────────┘
              ↓
      generateRecipeStream() 실행


┌─────────────────────────────────────────────┐
│     요청: GET /recipes/123                   │
└─────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────┐
│  @Get('generate-ai-stream')                 │
│  ❌ 매칭 실패 (다음으로)                     │
└─────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────┐
│  @Get('category/:category')                 │
│  ❌ 매칭 실패 (다음으로)                     │
└─────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────┐
│  @Get(':id')                                │
│  ✅ 매칭 성공! (:id = "123")                │
└─────────────────────────────────────────────┘
              ↓
      findOne(123) 실행
```

### 올바른 라우트 순서 규칙

```
1. POST, PATCH, DELETE (HTTP 메서드로 구분)
   ↓
2. GET (구체적 경로)
   - /recipes/generate-ai-stream
   - /recipes/category/:category
   - /recipes/search/ingredient
   ↓
3. GET (동적 경로)
   - /recipes/:id
```

**시각화:**

```
┌────────────────────────────────────┐
│  구체적 경로 (Specific Routes)      │
│  ================================  │
│  ✅ /recipes/generate-ai-stream    │
│  ✅ /recipes/category/:category    │
│  ✅ /recipes/search/ingredient     │
└────────────────────────────────────┘
              ↓
┌────────────────────────────────────┐
│  동적 경로 (Dynamic Routes)         │
│  ================================  │
│  ✅ /recipes/:id                   │
└────────────────────────────────────┘
```

---

## 핵심 개념 정리

### 1. SSE (Server-Sent Events)
```
특징: 서버 → 클라이언트 단방향 스트리밍
프로토콜: HTTP/HTTPS
재연결: 자동
사용 사례: AI 챗봇, 실시간 알림, 진행률 표시
```

### 2. SSE 메시지 형식
```
data: {"content": "양파"}\n\n
data: {"done": true}\n\n
```

### 3. 전체 데이터 흐름
```
Frontend (EventSource GET)
    ↓
NestJS (프록시: GET → POST 변환)
    ↓
FastAPI (SSE 응답 생성)
    ↓
OpenAI (스트리밍 API)
```

### 4. 핵심 기술 스택
| 계층 | 기술 | 역할 |
|-----|-----|-----|
| Frontend | EventSource | SSE 클라이언트 |
| NestJS | Stream.pipe() | 프록시 (GET ↔ POST) |
| FastAPI | StreamingResponse | SSE 서버 |
| OpenAI | stream=True | AI 스트리밍 |

### 5. 주요 문법 요약

**FastAPI:**
```python
async def event_generator():
    yield f"data: {json.dumps(data)}\n\n"

return StreamingResponse(event_generator(), media_type="text/event-stream")
```

**OpenAI:**
```python
stream = await client.chat.completions.create(..., stream=True)
async for chunk in stream:
    yield chunk.choices[0].delta.content
```

**NestJS:**
```typescript
const response = await this.httpService.axiosRef.post(url, body, { responseType: 'stream' });
const stream = response.data as Readable;
stream.pipe(res);
```

**Frontend:**
```typescript
const eventSource = new EventSource(url);
eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  setRecipe((prev) => prev + data.content);
};
```

### 6. 트러블슈팅 체크리스트

| 문제 | 원인 | 해결 |
|-----|-----|-----|
| 400 Bad Request | NestJS ValidationPipe | `@Query()` 전체 객체로 받기 |
| 라우트 매칭 실패 | 동적 경로가 먼저 | 구체적 경로를 위로 이동 |
| 한글 깨짐 | ASCII 인코딩 | `ensure_ascii=False` |
| 메모리 누수 | EventSource 미종료 | `eventSource.close()` 호출 |
| CORS 에러 | FastAPI CORS 미설정 | `allow_origins` 설정 |

### 7. 성능 최적화 포인트

**메모리 효율:**
```python
# ❌ 나쁜 방법: 전체 데이터를 메모리에 로드
all_data = await fetch_all()
return all_data

# ✅ 좋은 방법: 청크 단위로 스트리밍
async for chunk in fetch_stream():
    yield chunk
```

**실시간성:**
```typescript
// ❌ 나쁜 방법: 폴링 (주기적 요청)
setInterval(() => fetch('/status'), 1000);

// ✅ 좋은 방법: SSE (푸시 방식)
const eventSource = new EventSource('/stream');
```

---

## 마무리

### 학습한 내용
1. ✅ SSE 개념 및 WebSocket과의 차이
2. ✅ FastAPI SSE 스트리밍 구현
3. ✅ OpenAI 스트리밍 API 사용법
4. ✅ NestJS 스트리밍 프록시 구현
5. ✅ Frontend EventSource 사용법
6. ✅ NestJS 라우트 순서의 중요성
7. ✅ 비동기 제너레이터와 Stream pipe 개념

### 다음 학습 목표
- [ ] WebSocket 구현 및 SSE 비교
- [ ] 인증 토큰을 포함한 SSE 연결
- [ ] Server-Sent Events 표준 명세 심화
- [ ] 재연결 전략 및 에러 처리 고도화
- [ ] 청크 크기 최적화 및 버퍼링 전략

---

**작성일:** 2024-10-01
**작성자:** AI Recipe Platform Team
