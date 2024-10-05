import time
from tqdm import tqdm

def update_progress_bar(total, progress_var, progress_label, progress_bar):
    step_size = 100 / total  # Progres dibagi sesuai dengan total images yang dihasilkan
    for _ in tqdm(range(total), desc="Splitting Video"):
        time.sleep(0.5)  # Simulasi delay, bisa disesuaikan
        progress_var.set(progress_var.get() + step_size)  # Perbarui progress
        progress_label.config(text=f"Progress: {int(progress_var.get())}%")
        progress_bar.update()  # Update progress bar di GUI
