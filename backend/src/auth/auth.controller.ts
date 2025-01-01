import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  async register(@Body() registerDto: RegisterDto) {
    try {
      return await this.authService.register(registerDto);
    } catch (error) {
      throw error;
    }
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Return JWT token' })
  async login(@Body() loginDto: LoginDto) {
    try {
      const user = await this.authService.validateUser(loginDto);

      return await this.authService.login(user);
    } catch (error) {
      throw error;
    }
  }
}
