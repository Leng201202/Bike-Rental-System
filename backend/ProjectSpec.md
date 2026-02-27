# Bike Rental System - Backend Specification

## 1. Project Overview
The Bike Rental System backend is a Spring Boot application designed to manage users, bikes, and rentals. It has been architected using **Clean Architecture** principles to ensure high maintainability, testability, and decoupling from external frameworks.

## 2. Architecture: Clean Architecture
The system is divided into three concentric layers:

### A. Core Domain Layer (`com.bikerental.core.domain`)
The innermost layer containing pure business logic and entities.
- **Entities**: `User`, `Bike`, `Rent`, `AuditLog`, `Category`, `Status`. These are POJOs with no framework dependencies.
- **Repository Interfaces**: Define data access contracts (e.g., `UserRepository`, `BikeRepository`, `CategoryRepository`, `StatusRepository`).

### B. Core Application Layer (`com.bikerental.core.application`)
Orchestrates business flow and uses cases.
- **Use Cases**: Encapsulate specific business actions (e.g., `GetAllBikesUseCase`, `LogAuditActionUseCase`).
- **DTOs**: `UserResponseDTO`, `BikeResponseDTO`, `RentResponseDTO`, `AuditLogResponseDTO`.
- **Mappers**: Transform Domain Entities to DTOs.

### C. Infrastructure Layer (`com.bikerental.infrastructure`)
Handles technical details and framework integration.
- **Persistence**: JPA Entities (`UserEntity`, `BikeEntity`, etc.), Spring Data Repositories, and implementation of Domain Repositories (`UserRepositoryImpl`, etc.).
- **Web**: REST Controllers that expose the API to the frontend.

## 3. Technology Stack
- **Language**: Java 17
- **Framework**: Spring Boot 3.x
- **Persistence**: Spring Data JPA, Hibernate
- **Database**: H2 (In-memory for development)
- **Utilities**: Lombok (for boilerplate reduction), Maven (Build tool)

## 4. Core Features
- **User Management**: Fetching and managing user profiles.
- **Bike Management**: Inventory tracking, status management, and categorization (`Category` and `Status` entities).
- **Rental Management**: Handling the rental lifecycle (Rent, Return, Payment).
- **Audit Logging**: System-wide tracking of user actions (Fetch, Rent, etc.) for accountability.

## 5. API Endpoints
| Resource | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Users** | GET | `/api/users` | Retrieve all users |
| **Bikes** | GET | `/api/bikes` | Retrieve all bikes |
| **Rentals** | GET | `/api/rentals` | Retrieve all rentals |
| **Audit** | GET | `/api/audit` | Retrieve all system audit logs |

## 6. How to Build and Run
1.  **Compile**: `./mvnw clean compile`
2.  **Run**: `./mvnw spring-boot:run`
3.  **Access H2 Console**: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:testdb`)
