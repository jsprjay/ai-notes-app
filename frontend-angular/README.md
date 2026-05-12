# Frontend (Angular)

This is the Angular frontend for the Full-Stack Notes App. The frontend provides authentication, note management, AI summarization interaction, and responsive user experience features.

---

## 🛠 Tech Stack

* Angular
* TypeScript
* HTML/CSS
* Angular HttpClient
* RxJS

---

## ✨ Features

- User login and registration
- JWT authentication handling
- Protected note access
- Create, edit, and delete notes
- AI-powered note summarization requests
- Loading states during API calls
- Inline error handling
- Disabled buttons during async operations
- Empty-state messaging
- Responsive frontend architecture
- Search notes by title
- Sort notes by newest, oldest, A-Z, and Z-A
- Client-side filtering using Angular state and derived data

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

## 🔗 Backend Integration

The frontend communicates with the FastAPI backend using REST APIs.

### Backend URL

```text
http://127.0.0.1:8000
```

### Authentication

The frontend stores JWT tokens in local storage and sends them through the Authorization header for protected requests.

```text
Authorization: Bearer <token>
```

---

## 🧠 AI Summarization Flow

```text
Angular Frontend
      ↓
Button Click
      ↓
HTTP Request to Backend
      ↓
Mock AI Summary Returned
      ↓
UI Updated with Loading States
```

The frontend uses Angular services and RxJS observables to manage asynchronous requests and UI updates.

---

## 📁 Frontend Structure

```text
frontend-angular/
├── src/
│   ├── app/
│   ├── assets/
│   └── styles.css
│
├── package.json
├── angular.json
└── tsconfig.json
```

---

## 🧠 Notes

* Uses Angular services for API communication
* Uses two-way binding with `ngModel`
* Uses observables for async data handling
* Separates UI logic from API logic
* Includes loading and error states for improved UX
* Supports authenticated requests using JWT tokens

---

## 🔎 Search and Filtering

The frontend includes client-side search and sorting functionality.

Users can:

- Search notes by title
- Sort notes by newest first
- Sort notes by oldest first
- Sort alphabetically A-Z
- Sort alphabetically Z-A

This feature is handled in Angular using component state and a filtered notes getter, allowing the UI to update dynamically without requiring additional backend requests.
