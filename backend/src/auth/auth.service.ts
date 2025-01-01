import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async isValidPassword(password: string, hashedPassword: string) {
    try {
      const isValid = await bcrypt.compare(password, hashedPassword);
      if (!isValid) {
        throw new NotFoundException('Invalid credentials');
      }

      return isValid;
    } catch (error) {
      throw error;
    }
  }

  async validateUser(loginDto: LoginDto): Promise<any> {
    try {
      const user = await this.userModel.findOne({ email: loginDto.email });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      await this.isValidPassword(loginDto.password, user.password);

      const { password, ...result } = user.toObject();
      return result;
    } catch (error) {
      throw error;
    }
  }

  async login(user: UserDocument) {
    try {
      const payload = { email: user.email, id: user._id, role: user.role };

      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      throw error;
    }
  }

  async register(registerDto: RegisterDto) {
    try {
      const hashedPassword = await bcrypt.hash(registerDto.password, 10);

      const createdUser = new this.userModel({
        ...registerDto,
        password: hashedPassword,
      });
      const savedUser = await createdUser.save();

      const { password, ...result } = savedUser.toObject();

      return result;
    } catch (error) {
      throw error;
    }
  }
}