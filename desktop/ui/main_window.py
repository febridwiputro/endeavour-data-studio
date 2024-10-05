import tkinter as tk
from tkinter import filedialog, messagebox, ttk
from controller.video_controller import VideoController

class MainWindow:
    def __init__(self, root, video_controller):
        self.root = root
        self.video_controller = video_controller

        self.video_path = tk.StringVar()
        self.num_images = tk.StringVar(value="5")

        # Setup UI elements
        self.setup_ui()

    def setup_ui(self):
        # Label dan tombol untuk memilih file video
        tk.Label(self.root, text="Select Video:").grid(row=0, column=0, padx=10, pady=10)
        tk.Entry(self.root, textvariable=self.video_path, width=50).grid(row=0, column=1, padx=10, pady=10)
        tk.Button(self.root, text="Browse", command=self.select_video).grid(row=0, column=2, padx=10, pady=10)

        # Input untuk menentukan jumlah gambar
        tk.Label(self.root, text="Number of Images:").grid(row=1, column=0, padx=10, pady=10)
        tk.Entry(self.root, textvariable=self.num_images, width=10).grid(row=1, column=1, padx=10, pady=10)

        # Tombol untuk memulai proses split video
        tk.Button(self.root, text="Split Video", command=self.split_video).grid(row=2, column=0, columnspan=3, pady=20)

        # Progress bar
        self.progress_var = tk.DoubleVar()
        self.progress_bar = ttk.Progressbar(self.root, variable=self.progress_var, maximum=100)
        self.progress_bar.grid(row=3, column=0, columnspan=3, padx=10, pady=10, sticky="ew")

        # Label untuk menampilkan progress
        self.progress_label = tk.Label(self.root, text="Progress: 0%")
        self.progress_label.grid(row=4, column=0, columnspan=3, padx=10, pady=10)

    def select_video(self):
        file_path = filedialog.askopenfilename(
            title="Select a video file",
            filetypes=[("Video files", "*.mp4")]
        )
        self.video_path.set(file_path)

    def split_video(self):
        video_file = self.video_path.get()
        num_images = self.num_images.get()

        if not video_file:
            messagebox.showerror("Error", "Please select a video file.")
            return

        if not num_images.isdigit() or int(num_images) < 1:
            messagebox.showerror("Error", "Please enter a valid number of images.")
            return

        images = self.video_controller.split_video(video_file, int(num_images))
        if images:
            messagebox.showinfo("Success", f"Video split successfully. {len(images)} images saved.")
