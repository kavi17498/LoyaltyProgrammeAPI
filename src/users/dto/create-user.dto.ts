import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Unique username for login',
    example: 'cashier_john',
  })
  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  @MinLength(3, { message: 'Username must be at least 3 characters' })
  @MaxLength(50, { message: 'Username cannot exceed 50 characters' })
  @Matches(/^[a-zA-Z0-9._-]+$/, {
    message: 'Username can only contain alphanumeric characters, dots, underscores, and hyphens',
  })
  username: string;

  @ApiProperty({
    description: 'Account login password (minimum 6 characters)',
    example: 'StrongP@ssw0rd!',
    format: 'password',
  })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @MaxLength(100, { message: 'Password cannot exceed 100 characters' })
  password: string;

  @ApiPropertyOptional({
    description: 'Quick 4 to 6 digit numeric PIN for cashier terminal login',
    example: '1234',
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
    default: UserRole.CASHIER,
    example: UserRole.CASHIER,
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be one of ADMIN, MANAGER, CASHIER, STAFF' })
  role?: UserRole;

  @ApiPropertyOptional({
    description: 'Whether the user account is active',
    default: true,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
