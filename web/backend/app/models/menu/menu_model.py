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


class MenuModel(Base):
    __tablename__ = "menu_tbl"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    menu_metadata = Column(JSON, nullable=True)
    logo_url = Column(String, nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    updated_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    annotation_features = relationship(
        "AnnotationFeatureModel", back_populates="menu", lazy="joined"
    )