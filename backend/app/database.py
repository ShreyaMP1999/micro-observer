from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Simple SQLite DB in the backend folder
SQLALCHEMY_DATABASE_URL = "sqlite:///./micro_observer.db"

# check_same_thread=False is required only for SQLite
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
