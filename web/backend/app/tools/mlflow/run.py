import os
import subprocess
import time
import requests
from config import MLflowConfig

def start_mlflow():
    """Menjalankan MLflow server di latar belakang."""
    print("🚀 Starting MLflow Server...")

    mlflow_process = subprocess.Popen(
        MLflowConfig.MLFLOW_COMMAND,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        creationflags=subprocess.CREATE_NEW_CONSOLE  # Membuka jendela CMD baru
    )

    time.sleep(3)

    mlflow_url = f"http://{MLflowConfig.MLFLOW_HOST}:{MLflowConfig.MLFLOW_PORT}"
    max_retries = 5
    for i in range(max_retries):
        try:
            response = requests.get(mlflow_url)
            if response.status_code == 200:
                print(f"✅ MLflow is running at {mlflow_url}")
                return mlflow_process
        except requests.ConnectionError:
            print(f"⏳ Waiting for MLflow to start... ({i+1}/{max_retries})")
            time.sleep(2)

    print("❌ Failed to connect to MLflow. Please check logs.")
    return mlflow_process

if __name__ == "__main__":
    try:
        mlflow_process = start_mlflow()
        mlflow_process.wait()
    except KeyboardInterrupt:
        print("\n🛑 Shutting down MLflow...")
        if mlflow_process:
            mlflow_process.terminate()
            mlflow_process.wait()
            print("✅ MLflow has been terminated.")