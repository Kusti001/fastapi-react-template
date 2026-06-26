FROM python:3.11-alpine

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY requirements.txt .

# Устанавливаем зависимости приложения
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Копируем остальной код бэкенда в контейнер
COPY . .

# Открываем порт, на котором работает FastAPI
EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]