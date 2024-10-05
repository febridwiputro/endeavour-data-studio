from moviepy.editor import VideoFileClip

def trim_video(input_path, output_path, start_time, end_time):
    """Memotong video dari `start_time` ke `end_time`."""
    with VideoFileClip(input_path) as video:
        trimmed_video = video.subclip(start_time, end_time)
        trimmed_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

from moviepy.editor import VideoFileClip, TextClip, CompositeVideoClip

def add_text_to_video(input_path, output_path, text, font_size=50, color='white', position='center'):
    """Menambahkan teks ke video."""
    with VideoFileClip(input_path) as video:
        text_clip = TextClip(text, fontsize=font_size, color=color)
        text_clip = text_clip.set_pos(position).set_duration(video.duration)
        video_with_text = CompositeVideoClip([video, text_clip])
        video_with_text.write_videofile(output_path, codec="libx264", audio_codec="aac")

from moviepy.editor import VideoFileClip

def change_video_speed(input_path, output_path, factor):
    """Mengubah kecepatan video. `factor > 1` untuk mempercepat, `factor < 1` untuk memperlambat."""
    with VideoFileClip(input_path) as video:
        modified_video = video.fx(vfx.speedx, factor)
        modified_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

from moviepy.editor import VideoFileClip

def reverse_video(input_path, output_path):
    """Membalikkan video (reverse)."""
    with VideoFileClip(input_path) as video:
        reversed_video = video.fx(vfx.time_mirror)
        reversed_video.write_videofile(output_path, codec="libx264", audio_codec="aac")


from moviepy.editor import VideoFileClip, AudioFileClip

def add_audio_to_video(video_path, audio_path, output_path):
    """Menambahkan audio ke video."""
    with VideoFileClip(video_path) as video, AudioFileClip(audio_path) as audio:
        video_with_audio = video.set_audio(audio)
        video_with_audio.write_videofile(output_path, codec="libx264", audio_codec="aac")


from moviepy.editor import VideoFileClip, concatenate_videoclips

def concatenate_videos(video_paths, output_path):
    """Menggabungkan beberapa video."""
    clips = [VideoFileClip(path) for path in video_paths]
    final_video = concatenate_videoclips(clips)
    final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")
    
    for clip in clips:
        clip.close()  # Tutup setiap video clip untuk membebaskan memori


from moviepy.editor import VideoFileClip

def rotate_video(input_path, output_path, angle):
    """Memutar video dengan sudut `angle`."""
    with VideoFileClip(input_path) as video:
        rotated_video = video.rotate(angle)
        rotated_video.write_videofile(output_path, codec="libx264", audio_codec="aac")


from moviepy.editor import VideoFileClip

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


from moviepy.editor import VideoFileClip

def video_to_gif(input_path, output_path):
    """Mengubah video menjadi GIF."""
    with VideoFileClip(input_path) as video:
        video.write_gif(output_path)


from moviepy.editor import VideoFileClip

def crop_video(input_path, output_path, x1, y1, x2, y2):
    """Memotong video dari (x1, y1) ke (x2, y2)."""
    with VideoFileClip(input_path) as video:
        cropped_video = video.crop(x1=x1, y1=y1, x2=x2, y2=y2)
        cropped_video.write_videofile(output_path, codec="libx264", audio_codec="aac")


from moviepy.editor import VideoFileClip

def remove_audio_from_video(input_path, output_path):
    """Menghapus audio dari video."""
    with VideoFileClip(input_path) as video:
        video_without_audio = video.without_audio()
        video_without_audio.write_videofile(output_path, codec="libx264")


from moviepy.editor import VideoFileClip
from moviepy.video.fx import fadein, fadeout

def add_fade_effects(input_path, output_path, fadein_duration=1, fadeout_duration=1):
    """Menambahkan efek fade-in dan fade-out ke video."""
    with VideoFileClip(input_path) as video:
        video_with_fades = fadein(video, fadein_duration).fx(fadeout, fadeout_duration)
        video_with_fades.write_videofile(output_path, codec="libx264", audio_codec="aac")

from moviepy.editor import VideoFileClip

def loop_video(input_path, output_path, loops=2):
    """Mengulang video sebanyak `loops` kali."""
    with VideoFileClip(input_path) as video:
        looped_video = video.loop(n=loops)
        looped_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

from moviepy.editor import ImageClip, concatenate_videoclips

