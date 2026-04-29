import { useQuery } from '@tanstack/react-query';
import { getStaff } from '../services/staffApi';

/**
 * Custom hook to fetch staff members with caching
 * @param {Object} params
 * @param {number} params.page - Page number
 * @param {number} params.pageSize - Items per page
 * @param {string} params.search - Search term
 * @returns {Object} { data, isLoading, error, isError, refetch }
 */
export const useStaff = ({ page = 1, pageSize = 10, search = '' } = {}) => {
  return useQuery({
    queryKey: ['staff', page, pageSize, search],
    queryFn: () => getStaff({ page, pageSize, search }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
};
