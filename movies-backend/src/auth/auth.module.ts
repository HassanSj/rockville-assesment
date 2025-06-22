import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema } from './schemas/user.schema';
import { jwtConstants } from 'src/config/jwt.config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { CloudinaryModule } from './cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
    CloudinaryModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
   exports:[AuthService]
})
export class AuthModule {}
