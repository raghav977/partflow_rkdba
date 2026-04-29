import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5186/api';

export const authApi = {
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  },
};
