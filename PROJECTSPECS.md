# Project Specifications: Campus Bike Rental System

## 1. Project Overview
The **Campus Bike Rental System** is a full-stack web application designed to facilitate bicycle rentals for students (Riders) and management for staff (Administrators). It features a modern, responsive UI with real-time-like interactions, dark-themed aesthetics, and a robust Spring Boot backend.

## 2. Core Features

### 🟢 Rider Features
- **Browse Bikes**: View available bikes with details (type, price, status).
- **Search & Filter**: Find bikes by name or type (MTB, Road, City, Electric).
- **Rent Bike**: High-fidelity rental process with duration selection and price calculation.
- **Rider Dashboard**: Manage active rentals, view rental history, and track spending.
- **Live Tracking**: Visual simulation of bike status during an active rental.
- **User Profile**: Manage personal account details.

### 🔴 Administrator Features
- **Admin Dashboard**: Overview of system-wide metrics (total bikes, revenue, active sessions).
- **Bike Management**: Full CRUD operations for the bike inventory.
- **Rental Oversight**: View and filter all rental transactions across the system.
- **User Management**: Monitor registered users and their roles.

## 3. Technical Stack

### Frontend
- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 7](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Routing**: [React Router 7](https://reactrouter.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/)
- **Maps**: [React Leaflet](https://react-leaflet.js.org/) (for tracking visualization)

### Backend
- **Framework**: [Spring Boot 3.4.3](https://spring.io/projects/spring-boot)
- **Language**: Java 17
- **Data Access**: Spring Data JPA
- **Database**: H2 (In-memory, for development)
- **Utilities**: Lombok

## 4. Data Model

### `Bike` Entity
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | Long | Primary Key |
| `name` | String | Model name |
| `type` | Enum | `MOUNTAIN`, `ROAD`, `CITY`, `ELECTRIC` |
| `status` | Enum | `AVAILABLE`, `RENTED`, `MAINTENANCE` |
| `pricePerHour` | Double | Rental cost per hour |
| `imageUrl` | String | Path/URL to bike image |
| `description` | String | Brief detail about the bike |

### `User` Entity
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | Long | Primary Key |
| `username` | String | Unique username |
| `email` | String | User email |
| `role` | Enum | `RIDER`, `ADMIN` |
| `fullName` | String | User's full name |

### `Rental` Entity
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | Long | Primary Key |
| `bike` | Bike | FK to Bike |
| `user` | User | FK to User |
| `startTime` | LocalDateTime | Start of rental |
| `endTime` | LocalDateTime | End of rental |
| `totalCost` | Double | Calculated final cost |
| `status` | Enum | `ACTIVE`, `COMPLETED`, `CANCELLED` |

## 5. API Endpoints (Base URL: `/api`)

### Bikes
- `GET /bikes`: List all bikes.
- `POST /bikes`: Create new bike (Admin).
- `PUT /bikes/{id}`: Update bike details (Admin).
- `DELETE /bikes/{id}`: Remove bike (Admin).

### Rentals
- `GET /rentals`: Get current user's rentals or all rentals if Admin.
- `POST /rentals`: Start a new rental session.
- `PUT /rentals/{id}/return`: Complete an active rental.

## 6. UI/UX Design System
- **Aesthetic**: Modern Dark Mode ("Glassmorphism").
- **Colors**:
    - Primary: `#3b82f6` (Blue)
    - Background: Deep Dark Grays/Blacks
    - Accents: Neon Green (Available), Vivid Red (Rented)
- **Animations**: Smooth transitions using CSS/Tailwind transitions.
- **Responsiveness**: Mobile-first design using Tailwind's grid and flex systems.
