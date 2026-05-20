import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getParts,
  createPart,
  getPartById,
  updatePart,
  deletePart,
} from '@/apis/partApi';

/**
 * Fetch parts with pagination and search
 */
export const useParts = ({ page = 1, pageSize = 10, search = '' } = {}) => {
  return useQuery({
    queryKey: ['parts', page, pageSize, search],
    queryFn: () => getParts({ page, pageSize, search }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
};

/**
 * Fetch a single part by ID
 */
export const useGetPartById = (id) => {
  return useQuery({
    queryKey: ['part', id],
    queryFn: () => getPartById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
};

/**
 * Create a part
 */
export const useCreatePart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (partData) => createPart(partData),
    onSuccess: () => {
      // Invalidate parts query to refetch
      queryClient.invalidateQueries({ queryKey: ['parts'] });
    },
  });
};

/**
 * Update a part
 */
export const useUpdatePart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updatePart(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parts'] });
    },
  });
};

/**
 * Delete a part
 */
export const useDeletePart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deletePart(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parts'] });
    },
  });
};
