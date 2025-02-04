import os
from typing import Optional, List
from fastapi import (
    APIRouter,
    HTTPException,
    UploadFile,
    Form,
    Depends,
    Request,
    Query,
    status,
)
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, or_, and_
from app.config.database import get_db
from app.models.menu.annotations.annotation_project_data_model import (
    AnnotationProjectDataModel,
)
from app.models.menu.annotations.annotate_result_model import (
    ImageMetadataModel,
    TextMetadataModel,
    AudioMetadataModel,
    VideoMetadataModel,
)
from app.models.menu.annotations.annotation_project_model import AnnotationProjectModel
from app.models.menu.annotations.annotate_result_model import ImageAnnotationResultModel
from datetime import datetime
import shutil
import uuid
from fastapi.responses import FileResponse
import zipfile
from app.enums.dataTypeEnum import DataTypeEnum
from app.utils.response_utils import standard_response, standard_pagination_response
from app.helpers.pagination_helper import paginate_query
from app.enums.uploadTypeEnum import UploadType
from app.enums.perPagesEnum import PerPageOptions
from app.utils.token_bearer_util import JWTBearer
from PIL import Image
import mutagen
from langdetect import detect
import requests

# Create or ensure the folder exists
OUTPUT_FOLDER = "static/image_output"
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

jwt_bearer = JWTBearer()
router = APIRouter()

# ✅ Fixed Operator Mapping (Added 'is before' and 'is after')
OPERATOR_MAP = {
    "=": lambda col, val: col == val,
    "!=": lambda col, val: col != val,
    "<": lambda col, val: col < val,
    ">": lambda col, val: col > val,
    "<=": lambda col, val: col <= val,
    ">=": lambda col, val: col >= val,
    "is before": lambda col, val: col < val,  # ✅ Fixed (Added)
    "is after": lambda col, val: col > val,  # ✅ Fixed (Added)
    "is between": lambda col, vals: col.between(vals["min"], vals["max"]),
    "not between": lambda col, vals: ~col.between(vals["min"], vals["max"]),
    "is empty": lambda col, _: col.is_(None),
    "contains": lambda col, val: col.ilike(f"%{val}%"),
    "not contains": lambda col, val: ~col.ilike(f"%{val}%"),
    "regex": lambda col, val: col.op("~")(val),
    "equal": lambda col, val: col == val,
    "not equal": lambda col, val: col != val,
    "is": lambda col, val: (
        col.is_(val) if isinstance(val, bool) else col == val
    ),  # ✅ Fixed Boolean Handling
}

# ✅ Fixed Column Type Mapping
COLUMN_TYPES = {
    "id": "int",
    "file_url": "string",
    "description": "text",
    "data_type": "string",
    "completed": "bool",
    "avg_confidence_score": "float",
    "is_annotated": "bool",  # ✅ Boolean Fixed
    "created_at": "datetime",
    "updated_at": "datetime",
    "width": "int",
    "height": "int",
    "x1": "float",
    "y1": "float",
    "x2": "float",
    "y2": "float",
    "confidence_score": "float",
    "label": "string",
}


import re


import re


