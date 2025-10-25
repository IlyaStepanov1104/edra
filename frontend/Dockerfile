FROM node:22-alpine as builder
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN corepack enable && \
    yarn set version stable && \
    yarn install --network-timeout 1000000
COPY . .
RUN yarn build

FROM node:22-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/next.config.js ./next.config.js

EXPOSE 3000
CMD ["yarn", "start"]