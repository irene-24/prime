import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { CreditsModule } from './modules/credits/credits.module';
import { User } from './modules/users/entities/user.entity';
import { Booking } from './modules/bookings/entities/booking.entity';
import { CreditTransaction } from './modules/credits/entities/credit-transaction.entity';
import { UserCredit } from './modules/credits/entities/user-credit.entity';
import { CreditPackage } from './modules/credits/entities/credit-package.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.local',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      synchronize: true,
      entities: [User, Booking, UserCredit, CreditTransaction, CreditPackage],
    }),
    UsersModule,
    BookingsModule,
    CreditsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

// [
//   {
//     id: '26b44183-6942-4f0d-9e1b-e929110a5001',
//     email: 'bob.mentee@example.com',
//     name: 'Bob Mentee',
//     role: 'MENTEE',
//     createdAt: '2026-01-29 21:58:11.85318+00',
//     updatedAt: '2026-01-29 21:58:11.85318+00',
//   },
//   {
//     id: '82839148-0c32-4de1-85d9-a1dec3b5250b',
//     email: 'dave.mentor@example.com',
//     name: 'Dave Mentor',
//     role: 'MENTOR',
//     createdAt: '2026-01-29 21:58:18.796349+00',
//     updatedAt: '2026-01-29 21:58:18.796349+00',
//   },
//   {
//     id: '8e2084d5-ab94-4520-b6b3-45d4b414c404',
//     email: 'alice.mentee@example.com',
//     name: 'Alice Mentee',
//     role: 'MENTEE',
//     createdAt: '2026-01-29 21:58:09.105385+00',
//     updatedAt: '2026-01-29 21:58:09.105385+00',
//   },
//   {
//     id: 'e765638f-de4b-4235-94b5-2d02ea3d9743',
//     email: 'carol.mentor@example.com',
//     name: 'Carol Mentor',
//     role: 'MENTOR',
//     createdAt: '2026-01-29 21:58:16.663352+00',
//     updatedAt: '2026-01-29 21:58:16.663352+00',
//   },
// ];
