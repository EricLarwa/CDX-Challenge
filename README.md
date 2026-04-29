# FinanceOS

FinanceOS is a full-stack financial operating system for freelancers and small businesses. This repository is organized as a Turborepo monorepo with separate web, API, shared, and database packages.

## What is live today

FinanceOS already includes:

- JWT auth with registration and sign-in flows
- invoice create, edit, send, cancel, delete, payment recording, and PDF download
- expense logging, categorization suggestions, anomaly checks, analytics, and filtering
- dashboard KPIs, alerts, cash flow, clients, vendors, reports, settings, and exports
- shared Zod schemas and typed API contracts across web and API
- Vitest coverage on the API lane and Playwright coverage on the main product flows

## Quick start

1. Copy `.env.example` to `.env` and update secrets.
2. Install dependencies:
   `bun install`
3. Start infrastructure:
   `docker compose up -d postgres`
4. Generate Prisma client and run migrations:
   `bun run db:generate && bun run db:migrate`
5. Optional: seed local sample data:
   `bun run db:seed`
   This is for local development only and is not used by the production deploy flow.
6. Start the app:
   `bun run dev`

## Useful commands

- `bun run dev` - start API and web locally
- `bun run lint` - run ESLint across the monorepo
- `bun run typecheck` - run TypeScript checks across the monorepo
- `bun run test` - run Vitest suites
- `bun run test:e2e -- --list` - list Playwright scenarios
- `bun run build` - build all packages

## Docker development

- `docker compose up --build` starts Postgres, the API, and the web app
- the API health endpoint is available at `http://localhost:3001/api/v1/health`
- the web app is available at `http://localhost:5173`

## Deployment targets

### Railway API

- `railway.json` is configured for the API service
- `apps/api/Dockerfile` builds a Bun-based API container
- set Railway environment variables to match `.env.example`
- provision PostgreSQL and point `DATABASE_URL` at the Railway database
- set `ENABLE_JOBS=true` only in the environment where you want reminder/overdue cron jobs to run
- Railway can use `/api/v1/ready` as the readiness path and `/api/v1/health` as a basic liveness path

### Vercel projects

- use separate Vercel projects for `apps/api` and `apps/web`
- set the API project's Root Directory to `apps/api`
- set the web project's Root Directory to `apps/web`
- `apps/api/vercel.json` is now API-specific and `apps/web/vercel.json` is web-specific
- `apps/web/Dockerfile` is still available for container-based hosting if needed
- set the web project's `VITE_API_PRODUCTION_URL` to `https://financeos-api.vercel.app/api/v1`
- set the API project's `FRONTEND_PRODUCTION_URL` to `https://finance-os-six-zeta.vercel.app`
- `VITE_API_URL` and `FRONTEND_URL` still work as explicit overrides when a deployment needs to point somewhere custom
- do not seed public demo credentials into production; use the registration flow to create live accounts
- if you deploy with the CLI, run `vercel link` from inside each app directory so each app is linked to the correct Vercel project

## Workspace layout

- `apps/web` - React + Vite frontend
- `apps/api` - Express + TypeScript REST API
- `packages/shared` - shared Zod schemas and TypeScript types
- `packages/db` - Prisma schema, migrations, and seed data

## Current status

FinanceOS is well beyond scaffold stage and into the Sprint 5 hardening/polish phase:

- production-oriented route splitting and React Query cache tuning are in place
- shared empty, loading, skeleton, and error-boundary states are wired through the product
- exports and print flows are available across major finance surfaces
- the Playwright suite currently covers auth, invoices, expenses, clients, vendors, filters, settings, navigation, and fallback routes