@router.get("/filter-data/", summary="Filter project data")
def filter_project_data(
    project_id: int = Query(..., description="Project ID to filter data"),
    filters: list[str] = Query(
        [],
        description="Filters in field:operator:value format (e.g., created_at:is between:2025-01-28T02:38:10.443929,2025-01-29T02:38:10.443929).",
    ),
    payload: dict = Depends(jwt_bearer),
    db: Session = Depends(get_db),
):
    """Filter project data based on given conditions."""

    user_id = payload.get("id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token."
        )

    project_exists = (
        db.query(AnnotationProjectDataModel.id).filter_by(project_id=project_id).first()
    )
    if not project_exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Annotation project not found.",
        )

    query = (
        db.query(AnnotationProjectDataModel)
        .filter(AnnotationProjectDataModel.project_id == project_id)
        .outerjoin(
            ImageMetadataModel,
            ImageMetadataModel.data_id == AnnotationProjectDataModel.id,
        )
        .outerjoin(
            ImageAnnotationResultModel,
            ImageAnnotationResultModel.data_id == AnnotationProjectDataModel.id,
        )
        .options(
            joinedload(AnnotationProjectDataModel.image_metadata),
            joinedload(AnnotationProjectDataModel.image_annotations),
        )
    )

    filter_conditions = []

    for filter_item in filters:
        try:
            print(f"Processing filter: {filter_item}")  # Debugging

            # ✅ Gunakan regex untuk parsing field, operator, dan value dengan benar
            match = re.match(r"([^:]+):([^:]+):(.+)", filter_item)
            if not match:
                raise ValueError(f"Invalid filter format: {filter_item}")

            field, operator, values = match.groups()

            # ✅ Pastikan operator valid
            if operator not in OPERATOR_MAP:
                raise ValueError(f"Operator '{operator}' not found in OPERATOR_MAP")

            if field not in COLUMN_TYPES:
                raise ValueError(f"Invalid field: {field}")

            column_type = COLUMN_TYPES[field]

            # ✅ Tentukan kolom yang digunakan berdasarkan field
            column = getattr(AnnotationProjectDataModel, field, None)
            if field in ["width", "height"]:
                column = getattr(ImageMetadataModel, field, None)
            elif field in ["x1", "y1", "x2", "y2", "label", "confidence_score"]:
                column = getattr(ImageAnnotationResultModel, field, None)

            if not column:
                raise ValueError(f"Invalid column: {field}")

            print(f"Operator: {operator}, Values: {values}")  # Debugging

            # ✅ Perbaikan "is before" dan "is after"
            if operator in ["is before", "is after"]:
                try:
                    if values.strip().lower() in ["null", "invalid date"]:
                        raise ValueError("Received invalid datetime value.")

                    datetime_value = datetime.fromisoformat(values.strip())
                    condition = OPERATOR_MAP[operator](column, datetime_value)
                    filter_conditions.append(condition)
                    continue
                except ValueError:
                    raise ValueError(f"Invalid datetime format: {values}")

            # ✅ Perbaikan "is between" dan "not between"
            elif operator in ["is between", "not between"]:
                if "," not in values:
                    raise ValueError(
                        f"Operator '{operator}' requires 'min,max' values."
                    )

                try:
                    min_value, max_value = values.split(",", 1)

                    if min_value.strip().lower() in [
                        "null",
                        "invalid date",
                    ] or max_value.strip().lower() in ["null", "invalid date"]:
                        raise ValueError("Received invalid datetime range.")

                    min_datetime = datetime.fromisoformat(min_value.strip())
                    max_datetime = datetime.fromisoformat(max_value.strip())

                    if min_datetime > max_datetime:
                        raise ValueError(
                            "Min datetime cannot be greater than Max datetime."
                        )

                    condition = OPERATOR_MAP[operator](
                        column, {"min": min_datetime, "max": max_datetime}
                    )
                    filter_conditions.append(condition)
                    continue
                except ValueError as e:
                    raise ValueError(
                        f"Invalid datetime range format: {values} - {str(e)}"
                    )

            elif column_type in ["int", "float"]:
                values = float(values)

            # ✅ Pastikan operator ditemukan dalam `OPERATOR_MAP`
            condition = OPERATOR_MAP[operator](column, values)
            filter_conditions.append(condition)

        except (ValueError, KeyError) as e:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    if filter_conditions:
        query = query.filter(and_(*filter_conditions))

    filtered_data = query.all()

    return standard_response(
        status="success",
        status_code=status.HTTP_200_OK,
        message_code="filtered_data_retrieved",
        data=[
            {
                "upload_id": d.id,
                "file_url": d.file_url,
                "description": d.description,
                "data_type": d.data_type,
                "completed": d.completed,
                "avg_confidence_score": d.avg_confidence_score,
                "is_annotated": d.is_annotated,
                "created_at": d.created_at.isoformat() if d.created_at else None,
                "updated_at": d.updated_at.isoformat() if d.updated_at else None,
                "metadata": {
                    "image_metadata": {
                        "width": d.image_metadata.width if d.image_metadata else None,
                        "height": d.image_metadata.height if d.image_metadata else None,
                    },
                    "image_annotations": [
                        {
                            "x1": ann.x1,
                            "y1": ann.y1,
                            "x2": ann.x2,
                            "y2": ann.y2,
                            "label": ann.label,
                            "confidence_score": ann.confidence_score,
                        }
                        for ann in d.image_annotations
                    ],
                },
            }
            for d in filtered_data
        ],
    )


