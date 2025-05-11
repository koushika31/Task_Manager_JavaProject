# Task Manager Application

A full-stack Task Manager application built with Spring Boot and React.

## Features
- Create, read, update, and delete tasks
- Mark tasks as complete/incomplete
- Task categorization
- RESTful API with Swagger documentation
- MySQL database integration

## Tech Stack
- Backend: Spring Boot 2.7.0
- Frontend: React with Material-UI
- Database: MySQL
- API Documentation: Swagger UI

## Prerequisites
- Java 11 or higher
- Node.js and npm
- MySQL 8.0
- Maven

## Setup Instructions

### Backend Setup
1. Clone the repository
2. Configure MySQL database in `src/main/resources/application.properties`
3. Run the Spring Boot application:
```bash
mvn spring-boot:run
```
4. Access Swagger UI at: `http://localhost:8081/swagger-ui.html`

### Frontend Setup
1. Navigate to the frontend directory:
```bash
cd frontend
```
2. Install dependencies:
```bash
npm install
```
3. Start the development server:
```bash
npm start
```
4. Access the application at: `http://localhost:3000`

## API Endpoints
- GET `/api/tasks` - Get all tasks
- GET `/api/tasks/{id}` - Get task by ID
- POST `/api/tasks` - Create new task
- PUT `/api/tasks/{id}` - Update task
- DELETE `/api/tasks/{id}` - Delete task
