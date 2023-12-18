# Build BASE
FROM node:18-alpine as BASE

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# Build Image
FROM node:18-alpine AS BUILD

WORKDIR /app

COPY package*.json ./

COPY --from=BASE /app/node_modules ./node_modules

COPY . .

RUN npm run build

ENV NODE_ENV production

RUN npm ci --only=production && npm cache clean --force

# Build production
FROM node:18-alpine AS PRODUCTION

WORKDIR /app

COPY --from=BUILD /app/package*.json ./
COPY --from=BUILD /app/node_modules ./node_modules
COPY --from=BUILD /app/.next ./.next
COPY --from=BUILD /app/public ./public

EXPOSE 3000

CMD ["npm","run","start"]


