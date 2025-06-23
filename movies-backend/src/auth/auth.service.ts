import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from './schemas/user.schema';
import { SignupDto } from './dto/signup.dto/signup.dto';
import { LoginDto } from './dto/login.dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { RateMovieDto } from './dto/rate-movie.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) { }


  async getProfile(userId: string) {
    const user = await this.userModel.findById(userId).select('-password');
    if (!user) throw new Error('User not found');
    return user;
  }

  async getRatings(userId: string) {
    const user = await this.userModel.findById(userId).select('movieRatings');
    if (!user) throw new Error('User not found');
    const ratings = user.movieRatings ?? new Map<string, number>();
    const ratingsObj = Object.fromEntries(ratings);
    return { userId, ratings: ratingsObj };
  }

  async signup(dto: SignupDto) {
    const existing = await this.userModel.findOne({ email: dto.email });
    if (existing) throw new ConflictException('Email already registered');

    const hash = await bcrypt.hash(dto.password, 10);
    const user = new this.userModel({
      email: dto.email,
      password: hash,
      name: dto.name,
      address: '123 Placeholder Street',
      image: 'https://cdn-icons-png.freepik.com/512/9650/9650503.png?ga=GA1.1.874513709.1750583883',
      dob: new Date('1990-01-01'),
      categories: ['Action', 'Comedy'],
    });
    await user.save();
    const token = this.jwtService.sign({ sub: user._id, email: user.email });

    return {
      message: 'User registered successfully',
      token,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({ sub: user._id, email: user.email });
    return { message: 'Login successful', token };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    await this.userModel.findByIdAndUpdate(userId, dto);
    return { message: 'Profile updated successfully' };
  }

  async rateMovie(userId: string, dto: RateMovieDto) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new Error('User not found');

    if (!user.movieRatings) {
      user.movieRatings = new Map<string, number>();
    }

    user.movieRatings.set(String(dto.movieId), dto.rating);
    await user.save();
    return { message: `Rated movie ${dto.movieId} with ${dto.rating} stars` };
  }

}
