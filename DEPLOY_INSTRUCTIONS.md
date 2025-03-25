# Инструкция по развертыванию Tasker на сервере

## Предварительные требования

- Доступ к серверу по SSH
- Git установлен на сервере
- Docker и Docker Compose установлены на сервере (скрипт установит их, если они отсутствуют)

## Вариант 1: Использование скрипта автоматического развертывания

1. Убедитесь, что вы настроили SSH-ключи для беспарольного доступа к серверу:

```bash
# Создание SSH ключа, если у вас его еще нет
ssh-keygen -t rsa -b 4096

# Копирование ключа на сервер (замените user и server на ваши данные)
ssh-copy-id root@dev
```

2. Выполните скрипт развертывания, указав URL вашего Git-репозитория:

```bash
./deploy.sh https://github.com/your-username/tasker-algofond.git
```

3. Приложение будет автоматически клонировано и запущено на сервере.

## Вариант 2: Ручное развертывание

Если вы предпочитаете развернуть приложение вручную, выполните следующие шаги:

1. Подключитесь к серверу:

```bash
ssh root@dev
```

2. Создайте директорию для приложения:

```bash
mkdir -p ~/tasker-algofond
cd ~/tasker-algofond
```

3. Клонируйте репозиторий:

```bash
git clone https://github.com/your-username/tasker-algofond.git .
```

4. Запустите приложение с помощью Docker Compose:

```bash
docker-compose up -d
```

5. Проверьте статус контейнеров:

```bash
docker-compose ps
```

## Доступ к приложению

После успешного развертывания приложение будет доступно по следующим адресам:

- Фронтенд: http://server-ip:3000
- API: http://server-ip:3001

## Обновление приложения

Для обновления приложения после изменений в репозитории:

```bash
ssh root@dev
cd ~/tasker-algofond
git pull
docker-compose down
docker-compose up -d
```

## Логи и отладка

Для просмотра логов:

```bash
# Все контейнеры
docker-compose logs

# Конкретный контейнер (frontend, backend, db)
docker-compose logs frontend
docker-compose logs backend
docker-compose logs db

# Для непрерывного вывода логов добавьте флаг -f
docker-compose logs -f
```

## Остановка приложения

Для остановки приложения:

```bash
cd ~/tasker-algofond
docker-compose down
```

## Полное удаление

Для полного удаления приложения вместе с данными:

```bash
cd ~/tasker-algofond
docker-compose down -v --rmi all
cd ..
rm -rf ~/tasker-algofond
```
