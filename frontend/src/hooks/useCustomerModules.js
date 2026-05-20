import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createAppointment,
  getCustomerAppointments,
  createPartRequest,
  getCustomerPartRequests,
  createReview,
  getAllReviews
} from '@/apis/customerApi';

// ============ APPOINTMENT HOOKS ============

export const useAppointments = ({ page = 1, pageSize = 10 } = {}) => {
  return useQuery({
    queryKey: ['appointments', page, pageSize],
    queryFn: () => getCustomerAppointments({ page, pageSize }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
};

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (appointmentData) => createAppointment(appointmentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
};

// ============ PART REQUEST HOOKS ============

export const usePartRequests = ({ page = 1, pageSize = 10 } = {}) => {
  return useQuery({
    queryKey: ['partRequests', page, pageSize],
    queryFn: () => getCustomerPartRequests({ page, pageSize }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
};

export const useCreatePartRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestData) => createPartRequest(requestData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partRequests'] });
    },
  });
};

// ============ REVIEW HOOKS ============

export const useReviews = () => {
  return useQuery({
    queryKey: ['reviews'],
    queryFn: () => getAllReviews(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewData) => createReview(reviewData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
};
