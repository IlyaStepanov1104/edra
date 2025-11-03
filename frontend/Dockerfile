# ---------- BUILD STAGE ----------
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

# Копируем package.json и lock-файл
ADD package.json /usr/src/app/package.json

# Устанавливаем зависимости Node
RUN npm install

# Копируем проект
COPY . /usr/src/app/

# Открываем порт
EXPOSE 3000

# Запуск Next.js
CMD ["npm", "run", "dev"]
