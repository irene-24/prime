# Mentoring Platform Backend

## Overview
This is a NestJS + TypeORM backend for a mentoring/booking platform. It manages users (mentees/mentors), credit packages, bookings, and credit transactions with robust business logic and transactional safety.

---

## Setup Instructions

### 1. Clone the Repository
```
git clone https://github.com/Irene-24/prime.git
cd prime
```

### 2. Install Dependencies
```
npm install
```

### 3. Configure Environment
- Copy `.env.example` to `.env.local` and set your database connection string (DATABASE_URL) and any other required variables.

### 4. Run Database Migrations & Seed Data
```
npm run seed
```
This seeds users (mentors and mentees) and credit packages for testing.

### 5. Start the Application
```
npm start:dev
```
- The API will be available at `http://localhost:<PORT>/api` (default port: 8272).

---

## Architectural Decisions
- **NestJS + TypeORM**: Modular structure for scalability and maintainability.
- **Numeric Transformer**: Used for all decimal columns to avoid JS/TS floating point issues (see `typeorm-decimal.transformer.ts`).
- **API Prefix**: All endpoints are prefixed with `/api` for clarity and future extensibility.
- **Seed Script**: Included for easy local development and testing.
- **Repository Pattern**: All services use injected repositories for non-transactional logic; DataSource is used only for transactions.
- **Custom Guards**: Simulated authentication via `x-user-id` header and a custom guard.
- **Global Exception Filter**: Consistent error responses across the API.
- **DTO Validation**: All input DTOs use `class-validator` for robust validation.

---

## Assumptions
- **Authentication**: Simulated via `x-user-id` header; no real auth implemented.
- **Credit Packages**: Only active packages are available for purchase.
- **Booking Status**: New bookings start as `PENDING`.
- **Refund Logic**: Follows business rules for full/partial/no refund based on cancellation timing.
- **Mentor Availability**: Double-booking is prevented via DB transaction and locking.
- **Price Storage**: Credit package prices are stored in integer cents for accuracy.
- **User Roles**: Only users with the correct role can perform certain actions (e.g., only mentees can cancel).

---

## Notes
- Numeric transformer is used to avoid type issues with decimals in JS/TS.
- All endpoints are under the `/api` prefix.
- Seed script is provided for local development.
