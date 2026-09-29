import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateCustomerDto } from './dto/create-customer.dto.js';
import { UpdateCustomerDto } from './dto/update-customer.dto.js';
import { CustomerEntity } from './entities/customer.entity.js';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCustomerDto): Promise<CustomerEntity> {
    try {
      const customer = await this.prisma.customer.create({
        data: {
          phoneNumber: dto.phoneNumber.trim(),
          fullName: dto.fullName.trim(),
          loyaltyAccount: {
            create: {
              currentBalance: 0,
            },
          },
        },
        include: {
          loyaltyAccount: true,
        },
      });

      return new CustomerEntity(customer);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('A customer with this phone number already exists');
      }
      throw new InternalServerErrorException('Failed to create customer');
    }
  }

  async findAll(): Promise<CustomerEntity[]> {
    const customers = await this.prisma.customer.findMany({
      include: {
        loyaltyAccount: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return customers.map((customer) => new CustomerEntity(customer));
  }

  async findOne(id: string): Promise<CustomerEntity> {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: {
        loyaltyAccount: true,
      },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID "${id}" not found`);
    }

    return new CustomerEntity(customer);
  }

  async update(id: string, dto: UpdateCustomerDto): Promise<CustomerEntity> {
    // Verify customer exists before attempting update
    await this.findOne(id);

    try {
      const updated = await this.prisma.customer.update({
        where: { id },
        data: {
          ...(dto.fullName !== undefined ? { fullName: dto.fullName.trim() } : {}),
          ...(dto.phoneNumber !== undefined ? { phoneNumber: dto.phoneNumber.trim() } : {}),
        },
        include: {
          loyaltyAccount: true,
        },
      });

      return new CustomerEntity(updated);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('A customer with this phone number already exists');
      }
      throw new InternalServerErrorException('Failed to update customer');
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    // Verify customer exists before attempting delete
    await this.findOne(id);

    await this.prisma.customer.delete({
      where: { id },
    });

    return {
      message: `Customer with ID "${id}" has been deleted successfully`,
    };
  }
}
