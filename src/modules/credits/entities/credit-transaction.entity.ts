import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { CreditTransactionType } from '@/enums/credit-transaction-type.enum';
import { ColumnNumericTransformer } from '@/utils/typeorm-decimal.transformer';

@Entity('credit_transactions')
export class CreditTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  amount: number;

  @Column({ type: 'enum', enum: CreditTransactionType })
  type: CreditTransactionType;

  @Column({ nullable: true })
  referenceId: string;

  @Column()
  description: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
