import os
from moviepy.editor import VideoFileClip, concatenate_videoclips

def concatenate_from_folder(folder_path, output_path, method="compose"):
    """Concatenates all video files in a folder into one video file
    and save it to `output_path`. Note that extension (e.g., mp4) must be added to `output_path`.
    
    Args:
        folder_path (str): The path to the folder containing video files.
        output_path (str): The path where the concatenated video will be saved.
        method (str): 'compose' or 'reduce':
            'reduce': Reduces the quality of the video to the lowest quality in the folder.
            'compose': Uses the default MoviePy composition method.
    """
    if not folder_path or not output_path:
        raise ValueError("You must provide a valid folder path and an output path.")

    video_clip_paths = [
        os.path.join(folder_path, f)
        for f in os.listdir(folder_path)
        if f.lower().endswith(('.mp4', '.mov', '.avi', '.mkv'))
    ]

    if not video_clip_paths:
        raise ValueError("No video files found in the specified folder.")

    clips = []
    for path in video_clip_paths:
        try:
            clip = VideoFileClip(path)
            clips.append(clip)
        except Exception as e:
            print(f"Error loading video {path}: {e}")

    if not clips:
        raise ValueError("No valid video clips were loaded.")

    if method == "reduce":
        min_height = min(c.h for c in clips)
        min_width = min(c.w for c in clips)
        clips = [c.resize(newsize=(min_width, min_height)) for c in clips]
        final_clip = concatenate_videoclips(clips)
    elif method == "compose":
        final_clip = concatenate_videoclips(clips, method="compose")
    else:
        raise ValueError(f"Invalid method: {method}. Use 'compose' or 'reduce'.")

    final_clip.write_videofile(output_path)

    for clip in clips:
        clip.close()

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(
        description="Simple Video Concatenation script in Python with MoviePy Library")
    parser.add_argument("-f", "--folder", required=True,
                        help="Folder containing video files to concatenate")
    parser.add_argument("-r", "--reduce", action="store_true", 
                        help="Whether to use the `reduce` method to reduce to the lowest quality on the resulting clip")
    parser.add_argument("-o", "--output", required=True, 
                        help="Output file name with extension (e.g., output.mp4)")
    
    args = parser.parse_args()
    folder_path = args.folder
    output_path = args.output
    reduce = args.reduce
    method = "reduce" if reduce else "compose"

    try:
        concatenate_from_folder(folder_path, output_path, method)
    except Exception as e:
        print(f"An error occurred: {e}")


# python video_merger_1.py --folder "C:\Users\febri.dwi\Documents\dataset\2024-11-08\split_video_2024-11-08" --output 2024_11_11_compose_video.mp4