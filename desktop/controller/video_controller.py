import threading
from utils.progress import update_progress_bar
from api.api_client import APIClient

class VideoController:
    def __init__(self, api_client, progress_var, progress_label, progress_bar):
        self.api_client = api_client
        self.progress_var = progress_var
        self.progress_label = progress_label
        self.progress_bar = progress_bar

    def split_video(self, video_file_path, num_images):
        def process_video():
            try:
                result = self.api_client.split_video(video_file_path, num_images)
                images = result.get('images', [])

                # Update progress bar during the process
                update_progress_bar(len(images), self.progress_var, self.progress_label, self.progress_bar)
                
                return images
            except Exception as e:
                print(f"Error: {e}")
                return None

        # Run the process in a separate thread
        threading.Thread(target=process_video).start()
