import axios from 'axios';
import { toDateInput } from '../utils/date.js';

const API_BASE_URL = 'http://localhost:3000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Get all movies 
export const getAllMovies = async (params = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/movies`, {
      ...getAuthHeaders(),
      params,
    });
    return {
      data: response.data?.data || response.data || [],
      pagination: response.data?.pagination || null,
    };
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};

// Get all public movies (NO AUTH REQUIRED)
export const getPublicMovies = async (params = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/movies/public/filter`, {
      params,
    });
    return {
      data: response.data?.data || response.data || [],
      pagination: response.data?.pagination || null,
    };
  } catch (error) {
    console.error('Error fetching public movies:', error);
    throw error;
  }
};

// Get movie by ID
export const getMovieById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/movies/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching movie:', error);
    throw error;
  }
};

// Search movies
export const searchMovies = async (query, { page = 1, limit = 10 } = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/movies/search`, {
      params: { keyword: query, page, limit },
    });
    return {
      data: response.data?.data || response.data || [],
      pagination: response.data?.pagination || null,
    };
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};

// Get movies by genre
export const getMoviesByGenre = async (genreId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/movies/genre/${genreId}`);
    return response.data?.data || response.data || [];
  } catch (error) {
    console.error('Error fetching movies by genre:', error);
    throw error;
  }
};

// Get movies by country
export const getMoviesByCountry = async (countryId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/movies/country/${countryId}`);
    return response.data?.data || response.data || [];
  } catch (error) {
    console.error('Error fetching movies by country:', error);
    throw error;
  }
};

// Create movie (admin only)
export const createMovie = async (movieData) => {
  try {
    const payload = {
      ...movieData,
      release_date: toDateInput(movieData.release_date),
    };

    const response = await axios.post(
      `${API_BASE_URL}/movies`,
      payload,
      getAuthHeaders()
    );

    return response.data;
  } catch (error) {
    console.error('Error creating movie:', error);
    throw error;
  }
};

// Update movie (admin only)
export const updateMovie = async (id, movieData) => {
  try {
    const payload = {
      ...movieData,
      release_date: toDateInput(movieData.release_date),
    };

    const response = await axios.put(
      `${API_BASE_URL}/movies/${id}`,
      payload,
      getAuthHeaders()
    );

    return response.data;
  } catch (error) {
    console.error('Error updating movie:', error);
    throw error;
  }
};

// Delete movie (admin only)
export const deleteMovie = async (id) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/movies/${id}`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting movie:', error);
    throw error;
  }
};

// Upload movie avatar and background images
export const uploadMovieImages = async (files = {}) => {
  try {
    const formData = new FormData();

    if (files.avatar) {
      formData.append('avatar', files.avatar);
    }
    if (files.background) {
      formData.append('background', files.background);
    }

    const response = await axios.post(
      `${API_BASE_URL}/upload/images`,
      formData,
      getAuthHeaders()
    );

    return response.data;
  } catch (error) {
    console.error('Error uploading movie images:', error);
    throw error;
  }
};
