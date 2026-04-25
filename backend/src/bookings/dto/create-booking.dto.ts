import { IsInt, IsNotEmpty, IsDateString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBookingDto {
  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  carId: number;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  endDate: string;
}