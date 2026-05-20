import api from '@/lib/api';

/**
 * Get all vendors with pagination and search
 * @param {Object} params
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.pageSize - Items per page (default: 10)
 * @param {string} params.search - Search by name or phone (optional)
 * @returns {Promise<{totalVendors, page, pageSize, data}>}
 */
export const getVendors = async ({
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

    const response = await api.get('/vendor', { params });
    return response.data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to fetch vendors'
    );
  }
};

/**
 * Create a new vendor
 * @param {Object} vendorData - Vendor data
 * @returns {Promise}
 */
export const createVendor = async (vendorData) => {
  try {
    const response = await api.post('/vendor', vendorData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to create vendor'
    );
  }
};

/**
 * Get a vendor by ID
 * @param {Guid} id - Vendor ID
 * @returns {Promise<VendorResponseDto>}
 */
export const getVendorById = async (id) => {
  try {
    const response = await api.get(`/vendor/${id}`);
    return response.data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to fetch vendor'
    );
  }
};

/**
 * Update an existing vendor
 * @param {Guid} id - Vendor ID
 * @param {Object} vendorData - Vendor data
 * @returns {Promise}
 */
export const updateVendor = async (id, vendorData) => {
  try {
    const response = await api.put(`/vendor/${id}`, vendorData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to update vendor'
    );
  }
};

/**
 * Delete a vendor
 * @param {Guid} id - Vendor ID
 * @returns {Promise}
 */
export const deleteVendor = async (id) => {
  try {
    const response = await api.delete(`/vendor/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to delete vendor'
    );
  }
};

export const vendorApi = {
  getVendors,
  createVendor,
  getVendorById,
  updateVendor,
  deleteVendor,
};