@router.post("/", summary="Upload Data")
async def upload_data(
    request: Request,
    project_id: int = Form(..., description="Project ID to associate the uploads."),
    upload_type: UploadType = Form(
        ..., description="Type of upload (e.g., BY_MULTIPLE_DATA, BY_DATA_URL)."
    ),
    data_type: DataTypeEnum = Form(
        ..., description="Type of data (e.g., IMAGE, AUDIO, TEXT, VIDEO)."
    ),
    files_upload: Optional[List[UploadFile]] = None,
    urls: Optional[List[str]] = None,
    payload: dict = Depends(jwt_bearer),
    db: Session = Depends(get_db),
):
    created_by = payload.get("id")
    if not created_by:
        return standard_response(
            status="error", status_code=401, message_code="INVALID_TOKEN"
        )

    project = db.query(AnnotationProjectModel).filter_by(id=project_id).first()
    if not project:
        return standard_response(
            status="error", status_code=404, message_code="PROJECT_NOT_FOUND"
        )

    uploaded_files = []

    try:
        if upload_type == UploadType.BY_MULTIPLE_DATA:
            if not files_upload or len(files_upload) == 0:
                return standard_response(
                    status="error", status_code=400, message_code="NO_FILES_PROVIDED"
                )
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

                uploaded_files.append(
                    {
                        "upload_id": new_upload.id,
                        "file_name": new_upload.file_name,
                        "uploaded_at": new_upload.created_at,
                        "file_url": file_url,
                    }
                )

        elif upload_type == UploadType.BY_DATA_URL:
            if not urls or len(urls) == 0:
                return standard_response(
                    status="error", status_code=400, message_code="NO_URLS_PROVIDED"
                )
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

                uploaded_files.append(
                    {
                        "upload_id": new_upload.id,
                        "file_name": new_upload.file_name,
                        "uploaded_at": new_upload.created_at,
                        "file_url": url,
                    }
                )

        else:
            return standard_response(
                status="error", status_code=400, message_code="INVALID_UPLOAD_TYPE"
            )

    except Exception as e:
        return standard_response(
            status="error", status_code=500, message_code="UPLOAD_FAILED", data=str(e)
        )

    return standard_response(
        status="success",
        status_code=201,
        message_code="UPLOAD_SUCCESS",
        data=uploaded_files,
    )


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
        sample_rate = (
            audio.info.sample_rate if hasattr(audio.info, "sample_rate") else None
        )
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
                # "file_name": file.file_name,
                "file_url": file.file_url,
                "description": file.description,
                "data_type": file.data_type.name if file.data_type else None,
                "drafts": file.drafts,
                "completed": file.completed,
                "avg_confidence_score": file.avg_confidence_score,
                "is_annotated": file.is_annotated,
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
                    "image_metadata": (
                        {
                            "width": file.image_metadata.width,
                            "height": file.image_metadata.height,
                            "image_annotations": [
                                {
                                    "result_type": annotation.result_type,
                                    "x1": annotation.x1,
                                    "y1": annotation.y1,
                                    "x2": annotation.x2,
                                    "y2": annotation.y2,
                                    "label": annotation.label,
                                    "confidence_score": annotation.confidence_score,
                                }
                                for annotation in file.image_annotations
                            ],
                        }
                        if file.image_metadata
                        else None
                    ),
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


