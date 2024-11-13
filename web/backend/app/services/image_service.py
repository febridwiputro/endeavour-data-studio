import os
from PIL import Image
from datetime import datetime
import random
import cv2
import logging
import time

logging.basicConfig(level=logging.INFO)
progress_status = {}



def adjust_image_size(input_path, output_path, target_size=(640, 640)):
    img = cv2.imread(input_path)
    height, width = img.shape[:2]
    target_width, target_height = target_size

    if width > target_width or height > target_height:
        scaling_factor = min(target_width / width, target_height / height)
        img = cv2.resize(img, (int(width * scaling_factor), int(height * scaling_factor)))
        height, width = img.shape[:2]

    left = (target_width - width) // 2
    top = (target_height - height) // 2

    adjusted_img = cv2.copyMakeBorder(
        img, top, target_height - height - top, left, target_width - width - left,
        cv2.BORDER_CONSTANT, value=(0, 0, 0)
    )

    cv2.imwrite(output_path, adjusted_img)
    # print(f"Adjusted {os.path.basename(input_path)} to {target_size}.")

def adjust_images_in_folder(adjustment_id, folder_input_path, target_width, target_height, output_folder):
    """Adjust all images in a folder to the specified size by adding a black background."""

    if not os.path.isdir(folder_input_path):
        logging.error(f"Folder '{folder_input_path}' does not exist or is not a directory.")
        progress_status[adjustment_id] = -1
        return

    image_files = [f for f in os.listdir(folder_input_path) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
    total_images = len(image_files)

    if total_images == 0:
        logging.warning(f"No images found in folder '{folder_input_path}' to process.")
        progress_status[adjustment_id] = -1
        return

    logging.info(f"Found {total_images} images in folder '{folder_input_path}'.")
    target_size = (target_width, target_height)

    # Counter for successfully processed images
    data_count = 0
    for count, file_name in enumerate(image_files, 1):
        input_path = os.path.join(folder_input_path, file_name)
        logging.info(f"Processing image: {file_name}")

        timestamp = datetime.now().strftime('%Y-%m-%d-%H-%M-%S')
        output_file_path = os.path.join(output_folder, f"img-size-adjust-{timestamp}-{random.randint(0, 1000)}.jpg")

        try:
            adjust_image_size(input_path, output_file_path, target_size)
            data_count += 1
        except Exception as e:
            logging.error(f"Error adjusting image {file_name}: {e}")
            continue

        # Update progress for each processed image
        progress_status[adjustment_id] = round((data_count / total_images) * 100, 2)
        logging.info(f"Progress {progress_status[adjustment_id]}% for adjustment ID {adjustment_id}")

        # Optional: small delay to make progress updates visible
        time.sleep(0.5)

    # Set final progress to 100% and log completed task
    progress_status[adjustment_id] = 100
    logging.info(f"Completed adjustment task for folder '{folder_input_path}' with {data_count} images processed.")
    return data_count

# def adjust_images_in_folder(adjustment_id, folder_input_path, target_width, target_height, output_folder):
#     """Adjust all images in a folder to the specified size by adding a black background."""

#     if not os.path.isdir(folder_input_path):
#         logging.error(f"Folder '{folder_input_path}' does not exist or is not a directory.")
#         progress_status[adjustment_id] = -1
#         return

#     image_files = [f for f in os.listdir(folder_input_path) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
#     total_images = len(image_files)

#     if total_images == 0:
#         logging.warning(f"No images found in folder '{folder_input_path}' to compress.")
#         progress_status[adjustment_id] = -1
#         return

#     logging.info(f"Found {total_images} images in folder '{folder_input_path}'.")

#     target_size = (target_width, target_height)

#     count = 0
#     for file_name in image_files:
#         input_path = os.path.join(folder_input_path, file_name)
#         logging.info(f"Processing image: {file_name}")

#         timestamp = datetime.now().strftime('%Y-%m-%d-%H-%M-%S')
#         output_file_path = os.path.join(output_folder, f"img-size-adjust-{timestamp}-{random.randint(0, 1000)}.jpg")        

#         try:
#             adjust_image_size(input_path, output_file_path, target_size)
#             count += 1
#         except Exception as e:
#             logging.error(f"Error compressing image {file_name}: {e}")
#             continue

#         # Pembaruan progress setiap kali gambar selesai diproses
#         progress_status[adjustment_id] = round((count / total_images) * 100, 2)
#         logging.info(f"Progress {progress_status[adjustment_id]}% for adjustment ID {adjustment_id}")

#         # Tambahkan delay atau jeda kecil agar pembaruan progress terlihat
#         time.sleep(0.5)

#     # Set progress ke 100 setelah semua gambar selesai
#     progress_status[adjustment_id] = 100
#     logging.info(f"Completed compression task for folder '{folder_input_path}'")

def process_compress_images_in_folder(compress_id, folder_name, target_size_kb, output_dir):
    """Function to compress all images in the specified folder."""
    logging.info(f"Starting compression task for folder: {folder_name} with target size: {target_size_kb} KB")
    
    if not os.path.isdir(folder_name):
        logging.error(f"Folder '{folder_name}' does not exist or is not a directory.")
        progress_status[compress_id] = -1
        return

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


def compress_image(input_path, output_path, target_size_kb=150, min_quality=10, step=5):
    img = Image.open(input_path)
    quality = 95
    while quality >= min_quality:
        img.save(output_path, 'JPEG', quality=quality)
        if os.path.getsize(output_path) / 1024 <= target_size_kb:
            break
        quality -= step

async def create_output_folder(folder_name):
    output_dir = os.path.abspath(folder_name)
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    return output_dir

def process_compress_uploaded_images(compress_id, files, target_size_kb, output_dir):
    total_images = len(files)
    for index, file in enumerate(files):
        timestamp = datetime.now().strftime('%Y-%m-%d-%H-%M-%S')
        output_file_path = os.path.join(output_dir, f"compressed-{timestamp}-{random.randint(0, 1000)}.jpg")
        temp_file_path = os.path.join(output_dir, file.filename)
        with open(temp_file_path, "wb") as buffer:
            buffer.write(file.file.read())
        compress_image(temp_file_path, output_file_path, target_size_kb)
        os.remove(temp_file_path)
        progress_status[compress_id] = (index + 1) / total_images * 100
    progress_status[compress_id] = 100

def process_compress_single_image(image_id, image_path, target_size_kb, output_dir):
    """Function to compress the uploaded single image in the background."""
    timestamp = datetime.now().strftime('%Y-%m-%d-%H-%M-%S')
    compressed_image_path = os.path.join(output_dir, f"compress-img-{timestamp}-{random.randint(0, 1000)}.jpg")

    compress_image(image_path, compressed_image_path, target_size_kb)

    # Update progress to 100% after compression
    progress_status[image_id] = 100
    os.remove(image_path)  # Remove the original image after compressio