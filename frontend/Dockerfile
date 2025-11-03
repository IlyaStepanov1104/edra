# ---------- BUILD STAGE ----------
FROM node:22-alpine as builder

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN corepack enable && \
    yarn set version stable && \
    yarn install --frozen-lockfile --network-timeout 1000000

COPY . .
RUN yarn build

# ---------- RUNTIME STAGE ----------
FROM node:22-alpine

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/next.config.* ./

EXPOSE 3000
CMD ["yarn", "start"]
