# backend/alembic/env.py

from logging.config import fileConfig
import os
from sqlalchemy import engine_from_config, pool
from alembic import context
from sqlalchemy.orm import configure_mappers
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Import Base and all models to ensure mappers are configured
from app.config.database import Base
from app.models.menu.menu_model import MenuModel
# from app.models.menu.annotations.annotate_model import AnnotateModel
# from app.models.menu.annotations.annotate_result_model import AnnotateResultModel
from app.models.menu.annotations.active_learning_model import ActiveLearningModel
from app.models.menu.annotations.annotation_project_model import AnnotationProjectModel
from app.models.menu.annotations.annotation_project_data_model import AnnotationProjectDataModel
from app.models.menu.annotations.annotation_project_deployment_model import AnnotationProjectDeploymentModel
from app.models.menu.annotations.classes_and_tags_model import ClassesAndTagsModel
from app.models.menu.annotations.dataset_model import DatasetModel
from app.models.menu.annotations.deployment_model import DeploymentModel
from app.models.menu.annotations.train_model import TrainModel
from app.models.menu.annotations.version_model import VersionModel
from app.models.user_model import UserModel, VerificationCode
from app.models.menu.annotations.models_model import ModelsModel
from app.models.menu.annotations.annotate_result_model import (
    ImageAnnotationResultModel, 
    TextAnnotationResultModel, 
    AudioAnnotationResultModel, 
    VideoAnnotationResultModel, 
    ImageMetadataModel,
    TextMetadataModel,
    AudioMetadataModel,
    VideoMetadataModel
)


# Retrieve database URL from environment variables
DATABASE_URL = (
    f"postgresql+psycopg2://{os.getenv('POSTGRES_USER')}:{os.getenv('POSTGRES_PASSWORD')}"
    f"@{os.getenv('POSTGRES_HOST')}:{os.getenv('DATABASE_PORT')}/{os.getenv('POSTGRES_DB')}"
)

# Alembic configuration
config = context.config
config.set_main_option("sqlalchemy.url", DATABASE_URL)

# Logging configuration
fileConfig(config.config_file_name)

# Set target metadata for Alembic
target_metadata = Base.metadata


def run_migrations_offline():
    """Run migrations in 'offline' mode."""
    context.configure(
        url=config.get_main_option("sqlalchemy.url"),
        target_metadata=target_metadata,
        literal_binds=True,
        compare_type=True,  # Optional: Include type comparisons in migrations
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    """Run migrations in 'online' mode."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    try:
        # Check and configure mappers
        # configure_mappers()
        print("Mappers configured successfully.")
    except Exception as e:
        print(f"Error configuring mappers: {e}")
        raise

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,  # Optional: Include type comparisons in migrations
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()