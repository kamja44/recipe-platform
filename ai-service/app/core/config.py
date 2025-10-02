import os
from typing import Optional
from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    # API Keys
    openai_api_key: Optional[str] = Field(default=None, env="OPENAI_API_KEY")
    anthropic_api_key: Optional[str] = Field(default=None, env="ANTHROPIC_API_KEY")

    # Server Configuration
    host: str = Field(default="0.0.0.0", env="HOST")
    port: int = Field(default=8000, env="PORT")
    debug: bool = Field(default=True, env="DEBUG")

    # External Services
    main_service_url: str = Field(default="http://localhost:3001", env="MAIN_SERVICE_URL")

    # App Configuration
    app_name: str = "Recipe AI Service"
    version: str = '1.0.0'

    class Config:
        env_file = '.env'
        case_sensitive = False
    
# Global settings instance
settings = Settings()