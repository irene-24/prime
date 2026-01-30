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
import { ApiSecurity } from '@nestjs/swagger';

@ApiSecurity('x-user-id')
@UseGuards(UserIdGuard)
@Controller('credits')
export class CreditsController {
  constructor(private readonly creditsService: CreditsService) {}

  @Post('purchase')
  async purchaseCredits(
    @Body() dto: PurchaseCreditsDto,
    @Req() req: ExpressRequest & { userId: string },
  ) {
    // userId is guaranteed by guard
    return this.creditsService.purchaseCredits(req.userId, dto.packageId);
  }

  @Get('balance')
  async getBalance(@Req() req: ExpressRequest & { userId: string }) {
    // userId is guaranteed by guard
    return this.creditsService.getBalance(req.userId);
  }

  @Get('transactions')
  async getTransactions(
    @Req() req: ExpressRequest & { userId: string },
    @Query() query: PaginationQueryDto,
  ) {
    return this.creditsService.getTransactions(req.userId, query);
  }
}
