FROM python:3.11-slim

# 환경변수 설정
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=7860

# 작업 디렉토리
WORKDIR /app

# 시스템 패키지 업데이트
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Python 의존성 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 애플리케이션 코드 복사
COPY . .

# Hugging Face Spaces는 7860 포트 필수
EXPOSE 7860

# Uvicorn으로 FastAPI 실행 (0.0.0.0:7860)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
