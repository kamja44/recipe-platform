# AI Recipe Platform

AI 기반 재료 추천 및 요리 커뮤니티 플랫폼

## 아키텍처

마이크로서비스 구조로 설계된 모노레포:

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Main Service**: NestJS + PostgreSQL + Redis
- **AI Service**: FastAPI + OpenAI/Claude API

## 시작하기

### 환경변수 설정
```bash
cp .env.example .env
# .env 파일에서 필요한 값들 설정
```

### 개발 환경 실행

#### 1. 각 서비스별 개발
```bash
# Frontend
cd frontend && npm run dev

# Main Service
cd main-service && npm run start:dev

# AI Service
cd ai-service && pip install -r requirements.txt && uvicorn app.main:app --reload
```

#### 2. Docker Compose로 통합 실행
```bash
docker-compose up
```

## 서비스 포트

- Frontend: http://localhost:3000
- Main Service: http://localhost:3001
- AI Service: http://localhost:8000
- PostgreSQL: localhost:5432
- Redis: localhost:6379

## 주요 기능

1. **재료 기반 AI 레시피 추천**
2. **레시피 CRUD 및 평점 시스템**
3. **사용자 커뮤니티**
4. **영양정보 분석**

## 개발 가이드

자세한 개발 지침은 `CLAUDE.md` 파일을 참고하세요.