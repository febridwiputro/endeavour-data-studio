from moviepy.editor import VideoFileClip, ImageClip, CompositeVideoClip, TextClip, AudioFileClip, concatenate_videoclips, vfx
from moviepy.audio.fx.all import audio_fadein, audio_fadeout, freeze
from moviepy.video.fx.all import colorx, blackwhite, resize, invert_colors, mirror_x, mirror_y, fadeout, blur
from moviepy.video.fx import speedx, fadein
from moviepy.video.tools.drawing import color_gradient
from moviepy.video.fx.margin import margin
import random
from datetime import datetime
import cv2
import os, sys
from rembg import remove
from moviepy.audio.fx import all as afx
import librosa
import numpy as np


class BasicVideoEditing:
    @staticmethod
    def apply_speed_ramping(input_path, output_path, ramp_times, speeds):
        """Menerapkan speed ramping pada video di waktu-waktu tertentu."""
        with VideoFileClip(input_path) as video:
            final_video = video.fx(vfx.speedx, speeds[0], end=ramp_times[0])
            for i in range(1, len(ramp_times)):
                final_video = final_video.set_duration(ramp_times[i]).fx(vfx.speedx, speeds[i])
            final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def extract_frames(input_path, output_dir, frame_rate=1):
        """Mengekstrak frame dari video setiap detik ke dalam folder yang diberikan."""
        with VideoFileClip(input_path) as video:
            for i, frame in enumerate(video.iter_frames(fps=frame_rate)):
                frame_image_path = os.path.join(output_dir, f"frame_{i+1}.png")
                cv2.imwrite(frame_image_path, frame)

    @staticmethod
    def add_watermark(input_path, output_path, watermark_path, position=("right", "bottom"), opacity=0.5):
        """Menambahkan watermark ke video."""
        with VideoFileClip(input_path) as video, ImageClip(watermark_path) as watermark:
            watermark = watermark.set_opacity(opacity).set_duration(video.duration).set_position(position).resize(height=50)
            final_video = CompositeVideoClip([video, watermark])
            final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_video_transition(video1_path, video2_path, output_path, transition_type="fade", duration=1):
        """Menambahkan transisi antara dua video."""
        video1 = VideoFileClip(video1_path)
        video2 = VideoFileClip(video2_path)
        if transition_type == "fade":
            video2 = video2.crossfadein(duration)
        final_video = concatenate_videoclips([video1, video2], method="compose")
        final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_video_transition(video1_path, video2_path, output_path, transition_type="fade", duration=1):
        """Menambahkan transisi antara dua video."""
        video1 = VideoFileClip(video1_path)
        video2 = VideoFileClip(video2_path)
        if transition_type == "fade":
            video2 = video2.crossfadein(duration)
        final_video = concatenate_videoclips([video1, video2], method="compose")
        final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def trim_video(input_path, output_path, start_time, end_time):
        """Memotong video dari `start_time` ke `end_time`."""
        with VideoFileClip(input_path) as video:
            trimmed_video = video.subclip(start_time, end_time)
            trimmed_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def change_video_speed(input_path, output_path, factor):
        """Mengubah kecepatan video. `factor > 1` untuk mempercepat, `factor < 1` untuk memperlambat."""
        with VideoFileClip(input_path) as video:
            modified_video = video.fx(speedx, factor)
            modified_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def reverse_video(input_path, output_path):
        """Membalikkan video (reverse)."""
        with VideoFileClip(input_path) as video:
            reversed_video = video.fx(vfx.time_mirror)
            reversed_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def rotate_video(input_path, output_path, angle):
        """Memutar video dengan sudut `angle`."""
        with VideoFileClip(input_path) as video:
            rotated_video = video.rotate(angle)
            rotated_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def resize_video(input_path, output_path, new_width=None, new_height=None):
        """Mengubah ukuran video ke resolusi yang baru."""
        with VideoFileClip(input_path) as video:
            if new_width and new_height:
                resized_video = video.resize((new_width, new_height))
            elif new_width:
                resized_video = video.resize(width=new_width)
            elif new_height:
                resized_video = video.resize(height=new_height)
            else:
                raise ValueError("You must provide either a new width or height.")
            resized_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def crop_video(input_path, output_path, x1, y1, x2, y2):
        """Memotong video dari (x1, y1) ke (x2, y2)."""
        with VideoFileClip(input_path) as video:
            cropped_video = video.crop(x1=x1, y1=y1, x2=x2, y2=y2)
            cropped_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def remove_audio_from_video(input_path, output_path):
        """Menghapus audio dari video."""
        with VideoFileClip(input_path) as video:
            video_without_audio = video.without_audio()
            video_without_audio.write_videofile(output_path, codec="libx264")

    @staticmethod
    def split_video(input_path, output_path, parts=2):
        """Memotong video menjadi beberapa bagian yang sama."""
        with VideoFileClip(input_path) as video:
            duration_per_part = video.duration / parts
            for i in range(parts):
                start_time = i * duration_per_part
                end_time = start_time + duration_per_part
                part = video.subclip(start_time, end_time)
                part.write_videofile(f"{output_path}_part{i+1}.mp4", codec="libx264", audio_codec="aac")

    @staticmethod
    def video_to_gif(input_path, output_path):
        """Mengubah video menjadi GIF."""
        with VideoFileClip(input_path) as video:
            video.write_gif(output_path)

    @staticmethod
    def loop_video(input_path, output_path, loops=2):
        """Mengulang video sebanyak `loops` kali."""
        with VideoFileClip(input_path) as video:
            looped_video = video.loop(n=loops)
            looped_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def adjust_video_brightness(input_path, output_path, factor=1.2):
        """Mengubah kecerahan video (default meningkatkan 20%)."""
        with VideoFileClip(input_path) as video:
            brighter_video = colorx(video, factor)
            brighter_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def change_fps(input_path, output_path, fps=30):
        """Mengubah frame rate video."""
        with VideoFileClip(input_path) as video:
            video_with_new_fps = video.set_fps(fps)
            video_with_new_fps.write_videofile(output_path, codec="libx264", fps=fps)

    @staticmethod
    def adjust_contrast(input_path, output_path, factor=1.2):
        """Mengubah kontras video. Faktor lebih dari 1 untuk meningkatkan kontras, kurang dari 1 untuk mengurangi."""
        with VideoFileClip(input_path) as video:
            contrast_video = colorx(video, factor)
            contrast_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def crop_aspect_ratio(input_path, output_path, target_aspect_ratio=16/9):
        """Memotong video berdasarkan rasio aspek tertentu."""
        with VideoFileClip(input_path) as video:
            video_aspect_ratio = video.w / video.h
            if video_aspect_ratio > target_aspect_ratio:
                new_width = int(video.h * target_aspect_ratio)
                x1 = (video.w - new_width) // 2
                x2 = x1 + new_width
                cropped_video = video.crop(x1=x1, x2=x2)
            else:
                new_height = int(video.w / target_aspect_ratio)
                y1 = (video.h - new_height) // 2
                y2 = y1 + new_height
                cropped_video = video.crop(y1=y1, y2=y2)
            
            cropped_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def stabilize_video(input_path, output_path, jitter=5):
        """Pseudo-stabilize video by slightly shifting frames."""
        def jitter_frames(get_frame, t):
            img = get_frame(t)
            dx = random.randint(-jitter, jitter)
            dy = random.randint(-jitter, jitter)
            return img[max(0, dy):img.shape[0]-dy, max(0, dx):img.shape[1]-dx]
        
        with VideoFileClip(input_path) as video:
            stabilized_video = video.fl(jitter_frames)
            stabilized_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_time_stretching(input_path, output_path, new_duration):
        """Mengubah durasi video tanpa mengubah pitch suara (time-stretching)."""
        with VideoFileClip(input_path) as video:
            stretched_video = video.fx(speedx, video.duration / new_duration)
            stretched_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_frame_freeze(input_path, output_path, freeze_time, freeze_duration):
        """Membekukan frame tertentu untuk menyoroti bagian penting."""
        with VideoFileClip(input_path) as video:
            frozen_video = freeze(video, t=freeze_time, freeze_duration=freeze_duration)
            frozen_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def remove_background(input_path, output_path):
        """Menghapus latar belakang pada video menggunakan library rembg."""
        
        # Buat direktori sementara untuk menyimpan frame tanpa latar belakang
        temp_dir = "temp_frames"
        if not os.path.exists(temp_dir):
            os.makedirs(temp_dir)

        # Buka video dengan MoviePy
        with VideoFileClip(input_path) as video:
            for i, frame in enumerate(video.iter_frames(fps=video.fps, dtype="uint8")):
                # Mengubah frame ke format BGRA (RGBA pada gambar)
                frame_bgra = cv2.cvtColor(frame, cv2.COLOR_RGB2BGRA)

                # Gunakan rembg untuk menghapus latar belakang pada frame
                frame_no_bg = remove(frame_bgra)

                # Simpan frame tanpa latar belakang
                frame_path = os.path.join(temp_dir, f"frame_{i:04d}.png")
                cv2.imwrite(frame_path, frame_no_bg)

        # Buat video dari frame yang dihasilkan tanpa latar belakang
        frame_paths = [os.path.join(temp_dir, f) for f in sorted(os.listdir(temp_dir)) if f.endswith('.png')]
        frame_example = cv2.imread(frame_paths[0])
        height, width, _ = frame_example.shape

        # Membuat VideoWriter untuk menyimpan output video
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter(output_path, fourcc, video.fps, (width, height))

        # Baca setiap frame yang telah dihapus latar belakangnya dan tambahkan ke output video
        for frame_path in frame_paths:
            frame = cv2.imread(frame_path)
            out.write(frame)

        out.release()

        # Hapus frame sementara setelah video selesai dibuat
        for file in os.listdir(temp_dir):
            os.remove(os.path.join(temp_dir, file))
        os.rmdir(temp_dir)

        print(f"Latar belakang dihapus dan video disimpan di {output_path}")

    # @staticmethod
    # def remove_background(input_path, output_path, background_model):
    #     """Menghapus latar belakang pada video menggunakan model machine learning."""
    #     # Contoh menggunakan OpenCV untuk latar belakang sederhana
    #     cap = cv2.VideoCapture(input_path)
    #     fg_bg = background_model  # Misalnya menggunakan cv2.createBackgroundSubtractorMOG2()
    #     while True:
    #         ret, frame = cap.read()
    #         if not ret:
    #             break
    #         fg_mask = fg_bg.apply(frame)
    #         cv2.imshow('Frame', fg_mask)
    #         # Simpan frame tanpa latar belakang
    #     cap.release()

    @staticmethod
    def apply_pip_multiple_videos(main_video_path, pip_video_paths, output_path, positions):
        """Menambahkan multiple picture-in-picture videos."""
        with VideoFileClip(main_video_path) as main_video:
            pip_videos = [VideoFileClip(pip).resize(height=main_video.h // 3).set_position(pos).set_duration(main_video.duration)
                          for pip, pos in zip(pip_video_paths, positions)]
            final_video = CompositeVideoClip([main_video, *pip_videos])
            final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def mirror_multiple_videos(input_paths, output_path, direction="horizontal"):
        """Menambahkan beberapa video yang dipantulkan (mirror effect) secara bersamaan."""
        mirrored_videos = []
        for input_path in input_paths:
            with VideoFileClip(input_path) as video:
                mirrored_video = mirror_x(video) if direction == "horizontal" else mirror_y(video)
                mirrored_videos.append(mirrored_video)
        final_video = concatenate_videoclips(mirrored_videos, method="compose")
        final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def split_video_by_silence(input_path, output_dir, silence_threshold=-50.0, chunk_size=500):
        """Membagi video berdasarkan jeda audio atau keheningan di dalam video."""
        # Menggunakan algoritma untuk mendeteksi keheningan pada audio (threshold dapat disesuaikan)
        with VideoFileClip(input_path) as video:
            # Implementasi logika mendeteksi keheningan pada audio
            pass

    @staticmethod
    def highlight_portion(input_path, output_path, start_time, end_time, color="red"):
        """Menyoroti bagian tertentu dalam video dengan kotak atau animasi highlight."""
        with VideoFileClip(input_path) as video:
            highlight_box = ImageClip(color, size=(video.w // 4, video.h // 4)).set_duration(end_time - start_time).set_position("center")
            final_video = CompositeVideoClip([video, highlight_box.set_start(start_time)])
            final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def add_3d_rotation_effect(input_path, output_path, angle):
        """Memutar video dengan efek rotasi 3D."""
        with VideoFileClip(input_path) as video:
            rotated_video = video.rotate(angle)
            rotated_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def convert_to_different_format(input_path, output_path):
        """Mengonversi video ke berbagai format lain seperti .avi, .flv, .webm."""
        with VideoFileClip(input_path) as video:
            video.write_videofile(output_path)

    @staticmethod
    def extract_thumbnail(input_path, output_dir, time=1):
        """Mengekstrak thumbnail dari frame tertentu dalam video."""
        with VideoFileClip(input_path) as video:
            frame = video.get_frame(time)
            thumbnail_path = os.path.join(output_dir, "thumbnail.png")
            cv2.imwrite(thumbnail_path, frame)

    @staticmethod
    def add_custom_metadata(input_path, output_path, metadata):
        """Menambahkan metadata kustom ke video (seperti deskripsi, judul, dll.)."""
        with VideoFileClip(input_path) as video:
            # Gunakan FFmpeg untuk menambahkan metadata
            os.system(f"ffmpeg -i {input_path} -metadata title={metadata['title']} -metadata comment={metadata['comment']} {output_path}")

    @staticmethod
    def merge_audio_video(video_path, audio_path, output_path):
        """Menggabungkan file video dan audio yang terpisah."""
        with VideoFileClip(video_path) as video, AudioFileClip(audio_path) as audio:
            video_with_audio = video.set_audio(audio)
            video_with_audio.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def overlay_animated_gif(video_path, gif_path, output_path, position="center"):
        """Menambahkan GIF animasi di atas video."""
        with VideoFileClip(video_path) as video, VideoFileClip(gif_path) as gif:
            gif = gif.resize(height=video.h // 3).set_position(position)
            final_video = CompositeVideoClip([video, gif.set_duration(video.duration)])
            final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def overlay_progress_bar(input_path, output_path):
        """Menambahkan progress bar untuk menunjukkan durasi video di bagian bawah."""
        with VideoFileClip(input_path) as video:
            progress_bar = TextClip("Progress", fontsize=24, color="white").set_position(("center", "bottom")).set_duration(video.duration)
            final_video = CompositeVideoClip([video, progress_bar])
            final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_reverse_motion_blur(input_path, output_path, blur_size=10):
        """Membalikkan video dengan efek motion blur."""
        with VideoFileClip(input_path) as video:
            reversed_video = video.fx(vfx.time_mirror)
            blurred_video = reversed_video.fx(vfx.blur, blur_size)
            blurred_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_time_warping(input_path, output_path, start_time, speed_factor):
        """Mengaplikasikan efek time-warping untuk mempercepat bagian tertentu secara bertahap."""
        with VideoFileClip(input_path) as video:
            time_warped_video = video.subclip(start_time).fx(vfx.speedx, speed_factor)
            final_video = concatenate_videoclips([video.subclip(0, start_time), time_warped_video])
            final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def cut_scenes(input_path, output_path, scenes):
        """Memotong beberapa adegan atau bagian tertentu dari video dengan durasi yang ditentukan."""
        with VideoFileClip(input_path) as video:
            clips = [video.subclip(start, end) for start, end in scenes]
            final_video = concatenate_videoclips(clips)
            final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_tilt_shift_effect(input_path, output_path):
        """Menambahkan efek tilt-shift untuk menambahkan kedalaman ke video."""
        with VideoFileClip(input_path) as video:
            tilt_shift_video = video.fx(vfx.lum_contrast, 1.5, 50, 128)
            tilt_shift_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_burn_in_subtitles(input_path, output_path, subtitle_text):
        """Menambahkan subtitle secara permanen (burn-in) ke video."""
        with VideoFileClip(input_path) as video:
            subtitle_clip = TextClip(subtitle_text, fontsize=24, color="white").set_duration(video.duration).set_position(("center", "bottom"))
            final_video = CompositeVideoClip([video, subtitle_clip])
            final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def watermark_rotation(input_path, output_path, watermark_path, rotation_angle=45):
        """Menambahkan watermark yang berputar atau bergerak selama video berlangsung."""
        with VideoFileClip(input_path) as video, ImageClip(watermark_path) as watermark:
            watermark = watermark.set_duration(video.duration).resize(height=50).rotate(rotation_angle)
            final_video = CompositeVideoClip([video, watermark.set_position("center")])
            final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

class VideoEffects:
    @staticmethod
    def apply_sepia_effect(input_path, output_path):
        """Menambahkan efek sepia (kecokelatan) untuk memberikan tampilan vintage pada video."""
        with VideoFileClip(input_path) as video:
            def sepia(get_frame, t):
                frame = get_frame(t)
                frame_sepia = np.dot(frame[..., :3], [[0.393, 0.769, 0.189], 
                                                      [0.349, 0.686, 0.168], 
                                                      [0.272, 0.534, 0.131]])
                return np.clip(frame_sepia, 0, 255).astype("uint8")
            sepia_video = video.fl(sepia)
            sepia_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_vhs_effect(input_path, output_path):
        """Menambahkan efek VHS (tampilan kaset video lama) pada video."""
        with VideoFileClip(input_path) as video:
            def vhs_effect(get_frame, t):
                frame = get_frame(t)
                noise = np.random.normal(0, 25, frame.shape)
                return np.clip(frame + noise, 0, 255).astype(np.uint8)
            vhs_video = video.fl(vhs_effect)
            vhs_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_cartoon_effect(input_path, output_path):
        """Mengubah video menjadi terlihat seperti kartun (cartoonize effect)."""
        with VideoFileClip(input_path) as video:
            def cartoonize(get_frame, t):
                frame = get_frame(t)
                gray = cv2.cvtColor(frame, cv2.COLOR_RGB2GRAY)
                edges = cv2.Canny(gray, 100, 200)
                edges = cv2.cvtColor(edges, cv2.COLOR_GRAY2RGB)
                return cv2.bitwise_and(frame, edges)
            cartoon_video = video.fl(cartoonize)
            cartoon_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_lens_flare(input_path, output_path):
        """Menambahkan efek lens flare (pantulan cahaya) pada video."""
        with VideoFileClip(input_path) as video:
            def lens_flare(get_frame, t):
                frame = get_frame(t)
                flare = np.zeros_like(frame)
                cv2.circle(flare, (int(frame.shape[1]*0.5), int(frame.shape[0]*0.5)), 150, (255,255,255), -1)
                return cv2.addWeighted(frame, 0.8, flare, 0.2, 0)
            flare_video = video.fl(lens_flare)
            flare_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_sketch_effect(input_path, output_path):
        """Mengubah video menjadi gambar sketsa."""
        with VideoFileClip(input_path) as video:
            def sketch(get_frame, t):
                frame = get_frame(t)
                gray = cv2.cvtColor(frame, cv2.COLOR_RGB2GRAY)
                inv_gray = cv2.bitwise_not(gray)
                sketch = cv2.divide(gray, inv_gray, scale=256.0)
                return cv2.cvtColor(sketch, cv2.COLOR_GRAY2RGB)
            sketch_video = video.fl(sketch)
            sketch_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_pixelate_effect(input_path, output_path, pixel_size=10):
        """Menambahkan efek pixelated pada video (seperti tampilan game retro)."""
        with VideoFileClip(input_path) as video:
            def pixelate(get_frame, t):
                frame = get_frame(t)
                small_frame = cv2.resize(frame, (frame.shape[1] // pixel_size, frame.shape[0] // pixel_size), interpolation=cv2.INTER_LINEAR)
                return cv2.resize(small_frame, (frame.shape[1], frame.shape[0]), interpolation=cv2.INTER_NEAREST)
            pixelated_video = video.fl(pixelate)
            pixelated_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_distortion_effect(input_path, output_path, distortion_type="fisheye"):
        """Menerapkan distorsi pada video (fisheye, warp, dll.)."""
        with VideoFileClip(input_path) as video:
            if distortion_type == "fisheye":
                distorted_video = video.fx(vfx.lens_correction, 0.5, 0.5)
            elif distortion_type == "warp":
                distorted_video = video.fx(vfx.time_mirror)
            else:
                raise ValueError("Invalid distortion type.")
            distorted_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_ripple_effect(input_path, output_path):
        """Menambahkan efek riak air pada video."""
        with VideoFileClip(input_path) as video:
            def ripple(get_frame, t):
                frame = get_frame(t)
                map_x, map_y = np.indices((frame.shape[:2]), dtype=np.float32)
                map_x += 10 * np.sin(map_y / 10.0)
                return cv2.remap(frame, map_x, map_y, cv2.INTER_LINEAR)
            ripple_video = video.fl(ripple)
            ripple_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_kaleidoscope_effect(input_path, output_path):
        """Menambahkan efek kaleidoskop pada video."""
        with VideoFileClip(input_path) as video:
            def kaleidoscope(get_frame, t):
                frame = get_frame(t)
                return np.rot90(frame, random.randint(1, 3))
            kaleidoscope_video = video.fl(kaleidoscope)
            kaleidoscope_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_noise_effect(input_path, output_path):
        """Menambahkan noise visual ke video (butiran atau bintik-bintik)."""
        with VideoFileClip(input_path) as video:
            def noise(get_frame, t):
                frame = get_frame(t)
                noise_layer = np.random.normal(0, 25, frame.shape).astype(np.uint8)
                return cv2.add(frame, noise_layer)
            noisy_video = video.fl(noise)
            noisy_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_old_film_effect(input_path, output_path):
        """Menambahkan efek film tua (dengan goresan, debu, dan jitter)."""
        with VideoFileClip(input_path) as video:
            def old_film(get_frame, t):
                frame = get_frame(t)
                noise = np.random.normal(0, 20, frame.shape)
                scratches = np.zeros_like(frame)
                for _ in range(100):
                    x = random.randint(0, frame.shape[1])
                    y = random.randint(0, frame.shape[0])
                    scratches[y:y+10, x:x+1] = 255
                return np.clip(frame + noise + scratches, 0, 255).astype(np.uint8)
            old_film_video = video.fl(old_film)
            old_film_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_tv_static_effect(input_path, output_path):
        """Menambahkan efek statis TV (tampilan layar TV yang tidak berfungsi)."""
        with VideoFileClip(input_path) as video:
            def tv_static(get_frame, t):
                frame = get_frame(t)
                static = np.random.randint(0, 256, frame.shape, dtype=np.uint8)
                return cv2.addWeighted(frame, 0.7, static, 0.3, 0)
            tv_static_video = video.fl(tv_static)
            tv_static_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_light_leak_effect(input_path, output_path):
        """Menambahkan efek light leaks (seperti kebocoran cahaya pada kamera)."""
        with VideoFileClip(input_path) as video:
            def light_leak(get_frame, t):
                frame = get_frame(t)
                leak = np.zeros_like(frame)
                cv2.circle(leak, (random.randint(0, frame.shape[1]), random.randint(0, frame.shape[0])), random.randint(50, 150), (255, 255, 255), -1)
                return cv2.addWeighted(frame, 0.8, leak, 0.2, 0)
            light_leak_video = video.fl(light_leak)
            light_leak_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_glow_effect(input_path, output_path, intensity=1.5):
        """Menambahkan efek glowing atau bercahaya pada elemen tertentu dalam video."""
        with VideoFileClip(input_path) as video:
            def glow(get_frame, t):
                frame = get_frame(t)
                glow_frame = cv2.GaussianBlur(frame, (0, 0), sigmaX=intensity, sigmaY=intensity)
                return cv2.addWeighted(frame, 0.6, glow_frame, 0.4, 0)
            glow_video = video.fl(glow)
            glow_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_ghost_trail_effect(input_path, output_path):
        """Menambahkan efek jejak hantu di belakang objek yang bergerak."""
        with VideoFileClip(input_path) as video:
            def ghost_trail(get_frame, t):
                frame = get_frame(t)
                ghost_frame = cv2.addWeighted(frame, 0.5, get_frame(max(t-0.05, 0)), 0.5, 0)
                return ghost_frame
            ghost_trail_video = video.fl(ghost_trail)
            ghost_trail_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_mosaic_effect(input_path, output_path, block_size=20):
        """Menambahkan efek mosaik di bagian tertentu dari video."""
        with VideoFileClip(input_path) as video:
            def mosaic(get_frame, t):
                frame = get_frame(t)
                small_frame = cv2.resize(frame, (frame.shape[1] // block_size, frame.shape[0] // block_size), interpolation=cv2.INTER_LINEAR)
                return cv2.resize(small_frame, (frame.shape[1], frame.shape[0]), interpolation=cv2.INTER_NEAREST)
            mosaic_video = video.fl(mosaic)
            mosaic_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_double_exposure_effect(input_path1, input_path2, output_path):
        """Menerapkan teknik double exposure untuk menggabungkan dua video dengan cara artistik."""
        with VideoFileClip(input_path1) as video1, VideoFileClip(input_path2) as video2:
            video2 = video2.set_duration(video1.duration).resize(video1.size).set_opacity(0.5)
            double_exposure_video = CompositeVideoClip([video1, video2])
            double_exposure_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_heat_map_effect(input_path, output_path):
        """Menambahkan efek heat map untuk menunjukkan perubahan warna berdasarkan panas."""
        with VideoFileClip(input_path) as video:
            def heat_map(get_frame, t):
                frame = get_frame(t)
                heat_map_frame = cv2.applyColorMap(frame, cv2.COLORMAP_JET)
                return heat_map_frame
            heat_map_video = video.fl(heat_map)
            heat_map_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_cyberpunk_effect(input_path, output_path):
        """Menambahkan efek warna neon dan kontras tinggi untuk tampilan ala cyberpunk."""
        with VideoFileClip(input_path) as video:
            cyberpunk_video = video.fx(vfx.colorx, 1.5).fx(vfx.lum_contrast, contrast=1.5, brightness=-0.2, saturation=2)
            cyberpunk_video.write_videofile(output_path, codec="libx264", audio_codec="aac")
    
    @staticmethod
    def apply_glitch_effect(input_path, output_path, intensity=5):
        """Menambahkan efek glitch pada video."""
        def glitch_frame(get_frame, t):
            frame = get_frame(t)
            if random.randint(0, 10) < intensity:
                return frame[:, ::-1, :]  # Membalik secara horizontal sebagai contoh glitch
            return frame
        with VideoFileClip(input_path) as video:
            glitch_video = video.fl(glitch_frame)
            glitch_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_rain_effect(input_path, output_path, rain_intensity=50):
        """Menambahkan efek hujan di video."""
        def add_rain(get_frame, t):
            frame = get_frame(t)
            rain_layer = np.zeros_like(frame)
            for _ in range(rain_intensity):
                x = random.randint(0, frame.shape[1])
                y = random.randint(0, frame.shape[0])
                rain_layer[y:y+5, x:x+1] = [255, 255, 255]
            return cv2.addWeighted(frame, 1, rain_layer, 0.5, 0)
        with VideoFileClip(input_path) as video:
            rain_video = video.fl(add_rain)
            rain_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_vignette_effect(input_path, output_path, intensity=0.3):
        """Menambahkan efek vignette di pinggir video."""
        def vignette(get_frame, t):
            frame = get_frame(t)
            rows, cols = frame.shape[0], frame.shape[1]
            center_x, center_y = cols // 2, rows // 2
            max_distance = np.sqrt(center_x**2 + center_y**2)
            vignette_mask = np.zeros_like(frame, dtype=np.float32)
            for y in range(rows):
                for x in range(cols):
                    distance = np.sqrt((x - center_x)**2 + (y - center_y)**2)
                    vignette_mask[y, x] = 1 - (distance / max_distance) * intensity
            return (frame * vignette_mask).astype(np.uint8)
        with VideoFileClip(input_path) as video:
            vignette_video = video.fl(vignette)
            vignette_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_cinematic_bars(input_path, output_path, bar_size=50):
        """Menambahkan bar hitam ala sinematik di bagian atas dan bawah video."""
        with VideoFileClip(input_path) as video:
            black_bar = ImageClip(np.zeros((bar_size, video.w, 3)), duration=video.duration)
            final_video = CompositeVideoClip([video, black_bar.set_pos(('center', 'top')), black_bar.set_pos(('center', 'bottom'))])
            final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")


    @staticmethod
    def adjust_video_rgb(input_path, output_path, factor=1.5):
        """Menyesuaikan warna RGB video. Faktor lebih dari 1 untuk meningkatkan saturasi warna."""
        with VideoFileClip(input_path) as video:
            adjusted_video = colorx(video, factor)
            adjusted_video.write_videofile(output_path, codec="libx264", audio_codec="aac")
    
    @staticmethod
    def apply_slow_motion(input_path, output_path, factor=0.5):
        """Menambahkan efek slow motion. Faktor kurang dari 1 untuk memperlambat."""
        with VideoFileClip(input_path) as video:
            slow_motion_video = video.fx(vfx.speedx, factor)
            slow_motion_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def adjust_saturation(input_path, output_path, factor=1.5):
        """Mengubah saturasi video. Faktor lebih dari 1 untuk menambah saturasi, kurang dari 1 untuk mengurangi."""
        with VideoFileClip(input_path) as video:
            saturated_video = colorx(video, factor)
            saturated_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_fade_effects(input_path, output_path, fadein_duration=1, fadeout_duration=1):
        """Menambahkan efek fade-in dan fade-out ke video."""
        with VideoFileClip(input_path) as video:
            video_with_fades = fadein(video, fadein_duration).fx(fadeout, fadeout_duration)
            video_with_fades.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_blackwhite_effect(input_path, output_path):
        """Mengubah video menjadi hitam putih."""
        with VideoFileClip(input_path) as video:
            bw_video = blackwhite(video)
            bw_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_blur_effect(input_path, output_path, blur_size=10):
        """Menambahkan efek blur ke video."""
        with VideoFileClip(input_path) as video:
            blurred_video = blur(video, blur_size)
            blurred_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_invert_colors_effect(input_path, output_path):
        """Membalik warna video (invert)."""
        with VideoFileClip(input_path) as video:
            inverted_video = invert_colors(video)
            inverted_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_mirror_effect(input_path, output_path, direction='horizontal'):
        """Membalik video (horizontal/vertical)."""
        with VideoFileClip(input_path) as video:
            if direction == 'horizontal':
                mirrored_video = mirror_x(video)
            elif direction == 'vertical':
                mirrored_video = mirror_y(video)
            else:
                raise ValueError("Direction must be 'horizontal' or 'vertical'.")
            
            mirrored_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_zoom_effect(input_path, output_path, zoom_factor=1.5):
        """Menambahkan efek zoom ke video."""
        with VideoFileClip(input_path) as video:
            zoomed_video = video.fx(resize, zoom_factor)
            zoomed_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_freeze_frame(input_path, output_path, t_start, duration=2):
        """Menambahkan efek freeze pada video dari `t_start` selama `duration` detik."""
        with VideoFileClip(input_path) as video:
            freeze_frame = video.freeze(t=t_start, freeze_duration=duration)
            freeze_frame.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_time_lapse(input_path, output_path, speed_factor=4):
        """Menambahkan efek time-lapse dengan mempercepat video."""
        with VideoFileClip(input_path) as video:
            time_lapse_video = video.fx(speedx, speed_factor)
            time_lapse_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def add_fadeout_effect(input_path, output_path, duration=2):
        """Menambahkan efek fade-out pada akhir video."""
        with VideoFileClip(input_path) as video:
            faded_video = fadeout(video, duration)
            faded_video.write_videofile(output_path, codec="libx264", audio_codec="aac")


class AudioOperations:
    @staticmethod
    def add_reverb_effect(input_path, output_path, reverb_amount=0.5):
        """Menambahkan efek reverb pada audio untuk memberikan efek gema ruangan besar."""
        with VideoFileClip(input_path) as video:
            audio = video.audio
            reverb_audio = audio.fx(afx.audio_reverb, reverb_amount)
            final_video = video.set_audio(reverb_audio)
            final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_pitch_shift(input_path, output_path, n_steps=2):
        """Mengubah pitch audio tanpa mengubah kecepatan."""
        with VideoFileClip(input_path) as video:
            audio = video.audio
            pitch_shifted_audio = audio.fx(afx.audio_pitchshift, n_steps)
            final_video = video.set_audio(pitch_shifted_audio)
            final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_auto_tune(input_path, output_path):
        """Menambahkan efek auto-tune pada suara dalam video."""
        # Placeholder function as real auto-tune would require complex processing
        with VideoFileClip(input_path) as video:
            audio = video.audio
            # Placeholder logic for auto-tune
            tuned_audio = audio.fx(afx.audio_tune)  # Example placeholder
            final_video = video.set_audio(tuned_audio)
            final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_vocoder_effect(input_path, output_path):
        """Mengubah suara manusia menjadi suara robot atau instrumen elektronik."""
        with VideoFileClip(input_path) as video:
            audio = video.audio
            vocoder_audio = audio.fx(afx.audio_vocoder)  # Placeholder for vocoder effect
            final_video = video.set_audio(vocoder_audio)
            final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_stereo_panning(input_path, output_path, pan_value=-1):
        """Mengontrol arah suara antara speaker kanan dan kiri (panning stereo)."""
        with VideoFileClip(input_path) as video:
            audio = video.audio.fx(afx.audio_pan, pan_value)
            final_video = video.set_audio(audio)
            final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_audio_eq_preset(input_path, output_path, eq_type="rock"):
        """Menambahkan preset equalizer (pop, rock, classical) untuk audio."""
        with VideoFileClip(input_path) as video:
            audio = video.audio.fx(afx.audio_equalizer, eq_type)
            final_video = video.set_audio(audio)
            final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def add_dj_scratching_effect(input_path, output_path):
        """Menambahkan efek scratching DJ pada audio di video."""
        # Placeholder function as real DJ scratching effect requires complex audio manipulation
        with VideoFileClip(input_path) as video:
            audio = video.audio.fx(afx.audio_dj_scratching)  # Placeholder
            final_video = video.set_audio(audio)
            final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_audio_normalization(input_path, output_path):
        """Menormalkan volume audio sehingga konsisten sepanjang video."""
        with VideoFileClip(input_path) as video:
            audio = video.audio.fx(afx.audio_normalize)
            final_video = video.set_audio(audio)
            final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_audio_denoising(input_path, output_path):
        """Mengurangi noise latar belakang pada audio."""
        with VideoFileClip(input_path) as video:
            audio = video.audio.fx(afx.audio_reduce_noise)
            final_video = video.set_audio(audio)
            final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_audio_time_stretch(input_path, output_path, factor=1.5):
        """Mengubah durasi audio tanpa mengubah pitch."""
        with VideoFileClip(input_path) as video:
            audio = video.audio.fx(afx.audio_time_stretch, factor)
            final_video = video.set_audio(audio)
            final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_beat_matching(input_path, output_path, bpm=120):
        """Menyesuaikan beat musik agar sesuai dengan tempo video."""
        with VideoFileClip(input_path) as video:
            audio = video.audio.fx(afx.audio_beat_match, bpm)
            final_video = video.set_audio(audio)
            final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def add_whisper_effect(input_path, output_path):
        """Mengubah suara menjadi suara berbisik."""
        with VideoFileClip(input_path) as video:
            audio = video.audio.fx(afx.audio_whisper)
            final_video = video.set_audio(audio)
            final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_telephone_filter(input_path, output_path):
        """Menambahkan filter telepon pada audio (suara rendah kualitas)."""
        with VideoFileClip(input_path) as video:
            audio = video.audio.fx(afx.audio_telephone_filter)
            final_video = video.set_audio(audio)
            final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_audio_distortion(input_path, output_path, distortion_level=0.5):
        """Menambahkan efek distorsi pada audio untuk suara yang tajam dan kasar."""
        with VideoFileClip(input_path) as video:
            audio = video.audio.fx(afx.audio_distortion, distortion_level)
            final_video = video.set_audio(audio)
            final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_binaural_effect(input_path, output_path):
        """Menambahkan efek audio binaural untuk pengalaman mendengar 3D."""
        with VideoFileClip(input_path) as video:
            audio = video.audio.fx(afx.audio_binaural)
            final_video = video.set_audio(audio)
            final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def add_audio_effect_chain(input_path, output_path, effects):
        """Menggabungkan beberapa efek audio sekaligus dalam satu proses (filter chain)."""
        with VideoFileClip(input_path) as video:
            audio = video.audio
            for effect in effects:
                audio = audio.fx(effect)
            final_video = video.set_audio(audio)
            final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def adjust_audio_pitch(input_path, output_path, semitones=2):
        """Meningkatkan atau menurunkan pitch audio."""
        with VideoFileClip(input_path) as video:
            audio = video.audio.fx(afx.audio_pitch_shift, semitones)
            final_video = video.set_audio(audio)
            final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_reverse_audio(input_path, output_path):
        """Memutar balik audio (seperti efek rewind)."""
        with VideoFileClip(input_path) as video:
            reversed_audio = video.audio.fx(afx.audio_reverse)
            final_video = video.set_audio(reversed_audio)
            final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_surround_sound_effect(input_path, output_path):
        """Mengubah audio stereo menjadi surround sound."""
        with VideoFileClip(input_path) as video:
            surround_audio = video.audio.fx(afx.audio_surround)
            final_video = video.set_audio(surround_audio)
            final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_audio_compression(input_path, output_path, threshold=0.1, ratio=4):
        """Mengompresi audio untuk menghasilkan tingkat suara yang lebih merata."""
        with VideoFileClip(input_path) as video:
            compressed_audio = video.audio.fx(afx.audio_compressor, threshold, ratio)
            final_video = video.set_audio(compressed_audio)
            final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")


    @staticmethod
    def equalize_audio(input_path, output_path, eq_type="bass"):
        """Mengatur equalizer audio (bass, mid, atau treble)."""
        with VideoFileClip(input_path) as video:
            audio = video.audio.fx(afx.audio_equalizer, eq_type)
            final_video = video.set_audio(audio)
            final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")


    @staticmethod
    def add_echo_effect(input_path, output_path, delay=0.2):
        """Menambahkan efek echo pada audio."""
        with VideoFileClip(input_path) as video:
            audio_with_echo = audio_fadein(video.audio.fx(afx.audio_echo, delay), delay)
            final_video = video.set_audio(audio_with_echo)
            final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_noise_reduction(input_path, output_path):
        """Mengurangi noise dari audio di video."""
        with VideoFileClip(input_path) as video:
            audio_without_noise = video.audio.fx(afx.reduce_noise)
            final_video = video.set_audio(audio_without_noise)
            final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")


    @staticmethod
    def add_background_music(video_path, music_path, output_path, volume=0.1):
        """Menambahkan background musik ke video."""
        with VideoFileClip(video_path) as video, AudioFileClip(music_path) as music:
            music = music.subclip(0, video.duration).volumex(volume)
            video_with_music = video.set_audio(music)
            video_with_music.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def add_audio_to_video(video_path, audio_path, output_path):
        """Menambahkan audio ke video."""
        with VideoFileClip(video_path) as video, AudioFileClip(audio_path) as audio:
            video_with_audio = video.set_audio(audio)
            video_with_audio.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def adjust_audio_volume(input_path, output_path, volume_factor=1.5):
        """Mengubah volume audio pada video. Faktor lebih dari 1 untuk meningkatkan volume."""
        with VideoFileClip(input_path) as video:
            video_with_adjusted_audio = video.volumex(volume_factor)
            video_with_adjusted_audio.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def extract_audio_from_video(video_path, output_audio_path):
        """Mengambil audio dari video dan menyimpannya sebagai file audio."""
        with VideoFileClip(video_path) as video:
            audio = video.audio
            audio.write_audiofile(output_audio_path)

    @staticmethod
    def sync_audio_to_video(video_path, audio_path, output_path):
        """Sinkronisasi audio ke video."""
        with VideoFileClip(video_path) as video, AudioFileClip(audio_path) as audio:
            video_with_synced_audio = video.set_audio(audio)
            video_with_synced_audio.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def add_audio_fade(input_path, output_path, fadein_duration=2, fadeout_duration=2):
        """Menambahkan efek fade-in dan fade-out pada audio di video."""
        with VideoFileClip(input_path) as video:
            faded_audio_video = video.audio.fx(audio_fadein, fadein_duration).fx(audio_fadeout, fadeout_duration)
            video.set_audio(faded_audio_video).write_videofile(output_path, codec="libx264", audio_codec="aac")


class OverlayOperations:
    @staticmethod
    def add_animated_text_overlay(input_path, output_path, text, font_size=50, color='white', position='center', fade_duration=1):
        """Menambahkan teks overlay dengan animasi fade-in dan fade-out."""
        with VideoFileClip(input_path) as video:
            text_clip = TextClip(text, fontsize=font_size, color=color).set_duration(video.duration).set_position(position)
            text_clip = fadein(text_clip, fade_duration).fx(fadeout, fade_duration)
            final_video = CompositeVideoClip([video, text_clip])
            final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_particle_overlay(input_path, output_path, particle_image_path, particle_count=100, particle_size=(10, 10), duration=None):
        """Menambahkan overlay partikel seperti salju, debu, atau percikan api."""
        with VideoFileClip(input_path) as video, ImageClip(particle_image_path) as particle:
            particles = []
            for _ in range(particle_count):
                x = random.randint(0, video.w)
                y = random.randint(0, video.h)
                particle_clone = particle.set_duration(video.duration).resize(particle_size).set_position((x, y))
                particles.append(particle_clone)

            final_video = CompositeVideoClip([video] + particles)
            final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def overlay_countdown_timer(input_path, output_path, duration, position="center", font_size=50, color="white"):
        """Menambahkan overlay penghitung waktu mundur pada video."""
        with VideoFileClip(input_path) as video:
            countdown_clips = []
            for i in range(duration, 0, -1):
                countdown = TextClip(str(i), fontsize=font_size, color=color).set_duration(1).set_position(position)
                countdown_clips.append(countdown)

            countdown_video = concatenate_videoclips(countdown_clips, method="compose")
            final_video = CompositeVideoClip([video, countdown_video.set_start(video.duration - duration)])
            final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def add_transparent_logo(input_path, logo_path, output_path, position="top-right", opacity=0.5):
        """Menambahkan logo dengan transparansi pada video."""
        with VideoFileClip(input_path) as video, ImageClip(logo_path) as logo:
            logo = logo.set_opacity(opacity).set_duration(video.duration).set_position(position).resize(height=50)
            final_video = CompositeVideoClip([video, logo])
            final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_weather_overlay(input_path, weather_image_path, output_path, opacity=0.5):
        """Menambahkan overlay cuaca seperti efek salju, kabut, atau hujan."""
        with VideoFileClip(input_path) as video, ImageClip(weather_image_path) as weather_effect:
            weather_effect = weather_effect.set_opacity(opacity).set_duration(video.duration).resize(video.size)
            final_video = CompositeVideoClip([video, weather_effect])
            final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def add_multilayer_overlay(input_path, overlays, output_path, positions=None):
        """Menambahkan beberapa lapisan overlay video dengan efek campuran."""
        with VideoFileClip(input_path) as video:
            layers = [video]
            for i, overlay_path in enumerate(overlays):
                with VideoFileClip(overlay_path) as overlay:
                    overlay = overlay.set_duration(video.duration).resize(video.size)
                    if positions and i < len(positions):
                        overlay = overlay.set_position(positions[i])
                    layers.append(overlay)

            final_video = CompositeVideoClip(layers)
            final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def add_3d_text_overlay(input_path, output_path, text, font_size=50, color='white', position='center', depth=3):
        """Menambahkan teks 3D di atas video."""
        with VideoFileClip(input_path) as video:
            text_clips = []
            for i in range(depth):
                text_clip = TextClip(text, fontsize=font_size, color=color).set_duration(video.duration).set_position((position[0] + i, position[1] + i))
                text_clips.append(text_clip)

            final_video = CompositeVideoClip([video] + text_clips)
            final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_text_animation_overlay(input_path, output_path, text, font_size=50, color='white', start_pos=(0, 100), end_pos=(500, 100), duration=5):
        """Menambahkan teks animasi yang bergerak di atas video (scrolling, bouncing)."""
        with VideoFileClip(input_path) as video:
            text_clip = TextClip(text, fontsize=font_size, color=color).set_duration(duration).set_position(lambda t: (start_pos[0] + t * (end_pos[0] - start_pos[0]) / duration, start_pos[1]))
            final_video = CompositeVideoClip([video, text_clip.set_start(video.duration - duration)])
            final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_lightning_effect_overlay(input_path, output_path, lightning_image_path, frequency=5):
        """Menambahkan efek petir di bagian tertentu dari video."""
        with VideoFileClip(input_path) as video, ImageClip(lightning_image_path) as lightning:
            clips = [video]
            for t in range(0, int(video.duration), frequency):
                clips.append(lightning.set_start(t).set_duration(0.2).resize(video.size).set_position('center'))
            final_video = CompositeVideoClip(clips)
            final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def add_flashing_overlay(input_path, output_path, flash_color=(255, 255, 255), flash_duration=0.1, flash_interval=1):
        """Menambahkan efek berkedip atau flashing di atas video."""
        with VideoFileClip(input_path) as video:
            flash_clips = []
            for t in np.arange(0, video.duration, flash_interval):
                flash = ImageClip(np.full((video.h, video.w, 3), flash_color, dtype=np.uint8)).set_duration(flash_duration).set_position("center").set_start(t)
                flash_clips.append(flash)

            final_video = CompositeVideoClip([video] + flash_clips)
            final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_social_media_overlay(input_path, output_path, social_media_icons, positions=None):
        """Menambahkan ikon media sosial di pojok video."""
        with VideoFileClip(input_path) as video:
            overlays = [video]
            for i, icon_path in enumerate(social_media_icons):
                icon = ImageClip(icon_path).set_duration(video.duration).resize(height=50)
                if positions and i < len(positions):
                    icon = icon.set_position(positions[i])
                overlays.append(icon)

            final_video = CompositeVideoClip(overlays)
            final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def overlay_static_image_sequence(input_path, image_sequence, output_path, interval=2):
        """Menambahkan urutan gambar statis yang bergantian di atas video."""
        with VideoFileClip(input_path) as video:
            image_clips = [ImageClip(img).set_duration(interval) for img in image_sequence]
            image_sequence_clip = concatenate_videoclips(image_clips, method="compose").set_duration(video.duration)
            final_video = CompositeVideoClip([video, image_sequence_clip])
            final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def add_quick_intro_overlay(input_path, output_path, intro_text, font_size=50, color='white', duration=3):
        """Menambahkan overlay intro cepat sebelum video utama dimulai."""
        intro_clip = TextClip(intro_text, fontsize=font_size, color=color).set_duration(duration).set_position('center')
        with VideoFileClip(input_path) as video:
            final_video = concatenate_videoclips([intro_clip, video], method="compose")
            final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_waveform_overlay(input_path, output_path, audio_waveform_path, opacity=0.5, position="bottom"):
        """Menambahkan overlay bentuk gelombang audio (waveform) pada video."""
        with VideoFileClip(input_path) as video, ImageClip(audio_waveform_path) as waveform:
            waveform = waveform.set_opacity(opacity).set_duration(video.duration).resize(height=100).set_position(position)
            final_video = CompositeVideoClip([video, waveform])
            final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def add_speech_bubble_overlay(input_path, output_path, bubble_image_path, text, position=("center", "bottom")):
        """Menambahkan bubble percakapan seperti pada komik."""
        with VideoFileClip(input_path) as video, ImageClip(bubble_image_path) as bubble:
            text_clip = TextClip(text, fontsize=30, color='black').set_position(position)
            bubble = bubble.set_duration(video.duration).set_position(position).resize(height=100)
            final_video = CompositeVideoClip([video, bubble, text_clip])
            final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def overlay_video_with_blending_modes(input_path, overlay_video_path, output_path, blending_mode='multiply'):
        """Menambahkan video overlay dengan berbagai blending mode."""
        with VideoFileClip(input_path) as video, VideoFileClip(overlay_video_path) as overlay:
            final_video = CompositeVideoClip([video, overlay.set_blend(blending_mode)])
            final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_brightness_adjust_overlay(input_path, output_path, brightness_factor=1.2):
        """Mengubah kecerahan video hanya di bagian overlay."""
        with VideoFileClip(input_path) as video:
            brightness_adjusted = video.fx(vfx.colorx, brightness_factor)
            final_video = CompositeVideoClip([video, brightness_adjusted])
            final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_grain_overlay(input_path, grain_image_path, output_path, opacity=0.5):
        """Menambahkan grain overlay untuk memberi efek tampilan film lama."""
        with VideoFileClip(input_path) as video, ImageClip(grain_image_path) as grain:
            grain = grain.set_opacity(opacity).set_duration(video.duration).resize(video.size)
            final_video = CompositeVideoClip([video, grain])
            final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def add_typing_effect_overlay(input_path, output_path, text, font_size=50, color='white', position='center', typing_speed=0.1):
        """Menambahkan efek teks yang muncul seperti sedang diketik di atas video."""
        with VideoFileClip(input_path) as video:
            text_clip = TextClip(text, fontsize=font_size, color=color).set_duration(video.duration)
            typing_effect_clip = text_clip.on_color(size=(video.w, video.h), color=(0, 0, 0)).set_position(position).set_start(typing_speed)
            final_video = CompositeVideoClip([video, typing_effect_clip])
            final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def add_noise_overlay(input_path, output_path, noise_level=0.5):
        """Menambahkan noise atau grain overlay secara dinamis selama video berlangsung."""
        with VideoFileClip(input_path) as video:
            noise_overlay = (np.random.rand(video.h, video.w, 3) * noise_level * 255).astype(np.uint8)
            final_video = CompositeVideoClip([video, ImageClip(noise_overlay, duration=video.duration)])
            final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_water_effect_overlay(input_path, output_path):
        """Menambahkan efek air mengalir di atas video."""
        with VideoFileClip(input_path) as video:
            water_effect = VideoFileClip("water_effect.mp4", has_mask=True).resize(video.size).set_duration(video.duration)
            final_video = CompositeVideoClip([video, water_effect])
            final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def add_timestamp_overlay(input_path, output_path, position=("right", "top")):
        """Menambahkan timestamp di sudut video."""
        with VideoFileClip(input_path) as video:
            timestamp = TextClip(datetime.now().strftime("%Y-%m-%d %H:%M:%S"), fontsize=24, color='white').set_duration(video.duration).set_pos(position)
            final_video = CompositeVideoClip([video, timestamp])
            final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")



    @staticmethod
    def apply_mask_to_video(input_path, output_path):
        """Menambahkan mask ke video."""
        with VideoFileClip(input_path) as video:
            mask = color_gradient(video.size, p1=(0, 0), p2=(video.w, video.h), shape='linear')
            video_with_mask = video.with_mask(mask)
            video_with_mask.write_videofile(output_path, codec="libx264", audio_codec="aac")
    
    @staticmethod
    def add_borders(input_path, output_path, border_size=20, color=(255, 255, 255)):
        """Menambahkan border pada video."""
        with VideoFileClip(input_path) as video:
            bordered_video = margin(video, border_size, color=color)
            bordered_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def add_overlay_with_transparency(main_video_path, overlay_video_path, output_path, position=(0, 0), opacity=0.5):
        """Menambahkan overlay video dengan transparansi."""
        with VideoFileClip(main_video_path) as main_video, VideoFileClip(overlay_video_path).set_opacity(opacity) as overlay_video:
            overlay_video = overlay_video.set_position(position).resize(height=main_video.h // 2)
            final_video = CompositeVideoClip([main_video, overlay_video])
            final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def set_video_opacity(input_path, output_path, opacity=0.5):
        """Mengatur tingkat transparansi (opacity) video."""
        with VideoFileClip(input_path) as video:
            transparent_video = video.set_opacity(opacity)
            transparent_video.write_videofile(output_path, codec="libx264", audio_codec="aac")    
    @staticmethod
    def add_text_to_video(input_path, output_path, text, font_size=50, color='white', position='center'):
        """Menambahkan teks ke video."""
        with VideoFileClip(input_path) as video:
            text_clip = TextClip(text, fontsize=font_size, color=color)
            text_clip = text_clip.set_pos(position).set_duration(video.duration)
            video_with_text = CompositeVideoClip([video, text_clip])
            video_with_text.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def picture_in_picture(main_video_path, pip_video_path, output_path, position=(0, 0)):
        """Menambahkan video PiP (Picture-in-Picture) di atas video utama."""
        with VideoFileClip(main_video_path) as main_video, VideoFileClip(pip_video_path) as pip_video:
            # Resize PiP video agar lebih kecil
            pip_video = pip_video.resize(height=main_video.h // 3)
            # Atur posisi PiP video
            pip_video = pip_video.set_position(position)
            final_video = CompositeVideoClip([main_video, pip_video])
            final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def overlay_image_on_video(video_path, image_path, output_path, position=("center", "center"), duration=None):
        """Menambahkan gambar di atas video."""
        with VideoFileClip(video_path) as video:
            with ImageClip(image_path) as image:
                image = image.set_duration(duration or video.duration).set_position(position)
                final_video = CompositeVideoClip([video, image])
                final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def add_text_with_background(input_path, output_path, text, font_size=50, color='white', bg_color='black', position='center'):
        """Menambahkan teks dengan latar belakang berwarna ke video."""
        with VideoFileClip(input_path) as video:
            txt_clip = TextClip(text, fontsize=font_size, color=color, bg_color=bg_color)
            txt_clip = txt_clip.set_pos(position).set_duration(video.duration)
            video_with_text = CompositeVideoClip([video, txt_clip])
            video_with_text.write_videofile(output_path, codec="libx264", audio_codec="aac")


class AdvancedVideoEditing:
    @staticmethod
    def create_intro_video(logo_path, text, music_path, output_path, duration=5):
        """Membuat intro video dengan logo, teks, dan musik."""
        logo = ImageClip(logo_path).set_duration(duration).resize(height=200).set_position("center")
        text_clip = TextClip(text, fontsize=40, color='white').set_duration(duration).set_position(("center", "bottom"))
        audio = AudioFileClip(music_path).subclip(0, duration)
        final_video = CompositeVideoClip([logo, text_clip]).set_audio(audio)
        final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_green_screen(input_path, background_path, output_path):
        """Mengganti background green screen dengan video lain."""
        with VideoFileClip(input_path) as video, VideoFileClip(background_path) as background:
            final_video = video.fx(vfx.mask_color, color=[0,255,0], thr=100, s=5).set_position("center").set_duration(background.duration)
            background_clip = CompositeVideoClip([background, final_video])
            background_clip.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def create_video_from_image_and_audio(image_path, audio_path, output_path, duration=None):
        """Membuat video dari gambar dan audio."""
        with ImageClip(image_path) as img, AudioFileClip(audio_path) as audio:
            img = img.set_duration(audio.duration if not duration else duration)
            img = img.set_audio(audio)
            img.write_videofile(output_path, codec="libx264", audio_codec="aac")
    
    @staticmethod
    def concatenate_videos(video_paths, output_path):
        """Menggabungkan beberapa video."""
        clips = [VideoFileClip(path) for path in video_paths]
        final_video = concatenate_videoclips(clips)
        final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")
        
        for clip in clips:
            clip.close()

    @staticmethod
    def create_slideshow(image_paths, output_path, duration_per_image=2):
        """Membuat slideshow dari gambar."""
        clips = [ImageClip(img).set_duration(duration_per_image) for img in image_paths]
        slideshow = concatenate_videoclips(clips, method="compose")
        slideshow.write_videofile(output_path, codec="libx264", fps=24)
        
        for clip in clips:
            clip.close()

    @staticmethod
    def create_outro_video(logo_path, text, music_path, output_path, duration=5):
        """Membuat video outro dengan logo, teks, dan musik penutup."""
        logo = ImageClip(logo_path).set_duration(duration).resize(height=200).set_position("center")
        text_clip = TextClip(text, fontsize=40, color='white').set_duration(duration).set_position(("center", "bottom"))
        audio = AudioFileClip(music_path).subclip(0, duration)
        final_video = CompositeVideoClip([logo, text_clip]).set_audio(audio)
        final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def add_interactive_hotspots(input_path, hotspots, output_path):
        """
        Menambahkan hotspot interaktif yang dapat diklik dalam video.
        hotspots: List of dictionaries with keys 'time', 'duration', 'position', 'size', 'action'.
        """
        with VideoFileClip(input_path) as video:
            for hotspot in hotspots:
                start_time = hotspot['time']
                duration = hotspot['duration']
                position = hotspot['position']
                size = hotspot['size']
                action = hotspot['action']  # Action can be a callback or an event trigger
                text_clip = TextClip("Click Here", fontsize=24, color="white", bg_color="red").set_position(position).set_duration(duration)
                video = CompositeVideoClip([video, text_clip.set_start(start_time)])
            video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_color_correction(input_path, output_path, color_factor=1.2):
        """Mengoreksi warna video dengan meningkatkan intensitas warna untuk tampilan sinematik."""
        with VideoFileClip(input_path) as video:
            corrected_video = colorx(video, color_factor)
            corrected_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def track_motion_in_video(input_path, output_path, overlay_clip_path, track_start, duration):
        """Melacak pergerakan objek dalam video dan menambahkan overlay yang mengikuti objek."""
        # This is a simplified placeholder as full motion tracking requires more advanced techniques
        with VideoFileClip(input_path) as video, VideoFileClip(overlay_clip_path) as overlay_clip:
            overlay_clip = overlay_clip.set_duration(duration).set_position((lambda t: (100 + 10 * t, 100 + 20 * t)))
            final_video = CompositeVideoClip([video, overlay_clip.set_start(track_start)])
            final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def create_interactive_menu(input_path, menu_items, output_path):
        """
        Membuat menu interaktif di dalam video.
        menu_items: List of dictionaries with 'text', 'position', 'duration', 'action'.
        """
        with VideoFileClip(input_path) as video:
            for item in menu_items:
                text_clip = TextClip(item['text'], fontsize=30, color="white", bg_color="blue").set_duration(item['duration']).set_position(item['position'])
                video = CompositeVideoClip([video, text_clip])
            video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_deepfake_effects(input_path, face_swap_model, output_path):
        """
        Mengganti wajah dalam video dengan deepfake.
        face_swap_model: Pre-trained deepfake model.
        """
        # This is a placeholder, implementing deepfake requires machine learning and pre-trained models.
        print("Applying deepfake using the provided model...")

    @staticmethod
    def generate_split_screen_video(video_paths, output_path):
        """Membuat video split-screen dari beberapa klip video."""
        clips = [VideoFileClip(path) for path in video_paths]
        final_video = concatenate_videoclips(clips, method="compose")
        final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_ai_face_swap(input_path, target_face_path, output_path):
        """
        Menukar wajah menggunakan AI.
        target_face_path: Gambar wajah yang akan diswap ke video.
        """
        # Placeholder for AI face swap
        print("Swapping faces using AI...")

    @staticmethod
    def create_vertical_video(input_path, output_path):
        """Membuat video vertikal yang dioptimalkan untuk media sosial."""
        with VideoFileClip(input_path) as video:
            vertical_video = video.resize(height=1920).crop(x1=0, width=1080)
            vertical_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_hdr_conversion(input_path, output_path):
        """Mengonversi video biasa menjadi HDR."""
        with VideoFileClip(input_path) as video:
            hdr_video = video.fx(vfx.colorx, 1.5)  # Placeholder effect for HDR
            hdr_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def generate_timelapse_video_from_images(image_paths, output_path, fps=24):
        """Membuat video timelapse dari kumpulan gambar."""
        clips = [ImageClip(img).set_duration(1/fps) for img in image_paths]
        timelapse = concatenate_videoclips(clips, method="compose")
        timelapse.write_videofile(output_path, codec="libx264", fps=fps)

    @staticmethod
    def apply_shake_effect(input_path, output_path, intensity=5):
        """Menambahkan efek goyangan (shake) pada video seperti kamera genggam."""
        def shake_frame(get_frame, t):
            frame = get_frame(t)
            dx = np.random.randint(-intensity, intensity)
            dy = np.random.randint(-intensity, intensity)
            return np.roll(frame, (dy, dx), axis=(0, 1))
        with VideoFileClip(input_path) as video:
            shaken_video = video.fl(shake_frame)
            shaken_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def add_custom_cursor_overlay(input_path, cursor_image_path, output_path, position, start_time, duration):
        """Menambahkan kursor khusus untuk video tutorial."""
        with VideoFileClip(input_path) as video, ImageClip(cursor_image_path) as cursor:
            cursor = cursor.set_duration(duration).set_position(position).set_start(start_time)
            final_video = CompositeVideoClip([video, cursor])
            final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def create_animated_transitions(video1_path, video2_path, output_path, transition_type="wipe"):
        """Membuat transisi animasi antara dua klip video."""
        video1 = VideoFileClip(video1_path)
        video2 = VideoFileClip(video2_path)
        if transition_type == "wipe":
            video2 = video2.set_start(video1.duration)
        final_video = concatenate_videoclips([video1, video2], method="compose")
        final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def add_social_media_template(input_path, output_path, platform="Instagram"):
        """Menambahkan template sosial media ke video untuk platform tertentu."""
        # Placeholder for adding social media templates
        print(f"Applying social media template for {platform}...")

    @staticmethod
    def apply_multi_audio_mix(input_path, audio_tracks, output_path):
        """Menggabungkan beberapa trek audio dalam satu video."""
        with VideoFileClip(input_path) as video:
            mixed_audio = CompositeAudioClip([AudioFileClip(track) for track in audio_tracks])
            final_video = video.set_audio(mixed_audio)
            final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def add_lower_third_overlay(input_path, output_path, text, font_size=24, color="white"):
        """Menambahkan overlay teks lower third ke video."""
        with VideoFileClip(input_path) as video:
            text_clip = TextClip(text, fontsize=font_size, color=color).set_position(("center", "bottom")).set_duration(video.duration)
            final_video = CompositeVideoClip([video, text_clip])
            final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def apply_video_cloning_effect(input_path, output_path):
        """Menggandakan objek dalam video untuk efek cloning."""
        with VideoFileClip(input_path) as video:
            cloned_video = CompositeVideoClip([video, video.set_position(("right", "center"))])
            cloned_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

    @staticmethod
    def create_360_video_editing(input_path, output_path):
        """Mengedit video 360 derajat untuk pengalaman VR."""
        # Placeholder for 360 video editing
        print("Editing 360 video...")

    @staticmethod
    def create_motion_graphics(input_path, output_path, graphics_path):
        """Membuat animasi motion graphics dengan elemen visual yang bergerak."""
        with VideoFileClip(input_path) as video, VideoFileClip(graphics_path) as graphics:
            graphics = graphics.set_position("center").set_duration(video.duration)
            final_video = CompositeVideoClip([video, graphics])
            final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")


# Contoh penggunaan
if __name__ == "__main__":
    # Contoh memotong video
    BasicVideoEditing.trim_video("input.mp4", "output_trimmed.mp4", 5, 20)

    # Contoh menambahkan teks ke video
    OverlayOperations.add_text_to_video("input.mp4", "output_text.mp4", "Hello World!")