# tools\mlflow\yolov8\mlflow_wrapper.py

import mlflow
import mlflow.pyfunc
from ultralytics import YOLO


class YOLOv8MLflowWrapper(mlflow.pyfunc.PythonModel):
    def load_context(self, context):
        """Load YOLOv8 model from MLflow artifacts."""
        self.model = YOLO(context.artifacts["best_model"])

    def predict(self, context, model_input):
        """Run inference on input data using the YOLO model."""
        results = self.model.predict(model_input["image_source"])
        output = []
        for r in results:
            for box in r.boxes:
                output.append({
                    "class_name": self.model.names[int(box.cls)],
                    "class_num": int(box.cls),
                    "confidence": float(box.conf),
                })
        return output
