# Frontend README

## Overview
This frontend is a React single-page application for the Bike Rental System. It provides rider and admin experiences, map-based bike discovery, rental flows, payment UX, and role-based route protection.

## Tech Stack
- React 19
- Vite 7
- React Router
- Zustand state management
- Axios API client
- Tailwind CSS
- Leaflet + React Leaflet

## Current Architecture
Source root:
- `frontend/src`

Primary folders:
- `pages`: route-level screens for rider/admin/auth/home
- `components`: shared UI and domain components
- `store`: Zustand stores (`useAuthStore`, `useBikeStore`, `useNotificationStore`)
- `api`: API client setup (`api.js`)
- `utils`: utility helpers (bike data adapters, payment helpers, ride access)
- `styles`: app-wide CSS

Key route groups:
- Auth pages: login/register/permissions
- Rider pages: browse bikes, manage rentals, tracking, payment, history
- Admin pages: dashboard, users, payments, debt, audit logs, live tracking

## State and API Integration
- Auth state is centralized in `useAuthStore`.
- Bike and rental state is centralized in `useBikeStore`.
- `api/api.js` sets base URL via `VITE_API_BASE_URL` and automatically attaches bearer token when present.

Environment variable:
- `VITE_API_BASE_URL` (default local fallback: `http://localhost:8080/api`)

## UX and Functional Behavior
- Responsive rider/admin flows with mobile bottom tab navigation.
- GPS and QR checks before rental start.
- Live map visualization and route-to-bike assistance.
- Return/payment flow with GPS recapture and validation.

## Local Development
```bash
cd frontend
npm ci
npm run dev
```

Build and preview:
```bash
npm run build
npm run preview
```

## Production Container
Frontend container is built from:
- `frontend/Dockerfile`

Nginx runtime config:
- `frontend/nginx.conf`

Runtime proxy variable:
- `API_UPSTREAM` (default: `backend:8080` for local compose)

## Notes
- Deployment and CI/CD details are documented in repository root `README.md`.
