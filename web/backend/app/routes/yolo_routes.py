import os
import sys
import cv2
import numpy as np
import requests
from fastapi import APIRouter, File, UploadFile, Form
from fastapi.responses import JSONResponse
from app.models.yolo_model import model

router = APIRouter()

@router.post("/predict")
async def predict_image(
    file: UploadFile = File(None),
    url: str = Form(None),
    pastedImage: str = Form(None)
):
    """
    Predict bounding boxes from uploaded image using YOLOv8 model.
    Supports file upload, image URL, and base64-encoded image data.
    """
    if file:
        # Read the image file
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    elif url:
        # Fetch the image from the URL
        try:
            response = requests.get(url)
            nparr = np.frombuffer(response.content, np.uint8)
            image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        except Exception as e:
            return JSONResponse(content={"error": "Failed to load image from URL."}, status_code=400)
    elif pastedImage:
        # Decode base64 image data
        try:
            image_data = np.frombuffer(base64.b64decode(pastedImage), np.uint8)
            image = cv2.imdecode(image_data, cv2.IMREAD_COLOR)
        except Exception as e:
            return JSONResponse(content={"error": "Failed to decode base64 image."}, status_code=400)
    else:
        return JSONResponse(content={"error": "No valid input provided."}, status_code=400)

    # Perform YOLO prediction
    results = model.predict(image, conf=0.25, verbose=False)

    predictions = []
    for result in results:
        for box in result.boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0].cpu().numpy())
            cls_id = int(box.cls.cpu().numpy())
            confidence = float(box.conf.cpu().numpy())
            class_name = result.names[cls_id]

            predictions.append({
                "class_id": cls_id,
                "class_name": class_name,
                "bounding_box": {"x1": x1, "y1": y1, "x2": x2, "y2": y2},
                "confidence": confidence
            })

    return JSONResponse(content=predictions)

@router.get("")
def root():
    return {"message": "YOLOv8 API is running successfully"}


# import os, sys
# import cv2
# import numpy as np
# from fastapi import APIRouter, File, UploadFile
# from fastapi.responses import JSONResponse
# from app.models.yolo_model import model

# router = APIRouter()

# @router.post("/predict")
# async def predict_image(file: UploadFile = File(...)):
#     """
#     Predict bounding boxes from uploaded image using YOLOv8 model.
#     """
#     # Read the image file
#     contents = await file.read()
#     nparr = np.frombuffer(contents, np.uint8)
#     image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

#     # Perform YOLO prediction
#     results = model.predict(image, conf=0.25, verbose=False)

#     predictions = []
#     for result in results:
#         for box in result.boxes:
#             x1, y1, x2, y2 = map(int, box.xyxy[0].cpu().numpy())
#             cls_id = int(box.cls.cpu().numpy())
#             confidence = float(box.conf.cpu().numpy())
#             class_name = result.names[cls_id]

#             predictions.append({
#                 "class_id": cls_id,
#                 "class_name": class_name,
#                 "bounding_box": {"x1": x1, "y1": y1, "x2": x2, "y2": y2},
#                 "confidence": confidence
#             })

#     return JSONResponse(content=predictions)

# @router.get("")
# def root():
#     return {"message": "YOLOv8 API is running successfully"}