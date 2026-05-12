# Full-Stack Notes App

A full-stack productivity application built with Angular, FastAPI, SQLAlchemy, and SQLite. The app allows authenticated users to create, view, edit, delete, and summarize notes with persistent storage, protected API routes, and responsive UX-focused interactions.

---

## 🚀 Tech Stack

### Frontend

* Angular
* TypeScript
* HTML/CSS

### Backend

* Python
* FastAPI
* SQLAlchemy
* SQLite

---

## ✨ Features

- User authentication with login and registration
- Protected API routes using JWT authentication
- Create, view, edit, and delete personal notes
- Persistent data storage using SQLite
- RESTful API integration between Angular and FastAPI
- AI-powered note summarization (with mock fallback)
- Loading states for better user feedback
- Inline error handling for failed requests
- Disabled buttons during API calls to prevent duplicate actions
- Empty state messaging when no notes exist
- User-specific note isolation and protected data access
- Search and filter notes by title
- Sort notes by newest, oldest, A-Z, and Z-A

---

## 🤖 AI Integration

The application includes an AI-powered summarization feature that generates insights from user-created notes.

- Implemented using an API-based architecture
- Includes a mock fallback to enable development without external dependencies
- Designed to be easily extended for real AI integrations
- Includes asynchronous loading states and frontend integration through Angular services

Example use cases:
- Summarizing tasks
- Extracting key topics
- Improving productivity insights

---

## 🏗️ Architecture

```text
Angular Frontend
   ↓ HTTP Requests
FastAPI Backend
   ↓ SQLAlchemy ORM
SQLite Database
```

---

## 📁 Project Structure

```text
ai-notes-app/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── notes.db
│
├── frontend-angular/
│   ├── src/
│   ├── package.json
│   └── angular.json
│
├── .gitignore
└── README.md
```

---

## ▶️ Running Locally

### Backend

```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Runs at:

```
http://127.0.0.1:8000
```

API Docs:

```
http://127.0.0.1:8000/docs
```

---

### Frontend

```bash
cd frontend-angular
npm install
npx ng serve --open
```

Runs at:

```
http://localhost:4200
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

## 🧠 What I Learned

- How frontend and backend communicate securely via REST APIs
- How JWT authentication and protected routes work
- How to structure a full-stack Angular + FastAPI application
- How to persist relational data using SQLAlchemy and SQLite
- How to integrate AI-powered features into an existing application
- How to design mock fallbacks for external APIs
- How to improve UX with loading states, inline errors, and disabled actions
- How to manage authentication state and authorization headers in Angular
- How to implement client-side search and sorting in Angular
- How to manage derived UI state from API data

---

## 🚧 Future Improvements

* Add note categories and tagging
* Add real OpenAI-powered summarization
* Add collaborative/shared notes
* Add cloud database support (PostgreSQL)
* Deploy frontend and backend to production
* Add unit and integration testing

---

## 🔐 Authentication Flow

```text
Angular Frontend
   ↓ Login/Register Request
FastAPI Backend
   ↓ Password Hashing + JWT Creation
JWT Token Returned
   ↓ Stored in Local Storage
Authenticated Requests Sent with Authorization Header

The application uses JWT-based authentication to protect note-related endpoints and ensure users can only access their own data.
```

---

## 🔎 Search and Filtering

The application includes a frontend search and filtering feature that improves note organization and usability.

Users can search notes by title and sort their notes by:

- Newest
- Oldest
- A-Z
- Z-A

This feature demonstrates client-side state management, dynamic rendering, and UX-focused filtering without requiring additional backend API calls.
