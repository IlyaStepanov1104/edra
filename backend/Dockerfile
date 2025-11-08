# Используем Node 20 на Alpine
FROM node:20-alpine

# Для сборки NestJS нужны bash, git и сборочные инструменты
RUN apk add --no-cache bash git python3 g++ make

# Рабочая директория внутри контейнера
WORKDIR /usr/src/app

# Копируем только package.json и package-lock.json для npm install
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходники
COPY . .

# Собираем проект (создаст папку dist)
RUN npm run build

# Устанавливаем порт
EXPOSE 3000

# Запуск напрямую через node
CMD ["npm", "run", "start:dev"]
