import { Controller, Get, Param, Query, Request, UseGuards } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { JwtAuthGuard } from 'src/guards/jwt.config';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) { }

  @Get('categories')
  getCategories() {
    return this.moviesService.getCategories();
  }

  @Get()
  getAllMovies(@Query('page') page = 1) {
    return this.moviesService.getPopularMovies(Number(page));
  }

  @Get('search')
  search(@Query('query') query: string, @Query('page') page = 1) {
    return this.moviesService.searchMovies(query, Number(page));
  }

 @UseGuards(JwtAuthGuard)
  @Get('recommended')
  getRecommended(@Request() req) {
    return this.moviesService.getRecommendedMovies(req.user.sub);
  }
  
  @Get(':id')
  getMovieById(@Param('id') id: string) {
    return this.moviesService.getMovieDetails(id);
  }
}
