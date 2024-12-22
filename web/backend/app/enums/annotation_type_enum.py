from enum import Enum

class AnnotationType(str, Enum):
    COMPUTER_VISION = "Computer Vision"
    NLP = "Natural Language Processing (NLP)"
    AUDIO = "Audio"
    CONVERSATIONAL_AI = "Conversational AI"
    RANKING_SCORING = "Ranking & Scoring"
    STRUCTURED_DATA_PARSING = "Structured Data Parsing"
    TIME_SERIES_ANALYSIS = "Time Series Analysis"
    VIDEO = "Video"
    GENERATIVE_AI = "Generative AI" 