import os
import cv2
import numpy as np
import httpx
from ultralytics import YOLO
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel, HttpUrl
from app.models.yolo_model import model
from app.utils.token_bearer_util import JWTBearer

# Initialize the router and JWT dependency
router = APIRouter()
jwt_bearer = JWTBearer()


class PredictRequest(BaseModel):
    url: HttpUrl

@router.post("/predict/")
async def predict_image(
    request: PredictRequest,
    payload: dict = Depends(jwt_bearer),  # Validate JWT
):
    # Validate JWT payload
    user_id = payload.get("id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or missing token."
        )

    try:
        # Convert HttpUrl to string
        image_url = str(request.url)

        # Fetch the image asynchronously using httpx
        async with httpx.AsyncClient() as client:
            response = await client.get(image_url, timeout=10)
            if response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Failed to fetch image from URL. HTTP {response.status_code}",
                )
            # Decode the image
            nparr = np.frombuffer(response.content, np.uint8)
            image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            if image is None:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Failed to decode the image.",
                )
        # Get image dimensions
        height, width, _ = image.shape

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error fetching image: {str(e)}",
        )

    try:
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
                    "confidence": confidence,
                })

        return JSONResponse(
            content={
                "status": "success",
                "predictions": predictions,
                "image_width": width,  # Include image width
                "image_height": height,  # Include image height
            },
            status_code=status.HTTP_200_OK,
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error during prediction: {str(e)}",
        )




# @router.post("/predict/")
# async def predict_image(url: str = Form(..., description="URL of the image to predict")):
#     """
#     Predict bounding boxes from an image URL using the YOLOv8 model.
#     """
#     if not url:
#         return JSONResponse(content={"error": "Image URL must be provided."}, status_code=400)

#     try:
#         # Fetch the image from the URL
#         response = requests.get(url)
#         if response.status_code != 200:
#             return JSONResponse(
#                 content={"error": f"Failed to fetch image: HTTP {response.status_code}"},
#                 status_code=400,
#             )

#         nparr = np.frombuffer(response.content, np.uint8)
#         image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
#         if image is None:
#             return JSONResponse(
#                 content={"error": "Failed to decode image from the provided URL."},
#                 status_code=400,
#             )
#     except Exception as e:
#         return JSONResponse(
#             content={"error": f"Error while fetching the image: {str(e)}"},
#             status_code=400,
#         )

#     # Perform YOLO prediction
#     try:
#         results = model.predict(image, conf=0.25, verbose=False)
#         predictions = []
#         for result in results:
#             for box in result.boxes:
#                 x1, y1, x2, y2 = map(int, box.xyxy[0].cpu().numpy())
#                 cls_id = int(box.cls.cpu().numpy())
#                 confidence = float(box.conf.cpu().numpy())
#                 class_name = result.names[cls_id]

#                 predictions.append({
#                     "class_id": cls_id,
#                     "class_name": class_name,
#                     "bounding_box": {"x1": x1, "y1": y1, "x2": x2, "y2": y2},
#                     "confidence": confidence,
#                 })

#         return JSONResponse(content=predictions)
#     except Exception as e:
#         return JSONResponse(
#             content={"error": f"Error during YOLO prediction: {str(e)}"},
#             status_code=500,
#         )


# @router.post("/predict/")
# async def predict_image(
#     file: UploadFile = File(None),
#     url: str = Form(None),
#     pastedImage: str = Form(None)
# ):
#     """
#     Predict bounding boxes from uploaded image using YOLOv8 model.
#     Supports file upload, image URL, and base64-encoded image data.
#     """
#     if file:
#         # Read the image file
#         contents = await file.read()
#         nparr = np.frombuffer(contents, np.uint8)
#         image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
#     elif url:
#         # Fetch the image from the URL
#         try:
#             response = requests.get(url)
#             nparr = np.frombuffer(response.content, np.uint8)
#             image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
#         except Exception as e:
#             return JSONResponse(content={"error": "Failed to load image from URL."}, status_code=400)
#     elif pastedImage:
#         # Decode base64 image data
#         try:
#             image_data = np.frombuffer(base64.b64decode(pastedImage), np.uint8)
#             image = cv2.imdecode(image_data, cv2.IMREAD_COLOR)
#         except Exception as e:
#             return JSONResponse(content={"error": "Failed to decode base64 image."}, status_code=400)
#     else:
#         return JSONResponse(content={"error": "No valid input provided."}, status_code=400)

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


@router.get("")
def root():
    return {"message": "YOLOv8 API is running successfully"}
