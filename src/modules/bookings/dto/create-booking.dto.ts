import { IsUUID, IsISO8601, IsInt, Min, Max } from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  mentorId: string;

  @IsISO8601()
  scheduledAt: string;

  @IsInt()
  @Min(30)
  @Max(120)
  duration: number; // in minutes
}
