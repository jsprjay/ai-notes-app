import os
from openai import OpenAI
from dotenv import load_dotenv
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker, declarative_base, Session

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# FastAPI app initialization
app = FastAPI()

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500", "http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

USE_AI = False # toggle this to use AI feature

# summarizer route
@app.get("/notes/summary")
def summarize_notes(db: Session = Depends(get_db)):
    notes = db.query(Note).all()

    if not notes:
        return {"summary": "No notes to summarize."}

    text = "\n".join([note.title for note in notes])

    if not USE_AI:
        return {
            "summary": f"Mock summary: You have {len(notes)} notes. Topics include {', '.join([n.title for n in notes[:3]])}."
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

@app.get("/notes")
def get_notes(db: Session = Depends(get_db)):
    notes = db.query(Note).all()
    return notes

@app.post("/notes")
def create_note(note: dict, db: Session = Depends(get_db)):
    new_note = Note(title=note["title"])
    db.add(new_note)
    db.commit()
    db.refresh(new_note)
    return new_note

@app.delete("/notes/{note_id}")
def delete_note(note_id: int, db: Session = Depends(get_db)):
    note = db.query(Note).filter(Note.id == note_id).first()

    if note is None:
        return {"message": "Note not found"}

    db.delete(note)
    db.commit()

    return {"message": "Note deleted"}

@app.put("/notes/{note_id}")
def update_note(note_id: int, updated_note: dict, db: Session = Depends(get_db)):
    note = db.query(Note).filter(Note.id == note_id).first()

    if note is None:
        return {"message": "Note not found"}

    note.title = updated_note["title"]
    db.commit()
    db.refresh(note)

    return note
