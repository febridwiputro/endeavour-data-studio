from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config.config import settings
from sqlalchemy.exc import OperationalError

DATABASE_URL = f"postgresql://{settings.POSTGRES_USER}:{settings.POSTGRES_PASSWORD}@{settings.POSTGRES_HOST}:{settings.DATABASE_PORT}/{settings.POSTGRES_DB}"

# Create engine and session
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

# Check database connection
try:
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))  # Use sqlalchemy.text
        print("Database is connected successfully.")
except OperationalError as e:
    print("Failed to connect to the database.")
    print(f"Error: {e}")

# query = text(""" 
#     SELECT *
#     FROM pg_catalog.pg_tables
#     WHERE schemaname != 'pg_catalog' AND 
#         schemaname != 'information_schema';""")


# with engine.connect() as conn:
#         with conn.begin():
#             result = conn.execute(query)


# for row in result:
#     print(row)

# Dependency to provide database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
