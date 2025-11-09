---
title: Recipe AI Service
emoji: 🍳
colorFrom: orange
colorTo: red
sdk: docker
pinned: false
license: mit
---

# 🍳 AI Recipe Recommendation Service

재료 기반 AI 레시피 추천 서비스입니다.

## Features

- 🤖 OpenAI GPT-3.5-turbo 기반 레시피 생성
- 📝 재료 기반 맞춤형 레시피 추천
- 🌐 RESTful API 제공
- 📚 Swagger UI 자동 문서화
- 🔄 실시간 스트리밍 응답

## API Endpoints

- `GET /` - 서비스 정보
- `GET /health` - 헬스 체크
- `POST /api/recipes/generate` - 레시피 생성
- `GET /api/recipes/generate-stream` - 스트리밍 레시피 생성
- `GET /docs` - Swagger UI

## Environment Variables

이 앱은 다음 환경변수가 필요합니다:

- `OPENAI_API_KEY` (필수) - OpenAI API 키
- `MAIN_SERVICE_URL` (선택) - Main Service URL

Hugging Face Spaces 설정에서 **Secrets**로 추가하세요.

## Usage

### 일반 레시피 생성

```bash
curl -X POST "https://YOUR-SPACE-NAME.hf.space/api/recipes/generate" \
  -H "Content-Type: application/json" \
  -d '{"ingredients": ["양파", "감자", "당근"]}'
```

### 스트리밍 레시피 생성

```bash
curl "https://YOUR-SPACE-NAME.hf.space/api/recipes/generate-stream?ingredients=양파,감자,당근"
```

## Tech Stack

- **FastAPI** - 고성능 비동기 웹 프레임워크
- **OpenAI API** - GPT-3.5-turbo
- **Uvicorn** - ASGI 서버
- **Pydantic** - 데이터 검증

## Links

- [Frontend (Vercel)](https://your-app.vercel.app)
- [Main Service (Fly.io)](https://recipe-main-service.fly.dev)
- [GitHub Repository](https://github.com/kamja44/recipe-platform)

## License

MIT
