import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class UpdateCustomerDto {
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
    description: 'Full name of the customer',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Full name cannot exceed 100 characters' })
  fullName?: string;
}
