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


# class TrainModel(Base):
#     __tablename__ = "train_tbl"

#     id = Column(Integer, primary_key=True, index=True)
#     data_id = Column(Integer, ForeignKey("annotation_project_data_tbl.id"), nullable=False)
#     status = Column(String, nullable=False)

#     data = relationship("AnnotationProjectDataModel", back_populates="train")

