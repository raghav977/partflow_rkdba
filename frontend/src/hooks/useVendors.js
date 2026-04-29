import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getVendors,
  createVendor,
  getVendorById,
  updateVendor,
  deleteVendor,
} from '@/apis/vendorApi';

/**
 * Fetch vendors with pagination and search
 */
export const useVendors = ({ page = 1, pageSize = 10, search = '' } = {}) => {
  return useQuery({
    queryKey: ['vendors', page, pageSize, search],
    queryFn: () => getVendors({ page, pageSize, search }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
};

/**
 * Fetch a single vendor by ID
 */
export const useGetVendorById = (id) => {
  return useQuery({
    queryKey: ['vendor', id],
    queryFn: () => getVendorById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
};

/**
 * Create a vendor
 */
export const useCreateVendor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vendorData) => createVendor(vendorData),
    onSuccess: () => {
      // Invalidate vendors query to refetch
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
    },
  });
};

/**
 * Update a vendor
 */
export const useUpdateVendor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateVendor(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
    },
  });
};

/**
 * Delete a vendor
 */
export const useDeleteVendor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteVendor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
    },
  });
};

/**
 * Get all vendors (for dropdowns, no pagination)
 */
export const useAllVendors = () => {
  return useQuery({
    queryKey: ['allVendors'],
    queryFn: () => getVendors({ page: 1, pageSize: 1000, search: '' }),
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 1,
  });
};
