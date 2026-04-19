# Bike Rental System

Campus bike rental platform with a React frontend and Spring Boot backend. The system supports rider and admin workflows including authentication, fleet operations, rental lifecycle management, payments, debt tracking, and audit logging.

## Project Specifications

### Core Domains
1. Authentication and authorization
2. Bike fleet management
3. Rental lifecycle (immediate/reserved)
4. Payment and debt handling
5. Admin monitoring and audit logs
6. Live tracking and map-assisted UX

### Roles
1. Rider: browse/rent/return bikes, manage profile, pay outstanding balances
2. Admin: manage bikes, users, payment/debt visibility, and audit operations

### Architecture
1. Frontend: React + Vite SPA
2. Backend: Spring Boot REST API
3. Database: PostgreSQL with Flyway migrations
4. Deployment: Render (frontend + backend), GitHub Actions CI/CD

### Repository Structure
```text
.
├── backend/                 # Spring Boot backend service
│   ├── src/main/java/...
│   ├── src/main/resources/
│   └── README.md
├── frontend/                # React + Vite frontend service
│   ├── src/
│   ├── public/
│   └── README.md
├── docker-compose.yml       # Local full-stack compose (frontend/backend/db)
├── render.yaml              # Render blueprint for production services
└── .github/workflows/ci-cd.yml
```

## Service Specifications

### Backend
- Java 21 / Spring Boot 3.3.x
- Spring Security with token auth filter
- JPA + Flyway + PostgreSQL
- Domain modules: auth, user, bike, rental, payment, notification, audit

Backend details:
- See `backend/README.md`

### Frontend
- React 19 / Vite 7
- Zustand state management
- Axios API client
- React Router and Leaflet maps

Frontend details:
- See `frontend/README.md`

## Local Development

### Option A: Docker Compose (recommended)
```bash
docker compose up -d --build
```

Local URLs:
1. Frontend: `http://localhost:5173`
2. Backend API: `http://localhost:8080`
3. Health via frontend proxy: `http://localhost:5173/api/health`

### Option B: Run services separately

Backend:
```bash
cd backend
./mvnw spring-boot:run
```

Frontend:
```bash
cd frontend
npm ci
npm run dev
```

## Deployment Guide (Render)

The project is deployed with two Render web services:
1. `bike-rental-backend` using `backend/Dockerfile`
2. `bike-rental-frontend` using `frontend/Dockerfile`

### Render Environment Variables

Backend service:
1. `SPRING_PROFILES_ACTIVE=prod`
2. `DB_URL=jdbc:postgresql://<host>:5432/<db>`
3. `DB_USERNAME=<username>`
4. `DB_PASSWORD=<password>`

Frontend service:
1. `API_UPSTREAM=bike-rental-backend:8080`

### CI/CD (GitHub Actions)

Workflow:
- `.github/workflows/ci-cd.yml`

Pipeline behavior:
1. Build and verify backend
2. Build frontend
3. Validate deploy hook secrets
4. Trigger Render deploy hooks for frontend and backend on push to `main`

Required repository secrets:
1. `RENDER_FRONTEND_DEPLOY_HOOK_URL`
2. `RENDER_BACKEND_DEPLOY_HOOK_URL`

## Production Checks

After deployment:
1. Open frontend domain root (`/`)
2. Verify API health through frontend proxy (`/api/health`)
3. Confirm login, bike browse, and rental flow

## Additional Notes

1. Render free tier can sleep when idle.
2. Keep migration scripts as source of truth for schema changes.
3. For architecture deep-dives, use `backend/README.md` and `frontend/README.md`.
