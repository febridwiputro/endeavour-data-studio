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
from app.enums.modelTypeEnum import ModelTypeEnum


class ModelsModel(Base):
    __tablename__ = "models_tbl"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(
        Integer, ForeignKey("annotation_projects_tbl.id"), nullable=False
    )
    model_type = Column(
        SQLAlchemyEnum(ModelTypeEnum), nullable=False
    )  # Use Enum for model_type
    name = Column(String, nullable=False)
    api_url = Column(String, nullable=True)
    api_key = Column(String, nullable=True)
    version = Column(String, nullable=True)
    is_enable = Column(Boolean, default=False, nullable=False)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    updated_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Define relationships
    project = relationship(
        "AnnotationProjectModel",
        back_populates="models",
    )
