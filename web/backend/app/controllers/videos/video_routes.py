from fastapi import APIRouter, BackgroundTasks, File, Form, UploadFile
import random
from typing import List
import shutil

from app.services.video_service import process_split_video_to_img, process_concatenation, progress_status

router = APIRouter()

@router.post("/split-video-to-img")
async def split_video_to_img(
    background_tasks: BackgroundTasks,
    video: UploadFile = File(...), 
    num_images: int = Form(...), 
    folder_name: str = Form("output")
):
    # Generate a random ID for this video processing task
    video_id = random.randint(1000, 9999)
    
    # Save the uploaded video to a temporary location
    video_path = f"./temp_{video_id}_{video.filename}"
    with open(video_path, "wb") as buffer:
        shutil.copyfileobj(video.file, buffer)

    # Schedule the background task with the saved video path
    background_tasks.add_task(process_split_video_to_img, video_id, video_path, num_images, folder_name)
    
    return {"message": "Video processing started", "video_id": video_id}

# @router.post("/split-video-to-img")
# async def split_video_to_img(
#     background_tasks: BackgroundTasks,
#     video: UploadFile = File(...), 
#     num_images: int = Form(...), 
#     folder_name: str = Form("output")
# ):
#     video_id = random.randint(1000, 9999)
#     background_tasks.add_task(process_split_video_to_img, video_id, video, num_images, folder_name)
#     return {"message": "Video processing started", "video_id": video_id}

@router.post("/concatenate-videos")
async def concatenate_videos(
    background_tasks: BackgroundTasks,
    videos: List[UploadFile] = File(...),
    method: str = Form("compose")
):
    video_id = random.randint(1000, 9999)
    background_tasks.add_task(process_concatenation, video_id, videos, method)
    return {"message": "Video concatenation started", "video_id": video_id}

@router.get("/progress-split-video-to-img/{video_id}")
async def get_progress(video_id: int):
    # Ambil status progress dari dictionary `progress_status`
    progress = progress_status.get(video_id, 0)
    return {"progress": progress}


@router.get("/progress/{video_id}")
async def check_progress(video_id: int):
    progress = progress_status.get(video_id, -1)
    return {"status": "processing", "progress": progress}
