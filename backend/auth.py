from fastapi import FastAPI, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from passlib.context import CryptContext

app = FastAPI()

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Password hashing setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Simulated user database (In real-world use a proper database)
fake_db = {}

@app.post("/signup")
async def signup(
    username: str = Form(...), email: str = Form(...), password: str = Form(...)
):
    if username in fake_db:
        raise HTTPException(status_code=400, detail="Username already exists")

    hashed_password = pwd_context.hash(password)  # Hash the password
    fake_db[username] = {"email": email, "password": hashed_password}

    return {"message": f"User {username} signed up successfully!"}

@app.post("/login")
async def login(username: str = Form(...), password: str = Form(...)):
    user = fake_db.get(username)

    if not user or not pwd_context.verify(password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {"message": f"Welcome back, {username}!"}
