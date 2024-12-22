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


# Annotation Project Model Management
class AnnotationProjectModelManagement(Base):
    __tablename__ = "annotation_project_models_tbl"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("annotation_projects_tbl.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    updated_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    project = relationship("AnnotationProjectModel", back_populates="models")
    models = relationship("ModelsModel", back_populates="model")

