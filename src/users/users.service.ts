import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UserEntity } from './entities/user.entity.js';

@Injectable()
export class UsersService {
  private readonly saltRounds = 12;

  constructor(private readonly prisma: PrismaService) {}

  private toEntity(user: User): UserEntity {
    return new UserEntity({
      id: user.id,
      username: user.username,
      role: user.role,
      hasPin: Boolean(user.pinHash),
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  async create(dto: CreateUserDto): Promise<UserEntity> {
    const passwordHash = await bcrypt.hash(dto.password, this.saltRounds);
    const pinHash = dto.pin ? await bcrypt.hash(dto.pin, this.saltRounds) : null;

    try {
      const user = await this.prisma.user.create({
        data: {
          username: dto.username.trim(),
          passwordHash,
          pinHash,
          role: dto.role ?? 'CASHIER',
          isActive: dto.isActive ?? true,
        },
      });

      return this.toEntity(user);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException(`Username "${dto.username}" is already taken`);
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return users.map((user) => this.toEntity(user));
  }

  async findOne(id: string): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return this.toEntity(user);
  }

  // Internal method for AuthModule login verification
  async findByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserEntity> {
    // Verify user exists first
    await this.findOne(id);

    const data: Prisma.UserUpdateInput = {};

    if (dto.username !== undefined) {
      data.username = dto.username.trim();
    }

    if (dto.password !== undefined) {
      data.passwordHash = await bcrypt.hash(dto.password, this.saltRounds);
    }

    if (dto.pin !== undefined) {
      data.pinHash = dto.pin ? await bcrypt.hash(dto.pin, this.saltRounds) : null;
    }

    if (dto.role !== undefined) {
      data.role = dto.role;
    }

    if (dto.isActive !== undefined) {
      data.isActive = dto.isActive;
    }

    try {
      const updated = await this.prisma.user.update({
        where: { id },
        data,
      });

      return this.toEntity(updated);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException(`Username "${dto.username}" is already taken`);
      }
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    // Verify user exists first
    await this.findOne(id);

    await this.prisma.user.delete({
      where: { id },
    });

    return {
      message: `User with ID "${id}" has been deleted successfully`,
    };
  }
}
