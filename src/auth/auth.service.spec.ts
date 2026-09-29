import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import bcrypt from 'bcrypt';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PrismaService } from '../prisma/prisma.service.js';
import { UserEntity } from '../users/entities/user.entity.js';
import { UsersService } from '../users/users.service.js';
import { AuthService } from './auth.service.js';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: { findByUsername: any; findOne: any };
  let jwtService: { sign: any };
  let prisma: { user: { findMany: any } };

  beforeEach(async () => {
    usersService = {
      findByUsername: vi.fn(),
      findOne: vi.fn(),
    };

    jwtService = {
      sign: vi.fn().mockReturnValue('mock-signed-jwt-token'),
    };

    prisma = {
      user: {
        findMany: vi.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: usersService,
        },
        {
          provide: JwtService,
          useValue: jwtService,
        },
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should authenticate valid user and return JWT access token', async () => {
      const hashedPassword = await bcrypt.hash('CorrectPassword123!', 10);

      usersService.findByUsername.mockResolvedValue({
        id: 'user-uuid-1',
        username: 'admin',
        passwordHash: hashedPassword,
        role: 'ADMIN',
        isActive: true,
      });

      usersService.findOne.mockResolvedValue(
        new UserEntity({
          id: 'user-uuid-1',
          username: 'admin',
          role: 'ADMIN',
          hasPin: false,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      );

      const result = await service.login({
        username: 'admin',
        password: 'CorrectPassword123!',
      });

      expect(result.accessToken).toBe('mock-signed-jwt-token');
      expect(result.user.username).toBe('admin');
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: 'user-uuid-1',
        username: 'admin',
        role: 'ADMIN',
      });
    });

    it('should throw UnauthorizedException on wrong password', async () => {
      const hashedPassword = await bcrypt.hash('CorrectPassword123!', 10);

      usersService.findByUsername.mockResolvedValue({
        id: 'user-uuid-1',
        username: 'admin',
        passwordHash: hashedPassword,
        role: 'ADMIN',
        isActive: true,
      });

      await expect(
        service.login({
          username: 'admin',
          password: 'WrongPassword!',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException on deactivated user', async () => {
      const hashedPassword = await bcrypt.hash('CorrectPassword123!', 10);

      usersService.findByUsername.mockResolvedValue({
        id: 'user-uuid-1',
        username: 'admin',
        passwordHash: hashedPassword,
        role: 'ADMIN',
        isActive: false,
      });

      await expect(
        service.login({
          username: 'admin',
          password: 'CorrectPassword123!',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('pinLogin', () => {
    it('should authenticate cashier with valid PIN', async () => {
      const hashedPin = await bcrypt.hash('4321', 10);

      prisma.user.findMany.mockResolvedValue([
        {
          id: 'cashier-1',
          username: 'cashier_bob',
          pinHash: hashedPin,
          role: 'CASHIER',
          isActive: true,
        },
      ]);

      usersService.findOne.mockResolvedValue(
        new UserEntity({
          id: 'cashier-1',
          username: 'cashier_bob',
          role: 'CASHIER',
          hasPin: true,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      );

      const result = await service.pinLogin({ pin: '4321' });

      expect(result.accessToken).toBe('mock-signed-jwt-token');
      expect(result.user.username).toBe('cashier_bob');
    });

    it('should throw UnauthorizedException on invalid PIN', async () => {
      prisma.user.findMany.mockResolvedValue([]);

      await expect(service.pinLogin({ pin: '9999' })).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
