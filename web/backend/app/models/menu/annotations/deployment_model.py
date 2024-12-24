# from sqlalchemy import (
#     Column,
#     Integer,
#     String,
#     Boolean,
#     Float,
#     ForeignKey,
#     DateTime,
#     Text,
#     JSON,
#     Enum as SQLAlchemyEnum,
# )
# from sqlalchemy.orm import relationship
# from datetime import datetime
# from app.config.database import Base


# class DeploymentModel(Base):
#     __tablename__ = "deployment_tbl"

#     id = Column(Integer, primary_key=True, index=True)
#     deployment_id = Column(Integer, ForeignKey("annotation_project_deployments_tbl.id"), nullable=False)
#     status = Column(String, nullable=False)

#     deployment = relationship("AnnotationProjectDeploymentModel", back_populates="deployment_tbl")
