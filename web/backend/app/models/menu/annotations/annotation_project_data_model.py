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
from app.enums.dataTypeEnum import DataTypeEnum
from app.config.database import Base


class AnnotationProjectDataModel(Base):
    __tablename__ = "annotation_project_data_tbl"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("annotation_projects_tbl.id"), nullable=False)
    file_name = Column(String, nullable=False)
    file_url = Column(Text, nullable=True)
    description = Column(Text, nullable=True)
    data_type = Column(SQLAlchemyEnum(DataTypeEnum), nullable=False)
    drafts = Column(Text, nullable=True)
    completed = Column(Boolean, default=False)
    avg_confidence_score = Column(Float, nullable=True, default=0.0)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    updated_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    project = relationship("AnnotationProjectModel", back_populates="project_data")
    datasets = relationship("DatasetModel", back_populates="project_data")
    training = relationship("TrainModel", back_populates="project_data")
    versions = relationship("VersionModel", back_populates="project_data")

    # Relasi dengan tabel hasil anotasi
    image_annotations = relationship(
        "ImageAnnotationResultModel",
        back_populates="project_data",
        cascade="all, delete-orphan",
    )
    text_annotations = relationship(
        "TextAnnotationResultModel",
        back_populates="project_data",
        cascade="all, delete-orphan",
    )
    audio_annotations = relationship(
        "AudioAnnotationResultModel",
        back_populates="project_data",
        cascade="all, delete-orphan",
    )
    video_annotations = relationship(
        "VideoAnnotationResultModel",
        back_populates="project_data",
        cascade="all, delete-orphan",
    )

    # Relasi metadata
    image_metadata = relationship(
        "ImageMetadataModel",
        back_populates="project_data",
        cascade="all, delete-orphan",
        uselist=False,
    )
    audio_metadata = relationship(
        "AudioMetadataModel",
        back_populates="project_data",
        cascade="all, delete-orphan",
        uselist=False,
    )
    text_metadata = relationship(
        "TextMetadataModel",
        back_populates="project_data",
        cascade="all, delete-orphan",
        uselist=False,
    )
    video_metadata = relationship(
        "VideoMetadataModel",
        back_populates="project_data",
        cascade="all, delete-orphan",
        uselist=False,
    )



# from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
# from sqlalchemy.orm import relationship
# from datetime import datetime
# from app.config.database import Base

# class AnnotationProjectDataModel(Base):
#     __tablename__ = "annotation_project_data_tbl"

#     id = Column(Integer, primary_key=True, index=True)
#     project_id = Column(Integer, ForeignKey("annotation_projects_tbl.id"), nullable=False)
#     file_name = Column(String, nullable=False)
#     img_url = Column(Text, nullable=True)
#     description = Column(Text, nullable=True)
#     created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
#     updated_by = Column(Integer, ForeignKey("users.id"), nullable=True)
#     created_at = Column(DateTime, default=datetime.utcnow)
#     updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

#     # Use string-based relationships
#     project = relationship("AnnotationProjectModel", back_populates="project_data")
#     datasets = relationship("DatasetModel", back_populates="project_data")
#     training = relationship("TrainModel", back_populates="project_data")
#     versions = relationship("VersionModel", back_populates="project_data")