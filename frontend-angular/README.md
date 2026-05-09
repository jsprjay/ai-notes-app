# Frontend (Angular)

This is the Angular frontend for the Full-Stack Notes App.

---

## 🛠 Tech Stack

* Angular
* TypeScript
* CSS
* Angular HttpClient

---

## ✨ Features

* View notes
* Add notes
* Edit notes
* Delete notes
* Loading states for better UX
* Error handling for API failures
* Empty-state messaging

---

## ▶️ Running the Frontend

```bash
npm install
npx ng serve --open
```

Runs at:

```
http://localhost:4200
```

---

## 🔗 API Integration

The frontend communicates with the FastAPI backend:

```
http://127.0.0.1:8000/notes
```

---

## 🧠 Notes

* Uses Angular services for API calls
* Uses two-way binding for form input
* Separates UI logic from API logic
