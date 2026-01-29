import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from '../modules/users/entities/user.entity';
import { Booking } from '../modules/bookings/entities/booking.entity';
import { CreditTransaction } from '../modules/credits/entities/credit-transaction.entity';
import { UserCredit } from '../modules/credits/entities/user-credit.entity';
import { CreditPackage } from '../modules/credits/entities/credit-package.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User, Booking, UserCredit, CreditTransaction, CreditPackage],
  migrations: [__dirname + '/migrations/*.{ts,js}'],
});
