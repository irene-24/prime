import { IsUUID, IsNotEmpty } from 'class-validator';

export class PurchaseCreditsDto {
  @IsUUID()
  @IsNotEmpty()
  packageId: string;
}
