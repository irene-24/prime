import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ColumnNumericTransformer } from '@/utils/typeorm-decimal.transformer';
import { ApiProperty } from '@nestjs/swagger';

@Entity('credit_packages')
export class CreditPackage {
  @ApiProperty({ example: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Starter Pack' })
  @Column({ unique: true })
  name: string;

  @ApiProperty({ example: 10 })
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  credits: number;

  @ApiProperty({ example: 2999, description: 'Price in cents' })
  @Column({
    type: 'int',
  })
  price: number;

  @ApiProperty({ example: true })
  @Column({ default: true })
  isActive: boolean;
}
