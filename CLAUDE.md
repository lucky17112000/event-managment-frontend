# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun dev          # Start dev server (uses Bun runtime, not Node)
bun build        # Production build
bun start        # Start production server
bun lint         # Run ESLint
```

All Next.js commands use `bun --bun` flag — do not use `npm run` or `npx next`.

## Architecture Overview

**EcoSpark** is a Next.js 16 + React 19 idea marketplace where users submit eco-friendly ideas for review, voting, and purchase.

### API Proxy Pattern

The frontend never calls the backend directly. All API calls go through Next.js route handlers in [src/app/api/](src/app/api/), which forward requests to `NEXT_PUBLIC_BACKEND_URL`. This keeps JWT secrets server-side and handles CORS transparently. Multipart uploads are streamed to avoid buffering in memory.

### Data Fetching

- **TanStack React Query v5** handles all client-side data fetching. The `QueryProvider` in [src/lib/provider/QueryProvider.tsx](src/lib/provider/QueryProvider.tsx) uses `ReactQueryStreamedHydration` for SSR hydration.
- Service functions in [src/services/](src/services/) call the local `/api/*` proxy routes (not the backend directly).
- The Axios wrapper in [src/lib/axios/httpClient.ts](src/lib/axios/httpClient.ts) is an async factory (`axiosInstance()`) that reads cookies at call time and auto-refreshes tokens expiring within 5 minutes.

### Authentication

JWT tokens are stored in HTTP-only cookies. Server-side verification uses `jsonwebtoken` with `JWT_ACCESS_SECRET`. Route protection is done inline via `cookies()` from `next/headers` — **there is no middleware.ts**. Role checks use helpers in [src/lib/authUtiles.ts](src/lib/authUtiles.ts).

User roles: `USER`, `ADMIN`, `SUPER_ADMIN`, `GUEST`.

Protected route patterns:

- `/dashboard/**` — USER
- `/admin/dashboard/**` — ADMIN or SUPER_ADMIN
- `/my-profile`, `/change-password` — any authenticated user

### Layout & Routing

App Router with two root layouts:

- `commonLayout` — public pages + auth pages
- `dashboardLayout` — user dashboard + admin panel (route groups under `(user)` and `(admin)`)

### Component Organization

- [src/components/ui/](src/components/ui/) — shadcn/ui primitives (do not edit these manually; regenerate via shadcn CLI)
- [src/components/shared/](src/components/shared/) — app-wide reusables (Navbar, Footer, loading states)
- [src/components/modules/](src/components/modules/) — feature-specific components (auth forms, dashboard cards, admin tables)

### Forms & Validation

TanStack React Form + Zod v4. Schemas live in [src/zod/](src/zod/). Use `@tanstack/react-form` with Zod adapter — not `react-hook-form`.

### Styling

Tailwind CSS v4 via PostCSS (`@tailwindcss/postcss`). Colors use OKLch color space. Custom animations defined in [src/app/globals.css](src/app/globals.css): `eco-float`, `eco-marquee`, `eco-fade-up`, `eco-ken-burns`, `eco-shimmer`. The setup respects `prefers-reduced-motion`.

### Path Aliases

`@/*` maps to `src/*`.

## Environment Variables

| Variable                   | Purpose                                                |
| -------------------------- | ------------------------------------------------------ |
| `NEXT_PUBLIC_API_BASE_URL` | Backend API base (e.g. `http://localhost:5000/api/v1`) |
| `NEXT_PUBLIC_BACKEND_URL`  | Backend origin (e.g. `http://localhost:5000`)          |
| `JWT_ACCESS_SECRET`        | Server-side JWT verification (never exposed to client) |
| `NEXT_PUBLIC_APP_URL`      | Frontend origin (e.g. `http://localhost:3000`)         |

## Key Gotchas

- **Dynamic rendering is intentional.** Pages using `cookies()` are not statically generated — this is expected and required for auth.
- **Bun runtime only.** The `--bun` flag uses Bun's JS runtime instead of Node; remove it only if switching runtimes deliberately.
- **React Query server/client split.** `QueryProvider` creates separate `QueryClient` instances for server vs. browser to pridea cross-request state pollution.
- **API response shape** is always `{ success, message, data, meta? }` — unwrap `data` before using in components.
