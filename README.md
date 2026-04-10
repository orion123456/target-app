# Goals Tracker

Веб-приложение для отслеживания выполнения целей по месяцам. Позволяет задавать цели с планом на месяц и отмечать прогресс по дням.

## Стек

**Frontend:** React 18, TypeScript, Vite, CSS Modules  
**Backend:** Node.js, Express, TypeScript, PostgreSQL, Zod

## Структура проекта

```
├── frontend/          # React SPA (Vite)
│   ├── src/
│   │   ├── components/   # UI-компоненты (GoalsTable, GoalRow, MonthNavigator и др.)
│   │   ├── api/          # Клиент API
│   │   ├── utils/        # Утилиты
│   │   └── types/        # TypeScript типы
│   └── package.json
│
├── backend/           # Express API сервер
│   ├── src/
│   │   ├── routes/       # API роуты
│   │   ├── controllers/  # HTTP-слой
│   │   ├── services/     # Бизнес-логика
│   │   ├── repositories/ # SQL-запросы
│   │   ├── validators/   # Zod-схемы
│   │   └── config/       # Конфигурация
│   ├── migrations/       # SQL-миграции
│   ├── scripts/          # Миграции и seed-данные
│   ├── tests/            # Тесты
│   └── package.json
```

## Требования

- Node.js 20+
- PostgreSQL 14+

## Быстрый старт

### 1. Клонировать репозиторий

```bash
git clone https://github.com/orion123456/target-app.git
cd target-app
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# Отредактируйте .env — укажите свой DATABASE_URL
npm install
npm run migrate
npm run dev
```

Backend будет доступен на `http://localhost:4000`.

### 3. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend будет доступен на `http://localhost:5173`.

## API

Подробная документация API — в [backend/README.md](backend/README.md).

Основные эндпоинты:

| Метод  | Путь              | Описание                  |
|--------|--------------------|---------------------------|
| GET    | `/api/goals`       | Список целей за месяц     |
| POST   | `/api/goals`       | Создать цель              |
| PUT    | `/api/goals/:id`   | Полное обновление цели    |
| PATCH  | `/api/goals/:id`   | Частичное обновление цели |
| DELETE | `/api/goals/:id`   | Удалить цель              |

## Тесты

```bash
cd backend
npm test
```
