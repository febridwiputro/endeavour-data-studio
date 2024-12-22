from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    DateTime,
    Text,
    Float,
    Enum as SQLAlchemyEnum,
)
from sqlalchemy.orm import relationship
from datetime import datetime
from app.config.database import Base
from app.enums.annotateResultTypeEnum import AnnotateResultTypeEnum


class AnnotateResultModel(Base):
    __tablename__ = "annotate_result_tbl"

    id = Column(Integer, primary_key=True, index=True)
    annotate_id = Column(Integer, ForeignKey("annotate_tbl.id"), nullable=False)
    result_type = Column(SQLAlchemyEnum(AnnotateResultTypeEnum), nullable=False)
    x1 = Column(Integer, nullable=True)
    y1 = Column(Integer, nullable=True)
    x2 = Column(Integer, nullable=True)
    y2 = Column(Integer, nullable=True)
    text_result = Column(Text, nullable=True)
    label = Column(String, nullable=True)
    confidence_score = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    updated_by = Column(Integer, ForeignKey("users.id"), nullable=True)

    annotation = relationship("AnnotateModel", back_populates="results")
