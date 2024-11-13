
##################################

import os
import cv2
from fastapi import FastAPI, File, UploadFile, Form, BackgroundTasks
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import random
from PIL import Image  # Added to handle image compression
from typing import List
from fastapi.staticfiles import StaticFiles
import uvicorn
from data.menu import menu

import logging

logging.basicConfig(level=logging.INFO)

app = FastAPI(
    title="Dataset Editor API",
    description="API for splitting video files into frames for further processing.",
    version="1.0.0",
    contact={
        "name": "febri dwi putro",
        "email": "putrodwifebri@gmail.com",
    },
    license_info={
        "name": "MIT License",
    }
)

# Add CORS middleware to allow requests from frontend
app.add_middleware(
    CORSMiddleware,
    # allow_origins=["http://localhost:3000"],    
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dummy Data for Dataset Split Features
menu_data = menu

@app.get("/menu")
async def get_menu():
    """
    Returns the dataset split and video editor features menu.
    """
    return menu_data

# Check if output directory exists, create if not
output_dir = "output"
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

app.mount("/output", StaticFiles(directory=output_dir), name="output")

progress_status = {}

@app.post("/create-output-folder", summary="Create Output Folder", description="Creates an output folder if it does not exist.")
async def create_output_folder(folder_name: str = Form(...)):
    """
    Create an output folder if it doesn't exist.

    Parameters:
    - **folder_name**: The name of the output folder to create.
    """
    output_dir = os.path.abspath(folder_name)  # Use absolute path
    
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        return {"message": f"Output folder '{folder_name}' created."}
    else:
        return {"message": f"Output folder '{folder_name}' already exists."}

def compress_image(input_path, output_path, target_size_kb=150, min_quality=10, step=5):
    """Compress a single image to the target size by adjusting JPEG quality."""
    img = Image.open(input_path)
    quality = 95

    while quality >= min_quality:
        img.save(output_path, 'JPEG', quality=quality)
        size_kb = os.path.getsize(output_path) / 1024

        if size_kb <= target_size_kb:
            print(f"Compressed {os.path.basename(input_path)} to {size_kb:.2f} KB with quality {quality}.")
            break

        quality -= step

    if quality < min_quality:
        print(f"Warning: Could not compress {os.path.basename(input_path)} to {target_size_kb} KB.")

@app.post("/compress-uploaded-images", summary="Compress Uploaded Images with Progress Tracking")
async def compress_uploaded_images(
    background_tasks: BackgroundTasks,
    files: List[UploadFile] = File(...),
    target_size_kb: int = Form(150),
    output_folder: str = Form("output")
):
    output_path = os.path.abspath(output_folder)
    if not os.path.exists(output_path):
        os.makedirs(output_path)

    # Generate a unique compress_id for tracking progress
    compress_id = random.randint(1000, 9999)
    progress_status[compress_id] = 0  # Initialize progress

    # Add background task
    background_tasks.add_task(process_compress_uploaded_images, compress_id, files, target_size_kb, output_path)

    return {"message": "Image compression started", "compress_id": compress_id}

def process_compress_uploaded_images(compress_id, files, target_size_kb, output_dir):
    """Background task to process and compress uploaded images."""
    total_images = len(files)
    for index, file in enumerate(files):
        timestamp = datetime.now().strftime('%Y-%m-%d-%H-%M-%S')
        output_file_path = os.path.join(output_dir, f"compressed-{timestamp}-{random.randint(0, 1000)}.jpg")
        
        try:
            # Save uploaded image temporarily and then compress
            temp_file_path = os.path.join(output_dir, file.filename)
            with open(temp_file_path, "wb") as buffer:
                buffer.write(file.file.read())
            
            # Compress the image
            compress_image(temp_file_path, output_file_path, target_size_kb)
            os.remove(temp_file_path)  # Clean up temporary file
        except Exception as e:
            logging.error(f"Error compressing image {file.filename}: {e}")
            continue

        # Update progress status
        progress_status[compress_id] = (index + 1) / total_images * 100

    # Mark progress as 100% complete
    progress_status[compress_id] = 100

@app.get("/progress-compress-uploaded-images/{compress_id}", summary="Check progress for compress-uploaded-images")
async def progress_compress_uploaded_images(compress_id: int):
    """
    Endpoint to check the progress of the compress-uploaded-images task.
    """
    progress = progress_status.get(compress_id, -1)
    if progress == -1:
        return {"status": "error", "message": f"Invalid compression ID: {compress_id}"}
    
    return {"status": "processing", "progress": progress}

@app.post("/compress-images-in-folder", summary="Compress Images in Folder")
async def compress_images_in_folder(
    background_tasks: BackgroundTasks,
    files: List[UploadFile] = File(None),
    folder_path: str = Form(...),
    target_size_kb: int = Form(150),
    output_folder: str = Form(None)
):
    logging.info(f"Received request with folder_path: {folder_path}, target_size_kb: {target_size_kb}, output_folder: {output_folder}")
    
    # Ensure valid folder path
    if folder_path:
        images_dir = os.path.abspath(folder_path)
    else:
        return {"error": "No valid folder path provided for compression"}

    if output_folder:
        output_dir = os.path.abspath(output_folder)

    # Create directories if they don't exist
    if not os.path.exists(images_dir):
        os.makedirs(images_dir)
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Generate unique compress_id and initialize progress
    compress_id = random.randint(1000, 9999)
    progress_status[compress_id] = 0
    logging.info(f"Compress ID generated: {compress_id}")

    # Start compression task in the background
    background_tasks.add_task(process_compress_images_in_folder, compress_id, images_dir, target_size_kb, output_dir)

    return {"message": "Folder image compression started", "compress_id": compress_id}


def process_compress_images_in_folder(compress_id, folder_name, target_size_kb, output_dir):
    """Function to compress all images in the specified folder."""
    logging.info(f"Starting compression task for folder: {folder_name} with target size: {target_size_kb} KB")
    
    if not os.path.isdir(folder_name):
        logging.error(f"Folder '{folder_name}' does not exist or is not a directory.")
        progress_status[compress_id] = -1
        return

    # Check for image files with case-insensitive extensions
    image_files = [f for f in os.listdir(folder_name) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
    total_images = len(image_files)

    if total_images == 0:
        logging.warning(f"No images found in folder '{folder_name}' to compress.")
        progress_status[compress_id] = -1
        return

    logging.info(f"Found {total_images} images in folder '{folder_name}'.")

    # Process each image
    count = 0
    for file_name in image_files:
        input_path = os.path.join(folder_name, file_name)
        logging.info(f"Processing image: {file_name}")

        timestamp = datetime.now().strftime('%Y-%m-%d-%H-%M-%S')
        compressed_image_path = os.path.join(output_dir, f"compress-img-{timestamp}-{random.randint(0, 1000)}.jpg")
        
        try:
            compress_image(input_path, compressed_image_path, target_size_kb)
            count += 1
        except Exception as e:
            logging.error(f"Error compressing image {file_name}: {e}")
            continue  # Skip to the next file on error

        # Update progress
        progress_status[compress_id] = (count / total_images) * 100

    progress_status[compress_id] = 100  # Mark as complete
    logging.info(f"Completed compression task for folder '{folder_name}'")

@app.get("/progress-compress-images-in-folder/{compress_id}", summary="Check folder image compression progress")
async def progress_compress_images_in_folder(compress_id: int):
    """
    Endpoint to check the progress of a folder image compression task.
    """
    progress = progress_status.get(compress_id, -1)
    if progress == -1:
        return {"status": "error", "message": f"Invalid compression ID: {compress_id}"}
    
    return {"status": "processing", "progress": progress}

@app.post("/compress-single-image", summary="Compress Single Image", description="Compress a single image file.")
async def compress_single_image(
    background_tasks: BackgroundTasks,
    image: UploadFile = File(...),
    target_size_kb: int = Form(150),  # Default target size
    folder_name: str = Form("output")  # Default output folder
):
    """
    Compress a single image file to the target size.
    
    Parameters:
    - **image**: Image file to be compressed.
    - **target_size_kb**: Target size in KB for the compressed image.
    - **folder_name**: Name of the output folder for the compressed image.
    """
    folder_response = await create_output_folder(folder_name)
    output_dir = os.path.abspath(folder_name)

    image_id = random.randint(1000, 9999)  # Generate a unique ID for the image
    image_path = f"./{image.filename}"
    
    # Save the image file
    with open(image_path, "wb") as f:
        f.write(await image.read())

    # Start the background task to compress the image
    progress_status[image_id] = 0 
    background_tasks.add_task(process_compress_single_image, image_id, image_path, target_size_kb, output_dir)

    return {"message": "Image compression started", "image_id": image_id, "folder_response": folder_response}

def process_compress_single_image(image_id, image_path, target_size_kb, output_dir):
    """Function to compress the uploaded single image in the background."""
    timestamp = datetime.now().strftime('%Y-%m-%d-%H-%M-%S')
    compressed_image_path = os.path.join(output_dir, f"compress-img-{timestamp}-{random.randint(0, 1000)}.jpg")

    compress_image(image_path, compressed_image_path, target_size_kb)

    # Update progress to 100% after compression
    progress_status[image_id] = 100
    os.remove(image_path)  # Remove the original image after compressio


@app.get("/progress-compress-single-image/{image_id}", summary="Check single image compression progress")
async def progress_compress_single_image(image_id: int):
    """
    Endpoint to check the progress of a single image compression task.
    """
    progress = progress_status.get(image_id, -1)
    if progress == -1:
        return {"status": "error", "message": "Invalid image ID"}
    return {"status": "processing", "progress": progress}





@app.post("/split-video-to-img", summary="Split Video into Frames", description="Endpoint to upload a video and split it into a specified number of frames.")
async def split_video_to_img(
    background_tasks: BackgroundTasks,
    video: UploadFile = File(...), 
    num_images: int = Form(...), 
    folder_name: str = Form("output")  # Default folder name
):
    """
    Upload a video file and specify the number of images to extract from the video.
    
    Parameters:
    - **video**: Video file (MP4)
    - **num_images**: Number of frames to extract from the video
    - **folder_name**: Name of the output folder
    """
    # Create output folder if it doesn't exist
    folder_response = await create_output_folder(folder_name)
    output_dir = os.path.abspath(folder_name)

    video_id = random.randint(1000, 9999)  # Generate a unique ID for the video
    video_path = f"./{video.filename}"
    
    # Save the video file
    with open(video_path, "wb") as f:
        f.write(await video.read())

    # Start the background task to process the video
    progress_status[video_id] = 0 
    background_tasks.add_task(process_split_video_to_img, video_id, video_path, num_images, output_dir)

    return {"message": "Video processing started", "video_id": video_id, "folder_response": folder_response}

def process_split_video_to_img(video_id, video_path, num_images, output_dir):
    """
    Function to process the video in the background and split it into frames.
    This is executed in the background and does not block the API.
    """
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        progress_status[video_id] = -1 
        return

    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    frame_interval = total_frames // num_images

    count = 0
    frame_idx = 0
    image_list = []

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        if frame_idx % frame_interval == 0 and count < num_images:
            timestamp = datetime.now().strftime('%Y-%m-%d-%H-%M-%S')
            filename = f"video2img-{timestamp}-{random.randint(0, 1000)}.png"
            output_path = os.path.join(output_dir, filename)

            cv2.imwrite(output_path, frame)
            image_list.append(output_path)
            count += 1

            # Update progress
            progress_status[video_id] = (count / num_images) * 100

        frame_idx += 1

    cap.release()
    os.remove(video_path) 
    progress_status[video_id] = 100 

@app.get("/progress-split-video-to-img/{video_id}", summary="Check video processing progress")
async def check_progress_split_video_to_img(video_id: int):
    """
    Endpoint to check the progress of a video splitting task.
    """
    progress = progress_status.get(video_id, -1)
    if progress == -1:
        return {"status": "error", "message": "Invalid video ID"}
    return {"status": "processing", "progress": progress}

@app.post("/concatenate-videos", summary="Concatenate multiple video files")
async def concatenate_videos(
    background_tasks: BackgroundTasks,
    videos: List[UploadFile] = File(...),
    method: str = Form("compose")
):
    """
    Upload multiple video files and concatenate them into a single video.
    
    Parameters:
    - **videos**: List of video files to concatenate (MP4)
    - **method**: Method to use for concatenation ("compose" or "reduce")
    """
    output_dir = "output_videos"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    video_paths = []
    for video in videos:
        video_path = f"./{video.filename}"
        with open(video_path, "wb") as f:
            shutil.copyfileobj(video.file, f)
        video_paths.append(video_path)

    output_video_path = f"{output_dir}/concatenated-{random.randint(1000,9999)}.mp4"
    video_id = random.randint(1000, 9999)
    
    # Add background task to process the concatenation
    progress_status[video_id] = 0  # Initialize progress
    background_tasks.add_task(process_concatenation, video_id, video_paths, output_video_path, method)
    
    return {"message": "Video concatenation started", "video_id": video_id}


def process_concatenation(video_id, video_paths, output_path, method):
    """
    Background task to concatenate video files.
    """
    try:
        clips = [VideoFileClip(video) for video in video_paths]
        if method == "reduce":
            min_height = min([c.h for c in clips])
            min_width = min([c.w for c in clips])
            clips = [c.resize(newsize=(min_width, min_height)) for c in clips]
            final_clip = concatenate_videoclips(clips)
        else:
            final_clip = concatenate_videoclips(clips, method="compose")

        final_clip.write_videofile(output_path)
        
        # Update progress status to completed
        progress_status[video_id] = 100

        # Clean up video clips after processing
        for clip in clips:
            clip.close()
    except Exception as e:
        progress_status[video_id] = -1  # Mark as failed
        print(f"Error processing concatenation: {e}")


@app.get("/concatenation-progress/{video_id}", summary="Check concatenation progress")
async def check_concatenation_progress(video_id: int):
    """
    Endpoint to check the progress of a video concatenation task.
    """
    progress = progress_status.get(video_id, -1)
    if progress == -1:
        return {"status": "error", "message": "Invalid video ID"}
    return {"status": "processing", "progress": progress}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)