@router.get(
    "/export-annotations/",
    summary="Export annotations in YOLO & Label Studio format",
    description="Exports annotation results including bounding boxes and class labels in a normalized format.",
    status_code=status.HTTP_200_OK,
)
def export_annotations(
    project_id: int = Query(..., description="The ID of the project."),
    db: Session = Depends(get_db),
):
    # 🔍 **Cek apakah proyek ada**
    project = db.query(AnnotationProjectModel).filter_by(id=project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Annotation project not found.",
        )

    # 🔍 **Ambil semua anotasi dari proyek ini**
    annotations = (
        db.query(ImageAnnotationResultModel)
        .join(
            AnnotationProjectDataModel,
            AnnotationProjectDataModel.id == ImageAnnotationResultModel.data_id,
        )
        .filter(AnnotationProjectDataModel.project_id == project_id)
        .all()
    )

    if not annotations:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No annotations found for this project.",
        )

    # 🔍 **Dapatkan daftar kelas unik**
    class_labels = (
        db.query(ImageAnnotationResultModel.label)
        .distinct()
        .filter(
            ImageAnnotationResultModel.data_id.in_([a.data_id for a in annotations])
        )
        .all()
    )
    class_labels = [label[0] for label in class_labels]  # Ubah tuple ke list

    # 🗂️ **Buat direktori sementara**
    export_dir = f"./temp_exports/{uuid.uuid4()}"
    images_dir = os.path.join(export_dir, "images")
    labels_dir = os.path.join(export_dir, "labels")
    os.makedirs(images_dir, exist_ok=True)
    os.makedirs(labels_dir, exist_ok=True)

    # 📝 **Tulis daftar kelas ke classes.txt**
    with open(os.path.join(export_dir, "classes.txt"), "w") as f:
        for label in class_labels:
            f.write(f"{label}\n")

    # 🔄 **Proses setiap anotasi**
    for annotation in annotations:
        image_data = (
            db.query(AnnotationProjectDataModel)
            .filter_by(id=annotation.data_id)
            .first()
        )
        if not image_data:
            continue

        # 🔍 **Ambil metadata gambar**
        image_metadata = (
            db.query(ImageMetadataModel).filter_by(data_id=annotation.data_id).first()
        )

        if not image_metadata:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Missing image metadata.",
            )

        image_width = image_metadata.width
        image_height = image_metadata.height

        image_url = image_data.file_url
        image_name = os.path.basename(image_url)

        # 🔽 **Unduh gambar**
        response = requests.get(image_url, stream=True)
        if response.status_code == 200:
            with open(os.path.join(images_dir, image_name), "wb") as img_file:
                shutil.copyfileobj(response.raw, img_file)
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to download image: {image_url}",
            )

        # 📏 **Normalisasi koordinat bounding box**
        x1, y1 = annotation.x1 / image_width, annotation.y1 / image_height  # Kiri Atas
        x2, y2 = annotation.x2 / image_width, annotation.y1 / image_height  # Kanan Atas
        x3, y3 = (
            annotation.x2 / image_width,
            annotation.y2 / image_height,
        )  # Kanan Bawah
        x4, y4 = annotation.x1 / image_width, annotation.y2 / image_height  # Kiri Bawah

        # 📜 **Tulis file label dengan format Label Studio**
        label_file_path = os.path.join(
            labels_dir, f"{os.path.splitext(image_name)[0]}.txt"
        )
        with open(label_file_path, "a") as label_file:
            bbox = f"{class_labels.index(annotation.label)} {x1:.6f} {y1:.6f} {x2:.6f} {y2:.6f} {x3:.6f} {y3:.6f} {x4:.6f} {y4:.6f}\n"
            label_file.write(bbox)

    # 📦 **Buat file ZIP**
    zip_file_path = f"{export_dir}.zip"
    with zipfile.ZipFile(zip_file_path, "w") as zipf:
        for root, _, files in os.walk(export_dir):
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, export_dir)
                zipf.write(file_path, arcname)

    # 🧹 **Bersihkan folder sementara**
    shutil.rmtree(export_dir)

    # 📤 **Kembalikan file ZIP**
    return FileResponse(
        zip_file_path, media_type="application/zip", filename="annotations_export.zip"
    )


# # 📌 Mapping operator SQL untuk digunakan dalam filter
# OPERATOR_MAP = {
#     "=": lambda column, value: column == value,
#     "!=": lambda column, value: column != value,
#     "<": lambda column, value: column < value,
#     ">": lambda column, value: column > value,
#     "<=": lambda column, value: column <= value,
#     ">=": lambda column, value: column >= value,
#     "is between": lambda column, values: column.between(values["min"], values["max"]),
#     "not between": lambda column, values: ~column.between(values["min"], values["max"]),
#     "is empty": lambda column, _: column.is_(None),
#     "contains": lambda column, value: column.ilike(f"%{value}%"),
#     "not contains": lambda column, value: ~column.ilike(f"%{value}%"),
#     "regex": lambda column, value: column.op("~")(value),
#     "equal": lambda column, value: column == value,
#     "not equal": lambda column, value: column != value,
#     "is": lambda column, value: column.is_(value),
#     "is before": lambda column, value: column < value,
#     "is after": lambda column, value: column > value,
# }

