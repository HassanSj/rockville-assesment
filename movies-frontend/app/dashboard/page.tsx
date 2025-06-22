'use client';

import React, { useEffect, useState } from 'react';
import SearchBar from '@/components/SearchBar';
import CategoryList from '@/components/CategoryList';
import MovieCard from '@/components/MovieCard';
import {
  getCategories,
  getPopularMovies,
  getRecommendedMovies,
  searchMovies,
} from '@/services/movieService';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  genre_ids?: number[];
  genre_names?: string[];
  [key: string]: any;
}

interface Category {
  id: number;
  name: string;
}

const Dashboard = () => {
  useAuthRedirect();

  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const localToken = localStorage.getItem('token');
    if (localToken) {
      const decoded: any = JSON.parse(atob(localToken.split('.')[1]));
      setUserId(decoded?.sub);
      setToken(localToken);
    }
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (userId && token) {
      fetchRecommendations(userId, token);
    }
  }, [userId, token]);

  useEffect(() => {
    if (selectedCategories.length > 0) {
      const applyFilters = async () => {
        const popRes = await getPopularMovies(page);
        const popMapped = mapGenresToNames(popRes, categories);
        setPopularMovies(filterByCategories(popMapped));
      };
      applyFilters();
    }
  }, [selectedCategories]);

  const mapGenresToNames = (movies: Movie[], categoryList: Category[]): Movie[] => {
    const idNameMap: { [key: string]: string } = {};
    categoryList.forEach((cat) => {
      idNameMap[cat.id.toString()] = cat.name;
    });

    return movies.map((movie) => ({
      ...movie,
      genre_names: (movie.genre_ids || []).map((id: number | string) =>
        idNameMap[id.toString()] || ''
      ),
    }));
  };

  const fetchInitialData = async () => {
    const [movieRes, catRes] = await Promise.all([
      getPopularMovies(1),
      getCategories(),
    ]);
    const mappedMovies = mapGenresToNames(movieRes, catRes);
    setPopularMovies(mappedMovies);
    setCategories(catRes);
    setPage(1);
  };

  const fetchRecommendations = async (userId: string, token: string) => {
    const recs = await getRecommendedMovies(userId, token);
    const mappedRecs = mapGenresToNames(recs, categories);
    setRecommendedMovies(mappedRecs);
  };

  const handleToggleCategory = (catName: string) => {
    setSelectedCategories((prev) =>
      prev.includes(catName)
        ? prev.filter((name) => name !== catName)
        : [...prev, catName]
    );
  };

  const handleClearCategories = () => {
    setSelectedCategories([]);
    fetchInitialData();
    if (userId && token) fetchRecommendations(userId, token);
  };

  const filterByCategories = (movies: Movie[]) => {
    if (selectedCategories.length === 0) return movies;
    return movies.filter(
      (movie) =>
        movie.genre_names &&
        movie.genre_names.some((g) => selectedCategories.includes(g))
    );
  };

  const handleNext = async () => {
    const newPage = page + 1;
    const res = await getPopularMovies(newPage);
    const mapped = mapGenresToNames(res, categories);
    setPopularMovies(filterByCategories(mapped));
    setPage(newPage);
  };

  const handlePrevious = async () => {
    if (page > 1) {
      const newPage = page - 1;
      const res = await getPopularMovies(newPage);
      const mapped = mapGenresToNames(res, categories);
      setPopularMovies(filterByCategories(mapped));
      setPage(newPage);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setPage(1);

    if (!query) {
      const res = await getPopularMovies(1);
      const mapped = mapGenresToNames(res, categories);
      setPopularMovies(mapped);
      if (userId && token) fetchRecommendations(userId, token);
    } else {
      const res = await searchMovies(query, 1);
      const mapped = mapGenresToNames(res, categories);
      setPopularMovies(mapped);
      setRecommendedMovies([]);
    }
  };

  const shouldShowRecommended =
    recommendedMovies.length > 0 && searchQuery === '' && selectedCategories.length === 0;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <SearchBar onSearch={handleSearch} />
      <CategoryList
        categories={categories}
        selected={selectedCategories}
        onToggle={handleToggleCategory}
        onClear={handleClearCategories}
      />
      {shouldShowRecommended && (
        <div className="mb-12 p-6 bg-white shadow-md rounded-xl border border-gray-200">
          <h2 className="text-3xl font-extrabold mb-6 text-blue-700 border-b pb-2">
            🎯 Recommended For You
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {recommendedMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      )}
      <div className="p-6 bg-white shadow-md rounded-xl border border-gray-200">
        <h2 className="text-3xl font-extrabold mb-6 text-indigo-700 border-b pb-2">
          🍿 Popular Movies
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {popularMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={handlePrevious}
            disabled={page === 1}
            className="px-5 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            Previous
          </button>
          <p className="self-center text-sm text-gray-600">Page {page}</p>
          <button
            onClick={handleNext}
            className="px-5 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
