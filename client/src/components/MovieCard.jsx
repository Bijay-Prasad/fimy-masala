/* eslint-disable no-unused-vars */
import { Link } from 'react-router-dom';
import { Star, Calendar, Tag } from 'lucide-react';
import { motion } from 'motion/react';
import { Card, CardContent } from './ui/card';

const MovieCard = ({ movie }) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <Card className="cinema-card overflow-hidden group cursor-pointer">
        <Link to={`/movies/${movie._id}`}>
          {/* Movie Poster */}
          <div className="relative overflow-hidden">
            <img
              src={movie.posterURL}
              alt={movie.title}
              className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Rating Badge */}
            <div className="absolute top-3 right-3">
              <div className="glass px-2 py-1 rounded-full flex items-center space-x-1">
                <Star className="w-3 h-3 text-accent fill-current" />
                <span className="text-xs font-medium">
                  {movie.averageRating ? movie.averageRating.toFixed(1) : 'N/A'}
                </span>
              </div>
            </div>

            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-12 h-12 bg-primary/80 rounded-full flex items-center justify-center backdrop-blur-sm glow-primary">
                <div className="w-0 h-0 border-l-4 border-l-white border-t-2 border-t-transparent border-b-2 border-b-transparent ml-1"></div>
              </div>
            </div>
          </div>
        </Link>

        {/* Movie Info */}
        <CardContent className="p-4">
          <Link to={`/movies/${movie._id}`}>
            <h3 className="text-lg font-semibold mb-2 text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {movie.title}
            </h3>
          </Link>

          {/* Movie Details */}
          <div className="flex items-center justify-between mb-3 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{movie.releaseYear}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Tag className="w-3 h-3" />
              <span className="truncate max-w-20">
                {movie.genre && movie.genre.length > 0 ? movie.genre[0] : 'N/A'}
              </span>
            </div>
          </div>

          {/* Synopsis */}
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {movie.synopsis}
          </p>

          {/* Genres */}
          {movie.genre && movie.genre.length > 1 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {movie.genre.slice(1, 3).map((genre, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 text-xs bg-accent/20 text-accent rounded-full"
                >
                  {genre}
                </span>
              ))}
              {movie.genre.length > 3 && (
                <span className="px-2 py-1 text-xs bg-muted/50 text-muted-foreground rounded-full">
                  +{movie.genre.length - 3}
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MovieCard;