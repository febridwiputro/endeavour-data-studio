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


class ActiveLearningModel(Base):
    __tablename__ = "active_learning_tbl"

    id = Column(Integer, primary_key=True, index=True)
    deployment_id = Column(
        Integer, ForeignKey("annotation_project_deployments_tbl.id"), nullable=False
    )
    strategy = Column(String, nullable=False)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    updated_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    deployment = relationship("AnnotationProjectDeploymentModel", back_populates="active_learning")