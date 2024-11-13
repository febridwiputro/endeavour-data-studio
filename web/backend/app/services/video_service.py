import os
import cv2
import random
from datetime import datetime
import cv2
from datetime import datetime
import os


progress_status = {}

def process_split_video_to_img(video_id, video_path, num_images, output_dir):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    cap = cv2.VideoCapture(video_path)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    frame_interval = total_frames // num_images
    count = 0
    frame_idx = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        if frame_idx % frame_interval == 0 and count < num_images:
            timestamp = datetime.now().strftime('%Y-%m-%d-%H-%M-%S')
            output_path = os.path.join(output_dir, f"frame-{timestamp}.png")
            cv2.imwrite(output_path, frame)
            count += 1
            progress_status[video_id] = (count / num_images) * 100

        frame_idx += 1

    cap.release()
    os.remove(video_path)
    progress_status[video_id] = 100

# def process_split_video_to_img(video_id, video_path, num_images, output_dir):
#     """
#     Function to process the video in the background and split it into frames.
#     This is executed in the background and does not block the API.
#     """
#     print("video_path: ", video_path)
#     cap = cv2.VideoCapture(video_path)
#     if not cap.isOpened():
#         progress_status[video_id] = -1 
#         return

#     total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
#     frame_interval = total_frames // num_images

#     count = 0
#     frame_idx = 0
#     image_list = []

#     while cap.isOpened():
#         ret, frame = cap.read()
#         if not ret:
#             break

#         if frame_idx % frame_interval == 0 and count < num_images:
#             timestamp = datetime.now().strftime('%Y-%m-%d-%H-%M-%S')
#             filename = f"video2img-{timestamp}-{random.randint(0, 1000)}.png"
#             output_path = os.path.join(output_dir, filename)

#             cv2.imwrite(output_path, frame)
#             image_list.append(output_path)
#             count += 1

#             # Update progress
#             progress_status[video_id] = (count / num_images) * 100

#         frame_idx += 1

#     cap.release()
#     os.remove(video_path) 
#     progress_status[video_id] = 100 

# def process_split_video_to_img(video_id, video, num_images, output_dir):
#     print("video_path: ", video)
#     video_path = f"./{video.filename}"
#     with open(video_path, "wb") as f:
#         f.write(video.file.read())
#     cap = cv2.VideoCapture(video_path)
#     total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
#     frame_interval = total_frames // num_images
#     count = 0
#     frame_idx = 0
#     while cap.isOpened():
#         ret, frame = cap.read()
#         if not ret:
#             break
#         if frame_idx % frame_interval == 0 and count < num_images:
#             timestamp = datetime.now().strftime('%Y-%m-%d-%H-%M-%S')
#             output_path = os.path.join(output_dir, f"frame-{timestamp}.png")
#             cv2.imwrite(output_path, frame)
#             count += 1
#             progress_status[video_id] = (count / num_images) * 100
#         frame_idx += 1
#     cap.release()
#     os.remove(video_path)
#     progress_status[video_id] = 100

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