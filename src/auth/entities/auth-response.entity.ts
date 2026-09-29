import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../users/entities/user.entity.js';

export class AuthResponseEntity {
  @ApiProperty({
    description: 'Signed JWT access token for authorization headers',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Authenticated user profile details',
    type: () => UserEntity,
  })
  user: UserEntity;

  constructor(partial: Partial<AuthResponseEntity>) {
    Object.assign(this, partial);
  }
}
