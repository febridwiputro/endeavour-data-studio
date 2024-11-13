from moviepy.editor import VideoFileClip, concatenate_videoclips

def concatenate(video_clip_paths, output_path, method="compose"):
    """Concatenates several video files into one video file
    and save it to `output_path`. Note that extension (mp4, etc.) must be added to `output_path`
    `method` can be either 'compose' or 'reduce':
        `reduce`: Reduce the quality of the video to the lowest quality on the list of `video_clip_paths`.
        `compose`: type help(concatenate_videoclips) for the info."""
    if not video_clip_paths or not output_path:
        raise ValueError("You must provide valid video file paths and an output path.")

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
        min_height = min([c.h for c in clips])
        min_width = min([c.w for c in clips])
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
    parser.add_argument("-c", "--clips", nargs="+",
                        required=True, help="List of video clip paths")
    parser.add_argument("-r", "--reduce", action="store_true", 
                        help="Whether to use the `reduce` method to reduce to the lowest quality on the resulting clip")
    parser.add_argument("-o", "--output", required=True, help="Output file name with extension (e.g. output.mp4)")
    
    args = parser.parse_args()
    clips = args.clips
    output_path = args.output
    reduce = args.reduce
    method = "reduce" if reduce else "compose"

    try:
        concatenate(clips, output_path, method)
    except Exception as e:
        print(f"An error occurred: {e}")


# python video_merger.py --clips "D:\engine\smart_parking\dataset\cctv\keluar_lt_2_out.mp4" "D:\engine\smart_parking\dataset\cctv\keluar_lt_2_out.mp4" "D:\engine\smart_parking\dataset\cctv\keluar_lt_2_out.mp4" "D:\engine\smart_parking\dataset\cctv\keluar_lt_2_out.mp4" --output compose_video.mp4
# python video_merger.py --clips "D:\engine\smart_parking\dataset\cctv\keluar_lt_2_out.mp4" "D:\engine\smart_parking\dataset\cctv\keluar_lt_2_out.mp4" "D:\engine\smart_parking\dataset\cctv\keluar_lt_2_out.mp4" --reduce --output compose_video.mp4

# python video_merger.py --clips "C:\Users\febri.dwi\Documents\dataset\2024-11-08\split_video_2024-11-08\192.168.1.10_01_2024110810130612_1.mp4_1097.mp4" "C:\Users\febri.dwi\Documents\dataset\2024-11-08\split_video_2024-11-08\192.168.1.10_01_2024110810130612_1.mp4_4596.mp4" --output 2024_11_11_compose_video.mp4