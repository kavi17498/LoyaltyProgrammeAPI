import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import bcrypt from 'bcrypt';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PrismaService } from '../prisma/prisma.service.js';
import { UsersService } from './users.service.js';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: { user: { create: any; findMany: any; findUnique: any; update: any; delete: any } };

  beforeEach(async () => {
    prisma = {
      user: {
        create: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should hash password and PIN, and return safe UserEntity without hashes', async () => {
      const mockCreatedUser = {
        id: 'user-uuid-1',
        username: 'john_doe',
        passwordHash: '$2b$12$mockHashedPassword',
        pinHash: '$2b$12$mockHashedPin',
        role: 'CASHIER' as const,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prisma.user.create.mockResolvedValue(mockCreatedUser);

      const result = await service.create({
        username: 'john_doe',
        password: 'Password123!',
        pin: '1234',
      });

      expect(prisma.user.create).toHaveBeenCalled();
      const createArgs = prisma.user.create.mock.calls[0][0];

      // Verify that plain password is NOT sent to DB
      expect(createArgs.data.passwordHash).not.toBe('Password123!');
      expect(await bcrypt.compare('Password123!', createArgs.data.passwordHash)).toBe(true);

      // Verify that plain PIN is NOT sent to DB
      expect(createArgs.data.pinHash).not.toBe('1234');
      expect(await bcrypt.compare('1234', createArgs.data.pinHash)).toBe(true);

      // Verify response does not leak hashes
      expect(result.id).toBe('user-uuid-1');
      expect(result.username).toBe('john_doe');
      expect(result.hasPin).toBe(true);
      expect((result as any).passwordHash).toBeUndefined();
      expect((result as any).pinHash).toBeUndefined();
    });
  });

  describe('findOne', () => {
    it('should return user entity when found', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-uuid-1',
        username: 'john_doe',
        passwordHash: 'hash',
        pinHash: null,
        role: 'ADMIN',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const user = await service.findOne('user-uuid-1');
      expect(user.id).toBe('user-uuid-1');
      expect(user.hasPin).toBe(false);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(NotFoundException);
    });
  });
});
