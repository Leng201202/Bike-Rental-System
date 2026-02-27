# 🛠️ Implementation Guide — Branching & Workflow

## Branching Strategy (Git Flow Simplified)

```
main          ●───●───●───●───●───●───●  (production, always deployable)
               \       ↑       ↑
dev             ●──●──●──●──●──●        (integration branch)
                 \   ↑   \   ↑
feature branches  ●──●     ●──●         (one per feature)
```

| Branch | Purpose | Deploys to |
|--------|---------|------------|
| `main` | Production-ready code | Vercel (prod) + Render |
| `dev` | Integration & testing | Vercel (preview) |
| `feature/*` | Individual features | Nothing (PR to dev) |

---

## Workflow

1. **Start a feature** — branch off `dev` with a name like `feature/backend-models`
2. **Work & commit** — use commit prefixes like `feat(backend):`, `fix(frontend):`, `docs:`, `chore:`
3. **Push & PR** — push to GitHub, create a Pull Request targeting `dev`; CI runs automatically
4. **Merge** — after review and CI passes, merge into `dev`, delete the feature branch
5. **Release** — when `dev` is stable, merge `dev` into `main`; Vercel + Render auto-deploy

---

## Implementation Phases

### Phase 1: Backend Models (branch: `feature/backend-models`)
- Create `Bike` entity — fields: id, name, type (MOUNTAIN/ROAD/CITY/ELECTRIC), status (AVAILABLE/RENTED/MAINTENANCE), pricePerHour, imageUrl, description
- Create `User` entity — fields: id, username, email, role (RIDER/ADMIN), fullName
- Create `Rental` entity — fields: id, bike (FK), user (FK), startTime, endTime, totalCost, status (ACTIVE/COMPLETED/CANCELLED)
- Create JPA repositories for each entity: `BikeRepository`, `UserRepository`, `RentalRepository`
- Create `CorsConfig` to allow requests from `http://localhost:5173`

### Phase 2: Backend API (branch: `feature/backend-api`)
- Create services: `BikeService`, `UserService`, `RentalService` with CRUD + business logic
- Create REST controllers:
  - `BikeController` — GET/POST/PUT/DELETE at `/api/bikes`
  - `UserController` — GET/POST at `/api/users`
  - `RentalController` — GET/POST at `/api/rentals`, PUT at `/api/rentals/{id}/return`
- Create `DataSeeder` — seed sample bikes, one rider user, and one admin user on startup

### Phase 3: Frontend Core (branch: `feature/frontend-core`)
- Install dependencies: `react-router-dom` and `axios`
- Create API service layer (`src/api/apiService.js`) — axios instance pointing to backend, export functions for all endpoints
- Create design system (`src/index.css`) — CSS variables for colors, dark theme, card styles (glassmorphism), button styles, hover animations
- Create shared components:
  - `Navbar` — logo, nav links (Home, Bikes, Dashboard), role toggle (Rider ↔ Admin)
  - `BikeCard` — displays bike image, name, type, price, status badge, rent button
  - `StatusBadge` — colored badge (green=available, red=rented, yellow=maintenance)
  - `RentalCard` — rental info with bike name, dates, cost, status
  - `LoadingSpinner` — spinner for API loading states
  - `Modal` — reusable modal for forms and confirmations
- Set up routing in `App.jsx` — routes for Home (`/`), Bikes (`/bikes`), Rider (`/rider`), Admin (`/admin`)

### Phase 4: Frontend Rider Pages (branch: `feature/frontend-rider`)
- **Home Page** — hero section with CTA, stats bar (total/available bikes), featured bikes grid
- **Bikes Page** — search bar, filter by type, responsive bike grid, rent action with confirmation
- **Rider Dashboard** — welcome header, stats cards (active rentals, total spent, rides), active rentals list with "Return" button, rental history table

### Phase 5: Frontend Admin Pages (branch: `feature/frontend-admin`)
- **Admin Dashboard** — overview cards (total bikes, users, active rentals, revenue), bike management table with add/edit/delete, all rentals table with status filter, users table

---

## Quick Reference

- **Create dev branch (one-time)**: branch off `main`, push to origin
- **Start feature**: checkout `dev`, pull latest, create `feature/` branch
- **Finish feature**: create PR to `dev`, merge after CI passes, delete branch
- **Release**: merge `dev` into `main`, push
- **Run backend locally**: `./mvnw spring-boot:run` in `backend/` → port 8080
- **Run frontend locally**: `npm run dev` in `frontend/` → port 5173
