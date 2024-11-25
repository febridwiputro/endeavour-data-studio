from app.data.features_annotations import features_annotations
from app.data.features_annotations import features_annotations_computer_vision

import logging

def get_annotations():
    """
    Retrieve all annotations data.
    """
    return features_annotations


def get_annotation_by_name(annotation_name: str):
    """
    Retrieve a specific annotation by its name.

    Args:
        annotation_name (str): Name of the annotation.

    Returns:
        dict: The annotation data if found.

    Raises:
        HTTPException: If no annotation with the given name exists.
    """
    if features_annotations["name"].lower() == annotation_name.lower():
        return features_annotations

    for feature in features_annotations.get("features", []):
        if feature["name"].lower() == annotation_name.lower():
            return feature

    return None

def get_annotations_computer_vision():
    """
    Retrieve all annotation computer vision data.
    """
    return features_annotations_computer_vision