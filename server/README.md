# Tasker Backend API

Бэкенд для приложения управления задачами, реализованный на Node.js + Express + PostgreSQL.

## Требования

- Node.js (v18 или выше)
- PostgreSQL (v14 или выше)

## Установка

1. Клонировать репозиторий
2. Перейти в директорию server:
   ```
   cd server
   ```
3. Установить зависимости:
   ```
   npm install
   ```
4. Создать базу данных PostgreSQL:
   ```
   createdb tasker_db
   ```
5. Скопировать `.env.example` в `.env` и настроить подключение к базе данных:
   ```
   cp .env.example .env
   ```
6. Настроить параметры в файле `.env`:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=tasker_db
   DB_USER=postgres
   DB_PASSWORD=postgres
   ```

## Использование

### Запуск сервера в режиме разработки:

```
npm run dev
```

Сервер будет запущен на порту 3001 (по умолчанию).

### Заполнение базы данных тестовыми данными:

```
npm run seed
```

## API Endpoints

### Задачи

- `GET /api/tasks` - получить все задачи
- `GET /api/tasks/:id` - получить задачу по ID
- `POST /api/tasks` - создать новую задачу
- `PUT /api/tasks/:id` - обновить задачу
- `DELETE /api/tasks/:id` - удалить задачу
- `POST /api/tasks/reorder` - изменить порядок задач

### Подзадачи

- `GET /api/tasks/:taskId/subtasks` - получить все подзадачи для задачи
- `GET /api/tasks/subtasks/:id` - получить подзадачу по ID
- `POST /api/tasks/subtasks` - создать новую подзадачу
- `PUT /api/tasks/subtasks/:id` - обновить подзадачу
- `DELETE /api/tasks/subtasks/:id` - удалить подзадачу

## Структура проекта

```
server/
  ├── src/
  │   ├── config/         # Конфигурация
  │   ├── controllers/    # Контроллеры
  │   ├── middleware/     # Middleware
  │   ├── models/         # Модели данных
  │   ├── routes/         # Маршруты API
  │   ├── services/       # Сервисы
  │   ├── utils/          # Утилиты
  │   └── index.js        # Точка входа
  ├── .env                # Переменные окружения
  ├── package.json        # Зависимости и скрипты
  └── README.md           # Документация
```
