# Full-Stack Contact List Application

This is a complete, full-stack web application for managing a personal contact list. It features a modern, decoupled architecture with a React frontend and a Django REST Framework backend.

The application allows any user to view and search contacts, but requires user authentication (via username and password) to add or delete entries.

## Public URLs

* **Frontend (Vercel):** https://contact-list-webpage-qqra.vercel.app/
* **Backend API (Render):** https://contact-app-oa5s.onrender.com/api/contacts/
* **Backend Admin Panel:** https://contact-app-oa5s.onrender.com/admin/

[![Frontend Deployed on Vercel](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel)](https://contact-list-webpage-qqra.vercel.app/)
[![Backend Deployed on Render](https://img.shields.io/badge/Backend-Render-46E3B7?logo=render)](https://contact-app-oa5s.onrender.com/api/contacts/)

## Features

* **View & Search:** All visitors can view the full contact list and use the real-time search bar to filter by name or email.
* **User Authentication:** A full username/password login system.
* **Protected Actions:** Only authenticated users can see the "Add Contact" form and "Delete" buttons.
* **Add & Delete Contacts:** Authenticated users can create new contacts and delete existing ones.
* **Decoupled Architecture:** The frontend (Vercel) and backend (Render) are fully separate, communicating via a REST API.

---

---

## Testing Login

You can test the login functionality using the following credentials:
* **Username:** `testuser`
* **Password:** `Testpass123`

*(Note: This user is a regular user and does not have access to the Django Admin Panel.)*

---

## Technology Stack

### Frontend (Deployed on Vercel)
* **React:** A JavaScript library for building user interfaces.
* **Vite:** A high-performance build tool and development server for React.
* **Axios:** A promise-based HTTP client for making requests to the backend API.
* **Vercel:** A cloud platform for hosting and deploying static frontends.

### Backend (Deployed on Render)
* **Python:** The programming language used for the backend.
* **Django:** A high-level Python web framework.
* **Django Rest Framework (DRF):** A powerful toolkit for building Web APIs.
* **DRF Token Authentication:** Provides the `api-token-auth/` endpoint for secure, token-based login.
* **django-cors-headers:** A package to handle Cross-Origin Resource Sharing (CORS) and allow the Vercel frontend to talk to the Render backend.
* **Gunicorn:** A production-ready WSGI HTTP server for Python.
* **Render:** A cloud platform for hosting and deploying backend web services.

### Database (Hosted on Neon)
* **PostgreSQL:** A powerful, open-source object-relational database system.
* **Neon:** A serverless, fully-managed PostgreSQL hosting service.
* **psycopg2-binary:** A Python adapter for connecting to PostgreSQL.

---

## Authorization System Explained

This project uses **Django Rest Framework's Token Authentication** to secure the API.

The backend permissions are set to `IsAuthenticatedOrReadOnly`. This means:
* `GET` requests (viewing/searching) are **allowed for anyone**.
* `POST`, `DELETE`, and `PUT` requests (adding, deleting, or updating) are **denied** unless a valid token is provided.

### The Login Flow

1.  A user enters their username and password into the React login form.
2.  React sends a `POST` request with these credentials to the backend's `https://contact-app-oa5s.onrender.com/api-token-auth/` endpoint.
3.  Django receives the credentials, checks if they are valid, and generates (or retrieves) a unique authentication token for that user.
4.  Django sends this token back to the React app in the response.
5.  The React app saves this token in the browser's `localStorage`. The user is now "logged in."
6.  When the user tries to Add or Delete a contact, the React app attaches this token to the request in the `Authorization` header (e.g., `Authorization: Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b`).
7.  The Django backend sees this header, validates the token, identifies the associated user, and grants permission for the action.

---

## Testing Login

You can test the login functionality using the following credentials:
* **Username:** `testuser`
* **Password:** `Testpass123`

*(Note: This user is a regular user and does not have access to the Django Admin Panel.)*

---

## How to Run This Project Locally

### Prerequisites

* Node.js & npm
* Python
* Git
* A Neon account (for the database)

### 1. Clone the Repository

```
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

(Remember to replace your-username/your-repo-name with your actual repository URL)

### 2. Backend Setup (Terminal 1)

Navigate to the backend folder:
```
cd backend
```

Create and activate a Python virtual environment:
```
python -m venv venv
```

Activate (Windows):
```
.env\Scriptsctivate
```

Activate (Mac/Linux):
```
source venv/bin/activate
```

Install Python dependencies:
```
pip install -r requirements.txt
```

Create your `.env` file and add the following:

```
SECRET_KEY="your-new-django-secret-key"
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
DEBUG="True"
```

Run database migrations:
```
python manage.py migrate
```

Create a superuser:
```
python manage.py createsuperuser
```

Run the backend server:
```
python manage.py runserver
```

Your Django API is now running at http://127.0.0.1:8000/.

### 3. Frontend Setup (Terminal 2)

Navigate to the project root:
```
cd your-repo-name
```

Install Node.js dependencies:
```
npm install
```

Update API URLs in `src/App.jsx`:
```
const API_URL = 'http://127.0.0.1:8000/api/contacts/';
const LOGIN_URL = 'http://127.0.0.1:8000/api-token-auth/';
```

Run the frontend server:
```
npm run dev
```

Your React app is now running at http://localhost:5173/.
