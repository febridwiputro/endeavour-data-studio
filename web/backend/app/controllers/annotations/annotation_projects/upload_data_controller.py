import os
from typing import Optional, List
from fastapi import APIRouter, HTTPException, UploadFile, Form, Depends, Request
from sqlalchemy.orm import Session, joinedload
from app.config.database import get_db
from app.models.menu.annotations.annotation_project_data_model import AnnotationProjectDataModel
from app.models.menu.annotations.annotate_result_model import (
    ImageMetadataModel,
    TextMetadataModel,
    AudioMetadataModel,
    VideoMetadataModel
)
from app.models.menu.annotations.annotation_project_model import AnnotationProjectModel
from app.enums.dataTypeEnum import DataTypeEnum
from app.utils.response_utils import standard_response, standard_pagination_response
from app.helpers.pagination_helper import paginate_query
from app.enums.uploadTypeEnum import UploadType
from app.enums.perPagesEnum import PerPageOptions
from app.utils.token_bearer_util import JWTBearer
from PIL import Image
import mutagen
from langdetect import detect

# Create or ensure the folder exists
OUTPUT_FOLDER = "static/image_output"
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

jwt_bearer = JWTBearer()
router = APIRouter()


@router.post("/", summary="Upload Data")
async def upload_data(
    request: Request,
    project_id: int = Form(..., description="Project ID to associate the uploads."),
    upload_type: UploadType = Form(..., description="Type of upload (e.g., BY_MULTIPLE_DATA, BY_DATA_URL)."),
    data_type: DataTypeEnum = Form(..., description="Type of data (e.g., IMAGE, AUDIO, TEXT, VIDEO)."),
    files_upload: Optional[List[UploadFile]] = None,
    urls: Optional[List[str]] = None,
    payload: dict = Depends(jwt_bearer),
    db: Session = Depends(get_db),
):
    created_by = payload.get("id")
    if not created_by:
        return standard_response(status="error", status_code=401, message_code="INVALID_TOKEN")

    project = db.query(AnnotationProjectModel).filter_by(id=project_id).first()
    if not project:
        return standard_response(status="error", status_code=404, message_code="PROJECT_NOT_FOUND")

    uploaded_files = []

    try:
        if upload_type == UploadType.BY_MULTIPLE_DATA:
            if not files_upload or len(files_upload) == 0:
                return standard_response(status="error", status_code=400, message_code="NO_FILES_PROVIDED")
            for file in files_upload:
                file_path = os.path.join(OUTPUT_FOLDER, file.filename)
                with open(file_path, "wb") as f:
                    f.write(await file.read())

                # file_url = str(request.url_for(path=f"{OUTPUT_FOLDER}/{file.filename}"))
                file_url = f"{request.base_url}static/image_output/{file.filename}"
                new_upload = AnnotationProjectDataModel(
                    project_id=project_id,
                    file_name=file.filename,
                    file_url=file_url,
                    data_type=data_type,
                    created_by=created_by,
                )
                db.add(new_upload)
                db.commit()
                db.refresh(new_upload)

                # Update metadata based on data type
                update_metadata(file_path, data_type, new_upload.id, db)

                uploaded_files.append({
                    "upload_id": new_upload.id,
                    "file_name": new_upload.file_name,
                    "uploaded_at": new_upload.created_at,
                    "file_url": file_url,
                })

        elif upload_type == UploadType.BY_DATA_URL:
            if not urls or len(urls) == 0:
                return standard_response(status="error", status_code=400, message_code="NO_URLS_PROVIDED")
            for url in urls:
                new_upload = AnnotationProjectDataModel(
                    project_id=project_id,
                    file_name=url.split("/")[-1],
                    file_url=url,
                    data_type=data_type,
                    created_by=created_by,
                )
                db.add(new_upload)
                db.commit()
                db.refresh(new_upload)

                uploaded_files.append({
                    "upload_id": new_upload.id,
                    "file_name": new_upload.file_name,
                    "uploaded_at": new_upload.created_at,
                    "file_url": url,
                })

        else:
            return standard_response(status="error", status_code=400, message_code="INVALID_UPLOAD_TYPE")

    except Exception as e:
        return standard_response(status="error", status_code=500, message_code="UPLOAD_FAILED", data=str(e))

    return standard_response(status="success", status_code=201, message_code="UPLOAD_SUCCESS", data=uploaded_files)


