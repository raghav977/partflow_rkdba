import { useQuery } from '@tanstack/react-query';
import { userApi } from '../services/userApi';

export const useUsers = ({ page = 1, pageSize = 10, role = '', search = '' } = {}) => {
  return useQuery({
    queryKey: ['users', page, pageSize, role, search],
    queryFn: () => userApi.getUsers({ page, pageSize, role, search }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
};
