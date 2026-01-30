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
import {
  ApiSecurity,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { BookingStatus } from '@/common/enums/booking-status.enum';

@ApiTags('Bookings')
@ApiSecurity('x-user-id')
@UseGuards(UserIdGuard)
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiBody({ type: CreateBookingDto })
  @ApiResponse({
    status: 201,
    description: 'Booking created',
    schema: {
      example: {
        id: 'uuid',
        menteeId: 'uuid',
        mentorId: 'uuid',
        scheduledAt: '2026-01-30T00:00:00.000Z',
        duration: 60,
        creditsUsed: 2,
        status: 'PENDING',
        createdAt: '2026-01-30T00:00:00.000Z',
        updatedAt: '2026-01-30T00:00:00.000Z',
      },
    },
  })
  async createBooking(
    @Body() createBookingDto: CreateBookingDto,
    @Req() req: ExpressRequest & { userId: string },
  ) {
    return this.bookingsService.createBooking(req.userId, createBookingDto);
  }

  @Get()
  @ApiOperation({
    summary: 'List user bookings (paginated, filterable by status)',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: BookingStatus,
    enumName: 'BookingStatus',
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of bookings',
    schema: {
      example: {
        data: [
          {
            id: 'uuid',
            menteeId: 'uuid',
            mentorId: 'uuid',
            scheduledAt: '2026-01-30T00:00:00.000Z',
            duration: 60,
            creditsUsed: 2,
            status: 'PENDING',
            createdAt: '2026-01-30T00:00:00.000Z',
            updatedAt: '2026-01-30T00:00:00.000Z',
          },
        ],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      },
    },
  })
  async getBookings(
    @Req() req: ExpressRequest & { userId: string },
    @Query() query: GetBookingsDto,
  ) {
    return this.bookingsService.getBookings(req.userId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking details' })
  @ApiParam({ name: 'id', type: 'string', description: 'Booking UUID' })
  @ApiResponse({
    status: 200,
    description: 'Booking details',
    schema: {
      example: {
        id: 'uuid',
        menteeId: 'uuid',
        mentorId: 'uuid',
        scheduledAt: '2026-01-30T00:00:00.000Z',
        duration: 60,
        creditsUsed: 2,
        status: 'PENDING',
        createdAt: '2026-01-30T00:00:00.000Z',
        updatedAt: '2026-01-30T00:00:00.000Z',
      },
    },
  })
  async getBookingDetails(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: ExpressRequest & { userId: string },
  ) {
    return this.bookingsService.getBookingById(id, req.userId);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel a booking (refunds credits if eligible)' })
  @ApiParam({ name: 'id', type: 'string', description: 'Booking UUID' })
  @ApiResponse({
    status: 200,
    description: 'Booking cancelled, refund info returned',
    schema: {
      example: {
        message: 'Booking cancelled successfully',
        refundAmount: 1,
        refundPercentage: '100%',
      },
    },
  })
  async cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: ExpressRequest & { userId: string },
  ) {
    return this.bookingsService.cancelBooking(id, req.userId);
  }
}
