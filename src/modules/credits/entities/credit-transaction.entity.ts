import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { CreditTransactionType } from '@/enums/credit-transaction-type.enum';
import { ColumnNumericTransformer } from '@/utils/typeorm-decimal.transformer';
import { ApiProperty } from '@nestjs/swagger';

@Entity('credit_transactions')
export class CreditTransaction {
  @ApiProperty({ example: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'uuid' })
  @Column('uuid')
  userId: string;

  @ApiProperty({ example: 10 })
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  amount: number;

  @ApiProperty({
    enum: CreditTransactionType,
    example: CreditTransactionType.PURCHASE,
  })
  @Column({ type: 'enum', enum: CreditTransactionType })
  type: CreditTransactionType;

  @ApiProperty({ example: 'uuid', nullable: true })
  @Column({ nullable: true })
  referenceId: string;

  @ApiProperty({ example: 'Purchased credits' })
  @Column()
  description: string;

  @ApiProperty({ example: '2026-01-30T00:00:00.000Z' })
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
