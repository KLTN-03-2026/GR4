import axios from 'axios';

const API_URL = 'http://localhost:3000/api/history';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

export const getMyHistory = async (limit = 20) => {
    try {
        const response = await axios.get(`${API_URL}/me`, {
            ...getAuthHeaders(),
            params: { limit }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching history:', error);
        throw error;
    }
};

export const addToHistory = async (movie_id) => {
    try {
        const response = await axios.post(API_URL, { movie_id }, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error('Error adding to history:', error);
        throw error;
    }
};

export const removeFromHistory = async (movie_id) => {
    try {
        const response = await axios.delete(`${API_URL}/${movie_id}`, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error('Error removing from history:', error);
        throw error;
    }
};

export const clearHistory = async () => {
    try {
        const response = await axios.delete(API_URL, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error('Error clearing history:', error);
        throw error;
    }
};
