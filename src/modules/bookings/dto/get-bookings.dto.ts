import { IsOptional, IsEnum } from 'class-validator';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import { BookingStatus } from '@/common/enums/booking-status.enum';

export class GetBookingsDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;
}
