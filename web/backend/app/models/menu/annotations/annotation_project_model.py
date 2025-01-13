from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    ForeignKey,
    DateTime,
    Enum as SQLAlchemyEnum,
)

from sqlalchemy.orm import relationship
from datetime import datetime
from app.config.database import Base
from app.models.menu.annotations.annotation_sub_feature_2_model import SubFeature2Model
from app.models.menu.annotations.annotation_project_data_model import AnnotationProjectDataModel


class AnnotationProjectModel(Base):
    __tablename__ = "annotation_projects_tbl"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    project_photo_url = Column(String, nullable=True)
    sub_feature_2_id = Column(
        Integer, ForeignKey("sub_feature_2_tbl.id"), nullable=True
    )
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    updated_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    sub_feature_2 = relationship("SubFeature2Model", lazy="joined")
    project_data = relationship(
        "AnnotationProjectDataModel", back_populates="project", lazy="joined"
    )
    tags = relationship(
        "ClassesAndTagsModel",
        back_populates="project"
    )
    models = relationship("ModelsModel", back_populates="project")
    deployments = relationship(
        "AnnotationProjectDeploymentModel", back_populates="project"
    )