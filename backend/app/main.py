from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.api.routes.events import router as events_router
from app.api.routes.health import router as health_router
from app.api.routes.venues import router as venues_router
from app.core.config import get_settings
from app.db.init_db import init_db


settings = get_settings()


@asynccontextmanager
async def lifespan(_: FastAPI):
    init_db()
    yield


app = FastAPI(
    title=settings.app_name,
    description="Backend API for the events application",
    version="0.1.0",
    lifespan=lifespan,
)

app.include_router(health_router)
app.include_router(venues_router)
app.include_router(events_router)
