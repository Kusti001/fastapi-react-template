# 🚀 FastAPI + React Fullstack Template

Production-ready fullstack boilerplate: **FastAPI** backend, **React + Vite + TypeScript** frontend, **PostgreSQL** database, **Google OAuth2** via `fastapi-users`, всё в Docker.

---

## 📂 Структура проекта

```
.
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── router.py              # Корневой роутер (/api)
│   │   │   └── v1/
│   │   │       ├── router.py          # Версионный роутер (/api/v1)
│   │   │       └── endpoints/
│   │   │           └── auth.py        # Auth эндпоинты (JWT + Google OAuth2)
│   │   ├── core/
│   │   │   ├── config.py              # Settings через pydantic-settings
│   │   │   ├── auth_backend.py        # JWT стратегия + BearerTransport
│   │   │   ├── fastapi_users.py       # Инициализация FastAPIUsers
│   │   │   ├── oauth2.py              # OAuth клиент (Google)
│   │   │   └── dependencies.py        # get_current_user dependency
│   │   ├── db/
│   │   │   ├── base.py                # DeclarativeBase
│   │   │   ├── engine.py              # Async SQLAlchemy engine
│   │   │   ├── session.py             # AsyncSession + get_async_session
│   │   │   ├── init.py                # create_tables при старте
│   │   │   └── users.py               # SQLAlchemyUserDatabase provider
│   │   ├── models/
│   │   │   └── user.py                # User + OAuthAccount модели
│   │   ├── services/
│   │   │   └── user_manager.py        # UserManager (хуки on_after_*)
│   │   └── main.py                    # FastAPI app + CORS + lifespan
│   ├── .env                           # Переменные окружения (не коммитить!)
│   ├── dockerfile
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── LoginPage.tsx          # Страница входа (Google OAuth кнопка)
│       │   ├── AuthCallbackPage.tsx   # Обработка callback от Google
│       │   ├── MainPage.tsx           # Главная страница
│       │   └── AuthTest.tsx           # Дебаг-страница /me
│       ├── shared/
│       │   └── api/
│       │       └── client.ts          # Axios instance (baseURL из .env)
│       ├── components/
│       │   ├── ui/                    # shadcn/ui компоненты
│       │   └── theme-provider.tsx     # Тема (dark/light)
│       └── App.tsx                    # React Router v7 конфиг
├── db/
│   └── .env                           # PostgreSQL credentials
└── docker-compose.yml
```

---

## ⚡ Быстрый старт (гибридный режим — рекомендуется)

Бэкенд и БД в Docker, фронтенд локально (HMR работает мгновенно).

### 1. Настройка переменных окружения

**`backend/.env`:**
```env
JWT_SECRET_KEY=<сгенерируй через: openssl rand -hex 32>
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:5173/auth/google/callback
DATABASE_URL=postgresql+asyncpg://postgres_user:postgres_password@db:5432/app_db
```

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

### 2. Запустить бэкенд + БД

```bash
docker compose up --build
```

API доступен на `http://localhost:8000`. Таблицы создаются автоматически при старте.

### 3. Запустить фронтенд

```bash
cd frontend
npm install
npm run dev
```

Фронтенд: `http://localhost:5173`

---

## 🔐 Google OAuth2 — Настройка

### Получение credentials

