import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({
    description: 'Full name of the customer',
    example: 'Alice Johnson',
  })
  @IsString()
  @IsNotEmpty({ message: 'Full name is required' })
  @MaxLength(100, { message: 'Full name cannot exceed 100 characters' })
  fullName: string;

  @ApiProperty({
    description: 'Unique customer phone number (e.g. +14155552671)',
    example: '+14155552671',
  })
  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  @Matches(/^\+?[1-9]\d{6,14}$/, {
    message: 'Phone number must be a valid format (e.g. +14155552671)',
  })
  phoneNumber: string;

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
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  emailConsent?: boolean;

  @ApiPropertyOptional({
    description: 'Consent to receive marketing SMS',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  smsConsent?: boolean;
}
