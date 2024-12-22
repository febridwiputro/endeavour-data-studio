from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    Float,
    ForeignKey,
    DateTime,
    Text,
    JSON,
    Enum as SQLAlchemyEnum,
)
from sqlalchemy.orm import relationship
from datetime import datetime
from app.config.database import Base


class AnnotationProjectDataModel(Base):
    __tablename__ = "annotation_project_data_tbl"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("annotation_projects_tbl.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    updated_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    project = relationship("AnnotationProjectModel", back_populates="data")
    upload_data = relationship("UploadDataModel", back_populates="data")
    annotate = relationship("AnnotateModel", back_populates="data")
    dataset = relationship("DatasetModel", back_populates="data")
    version = relationship("VersionModel", back_populates="data")
    train = relationship("TrainModel", back_populates="data")
    classes_and_tags = relationship("ClassesAndTagsModel", back_populates="data")
