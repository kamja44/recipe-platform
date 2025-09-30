from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.recipes.generate import router as recipes_router

app = FastAPI(
    title="Recipe AI Service",
    version="1.0.0",
    description="AI 기반 레시피 추천 서비스",
    docs_url="/docs", # Swagger UI
    redoc_url="/redoc" # ReDoc UI
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # dev용
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# 라우터 등록
app.include_router(recipes_router)

@app.get("/")
async def root():
    return {
        "message": "Recipe AI Service is running!",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "ai-service"
    }