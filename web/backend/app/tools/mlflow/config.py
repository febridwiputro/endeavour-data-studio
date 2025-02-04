# import os

# class MLflowConfig:
#     """Konfigurasi MLflow untuk lingkungan lokal Windows."""

#     # URI untuk menyimpan metadata tracking MLflow
#     MLFLOW_BACKEND_STORE_URI = "sqlite:///mlruns.db"

#     # Path untuk menyimpan artefak model (gunakan path absolut)
#     MLFLOW_ARTIFACT_ROOT = f"file:///{os.path.abspath('mlruns')}"

#     # Konfigurasi Host dan Port MLflow
#     MLFLOW_HOST = "127.0.0.1"  # 🛠️ Ubah agar bisa diakses dari luar localhost
#     MLFLOW_PORT = "8885"

#     # Perintah untuk menjalankan MLflow di Windows
#     MLFLOW_COMMAND = [
#         "mlflow",
#         "server",
#         "--backend-store-uri", MLFLOW_BACKEND_STORE_URI,
#         "--default-artifact-root", MLFLOW_ARTIFACT_ROOT,
#         "--host", MLFLOW_HOST,
#         "--port", MLFLOW_PORT,
#         "--gunicorn-opts", "--timeout 600"
#     ]

# # Set environment variable untuk MLflow
# os.environ["MLFLOW_TRACKING_URI"] = f"http://{MLflowConfig.MLFLOW_HOST}:{MLflowConfig.MLFLOW_PORT}"


import os

class MLflowConfig:
    """Konfigurasi untuk menjalankan MLflow Server."""
    MLFLOW_TRACKING_URI = "http://127.0.0.1:5000"
    MLFLOW_BACKEND_STORE_URI = "sqlite:///mlruns.db"
    MLFLOW_ARTIFACT_ROOT = "file:///absolute/path/to/mlruns"
    MLFLOW_HOST = "127.0.0.1"
    MLFLOW_PORT = "8885"

    # Perintah untuk menjalankan MLflow
    MLFLOW_COMMAND = [
        "mlflow",
        "server",
        "--backend-store-uri", MLFLOW_BACKEND_STORE_URI,
        "--host", MLFLOW_HOST,
        "--port", MLFLOW_PORT
    ]

# Set environment variable
os.environ["MLFLOW_TRACKING_URI"] = MLflowConfig.MLFLOW_TRACKING_URI
