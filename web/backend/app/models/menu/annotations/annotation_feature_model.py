from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    Text,
    ForeignKey,
    DateTime,
    Enum as SQLAlchemyEnum,
)

from sqlalchemy.orm import relationship
from datetime import datetime
from app.config.database import Base

class AnnotationFeatureModel(Base):
    __tablename__ = "annotation_feature_tbl"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)
    code_name = Column(String, nullable=False, unique=True)    
    description = Column(Text, nullable=True)
    menu_id = Column(Integer, ForeignKey("menu_tbl.id"), nullable=False)
    is_active = Column(Boolean, default=True)
    logo_url = Column(String, nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    updated_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    menu = relationship("MenuModel", back_populates="annotation_features")
    sub_features = relationship(
        "SubFeature1Model", back_populates="feature", lazy="joined"
    )
