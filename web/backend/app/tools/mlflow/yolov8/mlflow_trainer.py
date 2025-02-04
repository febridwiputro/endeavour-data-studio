# tools\mlflow\yolov8\mlflow_trainer.py

import os
import json
import torch
import mlflow
import mlflow.pyfunc
import platform
import psutil
import GPUtil
import numpy as np
from datetime import datetime
from collections import defaultdict
from ultralytics import YOLO
from mlflow.tracking import MlflowClient
from multiprocessing import freeze_support
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, precision_score, recall_score, f1_score
from config import (
    MLFLOW_URI, EXPERIMENT_NAME, MODEL_NAME, TRAINING_DIR, DATA_YAML_PATH, 
    MODEL_SAVE_DIR, LOG_DIR, PRETRAINED_MODEL, TRAINED_MODEL_PATH, PIC_RUNNING, TRAIN_PARAMS
)
from mlflow_wrapper import YOLOv8MLflowWrapper


class YOLOv8MLflowTrainer:
    def __init__(self):
        self.device = TRAIN_PARAMS["device"]
        mlflow.set_tracking_uri(MLFLOW_URI)
        mlflow.set_experiment(EXPERIMENT_NAME)

    def get_system_info(self):
        """Mendapatkan informasi sistem dan menyimpannya sebagai log JSON."""
        info = {
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "system": platform.system(),
            "version": platform.version(),
            "cpu": platform.processor(),
            "cpu_cores": psutil.cpu_count(logical=False),
            "cpu_threads": psutil.cpu_count(logical=True),
            "memory": f"{psutil.virtual_memory().total / (1024 ** 3):.2f} GB",
            "gpu": []
        }
        gpus = GPUtil.getGPUs()
        for gpu in gpus:
            info["gpu"].append({
                "name": gpu.name,
                "memory_total": f"{gpu.memoryTotal} MB",
                "memory_used": f"{gpu.memoryUsed} MB"
            })
        
        system_info_path = os.path.join(LOG_DIR, "system_info.json")
        with open(system_info_path, "w") as f:
            json.dump(info, f, indent=4)

        mlflow.log_artifact(system_info_path)  # ✅ Log system info ke MLflow

    def train(self):
        """Melatih model YOLOv8 dan mencatat hasilnya ke MLflow."""
        freeze_support()
        self.get_system_info()
        os.chdir(TRAINING_DIR)

        # 🚀 Pastikan tidak ada run aktif sebelum memulai
        mlflow.end_run()

        with mlflow.start_run(run_name=f"YOLOv8_Training_{datetime.now().strftime('%Y%m%d_%H%M%S')}"):
            model = YOLO(PRETRAINED_MODEL)

            mlflow.log_params(TRAIN_PARAMS)
            mlflow.log_artifact(DATA_YAML_PATH)

            results = model.train(**TRAIN_PARAMS)
            best_model_path = str(model.trainer.best)

            mlflow.log_metrics({
                "best_mAP": results.results.best_fitness,
                "best_loss": results.results.loss,
                "training_time": results.training_time if hasattr(results, 'training_time') else "N/A"
            })

            yolo_wrapper = YOLOv8MLflowWrapper()
            mlflow.pyfunc.log_model(
                artifact_path="model",
                artifacts={'best_model': best_model_path},
                python_model=yolo_wrapper
            )

            mlflow.set_tags({
                "framework": "YOLOv8",
                "task": "object-detection",
                "device": self.device,
                "dataset": "solar-panel",
                "training_time": str(datetime.now()),
                "pic.running": PIC_RUNNING,
            })

            print("✅ Model training completed and logged to MLflow!")


    def evaluate(self):
        """Evaluasi model YOLOv8 dan mencatat hasil + Confusion Matrix ke MLflow."""
        with mlflow.start_run(run_name=f"YOLOv8_Evaluation_{datetime.now().strftime('%Y%m%d_%H%M%S')}"):
            model = YOLO(TRAINED_MODEL_PATH)
            results = model.val()

            mlflow.log_metrics({
                "mAP50": results.results.best_fitness,
                "mAP50-95": results.results.map,
                "validation_time": str(datetime.now())
            })

            cm_path = os.path.join(LOG_DIR, "confusion_matrix.png")
            results.plot_confusion_matrix(save_path=cm_path)
            mlflow.log_artifact(cm_path)

            # ✅ Simpan Confusion Matrix manual dengan sklearn
            eval_log_path = os.path.join(LOG_DIR, f"eval_{datetime.now().strftime('%Y%m%d')}.txt")
            with open(eval_log_path, "w") as log_file:
                y_pred = results.pred
                y_true = results.gt
                
                cm = confusion_matrix(y_true, y_pred)
                class_report = classification_report(y_true, y_pred)

                log_file.write("-" * 50 + "\n")
                log_file.write("TEST SET EVALUATION\n")
                log_file.write("-" * 50 + "\n")
                log_file.write("Confusion Matrix:\n")
                log_file.write(str(cm) + "\n")
                log_file.write("Classification Report:\n")
                log_file.write(class_report + "\n")

                log_file.write(f"Accuracy: {accuracy_score(y_true, y_pred):.4f}\n")
                log_file.write(f"Precision: {precision_score(y_true, y_pred, average='weighted'):.4f}\n")
                log_file.write(f"Recall: {recall_score(y_true, y_pred, average='weighted'):.4f}\n")
                log_file.write(f"F1-Measure: {f1_score(y_true, y_pred, average='weighted'):.4f}\n")

            mlflow.log_artifact(eval_log_path)

            mlflow.set_tags({
                "evaluation_time": str(datetime.now()),
                "status": "completed",
                "pic.running": PIC_RUNNING
            })

            print("✅ Model evaluation completed and logged to MLflow!")

    def register_model(self):
        """Mendaftarkan model YOLOv8 ke MLflow Model Registry."""
        client = MlflowClient()
        with mlflow.start_run(run_name=f"YOLOv8_Register_{datetime.now().strftime('%Y%m%d_%H%M%S')}"):
            model_info = mlflow.register_model(
                model_uri=f"models:/model/latest",
                name=MODEL_NAME
            )

            mlflow.set_tags({
                "model_registered_time": str(datetime.now()),
                "model_version": model_info.version,
                "status": "registered",
                "pic.running": PIC_RUNNING
            })

            print(f"✅ Model registered: {MODEL_NAME}, version: {model_info.version}")


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="YOLOv8 MLflow Trainer")
    parser.add_argument('-m', '--mode', required=True, choices=['train', 'evaluate', 'register'], help='Mode: train, evaluate, or register')
    args = parser.parse_args()

    trainer = YOLOv8MLflowTrainer()
    
    if args.mode == 'train':
        trainer.train()
    elif args.mode == 'evaluate':
        trainer.evaluate()
    elif args.mode == 'register':
        trainer.register_model()


