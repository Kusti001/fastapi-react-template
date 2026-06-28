# FastAPI + React Template

Lightweight fullstack template for starting a web project. Includes **only OAuth2 authentication** — no extra complexity, no bloat. Take it and build on top.

> **Planned:** Nginx reverse proxy configuration for production Docker Compose.

**Stack:** FastAPI · PostgreSQL · React + Vite + TypeScript · shadcn/ui · Docker

## Getting Started

### 1. Clone and install dependencies

```bash
git clone https://github.com/kusti001/fastapi-react-template.git
cd fastapi-react-template
```

```bash
# Python dependencies
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

```bash
# Node dependencies
cd frontend
npm install
```

### 2. Configure environment variables

**`backend/.env`:**
```env
JWT_SECRET_KEY=<openssl rand -hex 32>
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5173/auth/google/callback
DATABASE_URL=postgresql+asyncpg://postgres_user:postgres_password@localhost:5432/app_db
```
    while backend in container, use docker networking in DATABASE_URL

**`db/.env`:**
```env
POSTGRES_USER=postgres_user
POSTGRES_PASSWORD=postgres_password
POSTGRES_DB=app_db
```

**`frontend/.env`:**
```env
VITE_API_URL=http://localhost:8000
```
   while frontend & backend in containers, use docker networking

### 3. Run

By default the project is configured for **development mode** — database in Docker, backend and frontend locally.

```bash
# Database
docker compose -f docker-compose.dev.yml up -d

# Backend
cd backend
uvicorn app.main:app --reload

# Frontend
cd frontend
npm run dev
```

## Dev vs Prod

| | Dev | Prod |
|---|---|---|
| Database | Docker | Docker |
| Backend | Local (`uvicorn --reload`) | Docker |
| Frontend | Local (Vite HMR) | Docker (built) |
| Config | `docker-compose.dev.yml` | `docker-compose.prod.yml` |

**Run in production:**
```bash
docker compose -f docker-compose.prod.yml up -d --build
```

Before deploying, make sure to:
- Change `POSTGRES_USER` and `POSTGRES_PASSWORD` to something secure
- Generate a new `JWT_SECRET_KEY`
- Update `GOOGLE_REDIRECT_URI` to your real domain
- Restrict CORS in `backend/app/main.py` to your domain only

## Google OAuth2 Setup

1. Open [Google Cloud Console](https://console.cloud.google.com/)
2. **APIs & Services → Credentials → Create OAuth 2.0 Client ID**
3. Application type: **Web application**
4. Add to **Authorized redirect URIs:**
   - `http://localhost:5173/auth/google/callback` (dev)
   - `https://yourdomain.com/auth/google/callback` (prod)
5. Copy Client ID and Client Secret into `backend/.env`

## Adding a New OAuth Provider

Short version: add credentials to `.env`, create a client in `core/oauth2.py`, register a router in `auth.py`, add the provider to `oauthProviders` in the frontend.


## Project Structure

```
.
├── backend/
│   └── app/
│       ├── api/v1/endpoints/auth.py   # Auth endpoints
│       ├── core/                      # Config, JWT, OAuth2 clients
│       ├── db/                        # Engine, session, migrations
│       ├── models/user.py             # User + OAuthAccount
│       ├── services/user_manager.py   # UserManager hooks
│       └── main.py                    # App entrypoint
├── frontend/
│   └── src/
│       ├── pages/                     # LoginPage, AuthCallbackPage, etc.
│       ├── shared/api/                # API client + all request functions
│       └── App.tsx                    # Router config
├── db/.env
└── docker-compose.*.yml
```
