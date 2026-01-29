import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreditPackage } from './entities/credit-package.entity';
import { UserCredit } from './entities/user-credit.entity';
import { CreditTransaction } from './entities/credit-transaction.entity';
import { CreditTransactionType } from '@/common/enums/credit-transaction-type.enum';
import { createPaginationResponse } from '@/common/interfaces/paginated-response.interface';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';

@Injectable()
export class CreditsService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(CreditPackage)
    private readonly creditPackageRepository: Repository<CreditPackage>,
    @InjectRepository(CreditTransaction)
    private readonly creditTransactionRepository: Repository<CreditTransaction>,
    @InjectRepository(UserCredit)
    private readonly userCreditRepository: Repository<UserCredit>,
  ) {}

  async findAllPackages(): Promise<CreditPackage[]> {
    return this.creditPackageRepository.find({ where: { isActive: true } });
  }

  async purchaseCredits(userId: string, packageId: string) {
    const pkg = await this.creditPackageRepository.findOneBy({
      id: packageId,
      isActive: true,
    });
    if (!pkg) {
      throw new NotFoundException('Credit package not found or inactive');
    }

    return await this.dataSource.transaction(async (manager) => {
      const userCredit = await manager.findOne(UserCredit, {
        where: { userId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!userCredit) {
        throw new NotFoundException('User credit record not found');
      }

      userCredit.balance = Number(userCredit.balance) + Number(pkg.credits);
      userCredit.totalPurchased =
        Number(userCredit.totalPurchased) + Number(pkg.credits);
      await manager.save(userCredit);

      const transaction = manager.create(CreditTransaction, {
        userId,
        amount: pkg.credits,
        type: CreditTransactionType.PURCHASE,
        referenceId: pkg.id,
        description: `Purchased ${pkg.name} (${pkg.credits} credits) at ${new Date().toISOString()}`,
      });
      await manager.save(transaction);

      return { balance: userCredit.balance };
    });
  }

  async getBalance(userId: string) {
    const userCredit = await this.userCreditRepository.findOneBy({ userId });
    if (!userCredit) {
      throw new NotFoundException('User credit record not found');
    }
    return { balance: userCredit.balance };
  }

  async getTransactions(userId: string, query: PaginationQueryDto) {
    const { page = 1, limit = 10 } = query;

    const [transactions, total]: [CreditTransaction[], number] =
      await this.creditTransactionRepository.findAndCount({
        where: { userId },
        order: { createdAt: 'DESC' },
        take: limit,
        skip: (page - 1) * limit,
      });

    return createPaginationResponse(transactions, total, page, limit);
  }
}
