from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    Float,
    JSON,
    Text,
    ForeignKey,
    DateTime,
    Enum as SQLAlchemyEnum,
)

from sqlalchemy.orm import relationship
from datetime import datetime
from app.config.database import Base
from app.models.menu.annotations.classes_and_tags_model import ClassesAndTagsModel
from app.models.menu.annotations.models_model import ModelsModel


class TrainModel(Base):
    __tablename__ = "train_tbl"

    id = Column(Integer, primary_key=True, index=True)
    data_id = Column(
        Integer, ForeignKey("annotation_project_data_tbl.id"), nullable=False
    )
    status = Column(String, nullable=False)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    updated_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    project_data = relationship("AnnotationProjectDataModel", back_populates="training")