FROM oven/bun:1.2.15-alpine

WORKDIR /app

COPY package.json bun.lock turbo.json tsconfig.base.json ./
COPY apps/web/package.json apps/web/package.json
COPY apps/api/package.json apps/api/package.json
COPY packages/shared/package.json packages/shared/package.json
COPY packages/db/package.json packages/db/package.json

RUN bun install --frozen-lockfile

COPY . .

ARG VITE_API_URL=http://localhost:3001/api/v1
ARG VITE_API_LOCAL_URL=http://localhost:3001/api/v1
ARG VITE_API_PRODUCTION_URL=https://financeos-api.vercel.app/api/v1
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_API_LOCAL_URL=${VITE_API_LOCAL_URL}
ENV VITE_API_PRODUCTION_URL=${VITE_API_PRODUCTION_URL}

RUN bun run --filter @financeos/web build

WORKDIR /app/apps/web

EXPOSE 4173

CMD ["bun", "run", "start", "--", "--host", "0.0.0.0", "--port", "4173"]