# import os
# import json
# import torch
# import mlflow
# import mlflow.pyfunc
# import platform
# import psutil
# import GPUtil
# from datetime import datetime
# from ultralytics import YOLO
# from mlflow.tracking import MlflowClient
# from multiprocessing import freeze_support
# from web.backend.app.tools.mlflow.yolov8.config import MLFLOW_URI, EXPERIMENT_NAME, MODEL_NAME, TRAINING_DIR, DATA_YAML_PATH, MODEL_SAVE_DIR, LOG_DIR, PRETRAINED_MODEL, TRAINED_MODEL_PATH
# from web.backend.app.tools.mlflow.yolov8.mlflow_wrapper import YOLOv8MLflowWrapper


# class YOLOv8MLflowTrainer:
#     def __init__(self):
#         self.device = "cuda" if torch.cuda.is_available() else "cpu"
#         mlflow.set_tracking_uri(MLFLOW_URI)
#         mlflow.set_experiment(EXPERIMENT_NAME)

#     def log_system_info(self):
#         """Log system information (CPU, GPU, Memory)."""
#         info = {
#             "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
#             "system": platform.system(),
#             "version": platform.version(),
#             "cpu": platform.processor(),
#             "cpu_cores": psutil.cpu_count(logical=False),
#             "cpu_threads": psutil.cpu_count(logical=True),
#             "memory": f"{psutil.virtual_memory().total / (1024 ** 3):.2f} GB",
#             "gpu": []
#         }
#         gpus = GPUtil.getGPUs()
#         for gpu in gpus:
#             info["gpu"].append({
#                 "name": gpu.name,
#                 "memory_total": f"{gpu.memoryTotal} MB",
#                 "memory_used": f"{gpu.memoryUsed} MB"
#             })
#         with open(os.path.join(LOG_DIR, "system_info.json"), "w") as f:
#             json.dump(info, f, indent=4)

