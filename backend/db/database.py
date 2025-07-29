from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from pathlib import Path
from core.config import settings

from dotenv import load_dotenv

load_dotenv()

project_root = Path(__file__).resolve().parent.parent.parent
database_path = project_root / 'backend' / 'database.db'

database_url = f"sqlite:///{database_path}"

engine = create_engine(database_url)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables():
    Base.metadata.create_all(bind=engine)