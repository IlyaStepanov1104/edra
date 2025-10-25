FROM node:22-alpine as builder

WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install -g next && \
    npm install --force
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/node_modules ./node_modules

ENV NODE_ENV=production
EXPOSE 3001
CMD ["npx", "next", "start"]