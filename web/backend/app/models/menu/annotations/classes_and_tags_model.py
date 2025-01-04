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


class ClassesAndTagsModel(Base):
    __tablename__ = "classes_and_tags_tbl"

    id = Column(Integer, primary_key=True, index=True)
    # data_id = Column(
    #     Integer, ForeignKey("annotation_project_data_tbl.id"), nullable=False
    # )
    project_id = Column(
        Integer, ForeignKey("annotation_projects_tbl.id"), nullable=False
    )
    tag_name = Column(String, nullable=True)
    class_name = Column(String, nullable=True)
    class_color = Column(String, nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    updated_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # project_data = relationship("AnnotationProjectDataModel", back_populates="tags")
    project = relationship(
        "AnnotationProjectModel",
        back_populates="tags",
    )