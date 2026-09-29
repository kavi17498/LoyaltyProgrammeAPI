import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoyaltyAccountEntity {
  @ApiProperty({
    description: 'Unique identifier for the loyalty account (UUID)',
    example: 'e2a86df7-5fc1-46bd-8da9-f8319f5a34ec',
  })
  id: string;

  @ApiProperty({
    description: 'Referenced Customer UUID',
    example: 'fbde3003-f7c4-4961-b269-7c16a8e7e6c9',
  })
  customerId: string;

  @ApiProperty({
    description: 'Current points/rewards balance',
    example: 0,
    default: 0,
  })
  currentBalance: number;

  @ApiProperty({
    description: 'Account status (e.g. ACTIVE, SUSPENDED, CLOSED)',
    example: 'ACTIVE',
    default: 'ACTIVE',
  })
  status: string;

  @ApiProperty({
    description: 'Timestamp when enrolled in loyalty program',
    example: '2026-09-29T08:38:13.000Z',
  })
  enrolledAt: Date;

  @ApiPropertyOptional({
    description: 'Timestamp when account was verified',
    example: null,
  })
  verifiedAt?: Date | null;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2026-09-29T08:38:13.000Z',
  })
  updatedAt: Date;

  constructor(partial: Partial<LoyaltyAccountEntity>) {
    Object.assign(this, partial);
  }

  credit(points: number): void {
    if (points > 0) {
      this.currentBalance += points;
    }
  }

  debit(points: number): void {
    if (points > 0 && this.currentBalance >= points) {
      this.currentBalance -= points;
    }
  }
}
