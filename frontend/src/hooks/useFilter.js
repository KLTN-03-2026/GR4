import { useState, useEffect } from "react";
import { getPublicMovies } from "../service/movie_service";

export const useFilter = () => {
  const [activeFilters, setActiveFilters] = useState({
    genre: "Tất cả",
    country: "Tất cả quốc gia",
    sort: "Mới nhất",
  });

  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  // ===== MAP UI -> BE =====
  const genreMap = {
    'Hành động': 'Hành Động',
    'Hài hước': 'Comedy',
    'Kinh dị': 'Horror',
    'Tình cảm': 'Romance',
    'Khoa học viễn tưởng': 'Sci-Fi',
    'Tài liệu': 'Animation',
    'Anime': 'Animation'
  };

  const countryMap = {
    'Việt Nam': 'Vietnam',
    'Hoa Kỳ': 'USA',
    'Hàn Quốc': 'Korea',
    'Nhật Bản': 'Japan',
    'Trung Quốc': 'China',
    'Thái Lan': 'Thailand'
  };

  const sortMap = {
    'Mới nhất': 'new',
    'Cũ nhất': 'old',
    'Đánh giá cao': 'rating',
    'Xem nhiều nhất': 'views'
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchMovies(page);
    }, 300);

    return () => clearTimeout(timeout);
  }, [activeFilters, page]);

  const fetchMovies = async (currentPage) => {
    try {
      setLoading(true);

      const params = {
        page: currentPage,
        limit: 12,
      };

      // ===== FILTER =====
      if (activeFilters.genre !== "Tất cả") {
        params.genre = genreMap[activeFilters.genre];
      }

      if (activeFilters.country !== "Tất cả quốc gia") {
        params.country = countryMap[activeFilters.country];
      }

      if (activeFilters.sort) {
        params.sort = sortMap[activeFilters.sort];
      }

      console.log("FILTER PARAMS:", params);

      const response = await getPublicMovies(params);
      const data = response.data || [];

      // ===== MAP DATA CHO MovieCard =====
      const mappedData = data.map(movie => ({
        ...movie,
        image: movie.avatar_url,
        year: movie.release_date
          ? new Date(movie.release_date).getFullYear()
          : "",
        rating: movie.rating || null,
      }));

      setFilteredMovies(mappedData);
      setPagination(response.pagination || null);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (type, value) => {
    setActiveFilters((prev) => ({
      ...prev,
      [type]: value,
    }));
    setPage(1); // Reset to page 1 on filter change
  };

  return {
    activeFilters,
    filteredMovies,
    updateFilter,
    loading,
    page,
    setPage,
    pagination,
  };
};