#     def train(self):
#         """Train YOLOv8 model and log results to MLflow."""
#         freeze_support()
#         self.log_system_info()
#         os.chdir(TRAINING_DIR)

#         with mlflow.start_run(run_name=f"YOLOv8_Training_{datetime.now().strftime('%Y%m%d_%H%M%S')}"):
#             model = YOLO(PRETRAINED_MODEL)

#             train_params = {
#                 "data": DATA_YAML_PATH,
#                 "epochs": 50,
#                 "imgsz": 640,
#                 "batch": 8,
#                 "amp": True,
#                 "name": "solar-panel-model",
#                 "workers": 8,
#                 "lr0": 0.01,
#                 "optimizer": "SGD",
#                 "momentum": 0.9,
#                 "dropout": 0.2,
#                 "patience": 5,
#                 "device": self.device,
#             }
#             mlflow.log_params(train_params)

#             results = model.train(**train_params)
#             best_model_path = str(model.trainer.best)

#             mlflow.log_metrics({
#                 "best_mAP": results.results.best_fitness,
#                 "best_loss": results.results.loss
#             })

#             # Register Model in MLflow
#             yolo_wrapper = YOLOv8MLflowWrapper()
#             mlflow.pyfunc.log_model(
#                 artifact_path="model",
#                 artifacts={'best_model': best_model_path},
#                 python_model=yolo_wrapper
#             )

#             mlflow.log_artifact(os.path.join(LOG_DIR, "system_info.json"))
#             print("✅ Model training completed and logged to MLflow!")

#     def evaluate(self):
#         """Evaluate YOLOv8 model and log metrics in MLflow."""
#         with mlflow.start_run(run_name=f"YOLOv8_Evaluation_{datetime.now().strftime('%Y%m%d_%H%M%S')}"):
#             model = YOLO(TRAINED_MODEL_PATH)
#             results = model.val()

#             mlflow.log_metrics({
#                 "mAP50": results.results.best_fitness,
#                 "mAP50-95": results.results.map
#             })

#             cm_path = "confusion_matrix.png"
#             results.plot_confusion_matrix(save_path=cm_path)
#             mlflow.log_artifact(cm_path)

#             print("✅ Model evaluation completed and logged to MLflow!")

#     def register_model(self):
#         """Register trained YOLOv8 model to MLflow Model Registry."""
#         client = MlflowClient()
#         model_info = mlflow.register_model(
#             model_uri=f"models:/model/latest",
#             name=MODEL_NAME
#         )

#         print(f"✅ Model registered: {MODEL_NAME}, version: {model_info.version}")


# if __name__ == "__main__":
#     import argparse
#     parser = argparse.ArgumentParser(description="YOLOv8 MLflow Trainer")
#     parser.add_argument('-m', '--mode', required=True, choices=['train', 'evaluate', 'register'], help='Mode: train, evaluate, or register')
#     args = parser.parse_args()

#     trainer = YOLOv8MLflowTrainer()
    
#     if args.mode == 'train':
#         trainer.train()
#     elif args.mode == 'evaluate':
#         trainer.evaluate()
#     elif args.mode == 'register':
#         trainer.register_model()
