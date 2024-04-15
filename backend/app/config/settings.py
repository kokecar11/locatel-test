from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache

class Settings(BaseSettings):
    app_name: str = "Backend Test Locatel API"
    DEBUG: bool = False
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str
    ALLOWED_HOSTS: list[str]
    model_config = SettingsConfigDict(env_file="../.env")

    
@lru_cache
def get_settings():
    return Settings()

