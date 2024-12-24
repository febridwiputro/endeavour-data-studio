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


# class ModelsModel(Base):
#     __tablename__ = "models_tbl"

#     id = Column(Integer, primary_key=True, index=True)
#     model_id = Column(Integer, ForeignKey("annotation_project_models_tbl.id"), nullable=False)
#     model_type = Column(String, nullable=False)  # in_model or ex_model
#     name = Column(String, nullable=False)

#     model = relationship("AnnotationProjectModelManagement", back_populates="models")
