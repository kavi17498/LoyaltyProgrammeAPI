import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  MinLength,
} from 'class-validator';

export class SetupAdminDto {
  @ApiProperty({ example: 'admin_user', description: 'Primary administrator username' })
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  username: string;

  @ApiProperty({ example: 'StrongPassword123!', description: 'Strong password (minimum 8 characters)' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiPropertyOptional({ example: '1234', description: 'Optional 4-6 digit numeric POS PIN' })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4,6}$/, { message: 'PIN must be between 4 and 6 numeric digits' })
  pin?: string;
}
