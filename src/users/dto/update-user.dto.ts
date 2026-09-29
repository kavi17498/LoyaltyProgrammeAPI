import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Unique username for login',
    example: 'cashier_john',
  })
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Username must be at least 3 characters' })
  @MaxLength(50, { message: 'Username cannot exceed 50 characters' })
  @Matches(/^[a-zA-Z0-9._-]+$/, {
    message: 'Username can only contain alphanumeric characters, dots, underscores, and hyphens',
  })
  username?: string;

  @ApiPropertyOptional({
    description: 'New account password (minimum 6 characters)',
    example: 'NewStrongP@ss123',
    format: 'password',
  })
  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @MaxLength(100, { message: 'Password cannot exceed 100 characters' })
  password?: string;

  @ApiPropertyOptional({
    description: 'Quick 4 to 6 digit numeric PIN for cashier terminal login',
    example: '5678',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4,6}$/, {
    message: 'PIN must be between 4 and 6 digits',
  })
  pin?: string;

  @ApiPropertyOptional({
    description: 'Access role',
    enum: UserRole,
    example: UserRole.MANAGER,
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be one of ADMIN, MANAGER, CASHIER, STAFF' })
  role?: UserRole;

  @ApiPropertyOptional({
    description: 'Whether the user account is active',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
