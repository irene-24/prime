import { IsUUID, IsISO8601, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ description: 'UUID of the mentor to book' })
  @IsUUID()
  mentorId: string;

  @ApiProperty({ description: 'ISO8601 datetime string for the session start' })
  @IsISO8601()
  scheduledAt: string;

  @ApiProperty({
    description: 'Session duration in minutes (30, 60, 90, 120)',
    minimum: 30,
    maximum: 120,
  })
  @IsInt()
  @Min(30)
  @Max(120)
  duration: number; // in minutes
}
