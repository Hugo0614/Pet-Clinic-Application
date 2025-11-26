# Pet Clinic Full-Stack Management System

## Project Overview

This is a full-stack application that allows pet owners and veterinarians to manage pet health, appointments, and medical records. It provides a secure, role-based system for managing pet information, scheduling appointments, and maintaining a complete medical history.

## Technology Stack

### Backend
- **Spring Boot:** Core framework for building the application.
- **Spring Security:** For authentication and authorization.
- **Spring Data JPA (Hibernate):** For data persistence and interaction with the database.
- **MySQL:** Relational database for storing all application data.
- **JSON Web Tokens (JWT):** Used for securing the RESTful API.
- **Maven:** For dependency management and building the project.

### Frontend
- **React:** JavaScript library for building the user interface.
- **TypeScript:** For adding static types to JavaScript.
- **Vite:** Modern frontend build tool.
- **Axios:** For making HTTP requests to the backend API.
- **React Router:** For handling routing and navigation.
- **Tailwind CSS:** For styling the application.
- **React Context API:** For managing global state (e.g., authentication).

## Testing Infrastructure

This project now includes comprehensive testing infrastructure for both backend and frontend:

### Backend Testing
- **Testing Framework:** JUnit 5 + Mockito + Spring Boot Test
- **Test Database:** H2 in-memory database (isolated from production MySQL)
- **Test Coverage:** 
  - Unit tests for services (AppointmentServiceTest)
  - Integration tests for controllers (AuthControllerTest, PetControllerTest)
  - API testing with MockMvc and RestAssured
- **Test Configuration:** `application-test.properties` with H2 database
- **Running Tests:** `cd petclinic-backend && mvn test`

### Frontend Testing
- **E2E Testing:** Cypress for end-to-end testing
- **Test Files:** Located in `petclinic-frontend/cypress/e2e/`
- **Running Tests:** `cd petclinic-frontend && npm run test:e2e`

### Test Isolation
Tests use completely separate databases from development/production:
- **Development:** MySQL (via `start_dev.sh`)
- **Testing:** H2 in-memory database (via `mvn test`)
- **Production:** MySQL (via Docker)

## Docker Containerization

This project is fully containerized with Docker for easy deployment:

### Docker Setup
- **Multi-stage Builds:** Optimized Dockerfile for both backend and frontend
- **Services:**
  - MySQL 8.0 database
  - Spring Boot backend (Java 21)
  - React frontend (served by Nginx)
- **Docker Compose:** Orchestrates all services with proper networking and health checks
- **Quick Start:** `./docker-start.sh` (one command to build and run everything)
- **Stop Services:** `./docker-stop.sh`

### Docker Commands
```bash
# Start all services in Docker
./docker-start.sh

# Stop all services
./docker-stop.sh

# View logs
docker compose logs -f

# Rebuild without cache
docker compose build --no-cache
```

### Port Configuration
- Frontend: http://localhost (port 80)
- Backend API: http://localhost:8080
- MySQL: localhost:3306 (internal only)

## CI/CD Automation

This project integrates a comprehensive GitHub Actions CI/CD pipeline to automate testing, building, and Docker image publishing. The pipeline is configured to run automatically whenever code is pushed to the `main` branch.

### How it works:

- **Trigger:** The workflow is triggered on every `push` event to the `main` branch.
- **Pipeline Jobs:** The pipeline consists of 5 jobs that ensure quality and automate deployment:
  1. **Backend Testing (`test-backend`):** 
     - Sets up Java Development Kit (JDK) 21
     - Runs all backend tests with H2 database
     - Generates test reports
  
  2. **Backend Build & Push (`build-backend`):**
     - Builds Docker image for Spring Boot application
     - Pushes image to GitHub Container Registry (GHCR)
     - Uses Docker layer caching for faster builds
  
  3. **Frontend Testing (`test-frontend`):**
     - Sets up Node.js 20.x runtime
     - Runs Cypress E2E tests
     - Generates test reports
  
  4. **Frontend Build & Push (`build-frontend`):**
     - Builds Docker image for React application
     - Pushes image to GitHub Container Registry (GHCR)
     - Optimized Nginx configuration
  
  5. **Deployment Summary (`deploy-summary`):**
     - Aggregates all job results
     - Provides deployment status and image tags

### Performance Optimization:

The workflow uses GitHub Actions' caching mechanism (`actions/cache`) to cache:
- Maven dependencies (`~/.m2/repository`) for faster backend builds
- NPM dependencies (`node_modules`) for faster frontend builds
- Docker layers for faster image builds

This significantly reduces build times for subsequent runs by avoiding redundant dependency downloads and layer rebuilds.

### GitHub Actions Status Badge:

You can add a status badge to display the CI/CD pipeline status:

```markdown
[![CI Build Status](https://github.com/Hugo0614/Pet-Clinic-Application/actions/workflows/ci-build.yml/badge.svg)](https://github.com/Hugo0614/Pet-Clinic-Application/actions/workflows/ci-build.yml)
```

## Features

### Backend (Backend API)

**What it does:**
- **User Authentication:** Handles user registration and login.
- **Role-Based Access Control (RBAC):** Differentiates between "OWNER" and "DOCTOR" roles, restricting access to certain functionalities.
- **Pet Management:** Allows owners to perform CRUD (Create, Read, Update, Delete) operations for their pets.
- **Appointment Management:** Enables owners to schedule appointments and doctors to view their appointments.
- **Medical Record Management:** Allows doctors to create and view medical records for pets.

