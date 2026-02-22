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
  hooks/            # Custom React hooks
  services/         # API communication layer
  types/            # Shared TypeScript interfaces
```

### Key patterns

- **State management**: The `useStrategist` hook (`src/hooks/useStrategist.ts`) centralizes all form state and API submission logic for the Strategist page. Components receive state via props — no global state manager.
- **API layer**: `src/services/api.ts` uses `fetch` with `FormData` for file uploads. Backend URL configured via `NEXT_PUBLIC_API_BASE_URL` env var (defaults to `http://localhost:8000`).
- **Client vs Server components**: Pages are server components by default. Components needing browser APIs, event handlers, or React state use `"use client"` (FileUpload, OptionDropdown, NavLink, strategist page).
- **Headless UI**: Used only for the dropdown (`OptionDropdown` uses `Listbox`). All other inputs use standard HTML elements.
- **Styling**: Tailwind utility classes directly in JSX. Custom theme variables defined in `src/app/globals.css`. Fonts: Geist Sans/Mono.

### API proxy routes

External APIs that don't support CORS are proxied through Next.js API routes (`src/app/api/`) to avoid browser restrictions. The client calls our local route, which forwards the request server-side.

- `src/app/api/analyze/route.ts` → proxies to `https://intelligenxe.org/api/chk/analyze/`

### API endpoints consumed

- `GET /options` — fetches dropdown options (returns `ApiOption[]`)
- `POST /strategist` — submits FormData with file, prompt, option, parameter_value (returns `StrategistResponse`) *(currently unused — will be wired up later)*
- `POST /api/analyze` — proxied; sends PDF as FormData (`document` field) for analysis (returns `StrategistResponse`)

## Environment

Copy `.env.local` and set `NEXT_PUBLIC_API_BASE_URL` to your backend URL.

## Path alias

`@/*` maps to `./src/*` (configured in tsconfig.json).
