# backend/alembic/env.py

from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Import Base and all models
from app.config.database import Base
from app.models.user_model import UserModel
from app.models.menu.menu_model import MenuModel
from app.models.menu.annotations.active_learning_model import ActiveLearningModel
from app.models.menu.annotations.version_model import VersionModel
from app.models.menu.annotations.annotate_model import AnnotateModel
from app.models.menu.annotations.annotate_result_model import AnnotateResultModel
from app.models.menu.annotations.annotation_project_data_model import AnnotationProjectDataModel
from app.models.menu.annotations.annotation_project_deployment_model import AnnotationProjectDeploymentModel
from app.models.menu.annotations.annotation_project_model import AnnotationProjectModel
from app.models.menu.annotations.classes_and_tags_model import ClassesAndTagsModel
from app.models.menu.annotations.dataset_model import DatasetModel
from app.models.menu.annotations.upload_data_model import UploadDataModel
from app.models.menu.annotations.models_model import ModelsModel
from app.models.menu.annotations.deployment_model import DeploymentModel
from app.models.menu.annotations.train_model import TrainModel

# Retrieve DB URL from environment variables
DATABASE_URL = (
    f"postgresql+psycopg2://{os.getenv('POSTGRES_USER')}:{os.getenv('POSTGRES_PASSWORD')}"
    f"@{os.getenv('POSTGRES_HOST')}:{os.getenv('DATABASE_PORT')}/{os.getenv('POSTGRES_DB')}"
)

# Alembic configuration
config = context.config
config.set_main_option("sqlalchemy.url", DATABASE_URL)

# Logging configuration
fileConfig(config.config_file_name)

# Set target_metadata from Base
target_metadata = Base.metadata


def run_migrations_offline():
    """Run migrations in 'offline' mode."""
    context.configure(
        url=config.get_main_option("sqlalchemy.url"),
        target_metadata=target_metadata,
        literal_binds=True,
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

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()



# from logging.config import fileConfig
# from sqlalchemy import engine_from_config, pool
# from alembic import context
# from sqlalchemy.ext.declarative import declarative_base
# from dotenv import load_dotenv
# import os

# # Load environment variables from .env file
# load_dotenv()

# # Add your models here
# from app.models.user_model import Base

# # Retrieve DB URL from environment variables
# DATABASE_URL = f"postgresql+psycopg2://{os.getenv('POSTGRES_USER')}:{os.getenv('POSTGRES_PASSWORD')}@{os.getenv('POSTGRES_HOST')}:{os.getenv('DATABASE_PORT')}/{os.getenv('POSTGRES_DB')}"

# # Configurations
# config = context.config
# config.set_main_option("sqlalchemy.url", DATABASE_URL)

# # Interpret the config file for Python logging.
# fileConfig(config.config_file_name)

# target_metadata = Base.metadata


# def run_migrations_offline():
#     """Run migrations in 'offline' mode."""
#     context.configure(
#         url=config.get_main_option("sqlalchemy.url"),
#         target_metadata=target_metadata,
#         literal_binds=True,
#     )

#     with context.begin_transaction():
#         context.run_migrations()


# def run_migrations_online():
#     """Run migrations in 'online' mode."""
#     connectable = engine_from_config(
#         config.get_section(config.config_ini_section),
#         prefix="sqlalchemy.",
#         poolclass=pool.NullPool,
#     )

#     with connectable.connect() as connection:
#         context.configure(connection=connection, target_metadata=target_metadata)

#         with context.begin_transaction():
#             context.run_migrations()


# if context.is_offline_mode():
#     run_migrations_offline()
# else:
#     run_migrations_online()