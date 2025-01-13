from enum import Enum

class UploadType(str, Enum):
    BY_FOLDER = "BY_FOLDER"
    BY_MULTIPLE_DATA = "BY_MULTIPLE_DATA"
    BY_DATA_URL = "BY_DATA_URL"
    BY_FOLDER_PATH = "BY_FOLDER_PATH"
    BY_DATA_PATH = "BY_DATA_PATH"


# from enum import Enum

# class UploadType(str, Enum):
#     by_folder = "by_folder"
#     by_multiple_image = "by_multiple_image"
#     by_image_url = "by_image_url"
#     by_folder_path = "by_folder_path"
#     by_image_path = "by_image_path"