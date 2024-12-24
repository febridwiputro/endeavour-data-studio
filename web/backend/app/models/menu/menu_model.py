# from sqlalchemy import (
#     Column,
#     Integer,
#     String,
#     Boolean,
#     JSON,
#     Text,
#     ForeignKey,
#     DateTime,
#     Enum as SQLAlchemyEnum,
# )
# from sqlalchemy.orm import relationship
# from datetime import datetime
# from app.config.database import Base
# from app.enums.menus_type_enum import MenusType


# class MenuModel(Base):
#     __tablename__ = "menu_tbl"

#     id = Column(Integer, primary_key=True, index=True)
#     name = Column(String, nullable=False, unique=True)
#     description = Column(Text, nullable=True)
#     type = Column(SQLAlchemyEnum(MenusType), nullable=False)
#     is_active = Column(Boolean, default=True)
#     menu_metadata = Column(JSON, nullable=True)
#     logo_url = Column(String, nullable=True)
#     created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
#     updated_by = Column(Integer, ForeignKey("users.id"), nullable=True)
#     created_at = Column(DateTime, default=datetime.utcnow)
#     updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

#     # Hubungan ke AnnotationProjectModel
#     annotation_projects = relationship(
#         "AnnotationProjectModel",
#         back_populates="menu",
#         lazy="selectin",
#         cascade="all, delete-orphan",
#     )


# from sqlalchemy import (
#     Column,
#     Integer,
#     String,
#     Boolean,
#     JSON,
#     Text,
#     ForeignKey,
#     DateTime,
#     Enum as SQLAlchemyEnum,
# )
# from sqlalchemy.orm import relationship
# from datetime import datetime
# from app.config.database import Base
# from app.enums.menus_type_enum import MenusType


# class MenuModel(Base):
#     __tablename__ = "menu_tbl"

#     id = Column(Integer, primary_key=True, index=True)
#     name = Column(String, nullable=False, unique=True)
#     description = Column(Text, nullable=True)
#     type = Column(SQLAlchemyEnum(MenusType), nullable=False)
#     is_active = Column(Boolean, default=True)
#     menu_metadata = Column(JSON, nullable=True)  # Rename from `metadata` to `menu_metadata`
#     logo_url = Column(String, nullable=True)
#     created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
#     updated_by = Column(Integer, ForeignKey("users.id"), nullable=True)
#     created_at = Column(DateTime, default=datetime.utcnow)
#     updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


# annotation_projects = relationship("AnnotationProjectModel", back_populates="menu", lazy="selectin")