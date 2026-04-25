import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCarDto, UpdateCarDto } from './dto/car.dto';

@Injectable()
export class CarsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.car.findMany({
      where: { available: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const car = await this.prisma.car.findUnique({
      where: { id },
    });

    if (!car) {
      throw new NotFoundException('Car not found');
    }

    return car;
  }

  async findFeatured() {
    return this.prisma.car.findMany({
      where: { available: true },
      take: 6,
      orderBy: { pricePerDay: 'desc' },
    });
  }

  async getCategories() {
    const cars = await this.prisma.car.findMany({
      select: { brand: true },
      distinct: ['brand'],
    });
    return cars.map((car) => car.brand);
  }

  async create(createCarDto: CreateCarDto) {
    return this.prisma.car.create({
      data: createCarDto,
    });
  }

  async update(id: number, updateCarDto: UpdateCarDto) {
    const car = await this.prisma.car.findUnique({
      where: { id },
    });

    if (!car) {
      throw new NotFoundException('Car not found');
    }

    return this.prisma.car.update({
      where: { id },
      data: updateCarDto,
    });
  }

  async delete(id: number) {
    const car = await this.prisma.car.findUnique({
      where: { id },
    });

    if (!car) {
      throw new NotFoundException('Car not found');
    }

    return this.prisma.car.delete({
      where: { id },
    });
  }
}