import { IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import { BookingStatus } from '@/common/enums/booking-status.enum';

export class GetBookingsDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    enum: BookingStatus,
    description: 'Filter by booking status',
  })
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;
}
