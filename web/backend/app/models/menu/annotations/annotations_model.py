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


class ClassesAndTagsModel(Base):
    __tablename__ = "classes_and_tags_tbl"

    id = Column(Integer, primary_key=True, index=True)
    data_id = Column(
        Integer, ForeignKey("annotation_project_data_tbl.id"), nullable=False
    )
    tag_name = Column(String, nullable=False)


class DatasetModel(Base):
    __tablename__ = "dataset_tbl"

    id = Column(Integer, primary_key=True, index=True)
    data_id = Column(
        Integer, ForeignKey("annotation_project_data_tbl.id"), nullable=False
    )
    name = Column(String, nullable=False)


class DeploymentModel(Base):
    __tablename__ = "deployment_tbl"

    id = Column(Integer, primary_key=True, index=True)
    deployment_id = Column(
        Integer, ForeignKey("annotation_project_deployments_tbl.id"), nullable=False
    )
    status = Column(String, nullable=False)


class ModelsModel(Base):
    __tablename__ = "models_tbl"

    id = Column(Integer, primary_key=True, index=True)
    model_id = Column(
        Integer, ForeignKey("annotation_project_models_tbl.id"), nullable=False
    )
    model_type = Column(String, nullable=False)  # in_model or ex_model
    name = Column(String, nullable=False)


class TrainModel(Base):
    __tablename__ = "train_tbl"

    id = Column(Integer, primary_key=True, index=True)
    data_id = Column(
        Integer, ForeignKey("annotation_project_data_tbl.id"), nullable=False
    )
    status = Column(String, nullable=False)


# Upload Data Model
class UploadDataModel(Base):
    __tablename__ = "upload_data_tbl"

    id = Column(Integer, primary_key=True, index=True)
    data_id = Column(
        Integer, ForeignKey("annotation_project_data_tbl.id"), nullable=False
    )
    file_name = Column(String, nullable=False)
    uploaded_at = Column(DateTime, default=datetime.utcnow)


# Version Model
class VersionModel(Base):
    __tablename__ = "version_tbl"

    id = Column(Integer, primary_key=True, index=True)
    data_id = Column(
        Integer, ForeignKey("annotation_project_data_tbl.id"), nullable=False
    )
    version_number = Column(String, nullable=False)


class ActiveLearningModel(Base):
    __tablename__ = "active_learning_tbl"

    id = Column(Integer, primary_key=True, index=True)
    deployment_id = Column(
        Integer, ForeignKey("annotation_project_deployments_tbl.id"), nullable=False
    )
    strategy = Column(String, nullable=False)