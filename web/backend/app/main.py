import os
import uvicorn
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config.database import get_db

from app.routes.image_routes import router as image_router
from app.routes.video_routes import router as video_router
from app.routes.menu_routes import router as menu_router

logging.basicConfig(level=logging.INFO)

app = FastAPI(
    title="Endeavour Data Studio API",
    description="API for splitting video files into frames and compressing images.",
    version="1.0.0",
    contact={
        "name": "febri dwi putro",
        "email": "putrodwifebri@gmail.com",
    },
    license_info={"name": "MIT License"}
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

output_dir = "output"
if not os.path.exists(output_dir):
    os.makedirs(output_dir)
app.mount("/output", StaticFiles(directory=output_dir), name="output")

app.include_router(image_router, prefix="/images")
app.include_router(video_router, prefix="/videos")
app.include_router(menu_router, prefix="/menu")