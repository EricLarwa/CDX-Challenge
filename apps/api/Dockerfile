FROM oven/bun:1.2.15-alpine

WORKDIR /app

COPY package.json bun.lock turbo.json tsconfig.base.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/shared/package.json packages/shared/package.json
COPY packages/db/package.json packages/db/package.json

RUN bun install --frozen-lockfile

COPY . .

ENV NODE_ENV=production
ENV PORT=3001

RUN bun run db:generate

EXPOSE 3001

CMD ["bun", "run", "--filter", "@financeos/api", "start"]
