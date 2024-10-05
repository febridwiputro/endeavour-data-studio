import tkinter as tk
from tkinter import filedialog, messagebox, ttk
import requests
import threading
import os
import unittest
from unittest.mock import patch


class Config:
    BASE_URL = "http://localhost:8000"

    @staticmethod
    def get_base_url():
        """Return the base URL for the API."""
        return Config.BASE_URL


# APIClient class to handle API requests to FastAPI
class APIClient:
    def __init__(self):
        self.base_url = Config.get_base_url()  # Use base URL from Config

    def split_video(self, video_file_path, num_images):
        url = f"{self.base_url}/split-video"
        try:
            with open(video_file_path, 'rb') as video_file:
                files = {'video': video_file}
                data = {'num_images': num_images}

                # Send POST request to FastAPI
                response = requests.post(url, files=files, data=data)
                return response
        except Exception as e:
            raise Exception(f"Failed to send request: {str(e)}")

# Utils class for utility functions
class Utils:
    @staticmethod
    def is_valid_number(num_images):
        """Check if the input is a valid positive integer."""
        if num_images.isdigit() and int(num_images) > 0:
            return True
        return False

    @staticmethod
    def is_valid_file_path(file_path):
        """Check if the given file path exists and is a valid file."""
        return os.path.isfile(file_path)

    @staticmethod
    def show_error(message):
        """Show error message in a messagebox."""
        messagebox.showerror("Error", message)

    @staticmethod
    def show_info(message):
        """Show informational message in a messagebox."""
        messagebox.showinfo("Info", message)

# ComponentFactory to create GUI components
class ComponentFactory:
    @staticmethod
    def create_label(parent, text, row, column, padx=10, pady=10, sticky="ew", **kwargs):
        label = tk.Label(parent, text=text, **kwargs)
        label.grid(row=row, column=column, padx=padx, pady=pady, sticky=sticky)
        return label

    @staticmethod
    def create_entry(parent, textvariable, row, column, width=50, padx=10, pady=10, sticky="ew", **kwargs):
        entry = tk.Entry(parent, textvariable=textvariable, width=width, **kwargs)
        entry.grid(row=row, column=column, padx=padx, pady=pady, sticky=sticky)
        return entry

    @staticmethod
    def create_button(parent, text, command, row, column, padx=10, pady=10, sticky="ew", columnspan=1, **kwargs):
        button = tk.Button(parent, text=text, command=command, **kwargs)
        button.grid(row=row, column=column, padx=padx, pady=pady, sticky=sticky, columnspan=columnspan)
        return button

    @staticmethod
    def create_progressbar(parent, row, column, length=300, padx=10, pady=20, columnspan=3, sticky="ew", **kwargs):
        progressbar = ttk.Progressbar(parent, orient="horizontal", length=length, mode="determinate", **kwargs)
        progressbar.grid(row=row, column=column, columnspan=columnspan, padx=padx, pady=pady, sticky=sticky)
        progressbar.grid_remove()  # Hidden by default
        return progressbar

