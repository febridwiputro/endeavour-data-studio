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
from app.models.menu.annotations.annotation_sub_feature_model import SubFeature1Model


class SubFeature2Model(Base):
    __tablename__ = "sub_feature_2_tbl"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    sub_feature_1_id = Column(
        Integer, ForeignKey("sub_feature_1_tbl.id"), nullable=False
    )
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    updated_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    sub_feature_1 = relationship("SubFeature1Model", back_populates="sub_features_2")

