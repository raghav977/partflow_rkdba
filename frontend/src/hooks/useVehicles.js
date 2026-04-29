import { useQuery } from '@tanstack/react-query';
import { getVehicles, getVehiclesByCustomer } from '@/apis/vehicleApi';
import { useAuth } from './useAuth';

/**
 * Custom hook to fetch vehicles with caching
 * @param {Object} params
 * @param {number} params.page - Page number
 * @param {number} params.pageSize - Items per page
 * @param {string} params.search - Search term (vehicleNumber, engineNumber, chassisNumber)
 * @returns {Object} { data, isLoading, error, isError, refetch }
 */
export const useVehicles = ({ page = 1, pageSize = 10, search = '' } = {}) => {
  return useQuery({
    queryKey: ['vehicles', page, pageSize, search],
    queryFn: () => getVehicles({ page, pageSize, search }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
};

/**
 * Custom hook to fetch vehicles for a specific customer
 * @param {Guid} customerId - Customer ID
 * @returns {Object} { data, isLoading, error, isError, refetch }
 */
export const useCustomerVehicles = (customerId) => {
  return useQuery({
    queryKey: ['customerVehicles', customerId],
    queryFn: () => getVehiclesByCustomer(customerId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
    enabled: !!customerId, // Only run if customerId is provided
  });
};

/**
 * Custom hook to fetch current logged-in user's vehicles
 * @returns {Object} { data, isLoading, error, isError, refetch }
 */
export const useUserVehicles = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['userVehicles', user?.id],
    queryFn: () => getVehiclesByCustomer(user?.id),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
    enabled: !!user?.id, // Only run if user ID is available
  });
};
