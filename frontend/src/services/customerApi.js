import api from "@/lib/api"

export const getCustomers = async ({
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

    const response = await api.get('/user/customers', { params });
    return response.data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to fetch customers'
    );
  }
};
