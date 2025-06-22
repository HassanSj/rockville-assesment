import MovieDetailsClient from '@/components/MovieDetailsClient';
import { getMovieById } from '@/services/movieService';

interface MoviePageProps {
  params: {
    id: string;
  };
}

const MovieDetailsPage = async ({ params }: MoviePageProps) => {
  const movie = await getMovieById(params.id);
  return <MovieDetailsClient movie={movie} />;
};

export default MovieDetailsPage;
