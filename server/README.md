# GymLabs API

A RESTful API for managing workout routines and user fitness data. Built with Express.js, TypeScript, and PostgreSQL with Prisma ORM.

## Features

- 🔐 User Authentication (JWT)
- 👤 User Management
- 💪 Workout Tracking
- 🏋️ Exercise Management
- 📊 Set/Rep Tracking

## Tech Stack

- Node.js & Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT Authentication
- bcrypt Password Hashing

## API Endpoints

### Authentication

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `DELETE /api/users` - Delete user account

### Workouts

- `GET /api/workouts` - Get all workouts
- `GET /api/workouts/:id` - Get specific workout
- `POST /api/workouts` - Create new workout
- `PUT /api/workouts/:id` - Update workout
- `DELETE /api/workouts/:id` - Delete workout

## Getting Started

1. Clone the repository

2. Install dependencies

3. Set up environment variables

4. Set up the database

5. Start the development server

## Database Schema

- User (id, email, password, name)
- Workout (id, title, description, userId)
- Exercise (id, title, workoutId)
- Set (id, weight, reps, completed, exerciseId)

## Security Features

- Password Hashing with bcrypt
- JWT Authentication
- Protected Routes
- Request Validation

## License

MIT