# Main window class for the GUI
class MainWindow:
    def __init__(self, root):
        self.root = root
        self.root.title("Video Splitter with FastAPI")
        self.cf = ComponentFactory()
        self.utils = Utils()
        
        # Initialize APIClient
        self.api_client = APIClient()

        # Set window size and properties
        self.root.minsize(1280, 768)
        self.root.resizable(True, True)
        self.root.columnconfigure(0, weight=1)
        self.root.columnconfigure(1, weight=1)
        self.root.columnconfigure(2, weight=1)
        self.root.columnconfigure(3, weight=1)
        self.root.rowconfigure(2, weight=1)

        # Bind for full screen toggle
        self.root.bind("<F11>", self.toggle_fullscreen)
        self.root.bind("<Escape>", self.end_fullscreen)

        # Initialize variables
        self.video_path = tk.StringVar()
        self.number_of_images = tk.StringVar(value="5")

        # Create UI components using ComponentFactory
        self.label_video = self.cf.create_label(self.root, "Select Video:", 0, 0)
        self.entry_video = self.cf.create_entry(self.root, self.video_path, 0, 1)
        self.button_browse = self.cf.create_button(self.root, "Browse", self.select_video, 0, 2)
        
        self.label_num_images = self.cf.create_label(self.root, "Number of Images:", 1, 0)
        self.entry_num_images = self.cf.create_entry(self.root, self.number_of_images, 1, 1)
        self.button_split = self.cf.create_button(self.root, "Split Video", self.run_split_video_in_thread, 1, 2, padx=10, pady=10)
        
        self.progress_bar = self.cf.create_progressbar(self.root, 2, 0, columnspan=3)

    def toggle_fullscreen(self, event=None):
        self.root.attributes("-fullscreen", not self.root.attributes("-fullscreen"))

    def end_fullscreen(self, event=None):
        self.root.attributes("-fullscreen", False)

    def select_video(self):
        file_path = filedialog.askopenfilename(
            title="Select a video file",
            filetypes=[("Video files", "*.mp4")]
        )
        self.video_path.set(file_path)

    def update_progress_bar(self, progress_value):
        self.progress_bar['value'] = progress_value
        self.root.update_idletasks()

    def split_video(self):
        video_file = self.video_path.get()
        num_images = self.number_of_images.get()

        # Validate file path
        if not self.utils.is_valid_file_path(video_file):
            self.utils.show_error("Please select a valid video file.")
            return

        # Validate number of images
        if not self.utils.is_valid_number(num_images):
            self.utils.show_error("Please enter a valid number of images.")
            return

        try:
            # Menampilkan progress bar
            self.progress_bar.grid(row=2, column=0, columnspan=3, padx=10, pady=20)

            # Start the progress bar at 10%
            self.update_progress_bar(10)

            # Call the APIClient to split video
            response = self.api_client.split_video(video_file, num_images)

            # Update progress bar to 50% (halfway)
            self.update_progress_bar(50)

            if response.status_code == 200:
                result = response.json()

                # Complete progress
                self.update_progress_bar(100)

                # Tampilkan popup saat proses berhasil
                self.utils.show_info(f"Video split successfully. {len(result['images'])} images saved.")

                # Setelah popup ditutup, sembunyikan progress bar
                self.progress_bar.grid_remove()
            else:
                self.utils.show_error("Failed to process video.")
                self.progress_bar.grid_remove()
        except Exception as e:
            self.utils.show_error(f"An error occurred: {str(e)}")
            self.update_progress_bar(0)
            self.progress_bar.grid_remove()

    def run_split_video_in_thread(self):
        self.progress_bar.grid_remove()  # Reset progress bar
        self.progress_bar['value'] = 0  # Reset progress bar value
        thread = threading.Thread(target=self.split_video)
        thread.start()

class TestUtils(unittest.TestCase):
    def test_is_valid_number(self):
        self.assertTrue(Utils.is_valid_number("5"))
        self.assertFalse(Utils.is_valid_number("abc"))
        self.assertFalse(Utils.is_valid_number("-5"))
        self.assertFalse(Utils.is_valid_number("0"))

    def test_is_valid_file_path(self):
        self.assertFalse(Utils.is_valid_file_path("non_existent_file.mp4"))
        # For valid file path test, you'd need to ensure the file exists

class TestAPIClient(unittest.TestCase):
    @patch('APIClient.requests.post')
    def test_split_video(self, mock_post):
        mock_post.return_value.status_code = 200
        mock_post.return_value.json.return_value = {"images": ["img1.png", "img2.png"]}
        
        api_client = APIClient()
        response = api_client.split_video("C:/Users/febri.dwi/Downloads/20240927_082511.mp4", 5)
        
        self.assertEqual(response.status_code, 200)
        self.assertIn("images", response.json())

# Running the application
if __name__ == "__main__":
    root = tk.Tk()
    app = MainWindow(root)
    root.mainloop()
