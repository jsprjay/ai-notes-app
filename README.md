# Full-Stack Notes App

A full-stack notes application built with Angular, FastAPI, SQLAlchemy, and SQLite. The app allows users to create, view, edit, and delete notes with persistent storage and a responsive user experience.

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

- Create, view, edit, and delete notes
- Persistent data storage using SQLite
- RESTful API integration between frontend and backend
- AI-powered note summarization (with mock fallback)
- Loading states for better user feedback
- Inline error handling for failed requests
- Disabled buttons during API calls to prevent duplicate actions
- Empty state messaging when no notes exist

---

## 🤖 AI Integration

The application includes an AI-powered summarization feature that generates insights from user-created notes.

- Implemented using an API-based architecture
- Includes a mock fallback to enable development without external dependencies
- Designed to be easily extended for real AI integrations

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
├── frontend-angular/
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

| Method | Endpoint         | Description   |
| ------ | ---------------- | ------------- |
| GET    | /notes           | Get all notes |
| POST   | /notes           | Create a note |
| PUT    | /notes/{note_id} | Update a note |
| DELETE | /notes/{note_id} | Delete a note |

---

## 🧠 What I Learned

- How frontend and backend communicate via REST APIs
- How to structure a full-stack application
- How to persist data using a database
- How to integrate AI features into an existing application
- How to design fallback mechanisms for external APIs
- How to improve user experience with loading states and error handling

---

## 🚧 Future Improvements

* Add authentication (login/signup)
* Add search and filtering
* Add note categories/tags
* Add AI-powered note summarization
* Deploy application to the cloud
