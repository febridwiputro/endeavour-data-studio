from enum import Enum

class UploadType(str, Enum):
    by_folder = "by_folder"
    by_multiple_image = "by_multiple_image"
    by_image_url = "by_image_url"
    by_folder_path = "by_folder_path"
    by_image_path = "by_image_path"
