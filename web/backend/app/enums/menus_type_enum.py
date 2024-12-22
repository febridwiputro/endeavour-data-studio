from enum import Enum

class MenusType(str, Enum):
    ANNOTATIONS = "Annotations"
    VIDEO_EDITOR = "Video Editor"
    IMAGE_EDITOR = "Image Editor"
    TEXT_EDITOR = "Text Editor"
    AUDIO_EDITOR = "Audio Editor"
    DATASET_SPLIT = "Dataset Split"
    DOCUMENT_EDITOR = "Document Editor"
    JSON_EDITOR = "JSON Editor"
    URL_EXTRACTOR = "URL Extractor"
    IMAGE_COLOR_PICKER = "Image Color Picker"
    REGEX_EDITOR = "Regex Editor"
    CRYPTOGRAPHY_GENERATOR = "Cryptography Generator"