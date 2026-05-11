# Backend (FastAPI)

This is the FastAPI backend service for the Full-Stack Notes App. The backend handles authentication, note management, AI summarization logic, database persistence, and protected API routes.

---

## 🛠 Tech Stack

* Python
* FastAPI
* SQLAlchemy
* SQLite
* JWT Authentication
* Passlib Password Hashing

---

## ✨ Features

- User registration and login
- JWT-based authentication
- Protected API routes
- CRUD operations for personal notes
- SQLite database persistence
- AI-powered note summarization (mock implementation)
- User-specific note access control
- RESTful API architecture
- Automatic interactive API documentation

---

## ▶️ Running the Backend

```bash
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Runs at:

```
http://127.0.0.1:8000
```

---

## 📄 API Documentation

FastAPI automatically generates Swagger UI documentation:

```
http://127.0.0.1:8000/docs
```

---

## 🔌 API Endpoints

| Method | Endpoint              | Description |
| ------ | --------------------- | ----------- |
| POST   | /auth/register        | Register user |
| POST   | /auth/login           | Login user |
| GET    | /notes                | Get authenticated user's notes |
| POST   | /notes                | Create a note |
| PUT    | /notes/{note_id}      | Update a note |
| DELETE | /notes/{note_id}      | Delete a note |
| GET    | /notes/summary        | Generate AI summary |

---

## 🔐 Authentication Flow

```text
Client Login Request
        ↓
FastAPI Backend
        ↓
Password Verification
        ↓
JWT Token Generation
        ↓
Token Returned to Frontend
        ↓
Protected Requests Use Authorization Header
```

The backend uses JWT-based authentication to ensure users can only access their own notes and protected resources.

---

## 🧠 AI Summarization

The backend includes a mocked AI summarization route:

```text
GET /notes/summary
```

This endpoint:

- Retrieves authenticated user's notes
- Simulates AI-generated summaries
- Supports frontend loading states and async requests
- Is designed to later integrate with real AI APIs

---

## 🗄 Database

The application uses SQLite with SQLAlchemy ORM.

### Tables

- users
- notes

### Relationships

```text
User
 └── Notes (one-to-many)
```

---

## 🧠 Notes

* Uses SQLAlchemy ORM for database interaction
* Uses SQLite for local persistence
* Uses password hashing for secure credential storage
* Database file is ignored via `.gitignore`
* Backend supports CORS for Angular frontend communication