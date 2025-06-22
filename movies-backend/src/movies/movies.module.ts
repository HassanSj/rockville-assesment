import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './schemas/category.schema';
import { MoviesService } from './movies.service';
import { HttpModule } from '@nestjs/axios';
import { MoviesController } from './movies.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TmdbService } from './tmdb.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    HttpModule,
    AuthModule,
    ConfigModule,
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  controllers: [MoviesController],
  providers: [MoviesService, TmdbService, ConfigService]
})
export class MoviesModule {}
