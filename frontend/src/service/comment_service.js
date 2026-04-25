import axios from "axios";

const API = "http://localhost:3000/api/comments";

const getAuthToken = () =>
  localStorage.getItem("token") || sessionStorage.getItem("token");

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getAuthToken()}`,
  },
});

export const getCommentsByMovie = async (movieId, { page = 1, limit = 10, search = "" } = {}) => {
  return axios.get(`${API}/${movieId}`, {
    params: { page, limit, search },
    ...getAuthHeaders(),
  });
};

export const getAllComments = async ({ page = 1, limit = 10, search = "" } = {}) => {
  return axios.get(`${API}/`, {
    params: { page, limit, search },
    ...getAuthHeaders(),
  });
};

export const createComment = async (commentData) => {
  return axios.post(`${API}/`, commentData, getAuthHeaders());
};

export const deleteComment = async (commentId) => {
  return axios.delete(`${API}/${commentId}`, getAuthHeaders());
};
