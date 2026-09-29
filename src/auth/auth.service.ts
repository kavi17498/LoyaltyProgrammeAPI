import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';
import { UserEntity } from '../users/entities/user.entity.js';
import { UsersService } from '../users/users.service.js';
import { LoginDto } from './dto/login.dto.js';
import { PinLoginDto } from './dto/pin-login.dto.js';
import { AuthResponseEntity } from './entities/auth-response.entity.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  private generateToken(user: { id: string; username: string; role: string }): string {
    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    return this.jwtService.sign(payload);
  }

  async login(dto: LoginDto): Promise<AuthResponseEntity> {
    const user = await this.usersService.findByUsername(dto.username.trim());

    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid username or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User account has been deactivated. Contact an administrator');
    }

    const accessToken = this.generateToken(user);
    const userEntity = await this.usersService.findOne(user.id);

    return new AuthResponseEntity({
      accessToken,
      user: userEntity,
    });
  }

  async pinLogin(dto: PinLoginDto): Promise<AuthResponseEntity> {
    // If username is provided, verify against that specific account
    if (dto.username) {
      const user = await this.usersService.findByUsername(dto.username.trim());
      if (!user || !user.pinHash) {
        throw new UnauthorizedException('Invalid PIN or account not configured for PIN login');
      }

      const isPinValid = await bcrypt.compare(dto.pin, user.pinHash);
      if (!isPinValid) {
        throw new UnauthorizedException('Invalid PIN');
      }

      if (!user.isActive) {
        throw new UnauthorizedException('User account has been deactivated');
      }

      const accessToken = this.generateToken(user);
      const userEntity = await this.usersService.findOne(user.id);

      return new AuthResponseEntity({
        accessToken,
        user: userEntity,
      });
    }

    // Otherwise, find active staff matching this PIN
    const usersWithPin = await this.prisma.user.findMany({
      where: {
        isActive: true,
        pinHash: { not: null },
      },
    });

    for (const user of usersWithPin) {
      if (user.pinHash && (await bcrypt.compare(dto.pin, user.pinHash))) {
        const accessToken = this.generateToken(user);
        const userEntity = await this.usersService.findOne(user.id);

        return new AuthResponseEntity({
          accessToken,
          user: userEntity,
        });
      }
    }

    throw new UnauthorizedException('Invalid PIN');
  }

  async getProfile(userId: string): Promise<UserEntity> {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User profile not found');
    }
    return user;
  }
}
