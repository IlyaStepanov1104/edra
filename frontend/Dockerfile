FROM node:22-alpine as builder

WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN corepack enable && \
    yarn set version stable && \
    yarn install --immutable-cache
COPY . .
RUN yarn build

FROM node:22-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/node_modules ./node_modules

ENV NODE_ENV=production
EXPOSE 3001
CMD ["yarn", "start"]