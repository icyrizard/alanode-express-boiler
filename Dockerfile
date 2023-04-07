# Install dependencies only when needed
FROM node:16-alpine3.16 AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.

RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json ./
RUN npm install

# Rebuild the source code only when needed
FROM node:16-alpine3.16 AS builder
ARG NODE_ENV

WORKDIR /app

COPY . .
COPY --from=deps /app/node_modules ./node_modules

RUN npm run build

FROM node:16-alpine3.16 AS runner


RUN npm install pm2 -g

WORKDIR /app

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

RUN addgroup -g 1001 -S nodejs
RUN adduser -S alanode -u 1001

# RUN chown alanode:nodejs /app

COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./
COPY --from=builder /app/entrypoint.sh ./

RUN chown -R alanode:nodejs /usr/local/bin/pm2
RUN chown -R alanode:nodejs /usr/local/bin/pm2-runtime

EXPOSE 80
# USER alanode

RUN npm run prisma:init


CMD ["./entrypoint.sh"]