import { Injectable, Logger } from '@nestjs/common';
import { Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.entity';
import bcrypt from "bcryptjs";
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userModel.findOne({ email });
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(userDto: { email: string; password: string; name?: string }) {
    const logger = new Logger(AuthService.name);
    logger.log(`Register attempt for email: ${userDto.email}`);
    
    const userId = new Types.ObjectId().toHexString();
    const hashedPassword = await bcrypt.hash(userDto.password, 10);
    
    const newUser = new this.userModel({
      email: userDto.email,
      password: hashedPassword,
      userId,
      ...(userDto.name && { name: userDto.name })
    });
    
    await newUser.save();
    return this.login(newUser);
  }
}