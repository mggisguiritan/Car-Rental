import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  private calculateDays(startDate: Date, endDate: Date): number {
    const diffTime = endDate.getTime() - startDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  }

  async calculatePrice(carId: number, startDate: string, endDate: string) {
    const car = await this.prisma.car.findUnique({
      where: { id: carId },
    });

    if (!car) {
      throw new NotFoundException('Car not found');
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      throw new BadRequestException('End date must be after start date');
    }

    const days = this.calculateDays(start, end);
    const totalPrice = days * car.pricePerDay;

    return { totalPrice, days };
  }

  async checkOverlappingBookings(
    carId: number,
    startDate: Date,
    endDate: Date,
    excludeBookingId?: number,
  ): Promise<boolean> {
    const bookings = await this.prisma.booking.findMany({
      where: {
        carId,
        status: { not: 'CANCELLED' },
        OR: [
          {
            startDate: { lte: endDate },
            endDate: { gte: startDate },
          },
        ],
      },
    });

    if (excludeBookingId) {
      const filteredBookings = bookings.filter(
        (b) => b.id !== excludeBookingId,
      );
      return filteredBookings.length > 0;
    }

    return bookings.length > 0;
  }

  async create(userId: number, createBookingDto: CreateBookingDto) {
    const car = await this.prisma.car.findUnique({
      where: { id: createBookingDto.carId },
    });

    if (!car) {
      throw new NotFoundException('Car not found');
    }

    if (!car.available) {
      throw new BadRequestException('Car is not available');
    }

    const startDate = new Date(createBookingDto.startDate);
    const endDate = new Date(createBookingDto.endDate);

    if (startDate < new Date()) {
      throw new BadRequestException('Start date cannot be in the past');
    }

    if (endDate <= startDate) {
      throw new BadRequestException('End date must be after start date');
    }

    const hasOverlap = await this.checkOverlappingBookings(
      createBookingDto.carId,
      startDate,
      endDate,
    );

    if (hasOverlap) {
      throw new BadRequestException(
        'Car is already booked for the selected dates',
      );
    }

    const days = this.calculateDays(startDate, endDate);
    const totalPrice = days * car.pricePerDay;

    return this.prisma.booking.create({
      data: {
        userId,
        carId: createBookingDto.carId,
        startDate,
        endDate,
        totalPrice,
      },
      include: {
        car: {
          select: {
            id: true,
            name: true,
            brand: true,
            pricePerDay: true,
            image: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findUserBookings(userId: number) {
    return this.prisma.booking.findMany({
      where: { userId },
      include: {
        car: {
          select: {
            id: true,
            name: true,
            brand: true,
            pricePerDay: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAll() {
    return this.prisma.booking.findMany({
      include: {
        car: {
          select: {
            id: true,
            name: true,
            brand: true,
            pricePerDay: true,
            image: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: number, updateStatusDto: UpdateBookingStatusDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (updateStatusDto.status === 'CANCELLED' && booking.status !== 'PENDING') {
      throw new BadRequestException(
        'Can only cancel bookings with PENDING status',
      );
    }

    return this.prisma.booking.update({
      where: { id },
      data: updateStatusDto,
      include: {
        car: {
          select: {
            id: true,
            name: true,
            brand: true,
            pricePerDay: true,
            image: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }
}