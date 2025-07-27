# Carpooling Web App

Carpooling web application built with React frontend, Spring Boot backend, and MySQL database.

## Features

- **User Authentication**: JWT-based signup and login
- **Offer a Ride**: Create ride offers with source, destination, date/time, seats, and optional price
- **Find a Ride**: Search for available rides by source, destination, and optional date
- **Join a Ride**: Join available rides with automatic seat management
- **My Rides Dashboard**: View offered rides and joined rides

## Tech Stack

- **Frontend**: React with Vite, Tailwind CSS, shadcn/ui components
- **Backend**: Spring Boot with Spring Security, JPA/Hibernate
- **Database**: MySQL
- **Authentication**: JWT tokens

## Project Structure

```
carpooling-app/
├── backend/                 # Spring Boot backend
│   ├── src/main/java/com/carpool/
│   │   ├── controller/      # REST controllers
│   │   ├── service/         # Business logic
│   │   ├── repository/      # Data access layer
│   │   ├── entity/          # JPA entities
│   │   ├── dto/             # Data transfer objects
│   │   ├── config/          # Configuration classes
│   │   └── security/        # JWT security components
│   └── pom.xml             # Maven dependencies
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom hooks
│   │   └── lib/            # Utilities and API client
│   └── package.json        # npm dependencies
└── README.md              # This file
```

## Setup Instructions

### Prerequisites

- Java 17 or higher
- Maven 3.6+
- Node.js 18+ and pnpm
- MySQL 8.0+

### Database Setup

1. Install and start MySQL server
2. Create database and user:
```sql
CREATE DATABASE carpool_db;
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
FLUSH PRIVILEGES;
```

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Update database configuration in `src/main/resources/application.properties` if needed

3. Run the Spring Boot application:
```bash
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm run dev
```

The frontend will start on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Rides
- `POST /api/rides/offer` - Offer a new ride
- `GET /api/rides/search` - Search for rides
- `GET /api/rides/my-rides` - Get user's offered rides

### Bookings
- `POST /api/bookings/join/{rideId}` - Join a ride
- `GET /api/bookings/my-bookings` - Get user's bookings

## Usage

1. **Register/Login**: Create an account or sign in
2. **Offer a Ride**: Click "Offer Ride" and fill in the details
3. **Find a Ride**: Click "Find Ride" and search by source/destination
4. **Join a Ride**: Click "Join Ride" on any available ride
5. **View Dashboard**: Check your offered rides and bookings

## Development Notes

- The application uses JWT tokens for authentication
- All API endpoints (except auth) require authentication
- The frontend automatically handles token storage and API requests
- Database tables are created automatically by Hibernate
- CORS is configured to allow frontend-backend communication

## Production Deployment

For production deployment:

1. Build the frontend:
```bash
cd frontend && pnpm run build
```

2. Package the backend:
```bash
cd backend && mvn clean package
```

3. Configure production database settings
4. Deploy the JAR file and serve the frontend build files

## License

This project is created for CDAC batch Feb-2025. All rights reserved