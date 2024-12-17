import torch
from ultralytics import YOLO
from app.config.config import settings


device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model = YOLO(settings.YOLO_MODEL_PATH)
model.to(device)

print(f"Model loaded on device: {device}")
