# Backend (FastAPI)

This is the backend service for the Full-Stack Notes App.

---

## 🛠 Tech Stack

* Python
* FastAPI
* SQLAlchemy
* SQLite

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

```
http://127.0.0.1:8000/docs
```

---

## 🔌 Endpoints

| Method | Endpoint         | Description   |
| ------ | ---------------- | ------------- |
| GET    | /notes           | Get all notes |
| POST   | /notes           | Create a note |
| PUT    | /notes/{note_id} | Update a note |
| DELETE | /notes/{note_id} | Delete a note |

---

## 🧠 Notes

* Uses SQLAlchemy as ORM
* Uses SQLite for local persistence
* Database file is not committed to Git (ignored via .gitignore)
