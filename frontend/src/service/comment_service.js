import axios from "axios";

const API = "http://localhost:3000/api/comments";

const getAuthToken = () =>
  localStorage.getItem("token") || sessionStorage.getItem("token");

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getAuthToken()}`,
  },
});

export const getCommentsByMovie = async (movieId) => {
  return axios.get(`${API}/${movieId}`, getAuthHeaders());
};

export const getAllComments = async () => {
  return axios.get(`${API}/`, getAuthHeaders());
};

export const createComment = async (commentData) => {
  return axios.post(`${API}/`, commentData, getAuthHeaders());
};

export const deleteComment = async (commentId) => {
  return axios.delete(`${API}/${commentId}`, getAuthHeaders());
};
