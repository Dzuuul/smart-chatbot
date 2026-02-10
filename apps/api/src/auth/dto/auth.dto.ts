import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
  })
  password: string;
}

export class RegisterDto {
  @ApiProperty({
    description: 'Full name of the new admin user',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'Email address for the new admin user',
    example: 'newadmin@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Password for the new admin user',
    example: 'securePassword123',
    minLength: 8,
  })
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh token to obtain a new access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refresh_token: string;
}
