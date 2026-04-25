import axios from 'axios';

const API = 'http://localhost:3000/api/ratings';

const getAuthToken = () =>
  localStorage.getItem('token') || sessionStorage.getItem('token');

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getAuthToken()}`,
  },
});

export const submitRating = async (ratingData) => {
  return axios.post(`${API}/`, ratingData, getAuthHeaders());
};

export const getRatingsByMovie = async (movieId) => {
  return axios.get(`${API}/${movieId}`);
};

export const getUserRatingByMovie = async (movieId) => {
  return axios.get(`${API}/user/${movieId}`, getAuthHeaders());
};
