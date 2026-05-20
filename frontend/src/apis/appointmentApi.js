import api from '@/lib/api';

// ============ STAFF APPOINTMENTS API ============

export const getAllAppointments = async ({ page = 1, pageSize = 10 } = {}) => {
  try {
    const response = await api.get('/appointments/all', {
      params: { page, pageSize }
    });
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch appointments';
    throw new Error(message);
  }
};

export const updateAppointmentStatus = async ({ id, status }) => {
  try {
    const response = await api.put(`/appointments/${id}/status`, { status });
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update appointment status';
    throw new Error(message);
  }
};
