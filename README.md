# 🚀 FastAPI + React (Vite) Project Template

A production-ready, full-stack boilerplate designed for rapid web application development. It features an isolated FastAPI backend with a PostgreSQL database running in Docker, paired with a React + TypeScript frontend with Shadcn/ui .

Out of the box, the template includes a robust authentication system **Google OAuth2** powered by `fastapi_users`.

## 📂 Project Structure

The project follows a modular, separation-of-concerns architecture:

```text
├── backend/                  # Backend application (FastAPI)
│   ├── app/                  # Main application package
│   │   ├── api/              # API endpoints/routes (versioned/modularized)
│   │   ├── core/             # App configuration, security settings, logging
│   │   ├── db/               # Database session and connection setup
│   │   ├── models/           # DB models
│   │   ├── services/         # Core business logic and helper utilities
│   │   └── main.py           # FastAPI application entry point
│   ├── .env                  # Backend environment variables
│   ├── dockerfile            # Dockerfile for backend containerization
│   └── requirements.txt      # Python dependencies
├── db/
│   └── .env                  # PostgreSQL database initialization settings
└── frontend/                 # Frontend application (React + Vite + TS)
    ├── src/                  # React source code
    ├── .env                  # Frontend environment variables
    ├── index.html
    ├── package.json
    └── Dockerfile            # Production Dockerfile for frontend

```
## 🔐 Authentication & Dependency Injection (`get_current_user`)

### How to protect a route and fetch the current user:

```python
from fastapi import Depends
from app.models.user import User  # User DB model
from app.core.users import current_active_user  # Dependency from fastapi_users

@router.get("/me")
async def read_current_user(
    current_user: User = Depends(get_current_user),
):
    return current_user

```

---

## 🛠 Google OAuth2 Setup

To enable Google social(or other provider) login, you need to obtain developer credentials.

Copy your generated `Client ID` and `Client Secret` from console and paste the keys into your `backend/.env` file:

```env
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:5173/auth/google/callback
```

---

## ⚡ Quick Start (Hybrid Development Mode)

For the best development experience and immediate **Hot Module Replacement (HMR)** on the frontend, it is highly recommended to run the database and backend inside Docker containers, while running the frontend locally on your host machine.

### Step 1: Environment Setup

Ensure that your `.env` files are configured in their respective directories (`backend/.env`, `frontend/.env`).

*Example for `frontend/.env`:*

```env
VITE_API_URL=http://localhost:8000

```

### Step 2: Spin up the Backend and Database

Run the following command in the project root directory to build and start the infrastructure containers:

```bash
docker compose up --build

```

*The backend API will be exposed at `http://localhost:8000`, and the database will remain securely isolated within the internal Docker network.*

### Step 3: Run the Frontend locally

Open a new terminal window, navigate to the frontend folder, and start the Vite development server:

```bash
cd frontend
npm install       # Run on initial setup
npm run dev

```

Your frontend will now be running at `http://localhost:5173`. Open this URL in your browser to start developing!