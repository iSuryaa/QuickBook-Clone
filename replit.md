# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

### QuickBook — Appointment Booking (`artifacts/quickbook`)

Mobile-first React + Vite appointment booking app (inspired by Swiggy/Zepto UX).

**Preview path**: `/`  **Port**: 21933  **Workflow**: `artifacts/quickbook: web`

**Features:**
- Home tab: greeting, category pills, featured horizontal scroll, popular near you, skeleton loading
- Explore tab: search, category filter pills, SlidersHorizontal filter sheet (rating, distance, open-only, price)
- Bookings tab: filter by status, booking cards with live queue indicator, cancel, details sheet
- Profile tab: user info, notifications, favourites, sign-out
- Login: 3-step flow — phone → OTP (demo: 123456) → name/email
- Business detail sheet: image hero, 3 tabs (Overview/Services/Reviews), Book Now CTA
- Booking flow sheet: 4 steps — service select, date/time picker, party size, confirm → success with token
- Queue tracker sheet: live animated position tracker with progress bar
- Notifications panel: categorized by type, mark all read
- Favourites sheet: saved businesses list

**Tech:**
- Tailwind CSS v4 with custom animations (fade-up, slide-up, scale-in, shimmer skeleton)
- Plus Jakarta Sans font
- Lucide icons throughout
- Local state management (useState hooks + module-level singletons for cross-component state)
- All data is mocked (8 businesses across 7 categories)
- No backend required — frontend-only app
- Indigo (#6366f1) accent color

**Key files:**
- `src/App.tsx` — root with ToastContainer
- `src/features/shared/AppShell.tsx` — all modal/sheet state management, tab routing
- `src/features/shared/tabs/` — HomeTab, ExploreTab, BookingsTab, ProfileTab
- `src/features/businesses/` — BusinessCard, BusinessDetailSheet, FilterSheet
- `src/features/bookings/` — BookingFlowSheet, BookingCard, BookingDetailSheet, QueueTrackerSheet
- `src/features/auth/LoginScreen.tsx` — 3-step login
- `src/features/profile/` — NotificationsPanel, FavouritesSheet
- `src/data/mock.ts` — all mock data + helpers (8 businesses, bookings, notifications)
- `src/store/` — authStore, bookingsStore, favoritesStore
- `src/index.css` — Tailwind v4 theme + custom animations
