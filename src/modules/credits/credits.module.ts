import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditsService } from './credits.service';
import { CreditsController } from './credits.controller';
import { CreditPackagesController } from './credit-packages.controller';
import { CreditPackage } from './entities/credit-package.entity';
import { UserCredit } from './entities/user-credit.entity';
import { CreditTransaction } from './entities/credit-transaction.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CreditPackage,
      UserCredit,
      CreditTransaction,
      User,
    ]),
  ],
  providers: [CreditsService],
  controllers: [CreditsController, CreditPackagesController],
})
export class CreditsModule {}
