import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { UserIdGuard } from '../../common/guards/user-id.guard';
import { CreditsService } from './credits.service';
import { PurchaseCreditsDto } from './dto/purchase-credits.dto';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import {
  ApiSecurity,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Credits')
@ApiSecurity('x-user-id')
@UseGuards(UserIdGuard)
@Controller('credits')
export class CreditsController {
  constructor(private readonly creditsService: CreditsService) {}

  @Post('purchase')
  @ApiOperation({ summary: 'Purchase a credit package (simulate payment)' })
  @ApiBody({ type: PurchaseCreditsDto })
  @ApiResponse({
    status: 201,
    description: 'Credits purchased, returns updated balance',
    schema: { example: { balance: 10 } },
  })
  async purchaseCredits(
    @Body() dto: PurchaseCreditsDto,
    @Req() req: ExpressRequest & { userId: string },
  ) {
    // userId is guaranteed by guard
    return this.creditsService.purchaseCredits(req.userId, dto.packageId);
  }

  @Get('balance')
  @ApiOperation({ summary: 'Get current user credit balance' })
  @ApiResponse({
    status: 200,
    description: 'Current credit balance',
    schema: { example: { balance: 10 } },
  })
  async getBalance(@Req() req: ExpressRequest & { userId: string }) {
    // userId is guaranteed by guard
    return this.creditsService.getBalance(req.userId);
  }

  @Get('transactions')
  @ApiOperation({
    summary: "Get user's credit transaction history (paginated)",
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of credit transactions',
    schema: {
      example: {
        data: [
          {
            id: '98ca1fd8-2d3b-4762-96a6-9051e9fb0e32',
            userId: '26b44183-6942-4f0d-9e1b-e929110a5001',
            amount: 2,
            referenceId: '035fcec2-d691-4c1a-8fbe-402af517c451',
            description:
              'Refund (100%) for cancelled booking 035fcec2-d691-4c1a-8fbe-402af517c451',
            createdAt: '2026-01-29T23:50:54.101Z',
          },
        ],
      },
    },
  })
  async getTransactions(
    @Req() req: ExpressRequest & { userId: string },
    @Query() query: PaginationQueryDto,
  ) {
    return this.creditsService.getTransactions(req.userId, query);
  }
}
