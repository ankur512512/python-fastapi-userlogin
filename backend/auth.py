import os
from fastapi import FastAPI, Form, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import declarative_base, sessionmaker
from passlib.context import CryptContext
from prometheus_fastapi_instrumentator import Instrumentator
from sqlalchemy import Column, String
from sqlalchemy.future import select
from contextlib import asynccontextmanager


app = FastAPI()
Instrumentator().instrument(app).expose(app)

# Frontend URL
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres@localhost:5432/postgres")
engine = create_async_engine(DATABASE_URL)
Base = declarative_base()

# Define User model
class User(Base):
    __tablename__ = "users"

    username = Column(String, primary_key=True)
    email = Column(String, unique=True)
    password = Column(String)

# Create a session factory
async_session = sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

# Dependency to get the database session
async def get_db():
    async with async_session() as session:
        yield session

# Password hashing setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Ensure tables are created in the database
@app.on_event("startup")
async def startup_event():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@app.post("/api/signup")
async def signup(
    username: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    db: AsyncSession = Depends(get_db)
):
    # Validate empty fields
    if not username.strip():
        raise HTTPException(status_code=400, detail="Username cannot be empty")
    if not email.strip():
        raise HTTPException(status_code=400, detail="Email cannot be empty")
    if not password.strip():
        raise HTTPException(status_code=400, detail="Password cannot be empty")

    # Check if user already exists
    result = await db.execute(User.__table__.select().where(User.username == username))
    existing_user = result.scalar_one_or_none()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    # Check for existing email
    result = await db.execute(User.__table__.select().where(User.email == email))
    existing_email = result.scalar_one_or_none()
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = pwd_context.hash(password)  # Hash the password
    new_user = User(username=username, email=email, password=hashed_password)
    db.add(new_user)
    await db.commit()
    return {"message": f"User {username} signed up successfully!"}

@app.post("/api/login")
async def login(
    username: str = Form(...),
    password: str = Form(...),
    db: AsyncSession = Depends(get_db)
):
    if not username.strip() or not password.strip():
        raise HTTPException(status_code=400, detail="Username and password are required")

    stmt = select(User).where(User.username == username)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()

    if not user or not pwd_context.verify(password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {"message": f"Welcome back, {username}!"}

@app.get("/health/readiness")
async def readiness():
    return {"status": "ready"}

@app.get("/health/liveness")
async def liveness(db: AsyncSession = Depends(get_db)):
    try:
        await db.execute(select(User).limit(1))
        return {"status": "ready"}
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Database Service not ready: {str(e)}")
