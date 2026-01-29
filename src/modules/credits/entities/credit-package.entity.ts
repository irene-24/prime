import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ColumnNumericTransformer } from '@/utils/typeorm-decimal.transformer';

@Entity('credit_packages')
export class CreditPackage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  credits: number;

  //Price is in cents
  @Column({
    type: 'int',
  })
  price: number;

  @Column({ default: true })
  isActive: boolean;
}
