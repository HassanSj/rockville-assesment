import { Injectable } from "@nestjs/common";
import { TmdbService } from "./tmdb.service";
import { AuthService } from "src/auth/auth.service";

@Injectable()
export class MoviesService {
  constructor(
    private readonly tmdbService: TmdbService,
    private readonly authService: AuthService
  ) { }

  getPopularMovies(page: number = 1) {
    return this.tmdbService.getPopularMovies(page);
  }

  searchMovies(query: string, page: number = 1) {
    return this.tmdbService.searchMovies(query, page);
  }

  getMovieDetails(id: string) {
    return this.tmdbService.getMovieDetails(id);
  }

  getCategories() {
    return this.tmdbService.getGenres();
  }

  async getRecommendedMovies(userId: string) {
    const user = await this.authService.getProfile(userId);

    if (!user || !user.categories || user.categories.length === 0) {
      return [];
    }

    const categories = user.categories;

    const allGenres = await this.tmdbService.getGenres();

    const genreIds = allGenres
      .filter((genre: any) => categories.includes(genre.name))
      .map((genre: any) => genre.id);

    if (genreIds.length === 0) return [];

    const recommendedMovies = await this.tmdbService.getMoviesByGenreIds(genreIds);
    return recommendedMovies;
  }

}
