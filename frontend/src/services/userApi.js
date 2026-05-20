import axiosInstance from '../lib/axiosInstance';

export const userApi = {
  getUsers: async ({ page = 1, pageSize = 10, role = '', search = '' }) => {
    try {
      const response = await axiosInstance.get('/user', {
        params: {
          page,
          pageSize,
          ...(role && { role }),
          ...(search && { search }),
        },
      });
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch users';
    }
  },
};
