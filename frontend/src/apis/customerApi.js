import api from '@/lib/api';

// ============ CUSTOMER DETAILS API ============

export const getCustomerDetails = async (customerId) => {
  try {
    const response = await api.get(`/users/customers/${customerId}`);
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch customer details';
    throw new Error(message);
  }
};

// ============ APPOINTMENTS API ============

export const createAppointment = async (appointmentData) => {
  try {
    const response = await api.post('/appointments', appointmentData);
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to create appointment';
    throw new Error(message);
  }
};

export const getCustomerAppointments = async ({ page = 1, pageSize = 10 } = {}) => {
  try {
    const response = await api.get('/appointments/customer', {
      params: { page, pageSize }
    });
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch appointments';
    throw new Error(message);
  }
};

// ============ PART REQUESTS API ============

export const createPartRequest = async (requestData) => {
  try {
    const response = await api.post('/part-requests', requestData);
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to create part request';
    throw new Error(message);
  }
};

export const getCustomerPartRequests = async ({ page = 1, pageSize = 10 } = {}) => {
  try {
    const response = await api.get('/part-requests/customer', {
      params: { page, pageSize }
    });
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch part requests';
    throw new Error(message);
  }
};

// ============ REVIEWS API ============

export const createReview = async (reviewData) => {
  try {
    const response = await api.post('/reviews', reviewData);
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to create review';
    throw new Error(message);
  }
};

export const getAllReviews = async () => {
  try {
    const response = await api.get('/reviews');
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch reviews';
    throw new Error(message);
  }
};

export const customerApi = {
  getCustomerDetails,
  createAppointment,
  getCustomerAppointments,
  createPartRequest,
  getCustomerPartRequests,
  createReview,
  getAllReviews
};
