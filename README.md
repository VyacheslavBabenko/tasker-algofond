# Tasker - Управление задачами

Приложение для управления задачами с возможностью создания, редактирования и отслеживания задач и подзадач.

## Технологии

### Фронтенд

- Vite
- TypeScript
- React
- Tailwind CSS
- shadcn/ui
- DnD-kit (для drag-and-drop)

### Бэкенд

- Node.js
- Express
- PostgreSQL
- Sequelize ORM

## Запуск проекта

### Запуск с помощью Docker Compose (рекомендуется)

Для запуска всего стека (база данных, бэкенд и фронтенд) используйте Docker Compose:

```bash
# Запуск всего стека
docker-compose up

# Для запуска в фоновом режиме
docker-compose up -d

# Для остановки
docker-compose down
```

Приложение будет доступно по адресу:

- Фронтенд: http://localhost:5173
- API: http://localhost:3001

### Локальный запуск (без Docker)

#### Запуск базы данных

1. Установите PostgreSQL
2. Создайте базу данных `tasker_db`

#### Запуск бэкенда

```bash
# Перейти в папку сервера
cd server

# Установить зависимости
npm install

# Запустить сервер в режиме разработки
npm run dev

# Заполнить базу тестовыми данными (при необходимости)
npm run seed
```

#### Запуск фронтенда

```bash
# Установить зависимости
npm install

# Запустить сервер разработки
npm run dev
```

## Структура проекта

```
tasker/
  ├── src/                   # Исходный код фронтенда
  │   ├── components/        # React компоненты
  │   ├── contexts/          # React контексты
  │   ├── hooks/             # React хуки
  │   └── lib/               # Вспомогательные функции
  ├── server/                # Бэкенд
  │   ├── src/
  │   │   ├── config/        # Конфигурация
  │   │   ├── controllers/   # Контроллеры
  │   │   ├── middleware/    # Middleware
  │   │   ├── models/        # Модели данных
  │   │   ├── routes/        # Маршруты API
  │   │   ├── services/      # Сервисы
  │   │   ├── utils/         # Утилиты
  │   │   └── index.js       # Точка входа
  │   ├── .env               # Переменные окружения
  │   └── package.json       # Зависимости бэкенда
  ├── docker-compose.yml     # Docker Compose конфигурация
  ├── Dockerfile             # Dockerfile для фронтенда
  └── package.json           # Зависимости фронтенда
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
