# Backend README

## Overview
The backend is a Spring Boot API for the Bike Rental System. It handles authentication, role-based authorization, bike fleet management, rental lifecycle, payment tracking, debt ledger, notifications, and audit logging.

## Tech Stack
- Java 21
- Spring Boot 3.3.x
- Spring Security (stateless token filter)
- Spring Data JPA
- Flyway migrations
- PostgreSQL
- Maven

## Current Architecture
Source root:
- `backend/src/main/java/com/bikerental/backend`

Main package groups:
- `config`: security and framework configuration
- `common`: shared API/error utilities
- `domain`: JPA entities and repositories by domain
- `modules`: feature modules (controllers/services/use-cases)
- `health`: operational health endpoint

Feature modules under `modules`:
- `auth`
- `user`
- `bike`
- `rental`
- `payment`
- `notification`
- `audit`

## Security Model
- Public endpoints:
  - `GET /actuator/health`
  - `GET /api/health`
  - `POST /api/auth/login`
  - `POST /api/auth/register`
  - `GET /api/bikes`
- Admin-only endpoints include:
  - bike mutations (`POST/PUT/PATCH/DELETE /api/bikes/**`)
  - user listing (`GET /api/users`)
  - payments overview (`GET /api/payments`, `GET /api/payments/balances`)
  - audit logs (`/api/audit-logs/**`)
- Other `/api/**` routes require authentication.

## Database and Schema
Migrations:
- `backend/src/main/resources/db/migration/V1__initial_schema.sql`
- `backend/src/main/resources/db/migration/V2__align_payments_currency_type.sql`
- `backend/src/main/resources/db/migration/V3__rename_users_campus_id_to_student_id.sql`
- `backend/src/main/resources/db/migration/V4__seed_demo_data.sql`

Core tables:
- `users`, `user_consents`
- `bikes`, `bike_location_history`
- `rentals`, `rental_route_points`
- `payments`, `debt_ledger`
- `audit_logs`, `notifications`

Business constraints:
- one non-terminal rental per bike
- one non-terminal rental per user
- strict lifecycle states for bike and rental transitions

## Runtime Configuration
Main config file:
- `backend/src/main/resources/application.yml`

Key environment variables:
- `PORT`
- `SPRING_PROFILES_ACTIVE`
- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`

## Local Run
```bash
cd backend
./mvnw clean verify
./mvnw spring-boot:run
```

Health checks:
- `http://localhost:8080/actuator/health`
- `http://localhost:8080/api/health`

## API Domains (High Level)
- Auth: register/login
- Bikes: browse + admin fleet operations
- Rentals: start, reserve, activate, return, history
- Payments/Debt: settlement and outstanding balance
- Admin Ops: audit logs, operational listings

## Notes
- The backend is currently configured for token-based auth with server-side token validation.
- For deployment details and CI/CD, see repository root `README.md`.