# # 📌 Definisi tipe kolom untuk menentukan operator yang sesuai
# COLUMN_TYPES = {
#     "upload_id": "int",
#     "confidence_score": "float",
#     "avg_confidence_score": "float",
#     "is_annotated": "bool",
#     "width": "int",
#     "height": "int",
#     "annotated_by": "string",
#     "updated_by": "string",
#     "file_url": "string",
#     "description": "text",
#     "data_type": "string",
#     "completed": "bool",
#     "created_at": "datetime",
#     "updated_at": "datetime",
# }


# @router.get("/filter-data/", summary="Filter project data based on conditions")
# def filter_project_data(
#     project_id: int = Query(..., description="Project ID to filter data for"),
#     filters: List[str] = Query(
#         [],
#         description="Filters in the format field:operator:value or field:operator:min,max. Multiple filters allowed.",
#     ),
#     payload: dict = Depends(jwt_bearer),
#     db: Session = Depends(get_db),
# ):
#     """
#     API untuk memfilter data anotasi berdasarkan berbagai kondisi.
#     """

#     user_id = payload.get("id")
#     if not user_id:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token."
#         )

#     # Validasi project
#     project = db.query(AnnotationProjectDataModel).filter_by(project_id=project_id).first()
#     if not project:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail="Annotation project not found.",
#         )

#     query = db.query(AnnotationProjectDataModel).filter(
#         AnnotationProjectDataModel.project_id == project_id
#     )

#     filter_conditions = []

#     for filter_item in filters:
#         try:
#             field, operator, *values = filter_item.split(":")
#             if field not in COLUMN_TYPES:
#                 raise ValueError(f"Invalid field: {field}")

#             column_type = COLUMN_TYPES[field]
#             column = getattr(AnnotationProjectDataModel, field, None)

#             if not column:
#                 raise ValueError(f"Invalid column: {field}")

#             # **Khusus untuk "is between" dan "not between"**
#             if operator in ["is between", "not between"]:
#                 if len(values) != 1 or "," not in values[0]:
#                     raise ValueError(f"Operator '{operator}' requires 'min,max' values.")

#                 min_value, max_value = values[0].split(",")

#                 # **Pastikan min dan max bernilai numerik jika tipe data adalah int/float**
#                 if column_type in ["int", "float"]:
#                     min_value, max_value = float(min_value), float(max_value)

#                 values = {"min": min_value, "max": max_value}

#             # **Konversi nilai berdasarkan tipe data**
#             elif column_type == "float":
#                 values = [float(v) for v in values]
#             elif column_type == "int":
#                 values = [int(v) for v in values]
#             elif column_type == "bool":
#                 values = [v.lower() == "true" for v in values]
#             elif column_type == "datetime":
#                 values = [v for v in values]  # Tidak mengubah karena akan diparse di database

#             if operator not in OPERATOR_MAP:
#                 raise ValueError(f"Invalid operator: {operator}")

#             # Gunakan operator yang sesuai
#             condition = OPERATOR_MAP[operator](column, values if isinstance(values, dict) else values[0])
#             filter_conditions.append(condition)

#         except ValueError as e:
#             raise HTTPException(
#                 status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)
#             )

#     # Tambahkan kondisi filter ke dalam query
#     if filter_conditions:
#         query = query.filter(and_(*filter_conditions))

#     # Eksekusi query
#     filtered_data = query.all()

#     return standard_response(
#         status="success",
#         status_code=status.HTTP_200_OK,
#         message_code="filtered_data_retrieved",
#         data=[{
#             "upload_id": d.id,
#             "file_url": d.file_url,
#             "description": d.description,
#             "data_type": d.data_type,
#             "completed": d.completed,
#             "avg_confidence_score": d.avg_confidence_score,
#             "is_annotated": d.is_annotated,
#             "created_at": d.created_at,
#             "updated_at": d.updated_at,
#             "metadata": {
#                 "image_metadata": {
#                     "width": d.image_metadata.width if d.image_metadata else None,
#                     "height": d.image_metadata.height if d.image_metadata else None,
#                     "image_annotations": [
#                         {
#                             "result_type": ann.result_type,
#                             "x1": ann.x1,
#                             "y1": ann.y1,
#                             "x2": ann.x2,
#                             "y2": ann.y2,
#                             "label": ann.label,
#                             "confidence_score": ann.confidence_score,
#                         }
#                         for ann in d.image_annotations
#                     ],
#                 }
#             },
#         } for d in filtered_data],
#     )
