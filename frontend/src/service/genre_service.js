import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Get all genres
export const getAllGenres = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/genre`, getAuthHeaders());
    const data = response.data;
    return Array.isArray(data) ? data : data?.data || [];
  } catch (error) {
    console.error('Error fetching genres:', error);
    throw error;
  }
};

// Get genre by ID
export const getGenreById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/genre/${id}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error fetching genre:', error);
    throw error;
  }
};

// Create genre (admin only)
export const createGenre = async (name) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/genre`,
      { name },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error creating genre:', error);
    throw error;
  }
};

// Update genre (admin only)
export const updateGenre = async (id, name) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/genre/${id}`,
      { name },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error updating genre:', error);
    throw error;
  }
};

// Delete genre (admin only)
export const deleteGenre = async (id) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/genre/${id}`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting genre:', error);
    throw error;
  }
};
