import { useState, useEffect } from 'react';
import { getMovieById, getPublicMovies } from '../service/movie_service';

const transformMovie = (movie) => ({
  id: movie.id,
  title: movie.title,
  description: movie.description,
  image: movie.avatar_url || movie.background_url || movie.hero || movie.hero_url,
  background: movie.background_url || movie.hero || movie.hero_url || movie.avatar_url,
  poster: movie.avatar_url,
  rating: parseFloat(movie.rating) || 8.5,
  year: movie.release_date ? new Date(movie.release_date).getFullYear() : 2024,
  genre: movie.genres ? movie.genres.split(',')[0].trim() : 'Phim',
  genres: movie.genres,
  tag: movie.required_vip_level > 0 ? 'VIP' : 'Miễn phí',
  quality: '4K',
  country: movie.country,
  required_vip_level: movie.required_vip_level,
  // Keep original properties for backward compatibility
  ...movie
});

export const useMovieDetail = (id) => {
  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      setIsLoading(true);
      try {
        // Fetch the specific movie by ID
        const movieData = await getMovieById(id);
        setMovie(transformMovie(movieData));
        
        // Fetch all public movies for recommendations
        const allMovies = await getPublicMovies();
        const recommendedMovies = allMovies
          .filter(m => String(m.id) !== String(id))
          .slice(0, 6)
          .map(transformMovie);
        setRecommendations(recommendedMovies);
      } catch (error) {
        console.error('Error fetching movie details:', error);
        setMovie(null);
        setRecommendations([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchMovieDetail();
    }
  }, [id]);

  return { movie, recommendations, isLoading };
};