def update_metadata(file_path: str, data_type: DataTypeEnum, data_id: int, db: Session):
    try:
        if data_type == DataTypeEnum.IMAGE:
            update_image_metadata(file_path, data_id, db)
        elif data_type == DataTypeEnum.AUDIO:
            update_audio_metadata(file_path, data_id, db)
        elif data_type == DataTypeEnum.TEXT:
            update_text_metadata(file_path, data_id, db)
        elif data_type == DataTypeEnum.VIDEO:
            update_video_metadata(file_path, data_id, db)
    except Exception as e:
        print(f"Error updating metadata for {data_type.value}: {e}")


def update_image_metadata(file_path: str, data_id: int, db: Session):
    with Image.open(file_path) as img:
        width, height = img.size
        format = img.format
        color_mode = img.mode

        metadata_entry = ImageMetadataModel(
            data_id=data_id,
            width=width,
            height=height,
            format=format,
            color_mode=color_mode,
        )
        db.add(metadata_entry)
        db.commit()


def update_text_metadata(file_path: str, data_id: int, db: Session):
    with open(file_path, "r", encoding="utf-8") as file:
        content = file.read()
        text_length = len(content)
        language = detect(content)

        metadata_entry = TextMetadataModel(
            data_id=data_id,
            text_length=text_length,
            language=language,
            encoding="utf-8",
        )
        db.add(metadata_entry)
        db.commit()

def update_audio_metadata(file_path: str, data_id: int, db: Session):
    audio = mutagen.File(file_path)
    if audio:
        duration = audio.info.length
        sample_rate = audio.info.sample_rate if hasattr(audio.info, "sample_rate") else None
        channels = audio.info.channels if hasattr(audio.info, "channels") else None
        format = file_path.split(".")[-1].upper()

        metadata_entry = AudioMetadataModel(
            data_id=data_id,
            duration=duration,
            sample_rate=sample_rate,
            channels=channels,
            format=format,
        )
        db.add(metadata_entry)
        db.commit()


