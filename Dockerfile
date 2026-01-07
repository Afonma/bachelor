FROM node:22.19.0 AS base

FROM base AS builder

WORKDIR /app

COPY package.jspn ./

RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build

FROM base as runner

WORKDIR /app

ENV NODE_ENV=development

COPY --chown=nodejs:nodejs package.json ./

RUN npm install --production

COPY --chown=nodejs:nodejs --from=builder /app/dist ./dist
COPY --chown=nodejs:nodejs --from=builder /app/prisma/generated ./prisma/generated

CMD ["node", "dist/main"]