**How it's implemented:**
- **RESTful API:** Uses `@RestController` and `@RequestMapping` to define API endpoints for frontend communication.
- **Service Layer:** Employs `@Service` classes to encapsulate business logic, separating it from the controller layer.
- **Data Persistence:** Leverages `@Repository` interfaces extending `JpaRepository` for seamless interaction with the MySQL database.
- **DTO Pattern:** Utilizes Data Transfer Objects (DTOs) to transfer data between the client and server, preventing the exposure of internal JPA entities.

### Frontend (Frontend UI)

**What it does:**
- **User Registration and Login:** Provides forms for users to register and log in.
- **Responsive Navigation and Layout:** A clean and responsive UI that works on different screen sizes.
- **Owner Dashboard:** Allows owners to view their pets and manage appointments.
- **Doctor Dashboard:** Allows doctors to view their scheduled appointments and manage medical records.
- **Protected Routes:** Prevents unauthenticated users from accessing protected pages like dashboards.

**How it's implemented:**
- **Component-Based Architecture:** Built with React functional components and Hooks (e.g., `useState`, `useEffect`).
- **Routing:** Uses `react-router-dom` for client-side routing and to implement `ProtectedRoute` for securing routes.
- **State Management:** Manages global authentication state (user and token) using the Context API (`AuthContext`).
- **API Communication:** Configures Axios with a service instance (`api.ts`) to communicate with the Spring Boot backend, including an interceptor to attach JWTs to requests.

## Architecture Deep Dive

### How do Spring Boot, Spring Data JPA, and MySQL work together?

1.  **Database Configuration:** The `application.properties` file configures the connection to the MySQL database, including the JDBC URL, username, password, and connection pool settings.
2.  **Entity Mapping:** Java classes in the `model` package (e.g., `User.java`, `Pet.java`) are annotated with `@Entity`. This tells Spring Data JPA to map these classes to corresponding tables in the MySQL database.
3.  **Repository Interfaces:** In the `repository` package, interfaces like `UserRepository` extend `JpaRepository`. Spring Data JPA automatically provides implementations for standard CRUD operations (e.g., `save()`, `findById()`, `findAll()`), eliminating the need for boilerplate code.

### How do Spring Security and JWT enable authentication and authorization?

1.  **Login Flow:** When a user logs in via the `/api/auth/login` endpoint, Spring Security's `AuthenticationManager` validates the credentials. Upon success, the `JwtUtil` class generates a JWT containing the user's username and role.
2.  **Request Validation Flow:** The `JwtAuthenticationFilter` intercepts every incoming API request to a protected endpoint.
3.  **Filter Mechanics:** The filter extracts the Bearer token from the `Authorization` header. It then uses `JwtUtil` to validate the token's signature and expiration. If the token is valid, it extracts the user details.
4.  **Authorization:** Spring Security uses the role extracted from the token to enforce access control. Annotations like `@PreAuthorize("hasAuthority('DOCTOR')")` are used on controller methods to restrict access to users with the specified role.

### How do React, TypeScript, Axios, and Spring Boot work in concert?

1.  **Token Storage:** After a successful login, the frontend's `AuthContext` stores the JWT in the browser's `localStorage`.
2.  **Automatic Header Injection:** An Axios interceptor (`api.ts`) is configured to automatically read the token from `localStorage` and add it to the `Authorization` header of every outgoing request as a `Bearer` token.
3.  **Full Request Lifecycle:**
    *   A user clicks a button in the UI (e.g., "View Pets").
    *   React calls a service function that uses the Axios instance.
    *   The Axios interceptor attaches the JWT to the request header.
    *   The request is sent to the Spring Boot backend.
    *   The `JwtAuthenticationFilter` on the backend validates the JWT.
    *   The corresponding controller method is executed, business logic is performed, and data is retrieved from the database.
    *   The backend returns the data as a JSON response.
    *   The frontend receives the response, and React updates the UI to display the data.

## Advanced Topics Review

- **Java development (RESTful Web Service, JMS):** This project utilizes **RESTful Web Services** (implemented via Spring Boot). It **does not use JMS**.
- **WebLogic:** This project **does not use** WebLogic. It runs on an embedded Tomcat server provided by Spring Boot.
- **OpenShift:** This project **does not use** OpenShift.
- **ETL tools (Informatica PowerCenter):** This project **does not include any ETL tools** like Informatica.
- **Script programming on AIX/Linux/Windows operating systems:** This project includes basic shell scripts for development and testing (e.g., `start_dev.sh`) but **does not contain complex scripts for AIX, Linux, or Windows** operating systems.
- **Supporting mission critical systems and mobile application:** This project is a web application and is **not designed as a mission-critical system or a native mobile application**.
- **Integrate and maintain workflow engines for business process automation:** This project **does not use** any workflow engines.
- **CI/CD pipelines and GitHub Actions:** This project **now includes a GitHub Actions CI/CD pipeline** (`.github/workflows/ci-build.yml`) that automatically builds and tests the application on every push to the `main` branch. The pipeline runs both backend (Maven) and frontend (Node.js) builds in parallel, with caching optimizations for improved performance.
- **Python:** This project **does not use** Python.
- **Ansible:** This project **does not use** Ansible.
