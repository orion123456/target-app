# Деплой на Amvera Cloud

Проект состоит из двух частей — **backend** и **frontend**. Каждая разворачивается как отдельный проект в Amvera. Также потребуется управляемая база данных PostgreSQL.

Общий порядок:

1. Создать PostgreSQL в Amvera
2. Создать и задеплоить backend
3. Создать и задеплоить frontend

---

## Шаг 1. Регистрация на Amvera

1. Зайдите на [amvera.ru](https://amvera.ru) и зарегистрируйтесь (или войдите).
2. Запомните ваш **логин** (имя пользователя) — он понадобится для git и для подключения к БД.

---

## Шаг 2. Создать базу данных PostgreSQL

1. В личном кабинете Amvera нажмите **«Создать проект»** → выберите тип **«СУБД»** → **PostgreSQL**.
2. Задайте параметры:
   - **Название**: например, `goals-db`
   - **Имя пользователя**: например, `goalsuser`
   - **Пароль**: придумайте надёжный пароль
   - **Имя базы данных**: например, `goals_tracker`
   - **Тариф**: Начальный (или выше)
3. Нажмите **«Завершить»** и дождитесь статуса **«PostgreSQL запущен»**.
4. Перейдите на вкладку **«Инфо»** и скопируйте **внутреннее доменное имя** для чтения/записи. Оно будет выглядеть примерно так:
   ```
   amvera-ВАШ_ЛОГИН-cnpg-goals-db-rw
   ```
5. Теперь у вас есть все данные для подключения:
   - **Host**: `amvera-ВАШ_ЛОГИН-cnpg-goals-db-rw`
   - **Port**: `5432`
   - **User**: `goalsuser`
   - **Password**: ваш пароль
   - **Database**: `goals_tracker`

   Полная строка подключения (DATABASE_URL):
   ```
   postgres://goalsuser:ВАШ_ПАРОЛЬ@amvera-ВАШ_ЛОГИН-cnpg-goals-db-rw:5432/goals_tracker
   ```

---

## Шаг 3. Создать проект для Backend

1. В Amvera нажмите **«Создать проект»** → **«Приложение»**.
2. Задайте:
   - **Название**: например, `goals-backend`
   - **Тариф**: Начальный (или выше)
3. **Не задавайте конфигурацию через интерфейс** — она уже есть в файле `amvera.yml`.
4. Нажмите **«Завершить»**.

### Добавить переменные окружения

Перейдите в раздел **«Переменные»** проекта `goals-backend` и добавьте:

| Тип      | Название          | Значение                                                              |
|----------|-------------------|-----------------------------------------------------------------------|
| Секрет   | `DATABASE_URL`    | `postgres://goalsuser:ПАРОЛЬ@amvera-ЛОГИН-cnpg-goals-db-rw:5432/goals_tracker` |
| Переменная | `NODE_ENV`       | `production`                                                          |
| Переменная | `PORT`           | `4000`                                                                |
| Переменная | `FRONTEND_ORIGIN`| *(пока оставьте пустым — заполните после создания frontend)*          |

### Задеплоить backend через git

Откройте терминал в корне проекта (`target-app/`) и выполните:

```bash
# Добавить remote для backend (URL найдёте на вкладке «Репозиторий» проекта в Amvera)
git remote add amvera-backend https://git.amvera.ru/ВАШ_ЛОГИН/goals-backend

# Запушить только папку backend в Amvera
git subtree push --prefix=backend amvera-backend master
```

При запросе логина и пароля введите учётные данные вашего аккаунта Amvera.

После push автоматически начнётся сборка. Следите за статусом в личном кабинете.

### Подключить домен для backend

1. Перейдите в **«Настройки»** проекта `goals-backend`.
2. Активируйте **бесплатное доменное имя** (или привяжите своё).
3. Дождитесь привязки. Домен будет выглядеть примерно так:
   ```
   goals-backend-ВАШ_ЛОГИН.amvera.tech
   ```
4. Проверьте, что backend работает, открыв в браузере:
   ```
   https://goals-backend-ВАШ_ЛОГИН.amvera.tech/api/goals?year=2026&month=4
   ```
   Должен вернуться JSON: `{"data":[]}`.

---

## Шаг 4. Создать проект для Frontend

### Подготовить .env.production

Создайте файл `frontend/.env.production` с адресом вашего backend:

```bash
# Из корня проекта (target-app/)
echo "VITE_API_BASE_URL=https://goals-backend-ВАШ_ЛОГИН.amvera.tech/api" > frontend/.env.production
```

Закоммитьте изменение:

```bash
git add frontend/.env.production
git commit -m "Add frontend production env with Amvera backend URL"
```

### Создать проект в Amvera

1. В Amvera нажмите **«Создать проект»** → **«Приложение»**.
2. Задайте:
   - **Название**: например, `goals-frontend`
   - **Тариф**: Пробный / Начальный
3. **Не задавайте конфигурацию через интерфейс**.
4. Нажмите **«Завершить»**.

### Задеплоить frontend через git

```bash
# Добавить remote для frontend
git remote add amvera-frontend https://git.amvera.ru/ВАШ_ЛОГИН/goals-frontend

# Запушить только папку frontend в Amvera
git subtree push --prefix=frontend amvera-frontend master
```

### Подключить домен для frontend

1. Перейдите в **«Настройки»** проекта `goals-frontend`.
2. Активируйте **бесплатное доменное имя**.
3. Домен будет выглядеть примерно так:
   ```
   goals-frontend-ВАШ_ЛОГИН.amvera.tech
   ```

---

## Шаг 5. Обновить FRONTEND_ORIGIN в backend

Теперь, когда вы знаете домен frontend, обновите переменную `FRONTEND_ORIGIN` в backend:

1. Перейдите в **«Переменные»** проекта `goals-backend`.
2. Измените `FRONTEND_ORIGIN` на:
   ```
   https://goals-frontend-ВАШ_ЛОГИН.amvera.tech
   ```
3. **Перезапустите** контейнер backend (кнопка «Перезапустить» на странице проекта).

---

## Шаг 6. Проверить

Откройте в браузере:
```
https://goals-frontend-ВАШ_ЛОГИН.amvera.tech
```

Приложение должно загрузиться и работать с данными из базы.

---

## Обновление после изменений в коде

После внесения изменений в код:

```bash
# Закоммитить изменения
git add -A
git commit -m "описание изменений"

# Обновить backend на Amvera
git subtree push --prefix=backend amvera-backend master

# Обновить frontend на Amvera
git subtree push --prefix=frontend amvera-frontend master

# Не забудьте также пушить в GitHub
git push origin main
```

---

## Возможные проблемы

### Ошибка при `git subtree push`
Если получаете ошибку о расхождении веток:
```bash
git push amvera-backend `git subtree split --prefix=backend`:master --force
```

### Ошибка подключения к БД
- Убедитесь, что секрет `DATABASE_URL` задан верно.
- Внутреннее доменное имя PostgreSQL — на вкладке «Инфо» СУБД.
- Формат: `postgres://user:password@host:5432/dbname`

### CORS ошибки
- Убедитесь, что `FRONTEND_ORIGIN` в backend указывает на точный домен frontend (с `https://`, без `/` в конце).
- После изменения переменных перезапустите контейнер.

### Frontend показывает ошибку сети
- Убедитесь, что `frontend/.env.production` содержит правильный URL backend.
- URL должен заканчиваться на `/api` (например, `https://goals-backend-xxx.amvera.tech/api`).
- После изменения `.env.production` нужно пересобрать и перепушить frontend.
