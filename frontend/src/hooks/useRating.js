import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import {
  getRatingsByMovie,
  getUserRatingByMovie,
  submitRating,
} from '../service/rating_service';

export function useRating(movieId) {
  const { user } = useAuth();
  const [userRating, setUserRating] = useState(null);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRatings = async () => {
    if (!movieId) return;

    try {
      const response = await getRatingsByMovie(movieId);
      const data = response.data || {};
      // Handle both old { ratings: [], averageRating, ratingCount } and new { ratings: [], averageRating, ratingCount }
      setAverageRating(data.averageRating || 0);
      setRatingCount(data.ratingCount || 0);
    } catch (err) {
      console.error('Fetch ratings failed', err);
      setAverageRating(0);
      setRatingCount(0);
    }
  };

  const fetchUserRating = async () => {
    if (!movieId || !user) {
      setUserRating(null);
      return;
    }

    try {
      const response = await getUserRatingByMovie(movieId);
      setUserRating(response.data?.value || null);
    } catch (err) {
      console.error('Fetch user rating failed', err);
      setUserRating(null);
    }
  };

  useEffect(() => {
    fetchRatings();
  }, [movieId]);

  useEffect(() => {
    fetchUserRating();
  }, [movieId, user?.id]);

  const updateRating = async (value) => {
    if (!movieId) return;
    setLoading(true);
    setError(null);

    try {
      await submitRating({ movieId, value });
      setUserRating(value);
      await fetchRatings();
      return value;
    } catch (err) {
      console.error('Submit rating failed', err);
      setError('Không thể gửi đánh giá. Vui lòng thử lại.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    userRating,
    averageRating,
    ratingCount,
    loading,
    error,
    updateRating,
    fetchRatings,
    fetchUserRating,
  };
}
