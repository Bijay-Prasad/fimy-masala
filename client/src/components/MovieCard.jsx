// frontend/src/components/MovieCard.jsx
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

const MovieCard = ({ movie }) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
      <Link to={`/movies/${movie._id}`}>
        <img
          src={movie.posterURL}
          alt={movie.title}
          className="w-full h-64 object-cover"
        />
      </Link>
      <div className="p-4">
        <Link to={`/movies/${movie._id}`}>
          <h3 className="text-lg font-semibold mb-2 hover:text-blue-400">
            {movie.title}
          </h3>
        </Link>
        <div className="flex items-center mb-2">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="ml-1 text-sm">
            {movie.averageRating ? movie.averageRating.toFixed(1) : 'N/A'}
          </span>
        </div>
        <p className="text-sm text-gray-400 mb-2">
          {movie.releaseYear} • {movie.genre.join(', ')}
        </p>
        <p className="text-sm text-gray-300 line-clamp-3">{movie.synopsis}</p>
      </div>
    </div>
  );
};

export default MovieCard;