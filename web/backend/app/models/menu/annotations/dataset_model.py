from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.config.database import Base

class DatasetModel(Base):
    __tablename__ = "dataset_tbl"

    id = Column(Integer, primary_key=True, index=True)
    data_id = Column(Integer, ForeignKey("annotation_project_data_tbl.id"), nullable=False)
    name = Column(String, nullable=False)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    updated_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Use string-based relationships
    project_data = relationship("AnnotationProjectDataModel", back_populates="datasets")
