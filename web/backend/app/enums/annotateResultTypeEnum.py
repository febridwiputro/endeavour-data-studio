from enum import Enum

class AnnotateResultTypeEnum(str, Enum):
    OBJECT_DETECTION = "object_detection"
    SEMANTIC_SEGMENTATION = "semantic_segmentation"
    TEXT_CLASSIFICATION = "text_classification"
    AUDIO_TRANSCRIPTION = "audio_transcription"
    AUDIO_CLASSIFICATION = "audio_classification"
    NLP_ENTITIES = "nlp_entities"