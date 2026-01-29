import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { CreditsModule } from './modules/credits/credits.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      synchronize: true,
      ssl: true,
      entities: [],
    }),
    UsersModule,
    BookingsModule,
    CreditsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
