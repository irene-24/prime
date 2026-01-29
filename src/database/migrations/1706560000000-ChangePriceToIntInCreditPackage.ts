import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangePriceToIntInCreditPackage1706560000000 implements MigrationInterface {
  name = 'ChangePriceToIntInCreditPackage1706560000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "credit_packages" ALTER COLUMN "price" TYPE integer USING ROUND(price::numeric)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "credit_packages" ALTER COLUMN "price" TYPE decimal(10,2)`,
    );
  }
}
