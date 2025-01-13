from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Text,
    ForeignKey,
    DateTime,
    Boolean,
    Enum as SQLAlchemyEnum,
)
from sqlalchemy.orm import relationship
from datetime import datetime
from app.config.database import Base


class ImageAnnotationResultModel(Base):
    __tablename__ = "image_annotation_result_tbl"

    id = Column(Integer, primary_key=True, index=True)
    data_id = Column(Integer, ForeignKey("annotation_project_data_tbl.id"), nullable=False)
    result_type = Column(String, nullable=False)
    x1 = Column(Float, nullable=True)
    y1 = Column(Float, nullable=True)
    x2 = Column(Float, nullable=True)
    y2 = Column(Float, nullable=True)
    label = Column(String, nullable=True)
    confidence_score = Column(Float, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    updated_by = Column(Integer, ForeignKey("users.id"), nullable=True)

    project_data = relationship("AnnotationProjectDataModel", back_populates="image_annotations")


class TextAnnotationResultModel(Base):
    __tablename__ = "text_annotation_result_tbl"

    id = Column(Integer, primary_key=True, index=True)
    data_id = Column(Integer, ForeignKey("annotation_project_data_tbl.id"), nullable=False)
    result_type = Column(String, nullable=False)
    text_result = Column(Text, nullable=False)  # Hasil anotasi teks
    label = Column(String, nullable=True)
    confidence_score = Column(Float, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    updated_by = Column(Integer, ForeignKey("users.id"), nullable=True)

    project_data = relationship("AnnotationProjectDataModel", back_populates="text_annotations")


class AudioAnnotationResultModel(Base):
    __tablename__ = "audio_annotation_result_tbl"

    id = Column(Integer, primary_key=True, index=True)
    data_id = Column(Integer, ForeignKey("annotation_project_data_tbl.id"), nullable=False)
    result_type = Column(String, nullable=False)
    start_time = Column(Float, nullable=False)
    end_time = Column(Float, nullable=False)
    label = Column(String, nullable=True)
    confidence_score = Column(Float, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    updated_by = Column(Integer, ForeignKey("users.id"), nullable=True)

    project_data = relationship("AnnotationProjectDataModel", back_populates="audio_annotations")


class VideoAnnotationResultModel(Base):
    __tablename__ = "video_annotation_result_tbl"

    id = Column(Integer, primary_key=True, index=True)
    data_id = Column(Integer, ForeignKey("annotation_project_data_tbl.id"), nullable=False)
    result_type = Column(String, nullable=False)
    start_frame = Column(Integer, nullable=False)
    end_frame = Column(Integer, nullable=False)
    label = Column(String, nullable=True)
    confidence_score = Column(Float, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    updated_by = Column(Integer, ForeignKey("users.id"), nullable=True)

    project_data = relationship("AnnotationProjectDataModel", back_populates="video_annotations")


class ImageMetadataModel(Base):
    __tablename__ = "image_metadata_tbl"

    id = Column(Integer, primary_key=True, index=True)
    data_id = Column(Integer, ForeignKey("annotation_project_data_tbl.id"), nullable=False)
    width = Column(Integer, nullable=False)
    height = Column(Integer, nullable=False)
    format = Column(String, nullable=True)
    color_mode = Column(String, nullable=True)

    project_data = relationship("AnnotationProjectDataModel", back_populates="image_metadata")


class AudioMetadataModel(Base):
    __tablename__ = "audio_metadata_tbl"

    id = Column(Integer, primary_key=True, index=True)
    data_id = Column(Integer, ForeignKey("annotation_project_data_tbl.id"), nullable=False)
    duration = Column(Float, nullable=False)
    sample_rate = Column(Integer, nullable=False)
    channels = Column(Integer, nullable=True)
    format = Column(String, nullable=True)

    project_data = relationship("AnnotationProjectDataModel", back_populates="audio_metadata")


class TextMetadataModel(Base):
    __tablename__ = "text_metadata_tbl"

    id = Column(Integer, primary_key=True, index=True)
    data_id = Column(Integer, ForeignKey("annotation_project_data_tbl.id"), nullable=False)
    text_length = Column(Integer, nullable=False)
    language = Column(String, nullable=True)
    encoding = Column(String, nullable=True)

    project_data = relationship("AnnotationProjectDataModel", back_populates="text_metadata")


class VideoMetadataModel(Base):
    __tablename__ = "video_metadata_tbl"

    id = Column(Integer, primary_key=True, index=True)
    data_id = Column(Integer, ForeignKey("annotation_project_data_tbl.id"), nullable=False)
    duration = Column(Float, nullable=False)
    frame_rate = Column(Float, nullable=True)
    resolution = Column(String, nullable=True)
    format = Column(String, nullable=True)

    project_data = relationship("AnnotationProjectDataModel", back_populates="video_metadata")

# from sqlalchemy import (
#     Column,
#     Integer,
#     String,
#     Boolean,
#     Float,
#     JSON,
#     Text,
#     ForeignKey,
#     DateTime,
#     Enum as SQLAlchemyEnum,
# )

# from sqlalchemy.orm import relationship
# from datetime import datetime
# from app.config.database import Base


# class AnnotateResultModel(Base):
#     __tablename__ = "annotate_result_tbl"

#     id = Column(Integer, primary_key=True, index=True)
#     annotate_id = Column(Integer, ForeignKey("annotate_tbl.id"), nullable=False)
#     result_type = Column(String, nullable=False)
#     x1 = Column(Integer, nullable=True)
#     y1 = Column(Integer, nullable=True)
#     x2 = Column(Integer, nullable=True)
#     y2 = Column(Integer, nullable=True)
#     text_result = Column(Text, nullable=True)
#     label = Column(String, nullable=True)
#     confidence_score = Column(Float, nullable=True)
#     created_at = Column(DateTime, default=datetime.utcnow)
#     updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
#     created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
#     updated_by = Column(Integer, ForeignKey("users.id"), nullable=True)
