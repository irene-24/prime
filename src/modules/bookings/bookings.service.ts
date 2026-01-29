import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { UserCredit } from '../credits/entities/user-credit.entity';
import { CreditTransaction } from '../credits/entities/credit-transaction.entity';
import { CreditTransactionType } from '@/common/enums/credit-transaction-type.enum';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BOOKING_RULES } from '@/constants/booking.constants';
import { calculateCreditCost } from '@/utils/credit-calculator.util';
import { BookingStatus } from '@/enums/booking-status.enum';
import { createPaginationResponse } from '@/interfaces/paginated-response.interface';
import { GetBookingsDto } from './dto/get-bookings.dto';
import { calculateRefundAmount } from '@/utils/refund-calculator';

@Injectable()
export class BookingsService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {}

  async createBooking(menteeId: string, dto: CreateBookingDto) {
    const { mentorId, scheduledAt, duration } = dto;
    const startTime = new Date(scheduledAt);
    const endTime = new Date(startTime.getTime() + duration * 60000);

    // Determine cost
    const creditCost = calculateCreditCost(duration);

    // Validate Lead Time
    const minLeadTime = new Date();
    minLeadTime.setHours(
      minLeadTime.getHours() + BOOKING_RULES.MIN_LEAD_TIME_HOURS,
    );

    if (startTime < minLeadTime) {
      throw new BadRequestException(
        `Bookings must be made at least ${BOOKING_RULES.MIN_LEAD_TIME_HOURS} hours in advance`,
      );
    }

    return await this.dataSource.transaction(async (manager) => {
      // Check for Mentor Overlap
      const overlap = await manager
        .createQueryBuilder(Booking, 'booking')
        .where('booking.mentorId = :mentorId', { mentorId })
        .andWhere('booking.status != :cancelled', {
          cancelled: BookingStatus.CANCELLED,
        })
        .andWhere(
          `NOT (
            booking.scheduledAt + (booking.duration * interval '1 minute') <= :startTime 
            OR 
            booking.scheduledAt >= :endTime
          )`,
          { startTime, endTime },
        )
        .getOne();

      if (overlap) {
        throw new ConflictException(
          'Mentor is already booked for this time slot',
        );
      }

      // Lock and check Mentee Credit Balance
      const userCredit = await manager.findOne(UserCredit, {
        where: { userId: menteeId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!userCredit || userCredit.balance < creditCost) {
        throw new BadRequestException(
          'Insufficient credits for this session duration',
        );
      }

      // Update Credits
      userCredit.balance -= creditCost;
      userCredit.totalUsed += creditCost;
      await manager.save(userCredit);

      // Create the Booking record
      const booking = manager.create(Booking, {
        menteeId,
        mentorId,
        scheduledAt: startTime,
        duration,
        creditsUsed: creditCost,
      });
      const savedBooking = await manager.save(booking);

      // Log the Audit Transaction
      const transaction = manager.create(CreditTransaction, {
        userId: menteeId,
        amount: -creditCost,
        type: CreditTransactionType.BOOKING,
        referenceId: savedBooking.id,
        description: `Booking: ${duration} mins with mentor ${mentorId} starting at ${startTime.toISOString()}`,
      });
      await manager.save(transaction);

      return savedBooking;
    });
  }

  async getBookings(userId: string, query: GetBookingsDto) {
    const { page = 1, limit = 10, status } = query;

    const whereConditions = status
      ? [
          { menteeId: userId, status },
          { mentorId: userId, status },
        ]
      : [{ menteeId: userId }, { mentorId: userId }];

    const [bookings, total] = await this.bookingRepository.findAndCount({
      where: whereConditions,
      relations: ['mentor', 'mentee'],
      order: { scheduledAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    return createPaginationResponse(bookings, total, page, limit);
  }

  async getBookingById(bookingId: string, userId: string) {
    const booking = await this.bookingRepository.findOne({
      where: [
        { id: bookingId, menteeId: userId },
        { id: bookingId, mentorId: userId },
      ],
      relations: ['mentor', 'mentee'], // Include user details
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${bookingId} not found`);
    }

    return booking;
  }

  async cancelBooking(bookingId: string, userId: string) {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId },
    });

    if (!booking) throw new NotFoundException('Booking not found');

    if (booking.menteeId !== userId) {
      throw new ForbiddenException('Only the mentee can cancel this booking');
    }

    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Booking is already cancelled');
    }

    const { amount: refundAmount, percentage } = calculateRefundAmount(
      booking.scheduledAt,
      booking.creditsUsed,
    );

    return await this.dataSource.transaction(async (manager) => {
      const lockedBooking = await manager.findOne(Booking, {
        where: { id: bookingId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!lockedBooking) throw new NotFoundException('Booking not found');

      lockedBooking.status = BookingStatus.CANCELLED;
      await manager.save(lockedBooking);

      if (refundAmount > 0) {
        const userCredit = await manager.findOne(UserCredit, {
          where: { userId: booking.menteeId },
          lock: { mode: 'pessimistic_write' },
        });

        if (userCredit) {
          userCredit.balance += refundAmount;
          await manager.save(userCredit);

          await manager.save(CreditTransaction, {
            userId: booking.menteeId,
            amount: refundAmount,
            type: CreditTransactionType.REFUND,
            referenceId: booking.id,
            description: `Refund (${percentage}%) for cancelled booking ${booking.id}`,
          });
        }
      }

      return {
        message: 'Booking cancelled successfully',
        refundAmount,
        refundPercentage: `${percentage}%`,
      };
    });
  }
}
