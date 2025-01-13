from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    Float,
    JSON,
    Text,
    ForeignKey,
    DateTime,
    Enum as SQLAlchemyEnum,
)

from sqlalchemy.orm import relationship
from datetime import datetime
from app.config.database import Base
from app.models.menu.annotations.annotation_feature_model import AnnotationFeatureModel


class SubFeature1Model(Base):
    __tablename__ = "sub_feature_1_tbl"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    feature_id = Column(
        Integer, ForeignKey("annotation_feature_tbl.id"), nullable=False
    )
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    updated_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    feature = relationship("AnnotationFeatureModel", back_populates="sub_features")
    sub_features_2 = relationship(
        "SubFeature2Model", back_populates="sub_feature_1", lazy="joined"
    )