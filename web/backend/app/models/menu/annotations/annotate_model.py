# from sqlalchemy import (
#     Column,
#     Integer,
#     String,
#     Boolean,
#     Float,
#     JSON,
#     Text,
#     ForeignKey,
#     DateTime,
#     Enum as SQLAlchemyEnum,
# )

# from sqlalchemy.orm import relationship
# from datetime import datetime
# from app.config.database import Base


# class AnnotateModel(Base):
#     __tablename__ = "annotate_tbl"

#     id = Column(Integer, primary_key=True, index=True)
#     inner_id = Column(String, nullable=True, unique=True)
#     data_id = Column(
#         Integer, ForeignKey("annotation_project_data_tbl.id"), nullable=False
#     )
#     annotation = Column(Text, nullable=True)
#     completed = Column(Boolean, default=False)
#     annotated_by = Column(Integer, ForeignKey("users.id"), nullable=True)
#     annotation_results = Column(Text, nullable=True)
#     annotation_ids = Column(Text, nullable=True)
#     prediction_score = Column(String, nullable=True)
#     prediction_model_versions = Column(Text, nullable=True)
#     prediction_results = Column(Text, nullable=True)
#     upload_filename = Column(String, nullable=True)
#     storage_filename = Column(String, nullable=True)
#     lead_time = Column(Integer, nullable=True)
#     drafts = Column(Text, nullable=True)
#     image = Column(String, nullable=True)
#     created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
#     updated_by = Column(Integer, ForeignKey("users.id"), nullable=True)
#     created_at = Column(DateTime, default=datetime.utcnow)
#     updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

#     project_data = relationship("AnnotationProjectDataModel")