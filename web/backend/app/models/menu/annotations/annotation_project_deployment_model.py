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



# Deployment Model
class AnnotationProjectDeploymentModel(Base):
    __tablename__ = "annotation_project_deployments_tbl"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("annotation_projects_tbl.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    updated_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    project = relationship("AnnotationProjectModel", back_populates="deployments")
    deployment_tbl = relationship("DeploymentModel", back_populates="deployment")
    active_learning_tbl = relationship("ActiveLearningModel", back_populates="deployment")
