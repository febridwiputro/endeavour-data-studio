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
from app.models.menu.annotations.classes_and_tags_model import ClassesAndTagsModel


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


class AnnotationProjectModel(Base):
    __tablename__ = "annotation_projects_tbl"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    project_photo_url = Column(String, nullable=True)
    sub_feature_2_id = Column(
        Integer, ForeignKey("sub_feature_2_tbl.id"), nullable=True
    )
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    updated_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    sub_feature_2 = relationship("SubFeature2Model", lazy="joined")
    project_data = relationship(
        "AnnotationProjectDataModel", back_populates="project", lazy="joined"
    )
    uploads = relationship("UploadDataModel", back_populates="project")
    tags = relationship(
        "ClassesAndTagsModel",
        back_populates="project"
    )

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

    project = relationship(
        "AnnotationProjectModel",
        back_populates="project_data",
    )
    # tags = relationship("ClassesAndTagsModel", back_populates="project_data")
    datasets = relationship("DatasetModel", back_populates="project_data")
    training = relationship("TrainModel", back_populates="project_data")
    # uploads = relationship("UploadDataModel", back_populates="project_data")
    versions = relationship("VersionModel", back_populates="project_data")


class UploadDataModel(Base):
    __tablename__ = "upload_data_tbl"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(
        Integer, ForeignKey("annotation_projects_tbl.id"), nullable=False
    )
    # data_id = Column(
    #     Integer, ForeignKey("annotation_project_data_tbl.id"), nullable=True
    # )  # Optional if not always tied to project data
    file_name = Column(String, nullable=False)
    img_url = Column(Text, nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    updated_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    project = relationship("AnnotationProjectModel", back_populates="uploads")
    # project_data = relationship("AnnotationProjectDataModel", back_populates="uploads")

class DatasetModel(Base):
    __tablename__ = "dataset_tbl"

    id = Column(Integer, primary_key=True, index=True)
    data_id = Column(
        Integer, ForeignKey("annotation_project_data_tbl.id"), nullable=False
    )
    name = Column(String, nullable=False)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    updated_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    project_data = relationship("AnnotationProjectDataModel", back_populates="datasets")


class AnnotationProjectFeatureModel(Base):
    __tablename__ = "annotation_project_features_tbl"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(
        Integer, ForeignKey("annotation_projects_tbl.id"), nullable=False
    )
    feature_name = Column(String, nullable=False)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    updated_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

  
class AnnotateResultModel(Base):
    __tablename__ = "annotate_result_tbl"

    id = Column(Integer, primary_key=True, index=True)
    annotate_id = Column(Integer, ForeignKey("annotate_tbl.id"), nullable=False)
    result_type = Column(String, nullable=False)
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

    models = relationship("ModelsModel", back_populates="project_model")

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
    lead_time = Column(Integer, nullable=True)
    drafts = Column(Text, nullable=True)
    image = Column(String, nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    updated_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    project_data = relationship("AnnotationProjectDataModel")


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

    deployments = relationship("DeploymentModel", back_populates="deployment")
    active_learning = relationship("ActiveLearningModel", back_populates="deployment")


class DeploymentModel(Base):
    __tablename__ = "deployment_tbl"

    id = Column(Integer, primary_key=True, index=True)
    deployment_id = Column(
        Integer, ForeignKey("annotation_project_deployments_tbl.id"), nullable=False
    )
    status = Column(String, nullable=False)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    updated_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    deployment = relationship("AnnotationProjectDeploymentModel", back_populates="deployments")


class ModelsModel(Base):
    __tablename__ = "models_tbl"

    id = Column(Integer, primary_key=True, index=True)
    model_id = Column(
        Integer, ForeignKey("annotation_project_models_tbl.id"), nullable=False
    )
    model_type = Column(String, nullable=False)  # in_model or ex_model
    name = Column(String, nullable=False)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    updated_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    project_model = relationship("AnnotationProjectModelManagement", back_populates="models")


class TrainModel(Base):
    __tablename__ = "train_tbl"

    id = Column(Integer, primary_key=True, index=True)
    data_id = Column(
        Integer, ForeignKey("annotation_project_data_tbl.id"), nullable=False
    )
    status = Column(String, nullable=False)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    updated_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    project_data = relationship("AnnotationProjectDataModel", back_populates="training")


# Version Model
class VersionModel(Base):
    __tablename__ = "version_tbl"

    id = Column(Integer, primary_key=True, index=True)
    data_id = Column(
        Integer, ForeignKey("annotation_project_data_tbl.id"), nullable=False
    )
    version_number = Column(String, nullable=False)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    updated_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    project_data = relationship("AnnotationProjectDataModel", back_populates="versions")


class ActiveLearningModel(Base):
    __tablename__ = "active_learning_tbl"

    id = Column(Integer, primary_key=True, index=True)
    deployment_id = Column(
        Integer, ForeignKey("annotation_project_deployments_tbl.id"), nullable=False
    )
    strategy = Column(String, nullable=False)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    updated_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    deployment = relationship("AnnotationProjectDeploymentModel", back_populates="active_learning")
