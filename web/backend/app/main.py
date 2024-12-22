import os, sys
import uvicorn
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.config.database import get_db

# sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.controllers.auth.auth_controller import router as auth_router
from app.controllers.user.user_controller import router as user_router
from app.controllers.images.image_routes import router as image_router
from app.controllers.videos.video_routes import router as video_router
from app.controllers.annotations.annotations_controller import router as annotations_router
from app.controllers.menu.menu_router import router as menu_router
# from app.routes.yolo_routes import router as yolo_router

logging.basicConfig(level=logging.INFO)

app = FastAPI(
    title="Data Studio API",
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
    # allow_origins=["*"],
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    # allow_methods=["*"],
    allow_methods=["GET", "POST", "PUT", "DELETE"],    
    allow_headers=["*"],
)

output_dir = "output"
if not os.path.exists(output_dir):
    os.makedirs(output_dir)
# app.mount("/output", StaticFiles(directory=output_dir), name="output")

app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(user_router, prefix="/user", tags=["user"])
app.include_router(annotations_router, prefix="/annotations", tags=["/annotations"])
app.include_router(image_router, prefix="/images", tags=["/images"])
app.include_router(video_router, prefix="/videos", tags=["/videos"])
app.include_router(menu_router, prefix="/menu", tags=["/menu"])
# app.include_router(yolo_router, prefix="/yolo", tags=["/yolo"])