1. Открой [Google Cloud Console](https://console.cloud.google.com/)
2. Создай проект → **APIs & Services → Credentials → Create OAuth 2.0 Client ID**
3. Application type: **Web application**
4. В **Authorized redirect URIs** добавь:
   - `http://localhost:5173/auth/google/callback` (dev)
   - `https://yourdomain.com/auth/google/callback` (prod)
5. Скопируй Client ID и Client Secret в `backend/.env`

### Как работает flow

```
[Пользователь нажимает "Войти через Google"]
         ↓
[Frontend] GET /api/v1/auth/google/authorize
         ↓
[Backend] → возвращает { authorization_url }
         ↓
[Frontend] → редиректит браузер на Google
         ↓
[Google] → редиректит на /auth/google/callback?code=...&state=...
         ↓
[Frontend: AuthCallbackPage] GET /api/v1/auth/google/callback?code=...&state=...
         ↓
[Backend] → обменивает code на токены Google, создаёт/обновляет юзера, возвращает JWT
         ↓
[Frontend] → сохраняет токен, редиректит на /
```

---

## 🛡️ Защита роутов

### Зависимость `get_current_user`

```python
from fastapi import APIRouter, Depends
from app.core.dependencies import get_current_user
from app.models.user import User

router = APIRouter()

@router.get("/profile")
async def get_profile(current_user: User = Depends(get_current_user)):
    return {"id": str(current_user.id), "email": current_user.email}
```

Если токен отсутствует или невалиден — автоматически возвращается `401 Unauthorized`.

### Опциональная аутентификация

```python
from app.core.fastapi_users import fastapi_users

get_optional_user = fastapi_users.current_user(active=True, optional=True)

@router.get("/public")
async def public_route(user: User | None = Depends(get_optional_user)):
    if user:
        return {"message": f"Привет, {user.email}!"}
    return {"message": "Привет, гость!"}
```

---

## 🔌 Как добавить нового OAuth-провайдера

Шаблон поддерживает любого провайдера из [`httpx-oauth`](https://frankie567.github.io/httpx-oauth/). Пример: добавить **GitHub**.

### Шаг 1 — Добавить credentials в `backend/.env`

```env
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_REDIRECT_URI=http://localhost:5173/auth/github/callback
```

### Шаг 2 — Расширить `core/config.py`

```python
class Settings(BaseSettings):
    DATABASE_URL: str
    JWT_SECRET_KEY: str
    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    GOOGLE_REDIRECT_URI: str
    # Добавить:
    GITHUB_CLIENT_ID: str
    GITHUB_CLIENT_SECRET: str
    GITHUB_REDIRECT_URI: str
    ...
```

### Шаг 3 — Создать клиент в `core/oauth2.py`

```python
from httpx_oauth.clients.google import GoogleOAuth2
from httpx_oauth.clients.github import GitHubOAuth2  # импорт нового провайдера
from .config import settings

google_oauth_client = GoogleOAuth2(settings.GOOGLE_CLIENT_ID, settings.GOOGLE_CLIENT_SECRET)
github_oauth_client = GitHubOAuth2(settings.GITHUB_CLIENT_ID, settings.GITHUB_CLIENT_SECRET)
```

### Шаг 4 — Зарегистрировать роутер в `api/v1/endpoints/auth.py`

```python
from app.core.oauth2 import google_oauth_client, github_oauth_client

# Существующий Google роутер:
router.include_router(
    fastapi_users.get_oauth_router(
        google_oauth_client, auth_backend, settings.GOOGLE_CLIENT_SECRET,
        redirect_url=settings.GOOGLE_REDIRECT_URI, associate_by_email=True,
        csrf_token_cookie_secure=False,
    ),
    prefix="/google",
)

# Новый GitHub роутер:
router.include_router(
    fastapi_users.get_oauth_router(
        github_oauth_client, auth_backend, settings.GITHUB_CLIENT_SECRET,
        redirect_url=settings.GITHUB_REDIRECT_URI, associate_by_email=True,
        csrf_token_cookie_secure=False,
    ),
    prefix="/github",
)
```

### Шаг 5 — Добавить кнопку на фронтенде

```tsx
// LoginPage.tsx
const handleGitHubLogin = async () => {
  const response = await apiClient.get('/api/v1/auth/github/authorize');
  window.location.href = response.data.authorization_url;
};
```

И добавить callback route в `App.tsx`:
```tsx
{ path: '/auth/github/callback', element: <AuthCallbackPage /> }
```

`AuthCallbackPage` универсальна — она читает `?code` и `?state` и вызывает нужный `/callback` эндпоинт. Просто измени URL в компоненте или параметризуй его через роутер.

---

## 🗄️ Как добавить новую фичу / модуль

Чтобы добавить, например, модуль `posts`:

```
backend/app/
├── models/
│   └── post.py          # 1. SQLAlchemy модель
├── services/
│   └── post_service.py  # 2. Бизнес-логика
└── api/v1/endpoints/
    └── posts.py         # 3. FastAPI роутер
```

Подключить роутер в `api/v1/router.py`:

```python
from .endpoints.posts import router as posts_router

router.include_router(posts_router, prefix="/posts", tags=["posts"])
```

---

## 🚀 Деплой на продакшен

### Что изменить перед продом

**`backend/.env`:**
```env
# Обязательно:
JWT_SECRET_KEY=<новый безопасный ключ: openssl rand -hex 32>
GOOGLE_REDIRECT_URI=https://yourdomain.com/auth/google/callback
DATABASE_URL=postgresql+asyncpg://user:password@db:5432/prod_db

# После деплоя включить HTTPS cookie protection:
# В auth.py: csrf_token_cookie_secure=True
```

**`backend/app/main.py` — ограничить CORS:**
```python
origins = [
    "https://yourdomain.com",
]
```

**`docker-compose.yml` — использовать healthcheck для БД:**
```yaml
db:
  image: postgres:17-alpine
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U postgres_user -d app_db"]
    interval: 10s
    timeout: 5s
    retries: 5

api:
  depends_on:
    db:
      condition: service_healthy
```

### Рекомендуемые инструменты для прода

- **Reverse proxy**: Nginx или Caddy (HTTPS + проксирование)
- **Миграции**: Alembic вместо `create_all` (не теряет данные при изменении схемы)
- **Логирование**: structlog или loguru вместо `print()`
- **Мониторинг**: Sentry для ошибок, Prometheus + Grafana для метрик

---

## 🧩 Расширение UserManager

`services/user_manager.py` — место для бизнес-логики вокруг пользователей:

```python
class UserManager(UUIDIDMixin, BaseUserManager[User, uuid.UUID]):

    async def on_after_register(self, user: User, request: Request | None = None):
        # Отправить приветственный email
        await send_welcome_email(user.email)

    async def on_after_login(self, user: User, request: Request | None = None, response: Response | None = None):
        # Логировать вход
        logger.info(f"User {user.id} logged in")

    async def on_after_forgot_password(self, user: User, token: str, request: Request | None = None):
        # Отправить письмо со сбросом пароля
        await send_reset_email(user.email, token)
```

---

## 📡 API Reference

| Метод | Путь | Описание |
|-------|------|----------|
| `GET` | `/api/v1/auth/google/authorize` | Получить URL для OAuth редиректа |
| `GET` | `/api/v1/auth/google/callback` | Обменять code на JWT токен |
| `POST` | `/api/v1/auth/jwt/login` | Логин через email/пароль |
| `POST` | `/api/v1/auth/jwt/logout` | Логаут |
| `GET` | `/api/v1/auth/me` | Получить данные текущего юзера |
| `GET` | `/docs` | Swagger UI |
| `GET` | `/redoc` | ReDoc |

---

## ⚙️ Полезные команды

```bash
# Бэкенд: запустить локально без Docker
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

# Фронтенд: форматирование
cd frontend
npm run format     # prettier
npm run lint       # eslint
npm run typecheck  # tsc

# Docker: пересобрать только бэкенд
docker compose up --build api

# Посмотреть логи бэкенда
docker compose logs -f api
```

---

## 🔑 Переменные окружения — полный список

| Переменная | Где | Описание |
|---|---|---|
| `JWT_SECRET_KEY` | `backend/.env` | Секрет для подписи JWT |
| `GOOGLE_CLIENT_ID` | `backend/.env` | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | `backend/.env` | Google OAuth Client Secret |
| `GOOGLE_REDIRECT_URI` | `backend/.env` | URL callback страницы |
| `DATABASE_URL` | `backend/.env` | Строка подключения к PostgreSQL |
| `POSTGRES_USER` | `db/.env` | Пользователь БД |
| `POSTGRES_PASSWORD` | `db/.env` | Пароль БД |
| `POSTGRES_DB` | `db/.env` | Имя базы данных |
| `VITE_API_URL` | `frontend/.env` | URL бэкенда для Axios клиента |

---

## 🛠️ Стек

| Слой | Технология |
|---|---|
| Backend | FastAPI + fastapi-users + SQLAlchemy (async) |
| Auth | JWT (Bearer) + Google OAuth2 (httpx-oauth) |
| Database | PostgreSQL + asyncpg |
| Frontend | React 19 + Vite + TypeScript |
| UI | shadcn/ui + Tailwind CSS v4 |
| HTTP клиент | Axios |
| Роутинг | React Router v7 |
| Контейнеризация | Docker + Docker Compose |