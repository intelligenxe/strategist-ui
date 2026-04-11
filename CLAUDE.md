# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build (also validates TypeScript)
npm run start    # Serve production build
npm run lint     # ESLint (eslint-config-next with core-web-vitals + typescript)
```

## Architecture

Next.js 16 App Router with TypeScript, Tailwind CSS v4, and Headless UI.

```
src/
  app/              # Pages (App Router)
  components/       # Reusable UI components
  contexts/         # React context providers (AuthContext)
  hooks/            # Custom React hooks
  services/         # API communication layer
  types/            # Shared TypeScript interfaces
```

### Key patterns

- **Authentication**: `AuthContext` (`src/contexts/AuthContext.tsx`) provides `useAuth()` hook with `login`, `register`, `logout`, `user`, `isAuthenticated`. Token stored in `localStorage("auth")`. `Providers.tsx` wraps the app in `layout.tsx` to keep it a server component.
- **Route protection**: `useStrategist` hook redirects unauthenticated users to `/login`. Login page redirects authenticated users to `/strategist`.
- **State management**: The `useStrategist` hook (`src/hooks/useStrategist.ts`) centralizes all form state and API logic for the Strategist page (upload, URL ingestion, query, stats, document management). Components receive state via props — no global state manager.
- **API layer**: `src/services/api.ts` uses `fetch` to call local proxy routes. Authenticated requests include `Authorization: Token <key>` header. A shared `authFetch()` helper handles 401 responses globally (clears token, redirects to `/login`).
- **Client vs Server components**: Pages are server components by default. Components needing browser APIs, event handlers, or React state use `"use client"`. Navbar remains a server component with `NavAuth` as a client island.
- **Headless UI**: Used only for the dropdown (`OptionDropdown` uses `Listbox`). All other inputs use standard HTML elements.
- **Styling**: Tailwind utility classes directly in JSX. Custom theme variables defined in `src/app/globals.css`. Fonts: Geist Sans/Mono.

### API proxy routes

External APIs at `intelligenxe.org` don't support CORS, so all requests are proxied through Next.js API routes (`src/app/api/`). Authenticated routes forward the `Authorization` header from the client request.

- `src/app/api/auth/register/route.ts` → POST to `/api/rag/register/` (no auth)
- `src/app/api/auth/login/route.ts` → POST to `/api/rag/login/` (no auth)
- `src/app/api/rag/upload/route.ts` → POST to `/api/rag/upload/` (auth, FormData)
- `src/app/api/rag/query/route.ts` → POST to `/api/rag/query/` (auth, JSON)
- `src/app/api/rag/stats/route.ts` → GET to `/api/rag/stats/` (auth)
- `src/app/api/rag/ingest-urls/route.ts` → POST to `/api/rag/ingest-urls/` (auth, JSON)
- `src/app/api/rag/documents/[filename]/route.ts` → DELETE to `/api/rag/documents/<filename>/` (auth)
- `src/app/api/rag/documents/delete/route.ts` → POST to `/api/rag/documents/delete/` (auth, JSON — body-based deletion for URL documents)
- `src/app/api/rag/clear/route.ts` → DELETE to `/api/rag/clear/` (auth)

### API endpoints consumed

- `POST /api/auth/register` — register new user (returns `AuthUser` with token)
- `POST /api/auth/login` — login (returns `AuthUser` with token)
- `POST /api/rag/upload` — upload PDF document with extraction_method
- `POST /api/rag/query` — query knowledge base with question and top_k
- `GET /api/rag/stats` — get user's chunk count and document list
- `POST /api/rag/ingest-urls` — ingest URLs into knowledge base (sends `urls[]` and `source_type`)
- `DELETE /api/rag/documents/<filename>` — delete a specific document
- `POST /api/rag/documents/delete` — delete a document by body payload (used for URL-sourced documents)
- `DELETE /api/rag/clear` — wipe user's knowledge base

## Environment

Copy `.env.local` and set:
- `NEXT_PUBLIC_API_BASE_URL` — backend URL (defaults to `http://localhost:8000`)
- `RAG_API_URL` — external RAG API base URL (server-only, defaults to `https://intelligenxe.org/api/rag`)

## Path alias

`@/*` maps to `./src/*` (configured in tsconfig.json).
