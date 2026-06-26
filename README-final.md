dev
replace DATABASE_URL inv backend/.env to "postgresql+asyncpg://postgres_user:postgres_password@localhost:5432/test_db"

```bash
docker compose -f docker-compose.dev.yml up -d
uvicorn app.main:app --reload
npm run dev
```

prod
```bash
docker compose -f docker-compose.prod.yml up -d --build
```
don't forget to change your postgres user & password

replace DATABASE_URL inv backend/.env to "postgresql+asyncpg://postgres_user:postgres_password@db:5432/test_db
