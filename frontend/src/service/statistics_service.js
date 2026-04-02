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

export const getAdminStatistics = async (range = 'Tháng') => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/statistics`, {
      ...getAuthHeaders(),
      params: { range },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching admin statistics:', error);
    throw error;
  }
};
