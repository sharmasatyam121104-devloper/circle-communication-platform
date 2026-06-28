# ---------- Stage 1 : Build ----------
FROM node:22-alpine AS builder

WORKDIR /circle-api

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# ---------- Stage 2 : Production ----------
FROM node:22-alpine

WORKDIR /circle-api

ENV NODE_ENV=production

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=builder /circle-api/dist ./dist

EXPOSE 8080

CMD ["npm", "start"]