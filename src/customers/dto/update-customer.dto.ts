import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateCustomerDto {
  @ApiPropertyOptional({
    description: 'Customer full name',
    example: 'Alice Johnson',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Full name cannot exceed 100 characters' })
  fullName?: string;

  @ApiPropertyOptional({
    description: 'Unique customer phone number (e.g. +14155552671)',
    example: '+14155552671',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\+?[1-9]\d{6,14}$/, {
    message: 'Phone number must be a valid format (e.g. +14155552671)',
  })
  phoneNumber?: string;

  @ApiPropertyOptional({
    description: 'Customer email address',
    example: 'alice@example.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email address format' })
  email?: string;

  @ApiPropertyOptional({
    description: 'Birthday month (1-12)',
    example: 8,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  birthdayMonth?: number;

  @ApiPropertyOptional({
    description: 'Birthday day of month (1-31)',
    example: 15,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(31)
  birthdayDay?: number;

  @ApiPropertyOptional({
    description: 'Consent to receive marketing emails',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  emailConsent?: boolean;

  @ApiPropertyOptional({
    description: 'Consent to receive marketing SMS',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  smsConsent?: boolean;
}
