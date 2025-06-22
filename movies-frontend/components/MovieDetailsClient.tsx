'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';
import { api } from '@/services/api';

interface MovieDetailsClientProps {
  movie: {
    id: number;
    title: string;
    poster_path: string;
    release_date: string;
    vote_average: number;
    overview: string;
  };
}

const MovieDetailsClient = ({ movie }: MovieDetailsClientProps) => {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const handleRatingSubmit = async () => {
    try {
      await api.post(
        '/rate',
        {
          movieId: movie.id,
          rating,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      alert('Rated successfully');
    } catch (err) {
      console.error(err);
      alert('Failed to submit rating');
    }
  };

  return (
    <div className="p-8">
      <button
        onClick={() => router.back()}
        className="mb-4 px-4 py-2 bg-red-500 rounded hover:bg-red-500"
      >
        Go Back
      </button>

      <div className="flex gap-12">
        <div className="w-1/2">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="rounded shadow-lg"
          />
        </div>
        <div className="w-1/2">
          <h1 className="text-3xl font-bold mb-4 text-black">{movie.title}</h1>
          <p className="mb-2 text-black"><strong>Release Date:</strong> {movie.release_date}</p>
          <p className="mb-2 text-black"><strong>Rating:</strong> {movie.vote_average}</p>
          <p className="text-gray-700 mb-4">{movie.overview}</p>

          <p className="mb-2 font-medium text-black">Rate this Movie:</p>
          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`text-xl ${rating >= star ? 'text-yellow-400' : 'text-gray-400'}`}
              >
                ★
              </button>
            ))}
          </div>
          <button
            onClick={handleRatingSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Submit Rating
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsClient;
