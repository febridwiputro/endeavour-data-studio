# from sqlalchemy import (
#     Column,
#     Integer,
#     String,
#     Boolean,
#     ForeignKey,
#     DateTime,
#     Text,
#     Enum as SQLAlchemyEnum,
# )
# from sqlalchemy.orm import relationship
# from datetime import datetime
# from app.config.database import Base
# from app.enums.annotation_type_enum import AnnotationType


# class AnnotationProjectModel(Base):
#     __tablename__ = "annotation_projects_tbl"

#     id = Column(Integer, primary_key=True, index=True)
#     name = Column(String, nullable=False, unique=True)
#     description = Column(Text, nullable=True)
#     annotation_type = Column(SQLAlchemyEnum(AnnotationType), nullable=False)
#     menu_id = Column(Integer, ForeignKey("menu_tbl.id"), nullable=False)
#     created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
#     updated_by = Column(Integer, ForeignKey("users.id"), nullable=True)
#     created_at = Column(DateTime, default=datetime.utcnow)
#     updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

#     # Relationships
#     models = relationship(
#         "AnnotationProjectModelManagement",
#         back_populates="project",  # Match the 'project' in AnnotationProjectModelManagement
#         cascade="all, delete-orphan",
#         lazy="selectin",
#     )

#     menu = relationship("MenuModel", back_populates="annotation_projects")
#     data = relationship(
#         "AnnotationProjectDataModel",
#         back_populates="project",
#         cascade="all, delete-orphan",
#     )

#     deployments = relationship(
#         "AnnotationProjectDeploymentModel",
#         back_populates="project",
#         cascade="all, delete-orphan",
#     )


# from sqlalchemy import (
#     Column,
#     Integer,
#     String,
#     Boolean,
#     ForeignKey,
#     DateTime,
#     Text,
#     Enum as SQLAlchemyEnum,
# )
# from sqlalchemy.orm import relationship
# from datetime import datetime
# from app.config.database import Base
# from app.enums.annotation_type_enum import AnnotationType

# class AnnotationProjectModel(Base):
#     __tablename__ = "annotation_projects_tbl"

#     id = Column(Integer, primary_key=True, index=True)
#     name = Column(String, nullable=False, unique=True)
#     description = Column(Text, nullable=True)
#     annotation_type = Column(SQLAlchemyEnum(AnnotationType), nullable=False)
#     project_photo_url = Column(String, nullable=True)
#     menu_id = Column(Integer, ForeignKey("menu_tbl.id"), nullable=False)
#     created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
#     updated_by = Column(Integer, ForeignKey("users.id"), nullable=True)
#     is_active = Column(Boolean, default=True)
#     created_at = Column(DateTime, default=datetime.utcnow)
#     updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

#     menu = relationship("MenuModel", back_populates="annotation_projects")
#     data = relationship("AnnotationProjectDataModel", back_populates="project")
#     models = relationship("AnnotationProjectModelManagement", back_populates="project")
#     deployments = relationship("AnnotationProjectDeploymentModel", back_populates="project")
