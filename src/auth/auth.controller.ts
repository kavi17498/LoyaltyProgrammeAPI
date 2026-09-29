import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserEntity } from '../users/entities/user.entity.js';
import { AuthService } from './auth.service.js';
import { CurrentUser } from './decorators/current-user.decorator.js';
import { Public } from './decorators/public.decorator.js';
import { LoginDto } from './dto/login.dto.js';
import { PinLoginDto } from './dto/pin-login.dto.js';
import { AuthResponseEntity } from './entities/auth-response.entity.js';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with username and password to obtain JWT access token' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Authentication successful. Returns JWT access token and user info',
    type: AuthResponseEntity,
  })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 401, description: 'Invalid credentials or inactive account' })
  login(@Body() loginDto: LoginDto): Promise<AuthResponseEntity> {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('pin-login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Quick POS login using 4-6 digit cashier PIN' })
  @ApiBody({ type: PinLoginDto })
  @ApiResponse({
    status: 200,
    description: 'PIN verified successfully. Returns JWT access token',
    type: AuthResponseEntity,
  })
  @ApiResponse({ status: 400, description: 'Invalid PIN format' })
  @ApiResponse({ status: 401, description: 'Invalid PIN' })
  pinLogin(@Body() pinLoginDto: PinLoginDto): Promise<AuthResponseEntity> {
    return this.authService.pinLogin(pinLoginDto);
  }

  @Get('me')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current authenticated user profile' })
  @ApiResponse({
    status: 200,
    description: 'Current user profile details',
    type: UserEntity,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid or missing JWT token' })
  getProfile(@CurrentUser('id') userId: string): Promise<UserEntity> {
    return this.authService.getProfile(userId);
  }
}
