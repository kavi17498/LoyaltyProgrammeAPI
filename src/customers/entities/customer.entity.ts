import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LoyaltyAccountEntity } from './loyalty-account.entity.js';

export class CustomerEntity {
  @ApiProperty({
    description: 'Unique identifier for the customer (UUID)',
    example: 'fbde3003-f7c4-4961-b269-7c16a8e7e6c9',
  })
  id: string;

  @ApiProperty({
    description: 'Unique customer phone number in international or local format',
    example: '+14155552671',
  })
  phoneNumber: string;

  @ApiProperty({
    description: 'Customer full name',
    example: 'Alice Johnson',
  })
  fullName: string;

  @ApiProperty({
    description: 'Timestamp when the customer record was created',
    example: '2026-09-29T08:38:13.000Z',
  })
  createdAt: Date;

  @ApiPropertyOptional({
    description: 'Customer loyalty account details',
    type: () => LoyaltyAccountEntity,
  })
  loyaltyAccount?: LoyaltyAccountEntity | null;

  constructor(partial: Partial<CustomerEntity>) {
    Object.assign(this, partial);
  }
}
