import os
import cv2
import numpy as np
import httpx
import base64
from ultralytics import YOLO
from fastapi import APIRouter, HTTPException, Depends, status, UploadFile, File, Form
from fastapi.responses import JSONResponse
from pydantic import BaseModel, HttpUrl
from app.models.yolo_model import model
from app.utils.token_bearer_util import JWTBearer
from app.utils.response_utils import standard_response

# Initialize the router and JWT dependency
router = APIRouter()
jwt_bearer = JWTBearer()


class PredictRequest(BaseModel):
    url: HttpUrl

@router.post("/predict/")
async def predict_image(
    file: UploadFile = File(None),
    url: str = Form(None),
    pastedImage: str = Form(None),
    payload: dict = Depends(jwt_bearer),  # Validate JWT
):
    """
    Predict bounding boxes from an image (uploaded file, URL, or Base64).
    """

    # Validate JWT payload
    user_id = payload.get("id")
    if not user_id:
        return JSONResponse(
            content=standard_response("error", status.HTTP_401_UNAUTHORIZED, "invalid_token"),
            status_code=status.HTTP_401_UNAUTHORIZED,
        )

    image = None
    width, height = None, None

    try:
        if file:
            # Read uploaded file
            file_bytes = await file.read()
            nparr = np.frombuffer(file_bytes, np.uint8)
            image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            source_type = "uploaded_file"

        elif url:
            # Fetch image from URL
            async with httpx.AsyncClient() as client:
                response = await client.get(url, timeout=10)
                if response.status_code != 200:
                    return JSONResponse(
                        content=standard_response("error", status.HTTP_400_BAD_REQUEST, "fetch_image_failed"),
                        status_code=status.HTTP_400_BAD_REQUEST,
                    )
                nparr = np.frombuffer(response.content, np.uint8)
                image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            source_type = "url"

        elif pastedImage:
            # Decode Base64 Image
            try:
                header, encoded_data = pastedImage.split(",", 1)
                decoded_data = base64.b64decode(encoded_data)
                nparr = np.frombuffer(decoded_data, np.uint8)
                image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            except Exception as e:
                return JSONResponse(
                    content=standard_response("error", status.HTTP_400_BAD_REQUEST, "invalid_base64_format"),
                    status_code=status.HTTP_400_BAD_REQUEST,
                )
            source_type = "base64"

        else:
            return JSONResponse(
                content=standard_response("error", status.HTTP_400_BAD_REQUEST, "no_valid_image_source"),
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        # Check if image is successfully loaded
        if image is None:
            return JSONResponse(
                content=standard_response("error", status.HTTP_400_BAD_REQUEST, "image_decoding_failed"),
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        # Get image dimensions
        height, width, _ = image.shape

    except Exception as e:
        return JSONResponse(
            content=standard_response("error", status.HTTP_400_BAD_REQUEST, "image_processing_failed", str(e)),
            status_code=status.HTTP_400_BAD_REQUEST,
        )

    try:
        # Perform YOLO object detection
        results = model.predict(image, conf=0.40, verbose=False)
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
            content=standard_response(
                "success",
                status.HTTP_200_OK,
                "prediction_success",
                {
                    "predictions": predictions,
                    "image_width": width,
                    "image_height": height,
                    "source_type": source_type,
                },
            ),
            status_code=status.HTTP_200_OK,
        )

    except Exception as e:
        return JSONResponse(
            content=standard_response("error", status.HTTP_500_INTERNAL_SERVER_ERROR, "prediction_failed", str(e)),
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

# @router.post("/predict/")
# async def predict_image(
#     request: PredictRequest,
#     payload: dict = Depends(jwt_bearer),  # Validate JWT
# ):
#     # Validate JWT payload
#     user_id = payload.get("id")
#     if not user_id:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or missing token."
#         )

#     try:
#         # Convert HttpUrl to string
#         image_url = str(request.url)

#         # Fetch the image asynchronously using httpx
#         async with httpx.AsyncClient() as client:
#             response = await client.get(image_url, timeout=10)
#             if response.status_code != 200:
#                 raise HTTPException(
#                     status_code=status.HTTP_400_BAD_REQUEST,
#                     detail=f"Failed to fetch image from URL. HTTP {response.status_code}",
#                 )
#             # Decode the image
#             nparr = np.frombuffer(response.content, np.uint8)
#             image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
#             if image is None:
#                 raise HTTPException(
#                     status_code=status.HTTP_400_BAD_REQUEST,
#                     detail="Failed to decode the image.",
#                 )
#         # Get image dimensions
#         height, width, _ = image.shape

#     except Exception as e:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail=f"Error fetching image: {str(e)}",
#         )

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

#         return JSONResponse(
#             content={
#                 "status": "success",
#                 "predictions": predictions,
#                 "image_width": width,
#                 "image_height": height,
#             },
#             status_code=status.HTTP_200_OK,
#         )

#     except Exception as e:
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=f"Error during prediction: {str(e)}",
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
