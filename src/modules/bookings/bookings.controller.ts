import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Get,
  Query,
  ParseUUIDPipe,
  Param,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UserIdGuard } from '@/common/guards/user-id.guard';
import { GetBookingsDto } from './dto/get-bookings.dto';

@UseGuards(UserIdGuard)
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  async createBooking(
    @Body() createBookingDto: CreateBookingDto,
    @Req() req: ExpressRequest & { userId: string },
  ) {
    return this.bookingsService.createBooking(req.userId, createBookingDto);
  }

  @Get()
  async getBookings(
    @Req() req: ExpressRequest & { userId: string },
    @Query() query: GetBookingsDto,
  ) {
    return this.bookingsService.getBookings(req.userId, query);
  }

  @Get(':id')
  async getBookingDetails(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: ExpressRequest & { userId: string },
  ) {
    return this.bookingsService.getBookingById(id, req.userId);
  }

  @Post(':id/cancel')
  async cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: ExpressRequest & { userId: string },
  ) {
    return this.bookingsService.cancelBooking(id, req.userId);
  }
}
