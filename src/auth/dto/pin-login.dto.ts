import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class PinLoginDto {
  @ApiProperty({
    description: '4 to 6 digit quick POS cashier PIN',
    example: '1234',
  })
  @IsString()
  @IsNotEmpty({ message: 'PIN is required' })
  @Matches(/^\d{4,6}$/, { message: 'PIN must be between 4 and 6 numeric digits' })
  pin: string;

  @ApiPropertyOptional({
    description: 'Optional username to disambiguate identical PINs across staff',
    example: 'cashier_john',
  })
  @IsOptional()
  @IsString()
  username?: string;
}
