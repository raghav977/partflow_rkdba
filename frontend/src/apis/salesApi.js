import api from "@/lib/api";

export const getSales = async ({ page = 1, pageSize = 10, search = '' } = {}) => {
  try {
    const response = await api.get('/sales', {
      params: {
        page,
        pageSize,
        ...(search && { search })
      }
    });
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch sales';
    throw new Error(message);
  }
};

export const createSaleInvoice = async (saleData) => {
  try {
    const response = await api.post('/sales', saleData);
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to create sale invoice';
    throw new Error(message);
  }
};

export const getSaleInvoiceDetail = async (id) => {
  try {
    const response = await api.get(`/sales/${id}`);
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch sale details';
    throw new Error(message);
  }
};

export const sendInvoiceEmail = async (invoiceId, email) => {
  try {
    const response = await api.post(`/sales/${invoiceId}/send-email`, { email });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to send invoice email';
    throw new Error(message);
  }
};

export const salesApi = {
  getSales,
  createSaleInvoice,
  getSaleInvoiceDetail,
  sendInvoiceEmail
};
