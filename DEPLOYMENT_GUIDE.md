# Руководство по развертыванию на VPS

## Требования
- Сервер с Ubuntu 20.04/22.04
- Docker и Docker Compose установлены
- Открытые порты: 80, 443 (HTTP/HTTPS)

## 1. Подготовка сервера

```bash
# Обновление пакетов
sudo apt update && sudo apt upgrade -y

# Установка Docker
sudo apt install -y docker.io docker-compose
sudo systemctl enable docker
sudo systemctl start docker

# Добавление пользователя в группу docker
sudo usermod -aG docker $USER
newgrp docker
```

## 2. Клонирование проекта

```bash
git clone https://ваш_репозиторий.git
cd edra
```

## 3. Настройка окружения

Создайте файл `.env` в корне проекта:
```bash
echo "SERVER_IP=ваш_ip_сервера" > .env
```

Для бэкенда (необязательно, если используются дефолтные значения):
```bash
echo "MONGO_URL=mongodb://root:example@mongo:27017" > backend/.env
```

## 4. Запуск сервисов

```bash
docker-compose up --build -d
```

## 5. Проверка работы

Проверьте логи:
```bash
docker-compose logs -f
```

Сервис должен быть доступен по:
- Веб-интерфейс: http://ваш_ip_сервера
- API: http://ваш_ip_сервера/api

## 6. Дополнительные настройки

### HTTPS (Let's Encrypt)
Рекомендуется настроить Nginx для работы с HTTPS. Пример конфигурации в `nginx.conf`:

```nginx
server {
    listen 443 ssl;
    server_name ваш_домен;

    ssl_certificate /etc/letsencrypt/live/ваш_домен/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ваш_домен/privkey.pem;

    # Остальная конфигурация...
}
```

### Обновление
Для обновления:
```bash
git pull
docker-compose up --build -d
```

## 7. Управление сервисом

Остановка:
```bash
docker-compose down
```

Перезапуск:
```bash
docker-compose restart
```

Просмотр логов:
```bash
docker-compose logs -f сервис  # например: backend, frontend или nginx