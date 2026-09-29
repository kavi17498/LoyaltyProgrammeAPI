import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LoyaltyAccountEntity } from './loyalty-account.entity.js';

export class CustomerEntity {
  @ApiProperty({
    description: 'Unique identifier for the customer (UUID)',
    example: 'fbde3003-f7c4-4961-b269-7c16a8e7e6c9',
  })
  id: string;

  @ApiProperty({
    description: 'Customer full name',
    example: 'Alice Johnson',
  })
  fullName: string;

  @ApiPropertyOptional({
    description: 'Customer email address',
    example: 'alice@example.com',
  })
  email?: string | null;

  @ApiProperty({
    description: 'Unique customer phone number in international format',
    example: '+14155552671',
  })
  phoneNumber: string;

  @ApiPropertyOptional({
    description: 'Birthday month (1-12)',
    example: 8,
  })
  birthdayMonth?: number | null;

  @ApiPropertyOptional({
    description: 'Birthday day of month (1-31)',
    example: 15,
  })
  birthdayDay?: number | null;

  @ApiProperty({
    description: 'Consent given to receive marketing emails',
    example: false,
    default: false,
  })
  emailConsent: boolean;

  @ApiProperty({
    description: 'Consent given to receive SMS notifications',
    example: false,
    default: false,
  })
  smsConsent: boolean;

  @ApiPropertyOptional({
    description: 'Timestamp when marketing consent was recorded',
    example: '2026-09-29T08:38:13.000Z',
  })
  consentTimestamp?: Date | null;

  @ApiProperty({
    description: 'Timestamp when the customer was created',
    example: '2026-09-29T08:38:13.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the customer record was last updated',
    example: '2026-09-29T08:38:13.000Z',
  })
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'Customer loyalty account details',
    type: () => LoyaltyAccountEntity,
  })
  loyaltyAccount?: LoyaltyAccountEntity | null;

  constructor(
    partial: Omit<Partial<CustomerEntity>, 'loyaltyAccount'> & {
      loyaltyAccount?: Partial<LoyaltyAccountEntity> | null;
    },
  ) {
    Object.assign(this, partial);
    if (partial.loyaltyAccount) {
      this.loyaltyAccount = new LoyaltyAccountEntity(partial.loyaltyAccount);
    }
  }

  isLoyaltyActive(): boolean {
    return this.loyaltyAccount?.status === 'ACTIVE';
  }
}
