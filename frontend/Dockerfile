# ---------- BUILD STAGE ----------
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

# Копируем package.json и lock-файл
COPY package*.json ./

# Устанавливаем зависимости Node
RUN npm install

# Копируем проект
COPY . .

# Открываем порт
EXPOSE 3000

# Запуск Next.js
CMD ["npm", "run", "dev"]
