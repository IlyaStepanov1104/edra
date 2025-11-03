# ---------- BUILD STAGE ----------
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

# Копируем package.json и lock
COPY package.json package-lock.json* ./

RUN ls

# Устанавливаем зависимости
RUN npm install

# Копируем весь проект
COPY . .

# Устанавливаем style-loader для Reshaped
RUN npm install --save-dev style-loader css-loader

# Сборка проекта
RUN npm run build

# ---------- PRODUCTION STAGE ----------
FROM node:22-alpine AS runner
WORKDIR /usr/src/app

# Копируем prod-зависимости
COPY package.json package-lock.json* ./
RUN npm install --omit=dev

# Копируем сборку
COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Открываем порт
EXPOSE 3000

# Запуск продакшн сервера
CMD ["npm", "run", "start"]
