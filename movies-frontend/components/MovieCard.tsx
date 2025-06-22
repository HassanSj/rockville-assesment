import Link from 'next/link';

const MovieCard = ({ movie }: { movie: any }) => {
  return (
    <Link href={`/movie/${movie.id}`}>
      <div className="rounded-xl shadow-md p-4 bg-white w-60 cursor-pointer hover:scale-105 transition">
        <img
          src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
          alt={movie.title}
          className="rounded-md mb-2"
        />
        <h2 className="text-lg font-semibold text-black">{movie.title}</h2>
        <p className="text-sm text-gray-600">{movie.release_date}</p>
      </div>
    </Link>
  );
};

export default MovieCard;
