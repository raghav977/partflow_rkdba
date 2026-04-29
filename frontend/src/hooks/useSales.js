import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { salesApi } from '@/apis/salesApi';

// Query hook for fetching sales list
export const useSales = ({ page = 1, pageSize = 10, search = '' } = {}) => {
  return useQuery({
    queryKey: ['sales', page, pageSize, search],
    queryFn: () => salesApi.getSales({ page, pageSize, search }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  });
};

// Mutation hook for creating sale invoice
export const useCreateSaleInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (saleData) => salesApi.createSaleInvoice(saleData),
    onSuccess: () => {
      // Invalidate sales list query to refresh
      queryClient.invalidateQueries({ queryKey: ['sales'] });
    }
  });
};

// Query hook for fetching sale invoice details
export const useSaleInvoiceDetail = (id) => {
  return useQuery({
    queryKey: ['sale-detail', id],
    queryFn: () => salesApi.getSaleInvoiceDetail(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    enabled: !!id // Only run query if id exists
  });
};

// Mutation hook for sending invoice email
export const useSendInvoiceEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ invoiceId, email }) => salesApi.sendInvoiceEmail(invoiceId, email),
    onSuccess: () => {
      // Invalidate sale details to refresh
      queryClient.invalidateQueries({ queryKey: ['sale-detail'] });
    }
  });
};
