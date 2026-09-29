import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class CreateCustomerDto {
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

  @ApiProperty({
    description: 'Full name of the customer',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty({ message: 'Full name is required' })
  @MaxLength(100, { message: 'Full name cannot exceed 100 characters' })
  fullName: string;
}
