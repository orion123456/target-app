# Goals Tracker Backend

Backend для приложения «таблица выполнения целей по месяцам».

## Стек

- Node.js + TypeScript
- Express.js
- PostgreSQL (`pg`)
- Zod для валидации

## Структура

- `src/app.ts` — настройка Express, CORS, JSON middleware, роуты, error handlers
- `src/server.ts` — запуск сервера и проверка подключения к БД
- `src/routes` — API роуты (`/api/goals`)
- `src/controllers` — HTTP-слой
- `src/services` — бизнес-логика
- `src/repositories` — SQL-запросы и работа с PostgreSQL
- `src/validators` — zod-схемы для query/body/params
- `src/utils/calculateFact.ts` — источник истины для расчета `fact`
- `migrations` — SQL-миграции
- `scripts/migrate.ts` — запуск SQL миграций
- `scripts/seed.ts` — тестовые данные

## Требования

- Node.js 20+
- PostgreSQL 14+

## Быстрый старт

1. Скопируйте env-файл:

```bash
cp .env.example .env
```

2. Проверьте `DATABASE_URL` в `.env`.

3. Установите зависимости:

```bash
npm install
```

4. Выполните миграции:

```bash
npm run migrate
```

5. (Опционально) Загрузите тестовые данные:

```bash
npm run seed
```

6. Запустите сервер:

```bash
npm run dev
```

Backend будет доступен на `http://localhost:4000`.

## API

Базовый префикс: `/api`

### GET `/api/goals?year=2026&month=3`

Ответ:

```json
{
  "data": [
    {
      "id": "uuid",
      "year": 2026,
      "month": 3,
      "title": "Прочитать книги",
      "plan": 20,
      "daysData": { "1": "", "2": "done", "3": "5" },
      "fact": 6,
      "createdAt": "2026-03-31T10:00:00.000Z",
      "updatedAt": "2026-03-31T10:00:00.000Z"
    }
  ]
}
```

### POST `/api/goals`

Тело:

```json
{
  "year": 2026,
  "month": 3,
  "title": "Прочитать книги",
  "plan": 20,
  "daysData": {
    "1": "",
    "2": "done",
    "3": "5"
  }
}
```

### PUT `/api/goals/:id`

Полная замена полей `year/month/title/plan/daysData`.

### PATCH `/api/goals/:id`

Частичное обновление одного или нескольких полей.

### DELETE `/api/goals/:id`

Ответ:

```json
{
  "data": {
    "message": "Goal deleted successfully"
  }
}
```

## Валидация

- `year`: обязательное число
- `month`: обязательное число `1..12`
- `title`: строка
- `plan`: число или `null`
- `daysData`: объект `{ ["1".."31"]: string }`
- Ключи `daysData` валидируются с учетом длины месяца (включая високосный февраль)

## Логика fact

- `""`, `"   "`, `null`, `undefined` -> `0`
- чистое число (`"5"`, `" 10 "`) -> это число
- любой другой непустой текст (`"done"`, `"10к"`, `"2 раза"`) -> `1`

Реализация и тесты:

- `src/utils/calculateFact.ts`
- `tests/calculateFact.test.ts`

Запуск тестов:

```bash
npm test
```
