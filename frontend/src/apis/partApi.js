import api from '@/lib/api';

/**
 * Get all parts with pagination and search
 * @param {Object} params
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.pageSize - Items per page (default: 10)
 * @param {string} params.search - Search by name or vendor name (optional)
 * @returns {Promise<{totalParts, page, pageSize, data}>}
 */
export const getParts = async ({
  page = 1,
  pageSize = 10,
  search = '',
} = {}) => {
  try {
    const params = {
      page,
      pageSize,
    };

    if (search?.trim()) {
      params.search = search;
    }

    const response = await api.get('/part', { params });
    return response.data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to fetch parts'
    );
  }
};

/**
 * Create a new part
 * @param {Object} partData - Part data
 * @returns {Promise}
 */
export const createPart = async (partData) => {
  try {
    const response = await api.post('/part', partData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to create part'
    );
  }
};

/**
 * Get a part by ID
 * @param {Guid} id - Part ID
 * @returns {Promise<PartResponseDto>}
 */
export const getPartById = async (id) => {
  try {
    const response = await api.get(`/part/${id}`);
    return response.data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to fetch part'
    );
  }
};

/**
 * Update an existing part
 * @param {Guid} id - Part ID
 * @param {Object} partData - Part data
 * @returns {Promise}
 */
export const updatePart = async (id, partData) => {
  try {
    const response = await api.put(`/part/${id}`, partData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to update part'
    );
  }
};

/**
 * Delete a part
 * @param {Guid} id - Part ID
 * @returns {Promise}
 */
export const deletePart = async (id) => {
  try {
    const response = await api.delete(`/part/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to delete part'
    );
  }
};

export const partApi = {
  getParts,
  createPart,
  getPartById,
  updatePart,
  deletePart,
};
