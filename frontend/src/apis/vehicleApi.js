import api from '@/lib/api';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL

/**
 * Get all vehicles with pagination and search
 * @param {Object} params
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.pageSize - Items per page (default: 10)
 * @param {string} params.search - Search by vehicleNumber, engineNumber, or chassisNumber (optional)
 * @returns {Promise<{totalVehicles, page, pageSize, data}>}
 */
export const getVehicles = async ({
  page = 1,
  pageSize = 10,
  search = '',
} = {}) => {
  try {
    const params = {
      page,
      pageSize,
    };

    // Only include search param if provided
    if (search?.trim()) {
      params.search = search;
    }

    const response = await api.get('/vehicle', { params });
    return response.data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to fetch vehicles'
    );
  }
};

/**
 * Get all vehicles for a specific customer
 * @param {Guid} customerId - Customer ID
 * @returns {Promise<Array>}
 */
export const getVehiclesByCustomer = async (customerId) => {
  try {
    const response = await api.get(`/vehicle/customer/${customerId}`);
    return response.data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to fetch customer vehicles'
    );
  }
};

/**
 * Add a new vehicle
 * @param {Object} vehicleData - Vehicle data
 * @returns {Promise}
 */
export const addVehicle = async (vehicleData) => {
  try {
    const response = await api.post(`/vehicle/add-vehicle`, vehicleData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to add vehicle'
    );
  }
};

export const vehicleApi = {
  getVehicles,
  getVehiclesByCustomer,
  addVehicle,
};