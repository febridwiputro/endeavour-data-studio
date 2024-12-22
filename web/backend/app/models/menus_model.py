# from enum import Enum
# from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Enum as SQLAlchemyEnum, DateTime, Text, JSON
# from datetime import datetime
# from app.config.database import Base
# from web.backend.app.enums.menus_type_enum import FeatureType


# class Feature(Base):
#     __tablename__ = "features"

#     id = Column(Integer, primary_key=True, index=True)
#     name = Column(String, nullable=False, unique=True)
#     description = Column(Text, nullable=True)
#     type = Column(SQLAlchemyEnum(FeatureType), nullable=False)
#     is_active = Column(Boolean, default=True)
#     metadata = Column(JSON, nullable=True)
#     logo_url = Column(String, nullable=True)
#     created_at = Column(DateTime, default=datetime.utcnow)
#     updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# class SubFeature(Base):
#     __tablename__ = "sub_features"

#     id = Column(Integer, primary_key=True, index=True)
#     feature_id = Column(Integer, ForeignKey("features.id"), nullable=False)
#     name = Column(String, nullable=False)
#     description = Column(Text, nullable=True)
#     level = Column(Integer, default=1)
#     parent_id = Column(Integer, ForeignKey("sub_features.id"), nullable=True)
#     metadata = Column(JSON, nullable=True)
#     is_active = Column(Boolean, default=True)
#     logo_url = Column(String, nullable=True)
#     created_at = Column(DateTime, default=datetime.utcnow)
#     updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
