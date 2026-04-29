import axiosInstance from './axiosInstance';

/**
 * Get all staff members with pagination and filtering
 * @param {Object} params
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.pageSize - Items per page (default: 10)
 * @param {string} params.search - Search by name or email (optional)
 * @returns {Promise<{totalUsers, page, pageSize, data}>}
 */
export const getStaff = async ({
  page = 1,
  pageSize = 10,
  search = '',
} = {}) => {
  try {
    const params = {
      page,
      pageSize,
      role: 'Staff', // Filter by Staff role
    };

    // Only include search param if provided
    if (search?.trim()) {
      params.search = search;
    }

    const response = await axiosInstance.get('/user', { params });
    return response.data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to fetch staff members'
    );
  }
};
