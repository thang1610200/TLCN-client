# Build BASE
FROM node:18-alpine as BASE

WORKDIR /app
COPY package*.json ./
RUN apk add --no-cache git \
    && npm ci

# Build Image
FROM node:18-alpine AS BUILD

WORKDIR /app
COPY --from=BASE /app/node_modules ./node_modules
COPY . .
RUN apk add --no-cache git curl \
    && npm run build \
    && rm -rf node_modules \
    && npm install --production --ignore-scripts --prefer-offline

# Build production
FROM node:18-alpine AS PRODUCTION

WORKDIR /app

COPY --from=BUILD /app/package*.json ./
COPY --from=BUILD /app/node_modules ./node_modules
COPY --from=BUILD /app/.next ./.next
COPY --from=BUILD /app/public ./public

EXPOSE 3000

CMD ["npm","run","start"]


