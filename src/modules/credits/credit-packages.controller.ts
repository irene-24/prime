import { Controller, Get } from '@nestjs/common';
import { CreditsService } from './credits.service';
import { CreditPackage } from './entities/credit-package.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Credit Packages')
@Controller('credit-packages')
export class CreditPackagesController {
  constructor(private readonly creditsService: CreditsService) {}

  @Get()
  @ApiOperation({ summary: 'List all active credit packages' })
  @ApiResponse({
    status: 200,
    description: 'List of active credit packages',
    schema: {
      example: [
        {
          id: '26b44183-6942-4f0d-9e1b-e929110a5001',
          name: 'Starter Pack',
          credits: 100,
          price: 1000,
          isActive: true,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ],
    },
  })
  async findAll(): Promise<CreditPackage[]> {
    return this.creditsService.findAllPackages();
  }
}
