from fastapi import FastAPI, HTTPException, Form, Request, Depends
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse, RedirectResponse
from pydantic import BaseModel
from passlib.context import CryptContext
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy import Column, String
from sqlalchemy.future import select
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres@/postgres")

engine = create_async_engine(DATABASE_URL, echo=True)
AsyncSessionLocal = sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()

# Define the User model
class User(Base):
    __tablename__ = "users"
    username = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
app = FastAPI()
templates = Jinja2Templates(directory="templates")

async def get_db():
    async with AsyncSessionLocal() as db:
        yield db

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

@app.on_event("startup")
async def startup_event():
    await init_db()

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("home.html", {"request": request})

@app.get("/signup", response_class=HTMLResponse)
async def signup_form(request: Request):
    return templates.TemplateResponse("signup.html", {"request": request})

@app.post("/signup")
async def create_user(username: str = Form(...), email: str = Form(...), password: str = Form(...), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).filter_by(username=username))
    existing_user = result.scalars().first()

    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    new_user = User(username=username, email=email, password=hash_password(password))
    db.add(new_user)
    await db.commit()
    return RedirectResponse(url="/login", status_code=303)

@app.get("/login", response_class=HTMLResponse)
async def login_form(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

@app.post("/login")
async def login(username: str = Form(...), password: str = Form(...), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).filter_by(username=username))
    user = result.scalars().first()

    if not user or not verify_password(password, user.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    return RedirectResponse(url="/welcome", status_code=303)

@app.get("/welcome", response_class=HTMLResponse)
async def welcome(request: Request):
    return templates.TemplateResponse("welcome.html", {"request": request})
