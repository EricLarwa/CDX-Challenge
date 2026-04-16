# FinanceOS

FinanceOS is a full-stack financial operating system for freelancers and small businesses. This repository is organized as a Turborepo monorepo with separate web, API, shared, and database packages.

## Quick start

1. Copy `.env.example` to `.env` and update secrets.
2. Install dependencies:
   `bun install`
3. Start infrastructure:
   `docker compose up -d postgres`
4. Generate Prisma client and run migrations:
   `bun run db:generate && bun run db:migrate`
5. Seed demo data:
   `bun run db:seed`
6. Start the app:
   `bun run dev`

## Workspace layout

- `apps/web` - React + Vite frontend
- `apps/api` - Express + TypeScript REST API
- `packages/shared` - shared Zod schemas and TypeScript types
- `packages/db` - Prisma schema, migrations, and seed data

## Current status

This scaffold covers Sprint 0 foundations:

- Turborepo + Bun workspace setup
- Shared API envelope and domain schemas
- Prisma schema + realistic seed script
- API and web application skeletons
- Docker Compose + CI baseline
