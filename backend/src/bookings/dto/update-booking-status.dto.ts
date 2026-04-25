import { IsEnum, IsOptional } from 'class-validator';
import { BookingStatus } from '../../enums/booking-status.enum';

export class UpdateBookingStatusDto {
  @IsEnum(BookingStatus)
  @IsOptional()
  status?: BookingStatus;
}