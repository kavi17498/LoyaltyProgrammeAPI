import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class UserEntity {
  @ApiProperty({
    description: 'Unique identifier for the user (UUID)',
    example: 'd5c58a14-41d3-4670-8772-23c34a2e88a0',
  })
  id: string;

  @ApiProperty({
    description: 'Unique login username',
    example: 'cashier_john',
  })
  username: string;

  @ApiProperty({
    description: 'User access role',
    enum: UserRole,
    example: UserRole.CASHIER,
  })
  role: UserRole;

  @ApiProperty({
    description: 'Indicates whether a quick POS login PIN has been configured',
    example: true,
  })
  hasPin: boolean;

  @ApiProperty({
    description: 'Whether the user account is active',
    example: true,
    default: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2026-09-29T08:38:13.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2026-09-29T08:38:13.000Z',
  })
  updatedAt: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
