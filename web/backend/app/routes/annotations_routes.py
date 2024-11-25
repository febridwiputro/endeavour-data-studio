from fastapi import APIRouter, HTTPException
from app.services.annotations_service import (
    get_annotations,
    get_annotation_by_name,
    get_annotations_computer_vision,
)
from app.utils.response_utils import standard_response  # Import the utility

router = APIRouter()

@router.get("/", summary="Get All Annotations", description="Retrieve all annotations data.")
def fetch_annotations():
    """
    Retrieve all annotations data.
    """
    annotations = get_annotations()
    return standard_response(
        status="success",
        status_code=200,
        message_code="annotations_fetched",
        data=annotations,
    )


@router.get("/{annotation_name}", summary="Get Annotation by Name", description="Retrieve a specific annotation by its name.")
def fetch_annotation_by_name(annotation_name: str):
    """
    Retrieve a specific annotation by its name.

    Args:
        annotation_name (str): Name of the annotation.

    Returns:
        dict: The annotation data if found.

    Raises:
        HTTPException: If no annotation with the given name exists.
    """
    annotation = get_annotation_by_name(annotation_name)
    if not annotation:
        return standard_response(
            status="error",
            status_code=404,
            message_code="annotation_not_found",
            data=None,
        )
    return standard_response(
        status="success",
        status_code=200,
        message_code="annotation_fetched",
        data=annotation,
    )


@router.get("/computer_vision/", summary="Get All Computer Vision Annotations", description="Retrieve all computer vision annotations data.")
def fetch_annotations_computer_vision():
    """
    Fetch all computer vision annotations data.
    """
    annotations = get_annotations_computer_vision()
    return standard_response(
        status="success",
        status_code=200,
        message_code="computer_vision_annotations_fetched",
        data=annotations,
    )
