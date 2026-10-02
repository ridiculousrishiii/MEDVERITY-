from fastapi import APIRouter
from api.routes import health, medical

api_router = APIRouter()
api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(medical.router, prefix="/medical", tags=["medical"])