def update_video_metadata(file_path: str, data_id: int, db: Session):
    import cv2
    video = cv2.VideoCapture(file_path)
    if not video.isOpened():
        raise Exception("Unable to open video file.")

    frame_rate = video.get(cv2.CAP_PROP_FPS)
    frame_count = int(video.get(cv2.CAP_PROP_FRAME_COUNT))
    duration = frame_count / frame_rate if frame_rate else 0
    width = int(video.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(video.get(cv2.CAP_PROP_FRAME_HEIGHT))
    resolution = f"{width}x{height}"
    format = file_path.split(".")[-1].upper()

    metadata_entry = VideoMetadataModel(
        data_id=data_id,
        duration=duration,
        frame_rate=frame_rate,
        resolution=resolution,
        format=format,
    )
    db.add(metadata_entry)
    db.commit()




# @router.post("/", summary="Upload Files")
# async def upload_data(
#     request: Request,
#     project_id: int = Form(..., description="Project ID to associate the uploads."),
#     upload_type: UploadType = Form(..., description="Type of upload (select from dropdown)."),
#     files_upload: Optional[List[UploadFile]] = None,
#     folders_upload: Optional[List[UploadFile]] = None,
#     folder_path: Optional[str] = None,
#     image_path: Optional[str] = None,
#     image_urls: Optional[List[str]] = None,
#     payload: dict = Depends(jwt_bearer),
#     db: Session = Depends(get_db),
# ):
#     created_by = payload.get("id")
#     if not created_by:
#         return standard_response(
#             status="error",
#             status_code=401,
#             message_code="INVALID_OR_EXPIRED_TOKEN",
#             data=None,
#         )

#     project = db.query(AnnotationProjectModel).filter_by(id=project_id).first()
#     if not project:
#         return standard_response(
#             status="error",
#             status_code=404,
#             message_code="PROJECT_NOT_FOUND",
#             data=None,
#         )

#     uploaded_files = []

#     try:
#         if upload_type == UploadType.by_multiple_image:
#             if not files_upload or len(files_upload) == 0:
#                 return standard_response(
#                     status="error",
#                     status_code=400,
#                     message_code="FILES_REQUIRED",
#                     data=None,
#                 )
#             for file in files_upload:
#                 file_path = os.path.join(OUTPUT_FOLDER, file.filename)
#                 with open(file_path, "wb") as f:
#                     f.write(await file.read())

#                 # Convert URL object to string
#                 img_url = str(request.url_for("static", path=f"image_output/{file.filename}"))

#                 new_upload = AnnotationProjectDataModel(
#                     project_id=project_id,
#                     file_name=file.filename,
#                     img_url=img_url,  # Pass as string
#                     created_by=created_by,
#                 )
#                 db.add(new_upload)
#                 db.commit()
#                 db.refresh(new_upload)
#                 uploaded_files.append({
#                     "upload_id": new_upload.id,
#                     "file_name": new_upload.file_name,
#                     "uploaded_at": new_upload.created_at,
#                     "file_path": file_path,
#                     "image_url": img_url,
#                 })

#         elif upload_type == UploadType.by_folder:
#             if not folders_upload or len(folders_upload) == 0:
#                 return standard_response(
#                     status="error",
#                     status_code=400,
#                     message_code="FOLDER_FILES_REQUIRED",
#                     data=None,
#                 )
#             for file in folders_upload:
#                 file_path = os.path.join(OUTPUT_FOLDER, file.filename)
#                 with open(file_path, "wb") as f:
#                     f.write(await file.read())

#                 # Convert URL object to string
#                 img_url = str(request.url_for("static", path=f"image_output/{file.filename}"))

#                 new_upload = AnnotationProjectDataModel(
#                     project_id=project_id,
#                     file_name=file.filename,
#                     img_url=img_url,  # Pass as string
#                     created_by=created_by,
#                 )
#                 db.add(new_upload)
#                 db.commit()
#                 db.refresh(new_upload)
#                 uploaded_files.append({
#                     "upload_id": new_upload.id,
#                     "file_name": new_upload.file_name,
#                     "uploaded_at": new_upload.created_at,
#                     "file_path": file_path,
#                     "image_url": img_url,
#                 })

#         elif upload_type == UploadType.by_image_url:
#             if not image_urls or len(image_urls) == 0:
#                 return standard_response(
#                     status="error",
#                     status_code=400,
#                     message_code="IMAGE_URLS_REQUIRED",
#                     data=None,
#                 )
#             for url in image_urls:
#                 new_upload = AnnotationProjectDataModel(
#                     project_id=project_id,
#                     file_name=url,
#                     img_url=url,  # Save the URL string directly
#                     created_by=created_by,
#                 )
#                 db.add(new_upload)
#                 db.commit()
#                 db.refresh(new_upload)
#                 uploaded_files.append({
#                     "upload_id": new_upload.id,
#                     "file_name": new_upload.file_name,
#                     "uploaded_at": new_upload.created_at,
#                     "image_url": url,
#                 })

#         elif upload_type == UploadType.by_folder_path:
#             if not folder_path:
#                 return standard_response(
#                     status="error",
#                     status_code=400,
#                     message_code="FOLDER_PATH_REQUIRED",
#                     data=None,
#                 )
#             uploaded_files.append({
#                 "message": f"Folder path '{folder_path}' processed successfully."
#             })

#         elif upload_type == UploadType.by_image_path:
#             if not image_path:
#                 return standard_response(
#                     status="error",
#                     status_code=400,
#                     message_code="IMAGE_PATH_REQUIRED",
#                     data=None,
#                 )
#             uploaded_files.append({
#                 "message": f"Image path '{image_path}' processed successfully."
#             })

#         else:
#             return standard_response(
#                 status="error",
#                 status_code=400,
#                 message_code="INVALID_UPLOAD_TYPE",
#                 data=None,
#             )
#     except Exception as e:
#         return standard_response(
#             status="error",
#             status_code=500,
#             message_code="UPLOAD_PROCESSING_FAILED",
#             data=str(e),
#         )

#     return standard_response(
#         status="success",
#         status_code=201,
#         message_code="UPLOAD_PROCESSED_SUCCESSFULLY",
#         data=uploaded_files,
#     )


@router.get("/all", summary="Get All Data by User")
async def get_all_data_by_user(
    page: int = 1,
    per_page: PerPageOptions = PerPageOptions.TEN,
    payload: dict = Depends(jwt_bearer),
    db: Session = Depends(get_db),
):
    """
    Retrieve all uploaded files by the user making the request with pagination.

    Returns:
        dict: A paginated response containing all files uploaded by the user.
    """
    created_by = payload.get("id")
    if not created_by:
        return standard_pagination_response(
            status="error",
            status_code=401,
            message_code="INVALID_OR_EXPIRED_TOKEN",
            data=[],
            count=0,
            per_page=per_page.value,
            total_pages=0,
        )

    query = db.query(AnnotationProjectDataModel).filter_by(created_by=created_by)
    paginated_result = paginate_query(query, page, per_page.value)

    if not paginated_result["items"]:
        return standard_pagination_response(
            status="error",
            status_code=404,
            message_code="NO_FILES_FOUND",
            data=[],
            count=0,
            per_page=per_page.value,
            total_pages=0,
        )

    response_data = [
        {
            "upload_id": upload.id,
            "project_id": upload.project_id,
            "file_name": upload.file_name,
            "uploaded_at": upload.created_at,
        }
        for upload in paginated_result["items"]
    ]

    return standard_pagination_response(
        status="success",
        status_code=200,
        message_code="FILES_RETRIEVED_SUCCESSFULLY",
        data=response_data,
        count=paginated_result["total_count"],
        per_page=per_page.value,
        total_pages=paginated_result["total_pages"],
        next_page=paginated_result["next_page"],
        previous_page=paginated_result["previous_page"],
    )

@router.get("/{project_id}", summary="Get Uploaded Files")
async def get_uploaded_data(
    project_id: int,
    request: Request,
    payload: dict = Depends(jwt_bearer),
    db: Session = Depends(get_db),
):
    """
    Retrieve uploaded files for a specific project ID without pagination.
    Includes related data using eager loading.

    Args:
        project_id (int): The ID of the project to retrieve files for.
        request (Request): The incoming HTTP request object.
        payload (dict): JWT payload containing user info.
        db (Session): Database session dependency.

    Returns:
        dict: A standard response containing the list of uploaded files and related data.
    """
    user_id = payload.get("id")
    if not user_id:
        return standard_response(
            status="error",
            status_code=401,
            message_code="INVALID_OR_EXPIRED_TOKEN",
            data=[],
        )

    # Query with eager loading of related models
    files = (
        db.query(AnnotationProjectDataModel)
        .filter_by(project_id=project_id)
        .options(
            joinedload(AnnotationProjectDataModel.project),
            joinedload(AnnotationProjectDataModel.datasets),
            joinedload(AnnotationProjectDataModel.training),
            joinedload(AnnotationProjectDataModel.versions),
            joinedload(AnnotationProjectDataModel.image_annotations),
            joinedload(AnnotationProjectDataModel.text_annotations),
            joinedload(AnnotationProjectDataModel.audio_annotations),
            joinedload(AnnotationProjectDataModel.video_annotations),
            joinedload(AnnotationProjectDataModel.image_metadata),
            joinedload(AnnotationProjectDataModel.audio_metadata),
            joinedload(AnnotationProjectDataModel.text_metadata),
            joinedload(AnnotationProjectDataModel.video_metadata),
        )
        .all()
    )

    if not files:
        return standard_response(
            status="error",
            status_code=404,
            message_code="FILES_NOT_FOUND",
            data=[],
        )

    # Serialize the results
    response_data = []
    for file in files:
        response_data.append(
            {
                "upload_id": file.id,
                "file_name": file.file_name,
                "file_url": file.file_url,
                "description": file.description,
                "data_type": file.data_type.name if file.data_type else None,
                "drafts": file.drafts,
                "completed": file.completed,
                "avg_confidence_score": file.avg_confidence_score,
                "created_at": file.created_at,
                "updated_at": file.updated_at,
                # "project": file.project.name if file.project else None,
                # "datasets": [
                #     {"id": dataset.id, "name": dataset.name}
                #     for dataset in file.datasets
                # ],
                # "training": [
                #     {"id": train.id, "status": train.status}
                #     for train in file.training
                # ],
                # "versions": [
                #     {"id": version.id, "name": version.name}
                #     for version in file.versions
                # ],
                # "annotations": {
                #     "image_annotations": [
                #         {"id": annotation.id, "label": annotation.label}
                #         for annotation in file.image_annotations
                #     ],
                #     "text_annotations": [
                #         {"id": annotation.id, "label": annotation.label}
                #         for annotation in file.text_annotations
                #     ],
                #     "audio_annotations": [
                #         {"id": annotation.id, "label": annotation.label}
                #         for annotation in file.audio_annotations
                #     ],
                #     "video_annotations": [
                #         {"id": annotation.id, "label": annotation.label}
                #         for annotation in file.video_annotations
                #     ],
                # },
                "metadata": {
                    "image_metadata": {
                        "width": file.image_metadata.width,
                        "height": file.image_metadata.height,
                    }
                    if file.image_metadata
                    else None,
                    # "audio_metadata": {
                    #     "duration": file.audio_metadata.duration,
                    #     "format": file.audio_metadata.format,
                    # }
                    # if file.audio_metadata
                    # else None,
                    # "text_metadata": {
                    #     "language": file.text_metadata.language,
                    #     "character_count": file.text_metadata.character_count,
                    # }
                    # if file.text_metadata
                    # else None,
                    # "video_metadata": {
                    #     "duration": file.video_metadata.duration,
                    #     "resolution": file.video_metadata.resolution,
                    # }
                    # if file.video_metadata
                    # else None,
                },
            }
        )

    return standard_response(
        status="success",
        status_code=200,
        message_code="FILES_RETRIEVED_SUCCESSFULLY",
        data=response_data,
    )


# @router.get("/{project_id}", summary="Get Uploaded Files")
# async def get_uploaded_data(
#     project_id: int,
#     request: Request,
#     payload: dict = Depends(jwt_bearer),
#     db: Session = Depends(get_db),
#     page: int = 1,
#     per_page: PerPageOptions = PerPageOptions.TEN,
# ):
#     """
#     Retrieve uploaded files for a specific project ID with pagination.

#     Args:
#         project_id (int): The ID of the project to retrieve files for.
#         request (Request): The incoming HTTP request object.
#         payload (dict): JWT payload containing user info.
#         db (Session): Database session dependency.
#         page (int): Current page number.
#         per_page (PerPageOptions): Number of items per page.

#     Returns:
#         dict: A paginated response containing the list of uploaded files.
#     """
#     user_id = payload.get("id")
#     if not user_id:
#         return standard_pagination_response(
#             status="error",
#             status_code=401,
#             message_code="INVALID_OR_EXPIRED_TOKEN",
#             data=[],
#             count=0,
#             per_page=per_page.value,
#             total_pages=0,
#         )

#     query = db.query(AnnotationProjectDataModel).filter_by(project_id=project_id)
#     paginated_result = paginate_query(query, page, per_page.value, request)

#     if not paginated_result["items"]:
#         return standard_pagination_response(
#             status="error",
#             status_code=404,
#             message_code="FILES_NOT_FOUND",
#             data=[],
#             count=0,
#             per_page=per_page.value,
#             total_pages=0,
#         )

#     response_data = [
#         {
#             "upload_id": upload.id,
#             "file_name": upload.file_name,
#             "img_url": upload.img_url,
#             "uploaded_at": upload.created_at,
#         }
#         for upload in paginated_result["items"]
#     ]

#     return standard_pagination_response(
#         status="success",
#         status_code=200,
#         message_code="FILES_RETRIEVED_SUCCESSFULLY",
#         data=response_data,
#         count=paginated_result["total_count"],
#         per_page=per_page.value,
#         total_pages=paginated_result["total_pages"],
#         next_page=paginated_result["next_page"],
#         previous_page=paginated_result["previous_page"],
#     )