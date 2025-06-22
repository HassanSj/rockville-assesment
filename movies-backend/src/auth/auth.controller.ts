import { Controller, Post, Body, Patch, UseGuards, Request, Get, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto/signup.dto';
import { LoginDto } from './dto/login.dto/login.dto';
import { RateMovieDto } from './dto/rate-movie.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from 'src/guards/jwt.config';
import { CloudinaryService } from './cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cloudinaryService: CloudinaryService
  ) { }

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: new CloudinaryStorage({
      cloudinary: require('cloudinary').v2,
      params: async (req, file) => ({
        folder: 'profile-images',
        format: file.mimetype.split('/')[1],
        public_id: `${Date.now()}-${file.originalname}`,
      }),
    }),
  }))

  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return { imageUrl: file.path };
  }

  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // @Patch('profile')
  // @UseGuards(JwtAuthGuard)
  // updateProfile(@Request() req, @Body() dto: UpdateProfileDto) {
  //   return this.authService.updateProfile(req.user.sub, dto);
  // }

  @UseGuards(JwtAuthGuard)
  @Post('rate')
  rateMovie(@Request() req, @Body() dto: RateMovieDto) {
    return this.authService.rateMovie(req.user.sub, dto);
  }
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req) {
    return this.authService.getProfile(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateProfile(@Request() req, @Body() dto: UpdateProfileDto) {
    return this.authService.updateProfile(req.user.sub, dto);
  }
}
