import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PASSPORT_STRATEGY_NAME } from 'src/util/constants';
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
      const user = await this.authService.register(registerDto);

      return {
        statusCode: HttpStatus.CREATED,
        message: 'User successfully created',
        data: {
          user,
        },
      };
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

      const access_token = await this.authService.login(user);

      return {
        statusCode: HttpStatus.OK,
        message: 'User logged in successfully',
        data: {
          access_token,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard(PASSPORT_STRATEGY_NAME))
  @Get('user')
  @ApiOperation({ summary: 'Get user details' })
  @ApiResponse({ status: 200, description: 'Return user details' })
  async loginUserDetails(@Request() req) {
    try {
      const authUser = req?.user;

      const user = await this.authService.findOneUser({
        _id: authUser?.userId,
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'User details fetched successfully',
        data: user,
      };
    } catch (error) {
      throw error;
    }
  }
}
