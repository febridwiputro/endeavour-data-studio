from app.data.features_video_editor import features_video_editor
from app.data.features_image_editor import features_image_editor
from app.data.features_text_editor import features_text_editor
from app.data.features_annotations import features_annotations
from app.data.features_audio_editor import features_audio_editor
from app.data.features_video_editor_2 import features_video_editor_2
from app.data.features_numeric_data_editor import features_numeric_data_editor
from app.data.features_dataset_split import features_dataset_split
from app.data.features_document_editor import features_document_editor
from app.data.features_url_extractor import features_url_extractor
from app.data.features_json_editor import features_json_editor
from app.data.features_image_color_picker import features_image_color_picker
from app.data.features_regex_editor import features_regex_editor
from app.data.features_cryptography_generator import features_cryptography_generator
# from app.data.features_

menu = {
  "menu": [
    features_annotations,
    # features_video_editor,
    features_image_editor,
    features_text_editor,
    features_audio_editor,
    features_video_editor_2,
    features_numeric_data_editor,
    features_dataset_split,
    features_document_editor,
    features_url_extractor,
    features_json_editor,
    features_image_color_picker,
    features_regex_editor,
    features_cryptography_generator
  ]
}