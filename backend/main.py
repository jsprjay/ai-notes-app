import os
from openai import OpenAI
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Depends, HTTPException, Header
from passlib.context import CryptContext
from jose import jwt, JWTError
from pydantic import BaseModel, Field
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey
from sqlalchemy.orm import sessionmaker, declarative_base, Session, relationship
from datetime import datetime, timedelta, timezone

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# FastAPI app initialization
app = FastAPI()

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500", 
        "http://localhost:4200",
        "http://127.0.0.1:4200"
        ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auth setup
SECRET_KEY = "change-this-secret-key-later"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

# Database configuration
DATABASE_URL = "sqlite:///./notes.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    notes = relationship("Note", back_populates="owner")

class Note(Base):
    __tablename__ = "notes"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="notes")

Base.metadata.create_all(bind=engine)

class UserCreate(BaseModel):
    email: str
    password: str = Field(min_length=6, max_length=72)

class UserLogin(BaseModel):
    email: str
    password: str = Field(min_length=6, max_length=72)

class NoteCreate(BaseModel):
    title: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# helper functions
def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(
    authorization: str = Header(None),
    db: Session = Depends(get_db)
):
    if authorization is None:
        raise HTTPException(status_code=401, detail="Missing authorization header")

    try:
        scheme, token = authorization.split()

        if scheme.lower() != "bearer":
            raise HTTPException(status_code=401, detail="Invalid auth scheme")

        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")

        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")

    except (JWTError, ValueError):
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.email == email).first()

    if user is None:
        raise HTTPException(status_code=401, detail="User not found")

    return user

USE_AI = False # toggle this to use AI feature

# summarizer route
@app.get("/notes/summary")
def summarize_notes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
    ):
    
    notes = db.query(Note).filter(Note.user_id == current_user.id).all()

    if not notes:
        return {"summary": "No notes to summarize."}

    text = "\n".join([str(note.title) for note in notes])

    if not USE_AI:
        return {
            "summary": f"Mock summary: You have {len(notes)} notes. Topics include {', '.join([str(n.title) for n in notes[:3]])}."
        }

    # REAL AI (only runs if USE_AI = True)
    response = client.chat.completions.create(
        model="gpt-4.1",
        messages=[
            {"role": "system", "content": "Summarize notes clearly."},
            {"role": "user", "content": text}
        ]
    )

    return {"summary": response.choices[0].message.content}

@app.get("/")
def home():
    return {"message": "Backend is working"}

# notes routes
@app.get("/notes")
def get_notes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Note).filter(Note.user_id == current_user.id).all()


@app.post("/notes")
def create_note(
    note: NoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_note = Note(title=note.title, user_id=current_user.id)

    db.add(new_note)
    db.commit()
    db.refresh(new_note)

    return new_note

@app.put("/notes/{note_id}")
def update_note(
    note_id: int,
    updated_note: NoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    note = db.query(Note).filter(
        Note.id == note_id,
        Note.user_id == current_user.id
    ).first()

    if note is None:
        raise HTTPException(status_code=404, detail="Note not found")

    for key, value in updated_note.dict().items():
        setattr(note, key, value)
    db.commit()
    db.refresh(note)

    return note

@app.delete("/notes/{note_id}")
def delete_note(
    note_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    note = db.query(Note).filter(
        Note.id == note_id,
        Note.user_id == current_user.id
    ).first()

    if note is None:
        raise HTTPException(status_code=404, detail="Note not found")

    db.delete(note)
    db.commit()

    return {"message": "Note deleted"}

# auth routes
@app.post("/auth/register")
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user_data.email).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        email=user_data.email,
        hashed_password=hash_password(user_data.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully"}

@app.post("/auth/login")
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_data.email).first()

    if not user or not verify_password(user_data.password, str(user.hashed_password)):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": user.email})

    return {
        "access_token": token,
        "token_type": "bearer"
    }