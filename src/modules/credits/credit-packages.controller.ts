import { Controller, Get } from '@nestjs/common';
import { CreditsService } from './credits.service';
import { CreditPackage } from './entities/credit-package.entity';

@Controller('credit-packages')
export class CreditPackagesController {
  constructor(private readonly creditsService: CreditsService) {}

  @Get()
  async findAll(): Promise<CreditPackage[]> {
    return this.creditsService.findAllPackages();
  }
}
