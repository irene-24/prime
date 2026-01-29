
# Mentoring Platform Backend

## Overview
This is a NestJS + TypeORM backend for a mentoring/booking platform. It manages users (mentees/mentors), credit packages, bookings, and credit transactions with robust business logic and transactional safety.

---

## Setup Instructions

### 1. Clone the Repository
```
git clone <your-repo-url>
cd <repo-folder>
```

### 2. Install Dependencies
```
pnpm install
```

### 3. Configure Environment
- Copy `.env.example` to `.env.local` and set your database connection string (DATABASE_URL) and any other required variables.

### 4. Run Database Migrations & Seed Data
```
pnpm run seed
```
This seeds users, mentors, mentees, credit packages, and user credits for testing.

### 5. Start the Application
```
pnpm start:dev
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
- **User Roles**: Only users with the correct role can perform certain actions (e.g., only mentees can book/cancel).

---

## Notes
- Numeric transformer is used to avoid type issues with decimals in JS/TS.
- All endpoints are under the `/api` prefix.
- Seed script is provided for local development.
- Cora: (If this refers to a tool or convention, clarify here or remove if not relevant.)

---

## Contact
For questions or issues, please contact the maintainer.

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
