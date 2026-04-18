# Backend Implementation Guide

This guide sets up and implements the backend for the Bike Rental System based on:
- [BACKEND_ERD_PREPARATION.md](BACKEND_ERD_PREPARATION.md)
- Existing frontend behavior in [frontend/src](frontend/src)

## 1. Backend Stack

- Java 21
- Spring Boot 3.3.x
- PostgreSQL
- Flyway migrations
- Spring Data JPA
- Spring Security (JWT phase-in)
- Maven

Backend project path:
- [backend](backend)

## 2. What Is Already Scaffolded

Created in this setup:
1. Maven project file: [backend/pom.xml](backend/pom.xml)
2. Spring Boot app entrypoint: [backend/src/main/java/com/bikerental/backend/BikeRentalBackendApplication.java](backend/src/main/java/com/bikerental/backend/BikeRentalBackendApplication.java)
3. Basic security config: [backend/src/main/java/com/bikerental/backend/config/SecurityConfig.java](backend/src/main/java/com/bikerental/backend/config/SecurityConfig.java)
4. Health endpoint: [backend/src/main/java/com/bikerental/backend/health/HealthController.java](backend/src/main/java/com/bikerental/backend/health/HealthController.java)
5. Environment/config file: [backend/src/main/resources/application.yml](backend/src/main/resources/application.yml)
6. Initial Flyway migration: [backend/src/main/resources/db/migration/V1__initial_schema.sql](backend/src/main/resources/db/migration/V1__initial_schema.sql)
7. Env template: [backend/.env.example](backend/.env.example)

## 3. Local Setup Steps

1. Install Java 21 and Maven.
2. Start PostgreSQL and create database `bike_rental`.
3. Copy [backend/.env.example](backend/.env.example) values into your shell/session.
4. Run backend:

```bash
cd backend
mvn spring-boot:run
```

5. Verify health endpoints:
- `GET http://localhost:8080/actuator/health`
- `GET http://localhost:8080/api/health`

## 4. Backend Package Structure (Recommended)

Use feature-first modules:

```text
backend/src/main/java/com/bikerental/backend/
  auth/
  user/
  bike/
  rental/
  payment/
  debt/
  tracking/
  audit/
  notification/
  common/
    config/
    error/
    security/
    util/
```

For each feature module:
- `controller`
- `service`
- `repository`
- `entity`
- `dto`
- `mapper`

## 5. Implementation Order

## Phase 1: Core Transaction Flows

1. Auth + users
- Register/login
- Role checks (`ADMIN`, `RIDER`)
- Rider consent gate

2. Bike browsing and admin fleet CRUD
- Read fleet with filters
- Admin add/update/delete bikes

3. Rental lifecycle
- Create immediate rental
- Create reservation (30 mins)
- Activate reservation
- Cancel reservation
- Unlock ride
- Return ride

4. Payment and debt core
- Create payment attempts
- Ledger charge/payment entries
- Debt balance endpoint

## Phase 2: Admin Operations

1. Payment management list/filter.
2. Debt management list/filter/notify.
3. Audit logging on all admin mutations.
4. User summary endpoint for admin dashboard cards/tables.

## Phase 3: Tracking and Policy Features

1. Track points ingestion (`/track-points`).
2. Optional route points persistence.
3. Privacy endpoint and account lifecycle actions.
4. Reservation expiry scheduler.

## 6. API Endpoints to Implement First

Priority API list:

1. `POST /api/auth/register`
2. `POST /api/auth/login`
3. `GET /api/users/me`
4. `PATCH /api/users/me`
5. `PUT /api/users/me/consents`
6. `GET /api/bikes`
7. `POST /api/admin/bikes`
8. `PATCH /api/admin/bikes/{bikeId}`
9. `DELETE /api/admin/bikes/{bikeId}`
10. `POST /api/rentals`
11. `POST /api/rentals/{id}/activate`
12. `POST /api/rentals/{id}/cancel`
13. `POST /api/rentals/{id}/unlock`
14. `POST /api/rentals/{id}/return`
15. `GET /api/rentals/active`
16. `GET /api/rentals/history`
17. `GET /api/admin/payments`
18. `GET /api/admin/debts`
19. `POST /api/admin/debts/{userId}/notify`
20. `GET /api/admin/audit-logs`

From feature coverage audit, also add:
21. `PATCH /api/users/me/privacy`
22. `POST /api/users/me/deactivate`
23. `POST /api/users/me/delete-request`
24. `POST /api/users/me/change-password`
25. `GET /api/admin/users/summary`

## 7. Critical Backend Rules

1. Reservation expiry must be enforced server-side.
2. Unlock only when rental is `ACTIVE`.
3. Enforce unlock policy checks (code/proximity/override mode).
4. Maintain single non-terminal rental per bike (`RESERVED` or `ACTIVE`).
5. Keep bike status consistent with rental state.
6. Return flow must be atomic in one transaction:
- close rental
- update bike status
- write payment/debt entries

## 8. Frontend Compatibility Notes

1. Frontend map may display computed `ACTIVE` state for bikes.
- Persisted bike status should remain `AVAILABLE|RESERVED|RENTED|MAINTENANCE`.

2. Frontend currently uses mocks in several modules.
- Implement backend responses with same shape before removing mock state.

3. Frontend expects transaction code for payment confirmation.
- Backend should generate and return `transaction_code` for each payment attempt.

## 9. Testing Plan

1. Unit tests for service state transitions.
2. Integration tests for rental lifecycle with PostgreSQL Testcontainers.
3. API tests for auth and role restrictions.
4. Data consistency tests for payment/debt ledger balance.

Suggested commands:

```bash
cd backend
mvn test
mvn spring-boot:run
```

## 10. Deployment Checklist

1. Set production env vars for DB and security keys.
2. Run Flyway migrations at startup.
3. Enable HTTPS and secure CORS policy.
4. Add API rate limits on login/unlock/payment endpoints.
5. Enable actuator health/readiness for platform probes.

## 11. Next Practical Step

Implement these first three modules end-to-end:
1. `auth`
2. `bike`
3. `rental`

Then wire frontend [frontend/src/api/api.js](frontend/src/api/api.js) calls to real endpoints and remove corresponding mock behaviors in stores.
