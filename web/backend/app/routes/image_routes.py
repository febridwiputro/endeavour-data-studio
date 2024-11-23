# routes/image_routes.py

import os
from datetime import datetime
from fastapi import APIRouter, BackgroundTasks, File, Form, UploadFile, BackgroundTasks, HTTPException
from typing import List
import random
from app.services.image_service import (
    compress_image, 
    process_compress_uploaded_images, 
    process_compress_single_image, 
    create_output_folder, 
    progress_status, 
    adjust_image_size, 
    adjust_images_in_folder, 
    process_compress_images_in_folder,
    adjust_images_in_folder,
    process_crop_images_in_folder
)
import logging

logging.basicConfig(level=logging.INFO)
router = APIRouter()


@router.post("/crop-images-in-folder", summary="Crop Images in Folder")
async def crop_images_in_folder(
    background_tasks: BackgroundTasks,
    folder_path: str = Form(...),
    target_width: int = Form(...),
    target_height: int = Form(...),
    output_folder: str = Form("output")
):
    logging.info(f"Received request with folder_path: {folder_path}, target_width: {target_width}, target_height: {target_height}, output_folder: {output_folder}")
    
    # Get absolute paths for input and output directories
    images_dir = os.path.abspath(folder_path)
    output_dir = os.path.abspath(output_folder)

    # Validate input folder
    if not os.path.exists(images_dir):
        return {"error": f"Folder path '{folder_path}' does not exist."}

    # Create output folder if it doesn't exist
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Generate a unique crop ID for this process
    crop_id = random.randint(1000, 9999)
    progress_status[crop_id] = 0
    logging.info(f"Crop ID generated: {crop_id}")

    # Start cropping task in the background
    background_tasks.add_task(process_crop_images_in_folder, crop_id, images_dir, target_width, target_height, output_dir)

    return {"message": "Folder image cropping started", "crop_id": crop_id}

@router.post("/adjust-image-size", summary="Adjust a single image size")
async def adjust_image_size_endpoint(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    target_width: int = Form(640),
    target_height: int = Form(640),
    output_folder: str = Form("output")
):
    target_size = (target_width, target_height)
    output_dir = os.path.abspath(output_folder)
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    timestamp = datetime.now().strftime('%Y-%m-%d-%H-%M-%S')
    output_file_path = os.path.join(output_dir, f"img-size-adjust-{timestamp}-{random.randint(0, 1000)}.jpg")

    temp_file_path = os.path.join(output_dir, file.filename)
    with open(temp_file_path, "wb") as buffer:
        buffer.write(await file.read())

    background_tasks.add_task(adjust_image_size, temp_file_path, output_file_path, target_size)

    return {"message": "Image size adjustment started", "output_path": output_file_path}

@router.post("/adjust-images-in-folder", summary="Adjust sizes of all images in a folder", status_code=200)
async def adjust_images_in_folder_endpoint(
    background_tasks: BackgroundTasks,
    folder_path: str = Form(...),
    target_width: int = Form(640),
    target_height: int = Form(640),
    output_folder: str = Form(None)
):
    if not folder_path:
        raise HTTPException(status_code=400, detail="No valid folder path provided for image adjustment.")

    images_dir = os.path.abspath(folder_path)
    output_dir = os.path.abspath(output_folder) if output_folder else os.path.abspath("output")

    # Check if folders exist, create if not
    if not os.path.exists(images_dir):
        os.makedirs(images_dir)
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Initialize unique adjustment ID and progress tracking
    adjustment_id = random.randint(1000, 9999)
    progress_status[adjustment_id] = 0
    logging.info(f"Adjustment ID generated: {adjustment_id}")

    # Add background task for processing images
    background_tasks.add_task(
        adjust_images_in_folder,
        adjustment_id=adjustment_id,
        folder_input_path=images_dir,
        target_width=target_width,
        target_height=target_height,
        output_folder=output_dir
    )

    # Initial response with adjustment ID for progress tracking
    return {
        "message": "Image size adjustment for folder started",
        "adjustment_id": adjustment_id
    }

