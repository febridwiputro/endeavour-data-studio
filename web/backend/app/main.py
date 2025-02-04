import os, sys
import uvicorn
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from app.config.database import get_db

# sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.controllers.auth.auth_controller import router as auth_router
from app.controllers.user.user_controller import router as user_router
from app.controllers.images.image_routes import router as image_router
from app.controllers.videos.video_routes import router as video_router
from app.controllers.annotations.annotation_features_controller import router as annotation_features_router
from app.controllers.annotations.annotation_projects_controller import router as annotation_projects_router
from app.controllers.annotations.annotation_project_features_controller import router as annotation_project_features_router
from app.controllers.annotations.annotation_sub_features_1 import router as annotation_sub_features_1_router
from app.controllers.annotations.annotation_sub_features_2 import router as annotation_sub_features_2_router
from app.controllers.menu.menu_router import router as menu_router
from app.controllers.annotations.annotation_projects.upload_data_controller import router as upload_data_router
from app.controllers.annotations.annotation_projects.classes_and_tags_controller import router as classes_and_tags_router
from app.controllers.annotations.models_controllers import router as models_router
from app.controllers.annotations.annotation_projects.annotate.image_annotations_controller import router as image_annotations_router
# from app.controllers.annotations.annotation_projects.annotate_controller import router as annotate_router
# from app.controllers.annotations.annotation_projects.annotate_result_controller import router as annotate_result_router
from app.controllers.yolo_routes import router as yolo_router
from app.controllers.tools.mlflow_controller import router as mlflow_router

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
    allow_origins=["http://localhost:3000", "http://127.0.0.1:8000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"], 
)


@app.middleware("http")
async def add_cors_header(request, call_next):
    response = await call_next(request)
    response.headers["Access-Control-Allow-Origin"] = "*"
    return response

# app.add_middleware(
#     CORSMiddleware,
#     # allow_origins=["*"],
#     allow_origins=["http://localhost:3000"],
#     allow_credentials=True,
#     # allow_methods=["*"],
#     allow_methods=["GET", "POST", "PUT", "DELETE"],    
#     allow_headers=["*"],
# )

output_dir = "output"
if not os.path.exists(output_dir):
    os.makedirs(output_dir)
# app.mount("/output", StaticFiles(directory=output_dir), name="output")

app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(user_router, prefix="/user", tags=["user"])
app.include_router(annotation_features_router, prefix="/annotations/annotation-features", tags=["annotations/annotation-features"])
app.include_router(annotation_sub_features_1_router, prefix="/annotations/annotation-sub-features-1", tags=["annotations/annotation-sub-features-1"])
app.include_router(annotation_sub_features_2_router, prefix="/annotations/annotation-sub-features-2", tags=["annotations/annotation-sub-features-2"])
app.include_router(annotation_projects_router, prefix="/annotations/annotation-projects", tags=["annotations/annotation-projects"])
app.include_router(annotation_project_features_router, prefix="/annotations/annotation-project-features", tags=["annotations/annotation-project-features"])
app.include_router(upload_data_router, prefix="/annotations/upload-data", tags=["annotations/upload-data"])
app.include_router(classes_and_tags_router, prefix="/annotations/classes-and-tags", tags=["annotations/classes-and-tags"])
app.include_router(image_annotations_router, prefix="/annotations/image-annotations", tags=["annotations/image-annotations"])
# app.include_router(annotate_router, prefix="/annotations/annotate", tags=["annotations/annotate"])
# app.include_router(annotate_result_router, prefix="/annotations/annotate-result", tags=["annotations/annotate-result"])

app.include_router(models_router, prefix="/annotations/models", tags=["annotations/models"])
app.include_router(image_router, prefix="/images", tags=["images"])
app.include_router(video_router, prefix="/videos", tags=["videos"])
app.include_router(menu_router, prefix="/menu", tags=["menu"])
app.include_router(yolo_router, prefix="/yolo", tags=["/yolo"])
app.include_router(mlflow_router, prefix="/mlflow", tags=["/mlflow"])