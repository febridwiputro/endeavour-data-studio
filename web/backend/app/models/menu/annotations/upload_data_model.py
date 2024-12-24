# from sqlalchemy import (
#     Column,
#     Integer,
#     String,
#     Boolean,
#     Float,
#     ForeignKey,
#     DateTime,
#     Text,
#     JSON,
#     Enum as SQLAlchemyEnum,
# )
# from sqlalchemy.orm import relationship
# from datetime import datetime
# from app.config.database import Base


# # Upload Data Model
# class UploadDataModel(Base):
#     __tablename__ = "upload_data_tbl"

#     id = Column(Integer, primary_key=True, index=True)
#     data_id = Column(Integer, ForeignKey("annotation_project_data_tbl.id"), nullable=False)
#     file_name = Column(String, nullable=False)
#     uploaded_at = Column(DateTime, default=datetime.utcnow)

#     data = relationship("AnnotationProjectDataModel", back_populates="upload_data")