@router.get("/progress-adjust-images-in-folder/{adjustment_id}", summary="Check folder image adjustment progress")
async def progress_adjust_images_in_folder(adjustment_id: int):
    """
    Endpoint to check the progress of an image adjustment task for a folder.
    """
    progress = progress_status.get(adjustment_id, -1)
    if progress == -1:
        return {"status": "error", "message": f"Invalid adjustment ID: {adjustment_id}"}
    
    return {"status": "processing", "progress": progress}

@router.post("/compress-images-in-folder", summary="Compress Images in Folder")
async def compress_images_in_folder(
    background_tasks: BackgroundTasks,
    folder_path: str = Form(...),
    target_size_kb: int = Form(150),
    output_folder: str = Form("output")
):
    logging.info(f"Received request with folder_path: {folder_path}, target_size_kb: {target_size_kb}, output_folder: {output_folder}")
    
    # Check if folder_path is provided and valid
    images_dir = os.path.abspath(folder_path)
    if not os.path.exists(images_dir):
        return {"error": f"Folder path '{folder_path}' does not exist."}

    output_dir = os.path.abspath(output_folder)
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Generate unique compress_id and initialize progress
    compress_id = random.randint(1000, 9999)
    progress_status[compress_id] = 0
    logging.info(f"Compress ID generated: {compress_id}")

    # Start compression task in the background
    background_tasks.add_task(process_compress_images_in_folder, compress_id, images_dir, target_size_kb, output_dir)

    return {"message": "Folder image compression started", "compress_id": compress_id}

# @router.post("/compress-images-in-folder", summary="Compress Images in Folder")
# async def compress_images_in_folder(
#     background_tasks: BackgroundTasks,
#     files: List[UploadFile] = File(None),
#     folder_path: str = Form(...),
#     target_size_kb: int = Form(150),
#     output_folder: str = Form(None)
# ):
#     logging.info(f"Received request with folder_path: {folder_path}, target_size_kb: {target_size_kb}, output_folder: {output_folder}")
    
#     if folder_path:
#         images_dir = os.path.abspath(folder_path)
#     else:
#         return {"error": "No valid folder path provided for compression"}

#     if output_folder:
#         output_dir = os.path.abspath(output_folder)

#     # Create directories if they don't exist
#     if not os.path.exists(images_dir):
#         os.makedirs(images_dir)
#     if not os.path.exists(output_dir):
#         os.makedirs(output_dir)

#     # Generate unique compress_id and initialize progress
#     compress_id = random.randint(1000, 9999)
#     progress_status[compress_id] = 0
#     logging.info(f"Compress ID generated: {compress_id}")

#     # Start compression task in the background
#     background_tasks.add_task(process_compress_images_in_folder, compress_id, images_dir, target_size_kb, output_dir)

#     return {"message": "Folder image compression started", "compress_id": compress_id}

@router.get("/progress-compress-images-in-folder/{compress_id}", summary="Check folder image compression progress")
async def progress_compress_images_in_folder(compress_id: int):
    """
    Endpoint to check the progress of a folder image compression task.
    """
    progress = progress_status.get(compress_id, -1)
    if progress == -1:
        return {"status": "error", "message": f"Invalid compression ID: {compress_id}"}
    
    return {"status": "processing", "progress": progress}

@router.post("/compress-uploaded-images")
async def compress_uploaded_images(
    background_tasks: BackgroundTasks,
    files: List[UploadFile] = File(...),
    target_size_kb: int = Form(150),
    output_folder: str = Form("output")
):
    output_path = await create_output_folder(output_folder)
    compress_id = random.randint(1000, 9999)
    progress_status[compress_id] = 0
    background_tasks.add_task(process_compress_uploaded_images, compress_id, files, target_size_kb, output_path)
    return {"message": "Image compression started", "compress_id": compress_id}

@router.post("/compress-single-image")
async def compress_single_image(
    background_tasks: BackgroundTasks,
    image: UploadFile = File(...),
    target_size_kb: int = Form(150),
    folder_name: str = Form("output")
):
    output_path = await create_output_folder(folder_name)
    image_id = random.randint(1000, 9999)
    background_tasks.add_task(process_compress_single_image, image_id, image, target_size_kb, output_path)
    return {"message": "Image compression started", "image_id": image_id}

@router.get("/progress/{compress_id}")
async def progress_compress_images(compress_id: int):
    progress = progress_status.get(compress_id, -1)
    return {"status": "processing", "progress": progress}
