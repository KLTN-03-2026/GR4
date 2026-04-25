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

// Get all countries
export const getAllCountries = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/countrie`, getAuthHeaders());
    const data = response.data;
    return Array.isArray(data) ? data : data?.data || [];
  } catch (error) {
    console.error('Error fetching countries:', error);
    throw error;
  }
};

// Get country by ID
export const getCountryById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/countrie/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching country:', error);
    throw error;
  }
};

// Create country (admin only)
export const createCountry = async (name) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/countrie`,
      { name },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error creating country:', error);
    throw error;
  }
};

// Update country (admin only)
export const updateCountry = async (id, name) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/countrie/${id}`,
      { name },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error updating country:', error);
    throw error;
  }
};

// Delete country (admin only)
export const deleteCountry = async (id) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/countrie/${id}`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting country:', error);
    throw error;
  }
};
