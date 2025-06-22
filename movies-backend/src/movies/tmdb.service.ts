import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class TmdbService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.themoviedb.org/3';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.apiKey = this.configService.get<string>('TMDB_API_KEY') || '';
  }

  async getPopularMovies(page = 1): Promise<any> {
    const url = `${this.baseUrl}/movie/popular?api_key=${this.apiKey}&page=${page}`;
    const response = await lastValueFrom(this.httpService.get(url));
    return response.data.results;
  }

  async searchMovies(query: string, page = 1): Promise<any> {
    const url = `${this.baseUrl}/search/movie?api_key=${this.apiKey}&query=${query}&page=${page}`;
    const response = await lastValueFrom(this.httpService.get(url));
    return response.data.results;
  }

  async getMovieDetails(id: string): Promise<any> {
    const url = `${this.baseUrl}/movie/${id}?api_key=${this.apiKey}`;
    const response = await lastValueFrom(this.httpService.get(url));
    return response.data;
  }

  async getGenres(): Promise<any> {
    const url = `${this.baseUrl}/genre/movie/list?api_key=${this.apiKey}`;
    const response = await lastValueFrom(this.httpService.get(url));
    return response.data.genres;
  }

  async getMoviesByGenreName(name: string): Promise<any[]> {
    const genres = await this.getGenres();
    const genre = genres.find(g => g.name.toLowerCase() === name.toLowerCase());

    if (!genre) {
      return [];
    }

    const url = `${this.baseUrl}/discover/movie?api_key=${this.apiKey}&with_genres=${genre.id}`;
    const response = await lastValueFrom(this.httpService.get(url));

    return response.data.results;
  }

  async getMoviesByGenreIds(genreIds: number[]): Promise<any[]> {
    const genreQuery = genreIds.join(',');
    const url = `${this.baseUrl}/discover/movie?api_key=${this.apiKey}&with_genres=${genreQuery}`;
    const response = await lastValueFrom(this.httpService.get(url));
    return response.data.results;
  }



}