def create_slideshow(image_paths, output_path, duration_per_image=2):
    """Membuat slideshow dari gambar."""
    clips = [ImageClip(img).set_duration(duration_per_image) for img in image_paths]
    slideshow = concatenate_videoclips(clips, method="compose")
    slideshow.write_videofile(output_path, codec="libx264", fps=24)
    
    for clip in clips:
        clip.close()

from moviepy.editor import VideoFileClip, AudioFileClip

def sync_audio_to_video(video_path, audio_path, output_path):
    """Sinkronisasi audio ke video."""
    with VideoFileClip(video_path) as video, AudioFileClip(audio_path) as audio:
        video_with_synced_audio = video.set_audio(audio)
        video_with_synced_audio.write_videofile(output_path, codec="libx264", audio_codec="aac")


from moviepy.editor import VideoFileClip
from moviepy.video.fx import colorx

def adjust_video_brightness(input_path, output_path, factor=1.2):
    """Mengubah kecerahan video (default meningkatkan 20%)."""
    with VideoFileClip(input_path) as video:
        brighter_video = colorx(video, factor)
        brighter_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

from moviepy.editor import VideoFileClip, AudioFileClip

def add_background_music(video_path, music_path, output_path, volume=0.1):
    """Menambahkan background musik ke video."""
    with VideoFileClip(video_path) as video, AudioFileClip(music_path) as music:
        # Sesuaikan panjang audio sesuai panjang video
        music = music.subclip(0, video.duration).volumex(volume)
        video_with_music = video.set_audio(music)
        video_with_music.write_videofile(output_path, codec="libx264", audio_codec="aac")

from moviepy.editor import VideoFileClip, CompositeVideoClip

