import os
from datetime import datetime
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import String, Float, Boolean, JSON, DateTime, Integer

# Database Configuration
DATABASE_URL = "sqlite+aiosqlite:///./firewall_logs.db"

# Engine Setup
engine = create_async_engine(DATABASE_URL, echo=False)

# Session Factory
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# Base Class
class Base(DeclarativeBase):
    pass

# Logs Model
class LogEntry(Base):
    __tablename__ = "logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[str] = mapped_column(String, nullable=False)
    session_id: Mapped[str] = mapped_column(String, nullable=False)
    prompt: Mapped[str] = mapped_column(String, nullable=False)
    injection_score: Mapped[float] = mapped_column(Float, nullable=False)
    tool_score: Mapped[float] = mapped_column(Float, nullable=False)
    final_risk: Mapped[float] = mapped_column(Float, nullable=False)
    blocked: Mapped[bool] = mapped_column(Boolean, nullable=False)
    matched_categories: Mapped[list] = mapped_column(JSON, nullable=False)
    risk_level: Mapped[str] = mapped_column(String, nullable=False)
    token_count: Mapped[int] = mapped_column(Integer, nullable=False)
    request_index: Mapped[int] = mapped_column(Integer, nullable=False)
    session_risk: Mapped[float] = mapped_column(Float, nullable=False)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

# Dependency
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

# Init DB
async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
