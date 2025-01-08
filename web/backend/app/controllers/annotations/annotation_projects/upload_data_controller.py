import os
from typing import Optional, List
from fastapi import APIRouter, HTTPException, UploadFile, Form, Depends, Request
from sqlalchemy.orm import Session
from app.config.database import get_db
from app.models.menu.annotations.annotations_model import AnnotationProjectModel, UploadDataModel
from app.utils.response_utils import standard_response, standard_pagination_response
from app.helpers.pagination_helper import paginate_query
from app.enums.uploadTypeEnum import UploadType
from app.enums.perPagesEnum import PerPageOptions
from app.utils.token_bearer_util import JWTBearer

# Create or ensure the folder exists
OUTPUT_FOLDER = "static/image_output"
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

jwt_bearer = JWTBearer()
router = APIRouter()


@router.post("/", summary="Upload Files")
async def upload_data(
    request: Request,
    project_id: int = Form(..., description="Project ID to associate the uploads."),
    upload_type: UploadType = Form(..., description="Type of upload (select from dropdown)."),
    files_upload: Optional[List[UploadFile]] = None,
    folders_upload: Optional[List[UploadFile]] = None,
    folder_path: Optional[str] = None,
    image_path: Optional[str] = None,
    image_urls: Optional[List[str]] = None,
    payload: dict = Depends(jwt_bearer),
    db: Session = Depends(get_db),
):
    created_by = payload.get("id")
    if not created_by:
        return standard_response(
            status="error",
            status_code=401,
            message_code="INVALID_OR_EXPIRED_TOKEN",
            data=None,
        )

    project = db.query(AnnotationProjectModel).filter_by(id=project_id).first()
    if not project:
        return standard_response(
            status="error",
            status_code=404,
            message_code="PROJECT_NOT_FOUND",
            data=None,
        )

    uploaded_files = []

    try:
        if upload_type == UploadType.by_multiple_image:
            if not files_upload or len(files_upload) == 0:
                return standard_response(
                    status="error",
                    status_code=400,
                    message_code="FILES_REQUIRED",
                    data=None,
                )
            for file in files_upload:
                file_path = os.path.join(OUTPUT_FOLDER, file.filename)
                with open(file_path, "wb") as f:
                    f.write(await file.read())

                # Convert URL object to string
                img_url = str(request.url_for("static", path=f"image_output/{file.filename}"))

                new_upload = UploadDataModel(
                    project_id=project_id,
                    file_name=file.filename,
                    img_url=img_url,  # Pass as string
                    created_by=created_by,
                )
                db.add(new_upload)
                db.commit()
                db.refresh(new_upload)
                uploaded_files.append({
                    "upload_id": new_upload.id,
                    "file_name": new_upload.file_name,
                    "uploaded_at": new_upload.created_at,
                    "file_path": file_path,
                    "image_url": img_url,
                })

        elif upload_type == UploadType.by_folder:
            if not folders_upload or len(folders_upload) == 0:
                return standard_response(
                    status="error",
                    status_code=400,
                    message_code="FOLDER_FILES_REQUIRED",
                    data=None,
                )
            for file in folders_upload:
                file_path = os.path.join(OUTPUT_FOLDER, file.filename)
                with open(file_path, "wb") as f:
                    f.write(await file.read())

                # Convert URL object to string
                img_url = str(request.url_for("static", path=f"image_output/{file.filename}"))

                new_upload = UploadDataModel(
                    project_id=project_id,
                    file_name=file.filename,
                    img_url=img_url,  # Pass as string
                    created_by=created_by,
                )
                db.add(new_upload)
                db.commit()
                db.refresh(new_upload)
                uploaded_files.append({
                    "upload_id": new_upload.id,
                    "file_name": new_upload.file_name,
                    "uploaded_at": new_upload.created_at,
                    "file_path": file_path,
                    "image_url": img_url,
                })

        elif upload_type == UploadType.by_image_url:
            if not image_urls or len(image_urls) == 0:
                return standard_response(
                    status="error",
                    status_code=400,
                    message_code="IMAGE_URLS_REQUIRED",
                    data=None,
                )
            for url in image_urls:
                new_upload = UploadDataModel(
                    project_id=project_id,
                    file_name=url,
                    img_url=url,  # Save the URL string directly
                    created_by=created_by,
                )
                db.add(new_upload)
                db.commit()
                db.refresh(new_upload)
                uploaded_files.append({
                    "upload_id": new_upload.id,
                    "file_name": new_upload.file_name,
                    "uploaded_at": new_upload.created_at,
                    "image_url": url,
                })

        elif upload_type == UploadType.by_folder_path:
            if not folder_path:
                return standard_response(
                    status="error",
                    status_code=400,
                    message_code="FOLDER_PATH_REQUIRED",
                    data=None,
                )
            uploaded_files.append({
                "message": f"Folder path '{folder_path}' processed successfully."
            })

        elif upload_type == UploadType.by_image_path:
            if not image_path:
                return standard_response(
                    status="error",
                    status_code=400,
                    message_code="IMAGE_PATH_REQUIRED",
                    data=None,
                )
            uploaded_files.append({
                "message": f"Image path '{image_path}' processed successfully."
            })

        else:
            return standard_response(
                status="error",
                status_code=400,
                message_code="INVALID_UPLOAD_TYPE",
                data=None,
            )
    except Exception as e:
        return standard_response(
            status="error",
            status_code=500,
            message_code="UPLOAD_PROCESSING_FAILED",
            data=str(e),
        )

    return standard_response(
        status="success",
        status_code=201,
        message_code="UPLOAD_PROCESSED_SUCCESSFULLY",
        data=uploaded_files,
    )


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

    query = db.query(UploadDataModel).filter_by(created_by=created_by)
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

    Args:
        project_id (int): The ID of the project to retrieve files for.
        request (Request): The incoming HTTP request object.
        payload (dict): JWT payload containing user info.
        db (Session): Database session dependency.

    Returns:
        dict: A standard response containing the list of uploaded files.
    """
    user_id = payload.get("id")
    if not user_id:
        return standard_response(
            status="error",
            status_code=401,
            message_code="INVALID_OR_EXPIRED_TOKEN",
            data=[],
        )

    files = db.query(UploadDataModel).filter_by(project_id=project_id).all()

    if not files:
        return standard_response(
            status="error",
            status_code=404,
            message_code="FILES_NOT_FOUND",
            data=[],
        )

    response_data = [
        {
            "upload_id": file.id,
            "file_name": file.file_name,
            "img_url": file.img_url,
            "uploaded_at": file.created_at,
        }
        for file in files
    ]

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

#     query = db.query(UploadDataModel).filter_by(project_id=project_id)
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