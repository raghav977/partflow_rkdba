import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllAppointments, updateAppointmentStatus } from '@/apis/appointmentApi';

// ============ STAFF APPOINTMENT HOOKS ============

export const useAppointmentsAdmin = ({ page = 1, pageSize = 10 } = {}) => {
  return useQuery({
    queryKey: ['appointments-admin', page, pageSize],
    queryFn: () => getAllAppointments({ page, pageSize }),
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 1,
  });
};

export const useUpdateAppointmentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => updateAppointmentStatus({ id, status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments-admin'] });
    },
  });
};
