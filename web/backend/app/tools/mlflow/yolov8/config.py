# tools\mlflow\yolov8\config.py

import os
import torch

# MLflow Configuration
MLFLOW_URI = "http://localhost:5000"
EXPERIMENT_NAME = "vehicle_detection"
MODEL_NAME = "vehicle_detection"
PIC_RUNNING = "Febri.Dwi"

# Dataset & Paths
PROJECT_LOCATION = "vehicle_detection_experiment"
TRAINING_DIR = os.path.join(PROJECT_LOCATION, "training_runs")
# DATA_YAML_PATH = os.path.join(PROJECT_LOCATION, "config.yaml")
DATA_YAML_PATH = os.path.abspath(os.path.join(PROJECT_LOCATION, "config.yaml"))

MODEL_SAVE_DIR = "/tmp/model/vehicle_detection"
LOG_DIR = os.path.join(PROJECT_LOCATION, "logs")

# Ensure directories exist
os.makedirs(TRAINING_DIR, exist_ok=True)
os.makedirs(LOG_DIR, exist_ok=True)

# Model File Names
PRETRAINED_MODEL = "yolov8n.pt"
TRAINED_MODEL_PATH = os.path.join(MODEL_SAVE_DIR, "trained_yolov8.pt")

# System Environment Variables
os.environ["CUDA_LAUNCH_BLOCKING"] = "1"
os.environ["OMP_NUM_THREADS"] = "4"

TRAIN_PARAMS = {
    "data": DATA_YAML_PATH,
    "epochs": 50,
    "imgsz": 640,
    "batch": 8,
    "amp": True,
    "name": "vehicle-detection-model",
    "workers": 8,
    "lr0": 0.01,
    "optimizer": "SGD",
    "momentum": 0.9,
    "dropout": 0.2,
    "patience": 5,
    "device": "cuda" if torch.cuda.is_available() else "cpu",
}