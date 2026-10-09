# DRIVEGO – Vehicle Rental Management System

A full-stack web application for managing vehicle rentals, customers, bookings, payments, and rental reports. DRIVEGO provides a centralized dashboard for monitoring vehicle availability and rental operations.

## Project Information

- **Project Name:** DRIVEGO – Vehicle Rental Management System
- **Student Name:** Dharshini A
- **Register Number:** 312324205048
- **Department:** Information Technology
- **Institution:** St. Joseph's College of Engineering
- **Academic Year:** 2026–2027

## Overview

DRIVEGO is designed to simplify vehicle rental operations through a web-based management system. It enables administrators to manage vehicles and customers, create rental bookings, track returns, record payments, and monitor business activity through a dashboard.

The application uses a React frontend, a Spring Boot REST API backend, and a relational database.

## Features

- **Dashboard:** View vehicle statistics, active rentals, customers, and revenue.
- **Vehicle Management:** Manage vehicle details, rental prices, and availability.
- **Customer Management:** Add, view, update, and delete customer records.
- **Rental Management:** Create bookings and track rental and return status.
- **Payment Management:** Record payments and view payment information.
- **Reports:** Access rental-related information and frequently rented vehicle data.
- **REST APIs:** Connect the frontend to backend services.
- **Docker Support:** Dockerfiles for the frontend and backend.
- **SQL Database:** Database schema and SQL operations for vehicle rental management.

## Technologies Used

### Frontend
- React
- Vite
- JavaScript
- HTML5
- CSS3
- Axios
- React Router
- Lucide React

### Backend
- Java
- Spring Boot
- Spring Data JPA
- REST API
- Maven

### Database
- MySQL
- SQL queries, joins, subqueries, stored procedures, functions, and triggers

### Tools
- Spring Tools for Eclipse
- Visual Studio Code
- Postman
- Git and GitHub
- Docker and Docker Hub

## Project Structure

```text
VehicleRentalSystem/
├── vehicle-rental-frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── layouts/
│   │   └── pages/
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.js
├── vehicle-rental-system/
│   ├── src/main/java/com/rental/vehiclerental/
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── entity/
│   │   ├── repository/
│   │   └── service/
│   ├── src/main/resources/
│   ├── Dockerfile
│   └── pom.xml
├── vehicle_rental.sql
└── README.md
```

## Database Setup

1. Install and start MySQL.
2. Open MySQL Workbench or your preferred MySQL client.
3. Execute the SQL script provided in `vehicle_rental.sql`.
4. Configure the database connection in the backend's `application.properties` file.

Database name:

`vehicle_rental_db`

The database supports vehicle, customer, rental, and payment information.

**Security:** Configure database credentials locally or through environment variables. Do not commit real passwords or other secrets to GitHub.

## Running the Backend

Prerequisites: Java and Maven-compatible tooling, plus a running MySQL server.

1. Open a terminal in the backend folder:

   ```bash
   cd vehicle-rental-system
   ```

2. Configure the database connection in `src/main/resources/application.properties`.

3. Start the Spring Boot application:

   ```bash
   .\mvnw.cmd spring-boot:run
   ```

   On macOS or Linux, use:

   ```bash
   ./mvnw spring-boot:run
   ```

4. The backend is configured to use port **8094** in the local development setup.

Backend base URL:

`http://localhost:8094`

## Running the Frontend

Prerequisites: Node.js and npm.

1. Open another terminal in the frontend folder:

   ```bash
   cd vehicle-rental-frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open the local URL shown in the terminal. The usual Vite address is:

   `http://localhost:5173`

Ensure the frontend API configuration points to the running backend at `http://localhost:8094`.

## API Testing

Use Postman to test the REST API endpoints for vehicles, customers, rentals, payments, and dashboard statistics.

Start the backend before sending requests. The exact endpoints are defined in the backend controller classes.

## Docker Images

The project frontend and backend images were pushed to Docker Hub under the following repositories:

- Frontend: `mjayashree08/vehicle-rental-frontend:latest`
- Backend: `mjayashree08/vehicle-rental-backend:latest`

Docker Hub repositories:

- https://hub.docker.com/r/mjayashree08/vehicle-rental-frontend
- https://hub.docker.com/r/mjayashree08/vehicle-rental-backend

The images are published, but running the full application requires the appropriate container configuration, network connectivity, and database setup.

## GitHub Repository

Source code:

https://github.com/fullstackfirstbatch2026/vehicle-rental-system

## Future Enhancements

- User authentication and role-based access
- Online booking and payment gateway integration
- Email and booking notifications
- Advanced analytics and downloadable reports
- Cloud deployment and automated CI/CD

## Conclusion

DRIVEGO demonstrates the development of a full-stack vehicle rental management application using React, Spring Boot, MySQL, and Docker. It integrates frontend interfaces, backend REST services, and database operations to support essential vehicle rental workflows.
