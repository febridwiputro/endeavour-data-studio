# from enum import Enum
# from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Enum as SQLAlchemyEnum, DateTime, Text, JSON
# from datetime import datetime
# from app.config.database import Base
# from app.enums.annotation_type_enum import AnnotationType
# from app.enums.annotation_status_enum import AnnotationStatus

# # Base Models
# class Annotation(Base):
#     __tablename__ = "annotations"

#     id = Column(Integer, primary_key=True, index=True)
#     name = Column(String, nullable=False, unique=True)
#     description = Column(Text, nullable=True)
#     type = Column(SQLAlchemyEnum(AnnotationType), nullable=False)
#     created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
#     logo_url = Column(String, nullable=True)
#     status = Column(SQLAlchemyEnum(AnnotationStatus), default=AnnotationStatus.ACTIVE)
#     created_at = Column(DateTime, default=datetime.utcnow)
#     updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# class AnnotationFeature(Base):
#     __tablename__ = "annotation_features"

#     id = Column(Integer, primary_key=True, index=True)
#     annotation_id = Column(Integer, ForeignKey("annotations.id"), nullable=False)
#     name = Column(String, nullable=False)
#     description = Column(Text, nullable=True)
#     level = Column(Integer, nullable=False, default=1)
#     parent_id = Column(Integer, ForeignKey("annotation_features.id"), nullable=True)
#     metadata = Column(JSON, nullable=True)
#     logo_url = Column(String, nullable=True)
#     created_at = Column(DateTime, default=datetime.utcnow)
#     updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# class AnnotationTask(Base):
#     __tablename__ = "annotation_tasks"

#     id = Column(Integer, primary_key=True, index=True)
#     annotation_id = Column(Integer, ForeignKey("annotations.id"), nullable=False)
#     name = Column(String, nullable=False)
#     description = Column(Text, nullable=True)
#     assigned_to = Column(Integer, ForeignKey("users.id"), nullable=True)
#     status = Column(SQLAlchemyEnum(AnnotationStatus), default=AnnotationStatus.PENDING)
#     created_at = Column(DateTime, default=datetime.utcnow)
#     updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# class AnnotationResult(Base):
#     __tablename__ = "annotation_results"

#     id = Column(Integer, primary_key=True, index=True)
#     task_id = Column(Integer, ForeignKey("annotation_tasks.id"), nullable=False)
#     result_data = Column(JSON, nullable=False)
#     reviewer_id = Column(Integer, ForeignKey("users.id"), nullable=True)
#     review_status = Column(SQLAlchemyEnum(AnnotationStatus), default=AnnotationStatus.UNREVIEWED)
#     created_at = Column(DateTime, default=datetime.utcnow)
#     updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)