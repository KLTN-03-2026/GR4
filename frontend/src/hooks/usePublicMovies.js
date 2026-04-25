import { useState, useEffect } from 'react';
import { getPublicMovies } from '../service/movie_service';

export const usePublicMovies = () => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPublicMovies = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getPublicMovies();
        setMovies(response.data || []);
      } catch (err) {
        console.error('Error fetching public movies:', err);
        setError(err.message || 'Failed to load movies');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublicMovies();
  }, []);

  return {
    movies,
    isLoading,
    error,
  };
};
