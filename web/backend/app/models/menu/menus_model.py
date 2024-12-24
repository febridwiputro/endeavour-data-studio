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
from app.enums.menus_type_enum import MenusType
from app.enums.annotation_type_enum import AnnotationType
from app.enums.annotateResultTypeEnum import AnnotateResultTypeEnum


class MenuModel(Base):
    __tablename__ = "menu_tbl"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)
    description = Column(Text, nullable=True)
    # type = Column(SQLAlchemyEnum(MenusType), nullable=False)
    type = Column(String, nullable=False) 
    is_active = Column(Boolean, default=True)
    menu_metadata = Column(JSON, nullable=True)
    logo_url = Column(String, nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    updated_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Hubungan ke AnnotationProjectModel
    annotation_projects = relationship(
        "AnnotationProjectModel",
        back_populates="menu",
        lazy="selectin",
        cascade="all, delete-orphan",
    )


class AnnotationTypeModel(Base):
    __tablename__ = "annotation_type_tbl"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)
    code_name = Column(String, nullable=False, unique=True)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    logo_url = Column(String, nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    updated_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    annotation_projects = relationship(
        "AnnotationProjectModel",
        back_populates="annotation_type_rel",
        cascade="all, delete-orphan",
        lazy="selectin",
    )


class AnnotationProjectModel(Base):
    __tablename__ = "annotation_projects_tbl"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)
    description = Column(Text, nullable=True)
    annotation_type_id = Column(
        Integer, ForeignKey("annotation_type_tbl.id"), nullable=False
    )  # Referencing the ID column of annotation_type_tbl
    menu_id = Column(Integer, ForeignKey("menu_tbl.id"), nullable=False)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    updated_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    project_photo_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    model_managements = relationship(
        "AnnotationProjectModelManagement",
        back_populates="project",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
    menu = relationship("MenuModel", back_populates="annotation_projects")
    data = relationship(
        "AnnotationProjectDataModel",
        back_populates="project",
        cascade="all, delete-orphan",
    )
    deployments = relationship(
        "AnnotationProjectDeploymentModel",
        back_populates="project",
        cascade="all, delete-orphan",
    )

    # Relationship to AnnotationTypeModel
    annotation_type_rel = relationship(
        "AnnotationTypeModel",
        back_populates="annotation_projects",
        lazy="selectin",
    )


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


class AnnotationProjectModelManagement(Base):
    __tablename__ = "annotation_project_models_tbl"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(
        Integer, ForeignKey("annotation_projects_tbl.id"), nullable=False
    )
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    updated_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Match back_populates to 'model_managements' in AnnotationProjectModel
    project = relationship(
        "AnnotationProjectModel",
        back_populates="model_managements",
        lazy="selectin",
    )
    models = relationship(
        "ModelsModel",
        back_populates="model_management",
        cascade="all, delete-orphan",
        lazy="selectin",
    )


class ActiveLearningModel(Base):
    __tablename__ = "active_learning_tbl"

    id = Column(Integer, primary_key=True, index=True)
    deployment_id = Column(
        Integer, ForeignKey("annotation_project_deployments_tbl.id"), nullable=False
    )
    strategy = Column(String, nullable=False)

    deployment = relationship(
        "AnnotationProjectDeploymentModel", back_populates="active_learning_tbl"
    )


class AnnotateModel(Base):
    __tablename__ = "annotate_tbl"

    id = Column(Integer, primary_key=True, index=True)
    inner_id = Column(String, nullable=True, unique=True)
    data_id = Column(
        Integer, ForeignKey("annotation_project_data_tbl.id"), nullable=False
    )
    annotation = Column(Text, nullable=True)
    completed = Column(Boolean, default=False)
    annotated_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    annotation_results = Column(Text, nullable=True)
    annotation_ids = Column(Text, nullable=True)
    prediction_score = Column(String, nullable=True)
    prediction_model_versions = Column(Text, nullable=True)
    prediction_results = Column(Text, nullable=True)
    upload_filename = Column(String, nullable=True)
    storage_filename = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    updated_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    lead_time = Column(Integer, nullable=True)
    drafts = Column(Text, nullable=True)
    image = Column(String, nullable=True)

    data = relationship("AnnotationProjectDataModel", back_populates="annotate")
    results = relationship("AnnotateResultModel", back_populates="annotation")


class AnnotationProjectDataModel(Base):
    __tablename__ = "annotation_project_data_tbl"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(
        Integer, ForeignKey("annotation_projects_tbl.id"), nullable=False
    )
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    updated_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Hubungan ke AnnotationProjectModel
    project = relationship(
        "AnnotationProjectModel",
        back_populates="data",
        lazy="selectin",
    )

    # Hubungan lainnya
    upload_data = relationship("UploadDataModel", back_populates="data")
    annotate = relationship("AnnotateModel", back_populates="data")
    dataset = relationship("DatasetModel", back_populates="data")
    version = relationship("VersionModel", back_populates="data")
    train = relationship("TrainModel", back_populates="data")
    classes_and_tags = relationship("ClassesAndTagsModel", back_populates="data")


# Deployment Model
class AnnotationProjectDeploymentModel(Base):
    __tablename__ = "annotation_project_deployments_tbl"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(
        Integer, ForeignKey("annotation_projects_tbl.id"), nullable=False
    )
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    updated_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    project = relationship("AnnotationProjectModel", back_populates="deployments")
    deployment_tbl = relationship("DeploymentModel", back_populates="deployment")
    active_learning_tbl = relationship(
        "ActiveLearningModel", back_populates="deployment"
    )


class ClassesAndTagsModel(Base):
    __tablename__ = "classes_and_tags_tbl"

    id = Column(Integer, primary_key=True, index=True)
    data_id = Column(
        Integer, ForeignKey("annotation_project_data_tbl.id"), nullable=False
    )
    tag_name = Column(String, nullable=False)

    data = relationship("AnnotationProjectDataModel", back_populates="classes_and_tags")


class DatasetModel(Base):
    __tablename__ = "dataset_tbl"

    id = Column(Integer, primary_key=True, index=True)
    data_id = Column(
        Integer, ForeignKey("annotation_project_data_tbl.id"), nullable=False
    )
    name = Column(String, nullable=False)

    data = relationship("AnnotationProjectDataModel", back_populates="dataset")


class DeploymentModel(Base):
    __tablename__ = "deployment_tbl"

    id = Column(Integer, primary_key=True, index=True)
    deployment_id = Column(
        Integer, ForeignKey("annotation_project_deployments_tbl.id"), nullable=False
    )
    status = Column(String, nullable=False)

    deployment = relationship(
        "AnnotationProjectDeploymentModel", back_populates="deployment_tbl"
    )


class ModelsModel(Base):
    __tablename__ = "models_tbl"

    id = Column(Integer, primary_key=True, index=True)
    model_id = Column(
        Integer, ForeignKey("annotation_project_models_tbl.id"), nullable=False
    )
    model_type = Column(String, nullable=False)  # in_model or ex_model
    name = Column(String, nullable=False)

    model_management = relationship(
        "AnnotationProjectModelManagement",
        back_populates="models",
        lazy="selectin",
    )


class TrainModel(Base):
    __tablename__ = "train_tbl"

    id = Column(Integer, primary_key=True, index=True)
    data_id = Column(
        Integer, ForeignKey("annotation_project_data_tbl.id"), nullable=False
    )
    status = Column(String, nullable=False)

    data = relationship("AnnotationProjectDataModel", back_populates="train")


# Upload Data Model
class UploadDataModel(Base):
    __tablename__ = "upload_data_tbl"

    id = Column(Integer, primary_key=True, index=True)
    data_id = Column(
        Integer, ForeignKey("annotation_project_data_tbl.id"), nullable=False
    )
    file_name = Column(String, nullable=False)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    data = relationship("AnnotationProjectDataModel", back_populates="upload_data")


# Version Model
class VersionModel(Base):
    __tablename__ = "version_tbl"

    id = Column(Integer, primary_key=True, index=True)
    data_id = Column(
        Integer, ForeignKey("annotation_project_data_tbl.id"), nullable=False
    )
    version_number = Column(String, nullable=False)

    data = relationship("AnnotationProjectDataModel", back_populates="version")


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
