---
name: bike-rental-system
description: "Use when working on the Bike Rental System (React + Vite frontend and Spring Boot backend), including feature implementation, bug fixes, API integration, rental workflow logic, and validating changes with project-specific commands. Trigger phrases: bike rental, rental lifecycle, frontend-backend integration, Spring Boot API, React Vite UI, admin dashboard, rider flow, payment/debt, audit logs."
---

# Bike Rental System Skill

## Purpose

Provide a reliable workflow for implementing and validating changes in this repository with minimal regressions.

## Project Snapshot

- Monorepo layout:
  - `frontend/`: React 19 + Vite app
  - `backend/`: Java 21 + Spring Boot 3.3 + JPA + Flyway + PostgreSQL
- API client entrypoint:
  - `frontend/src/api/api.js`
- Backend package root:
  - `backend/src/main/java/com/bikerental/backend`

## When To Use

Use this skill when tasks involve one or more of:

- Rider/Admin UI behavior or page logic
- API integration between frontend and backend
- Rental lifecycle endpoints and state transitions
- Payment/debt or audit-related backend logic
- Bug fixes that touch either `frontend/` or `backend/`

## Core Workflow

1. Confirm scope and affected surfaces.
- Identify whether the task is frontend-only, backend-only, or cross-stack.
- Map touched feature to domain modules: `auth`, `bike`, `rental`, `payment`, `debt`, `audit`, `tracking`.

2. Inspect and align contracts first.
- For frontend work, verify request/response shape expected by `frontend/src/api/api.js` utilities (`unwrapApiResponse`, `getApiErrorMessage`).
- Keep response envelopes consistent (`success`, `data`, `error`) to avoid UI breakage.

3. Implement with minimal blast radius.
- Preserve existing folder conventions and naming style.
- Avoid broad refactors unless the task explicitly requires it.

4. Validate in the smallest relevant scope.
- Frontend checks:
  - `cd frontend && npm run lint`
  - `cd frontend && npm run build`
- Backend checks:
  - `cd backend && mvn test`
  - `cd backend && mvn spring-boot:run` (for runtime API verification)

5. Verify behavior-level invariants for rental flows.
- Enforce one non-terminal rental per bike (`RESERVED` or `ACTIVE`).
- Ensure unlock is allowed only when rental state is `ACTIVE`.
- Keep bike status transitions synchronized with rental state.
- Keep return flow transactional (close rental, update bike, record payment/debt effects).

## Implementation Guardrails

- Frontend:
  - Reuse shared components and stores before adding new primitives.
  - Keep API calls centralized via `frontend/src/api/api.js`.
  - Handle errors through consistent user-facing messages.

- Backend:
  - Prefer feature-first package boundaries.
  - Keep business rules in service layer, not controller layer.
  - Use migrations for schema changes (`backend/src/main/resources/db/migration`).

## Done Criteria

Consider a task complete only when:

- The relevant build/lint/tests pass for changed areas.
- API contracts remain compatible with frontend consumers.
- Rental/payment/debt state transitions are consistent.
- Changed files are limited to what the request requires.

## Common Tasks Playbook

- Add new API endpoint:
  - Define DTOs and validation.
  - Implement service rule checks.
  - Add controller mapping.
  - Connect frontend call through `api.js` and consuming store/page.
  - Validate with backend tests + frontend build.

- Fix UI/API integration bug:
  - Reproduce from page/store callsite.
  - Inspect network payload shape.
  - Fix mismatch in backend serializer or frontend unwrapping usage.
  - Re-verify affected user flow end-to-end.

- Introduce schema change:
  - Add Flyway migration.
  - Update JPA entities/repositories.
  - Verify existing flows and backward compatibility assumptions.

## Notes For The Agent

- Prefer precise, small edits and include only necessary code comments.
- Do not revert unrelated local changes.
- If unexpected workspace changes appear during work, pause and ask user how to proceed.