def picture_in_picture(main_video_path, pip_video_path, output_path, position=(0, 0)):
    """Menambahkan video PiP (Picture-in-Picture) di atas video utama."""
    with VideoFileClip(main_video_path) as main_video, VideoFileClip(pip_video_path) as pip_video:
        # Resize PiP video agar lebih kecil
        pip_video = pip_video.resize(height=main_video.h // 3)
        # Atur posisi PiP video
        pip_video = pip_video.set_position(position)
        final_video = CompositeVideoClip([main_video, pip_video])
        final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")


from moviepy.editor import VideoFileClip
from moviepy.video.tools.drawing import color_gradient

def apply_mask_to_video(input_path, output_path):
    """Menambahkan mask ke video."""
    with VideoFileClip(input_path) as video:
        mask = color_gradient(video.size, p1=(0, 0), p2=(video.w, video.h), shape='linear')
        video_with_mask = video.with_mask(mask)
        video_with_mask.write_videofile(output_path, codec="libx264", audio_codec="aac")


from moviepy.editor import ImageClip, AudioFileClip

def create_video_from_image_and_audio(image_path, audio_path, output_path, duration=None):
    """Membuat video dari gambar dan audio."""
    with ImageClip(image_path) as img, AudioFileClip(audio_path) as audio:
        img = img.set_duration(audio.duration if not duration else duration)
        img = img.set_audio(audio)
        img.write_videofile(output_path, codec="libx264", audio_codec="aac")


from moviepy.editor import VideoFileClip

def change_fps(input_path, output_path, fps=30):
    """Mengubah frame rate video."""
    with VideoFileClip(input_path) as video:
        video_with_new_fps = video.set_fps(fps)
        video_with_new_fps.write_videofile(output_path, codec="libx264", fps=fps)


from moviepy.editor import VideoFileClip
from moviepy.video.fx.all import colorx

def adjust_saturation(input_path, output_path, factor=1.5):
    """Mengubah saturasi video. Faktor lebih dari 1 untuk menambah saturasi, kurang dari 1 untuk mengurangi."""
    with VideoFileClip(input_path) as video:
        saturated_video = colorx(video, factor)
        saturated_video.write_videofile(output_path, codec="libx264", audio_codec="aac")


from moviepy.editor import VideoFileClip, CompositeVideoClip

def add_overlay_with_transparency(main_video_path, overlay_video_path, output_path, position=(0, 0), opacity=0.5):
    """Menambahkan overlay video dengan transparansi."""
    with VideoFileClip(main_video_path) as main_video, VideoFileClip(overlay_video_path).set_opacity(opacity) as overlay_video:
        overlay_video = overlay_video.set_position(position).resize(height=main_video.h // 2)
        final_video = CompositeVideoClip([main_video, overlay_video])
        final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")


from moviepy.editor import VideoFileClip, vfx

def apply_slow_motion(input_path, output_path, factor=0.5):
    """Menambahkan efek slow motion. Faktor kurang dari 1 untuk memperlambat."""
    with VideoFileClip(input_path) as video:
        slow_motion_video = video.fx(vfx.speedx, factor)
        slow_motion_video.write_videofile(output_path, codec="libx264", audio_codec="aac")


from moviepy.editor import VideoFileClip
from moviepy.video.fx.all import colorx

def adjust_contrast(input_path, output_path, factor=1.2):
    """Mengubah kontras video. Faktor lebih dari 1 untuk meningkatkan kontras, kurang dari 1 untuk mengurangi."""
    with VideoFileClip(input_path) as video:
        contrast_video = colorx(video, factor)
        contrast_video.write_videofile(output_path, codec="libx264", audio_codec="aac")


from moviepy.editor import VideoFileClip

def adjust_audio_volume(input_path, output_path, volume_factor=1.5):
    """Mengubah volume audio pada video. Faktor lebih dari 1 untuk meningkatkan volume."""
    with VideoFileClip(input_path) as video:
        video_with_adjusted_audio = video.volumex(volume_factor)
        video_with_adjusted_audio.write_videofile(output_path, codec="libx264", audio_codec="aac")


from moviepy.editor import VideoFileClip

def crop_aspect_ratio(input_path, output_path, target_aspect_ratio=16/9):
    """Memotong video berdasarkan rasio aspek tertentu."""
    with VideoFileClip(input_path) as video:
        # Hitung ukuran baru berdasarkan rasio aspek
        video_aspect_ratio = video.w / video.h
        if video_aspect_ratio > target_aspect_ratio:
            # Video lebih lebar, potong lebar
            new_width = int(video.h * target_aspect_ratio)
            x1 = (video.w - new_width) // 2
            x2 = x1 + new_width
            cropped_video = video.crop(x1=x1, x2=x2)
        else:
            # Video lebih tinggi, potong tinggi
            new_height = int(video.w / target_aspect_ratio)
            y1 = (video.h - new_height) // 2
            y2 = y1 + new_height
            cropped_video = video.crop(y1=y1, y2=y2)
        
        cropped_video.write_videofile(output_path, codec="libx264", audio_codec="aac")


from moviepy.editor import VideoFileClip
from moviepy.video.fx.all import blur

def add_blur_effect(input_path, output_path, blur_size=10):
    """Menambahkan efek blur ke video."""
    with VideoFileClip(input_path) as video:
        blurred_video = blur(video, blur_size)
        blurred_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

from moviepy.editor import VideoFileClip
from moviepy.video.fx.all import fadeout

def apply_fadeout_effect(input_path, output_path, duration=2):
    """Menambahkan efek fade-out pada akhir video."""
    with VideoFileClip(input_path) as video:
        faded_video = fadeout(video, duration)
        faded_video.write_videofile(output_path, codec="libx264", audio_codec="aac")


from moviepy.editor import VideoFileClip
from moviepy.video.fx.all import mirror_x, mirror_y

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


from moviepy.editor import VideoFileClip
from moviepy.video.fx.all import invert_colors

def apply_invert_colors_effect(input_path, output_path):
    """Membalik warna video (invert)."""
    with VideoFileClip(input_path) as video:
        inverted_video = invert_colors(video)
        inverted_video.write_videofile(output_path, codec="libx264", audio_codec="aac")


from moviepy.editor import VideoFileClip
import random

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


from moviepy.editor import VideoFileClip, TextClip, CompositeVideoClip

def add_text_with_background(input_path, output_path, text, font_size=50, color='white', bg_color='black', position='center'):
    """Menambahkan teks dengan latar belakang berwarna ke video."""
    with VideoFileClip(input_path) as video:
        txt_clip = TextClip(text, fontsize=font_size, color=color, bg_color=bg_color)
        txt_clip = txt_clip.set_pos(position).set_duration(video.duration)
        video_with_text = CompositeVideoClip([video, txt_clip])
        video_with_text.write_videofile(output_path, codec="libx264", audio_codec="aac")


from moviepy.editor import VideoFileClip

def apply_freeze_frame(input_path, output_path, t_start, duration=2):
    """Menambahkan efek freeze pada video dari `t_start` selama `duration` detik."""
    with VideoFileClip(input_path) as video:
        freeze_frame = video.freeze(t=t_start, freeze_duration=duration)
        freeze_frame.write_videofile(output_path, codec="libx264", audio_codec="aac")


from moviepy.editor import VideoFileClip
from moviepy.video.fx.all import resize

def apply_zoom_effect(input_path, output_path, zoom_factor=1.5):
    """Menambahkan efek zoom ke video."""
    with VideoFileClip(input_path) as video:
        zoomed_video = video.fx(resize, zoom_factor)
        zoomed_video.write_videofile(output_path, codec="libx264", audio_codec="aac")


from moviepy.editor import VideoFileClip
from moviepy.video.fx.all import blackwhite

def apply_blackwhite_effect(input_path, output_path):
    """Mengubah video menjadi hitam putih."""
    with VideoFileClip(input_path) as video:
        bw_video = blackwhite(video)
        bw_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

from moviepy.editor import VideoFileClip

def set_video_opacity(input_path, output_path, opacity=0.5):
    """Mengatur tingkat transparansi (opacity) video."""
    with VideoFileClip(input_path) as video:
        transparent_video = video.set_opacity(opacity)
        transparent_video.write_videofile(output_path, codec="libx264", audio_codec="aac")


from moviepy.editor import VideoFileClip
from moviepy.video.fx.all import colorx

def adjust_video_rgb(input_path, output_path, factor=1.5):
    """Menyesuaikan warna RGB video. Faktor lebih dari 1 untuk meningkatkan saturasi warna."""
    with VideoFileClip(input_path) as video:
        adjusted_video = colorx(video, factor)
        adjusted_video.write_videofile(output_path, codec="libx264", audio_codec="aac")


from moviepy.editor import VideoFileClip

def apply_time_lapse(input_path, output_path, speed_factor=4):
    """Menambahkan efek time-lapse dengan mempercepat video."""
    with VideoFileClip(input_path) as video:
        time_lapse_video = video.fx(vfx.speedx, speed_factor)
        time_lapse_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

from moviepy.editor import VideoFileClip
from moviepy.video.fx.margin import margin

def add_borders(input_path, output_path, border_size=20, color=(255, 255, 255)):
    """Menambahkan border pada video."""
    with VideoFileClip(input_path) as video:
        bordered_video = margin(video, border_size, color=color)
        bordered_video.write_videofile(output_path, codec="libx264", audio_codec="aac")


from moviepy.editor import VideoFileClip
from moviepy.audio.fx.all import audio_fadein, audio_fadeout

def add_audio_fade(input_path, output_path, fadein_duration=2, fadeout_duration=2):
    """Menambahkan efek fade-in dan fade-out pada audio di video."""
    with VideoFileClip(input_path) as video:
        faded_audio_video = video.audio.fx(audio_fadein, fadein_duration).fx(audio_fadeout, fadeout_duration)
        video.set_audio(faded_audio_video).write_videofile(output_path, codec="libx264", audio_codec="aac")


from moviepy.editor import VideoFileClip

def split_video(input_path, output_path, parts=2):
    """Memotong video menjadi beberapa bagian yang sama."""
    with VideoFileClip(input_path) as video:
        duration_per_part = video.duration / parts
        for i in range(parts):
            start_time = i * duration_per_part
            end_time = start_time + duration_per_part
            part = video.subclip(start_time, end_time)
            part.write_videofile(f"{output_path}_part{i+1}.mp4", codec="libx264", audio_codec="aac")


from moviepy.editor import VideoFileClip, ImageClip, CompositeVideoClip

def overlay_image_on_video(video_path, image_path, output_path, position=("center", "center"), duration=None):
    """Menambahkan gambar di atas video."""
    with VideoFileClip(video_path) as video:
        with ImageClip(image_path) as image:
            image = image.set_duration(duration or video.duration).set_position(position)
            final_video = CompositeVideoClip([video, image])
            final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")


from moviepy.editor import VideoFileClip

def extract_audio_from_video(video_path, output_audio_path):
    """Mengambil audio dari video dan menyimpannya sebagai file audio."""
    with VideoFileClip(video_path) as video:
        audio = video.audio
        audio.write_audiofile(output_audio_path)
