import { useQuery } from '@tanstack/react-query';
import { getCustomers } from '../services/customerApi';
import { getCustomerDetails } from '@/apis/customerApi';

/**
 * Custom hook to fetch customers with caching
 * @param {Object} params
 * @param {number} params.page - Page number
 * @param {number} params.pageSize - Items per page
 * @param {string} params.search - Search term
 * @returns {Object} { data, isLoading, error, isError, refetch }
 */
export const useCustomers = ({ page = 1, pageSize = 10, search = '' } = {}) => {
  return useQuery({
    queryKey: ['customers', page, pageSize, search],
    queryFn: () => getCustomers({ page, pageSize, search }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
};

/**
 * Fetch detailed customer information including vehicles and history
 */
export const useCustomerDetails = (customerId) => {
  return useQuery({
    queryKey: ['customerDetails', customerId],
    queryFn: () => getCustomerDetails(customerId),
    enabled: !!customerId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
};
