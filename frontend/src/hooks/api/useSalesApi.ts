import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { ApiResponse, PagedResponse, SaleInvoiceDto, CreateSaleRequest, PaymentStatus } from '@/types';
import { toast } from 'sonner';

export const useSalesListQuery = (params: any) => {
  return useQuery({
    queryKey: ['sales', 'list', params],
    queryFn: async () => {
      const response = await api.get<ApiResponse<PagedResponse<SaleInvoiceDto>>>('/sales', { params });
      return response.data;
    },
  });
};

export const useSaleDetailQuery = (id: string) => {
  return useQuery({
    queryKey: ['sales', 'detail', id],
    queryFn: async () => {
      const response = await api.get<ApiResponse<SaleInvoiceDto>>(`/sales/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateSaleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateSaleRequest) => {
      const response = await api.post<SaleInvoiceDto>('/sales', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['inventory', 'parts'] }); 
      toast.success('Sale recorded successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to record sale';
      toast.error(message);
    }
  });
};

export const useUpdateSaleStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: PaymentStatus }) => {
      const response = await api.put<SaleInvoiceDto>(`/sales/${id}/status`, { status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      toast.success('Sale status updated');
    },
    onError: () => {
      toast.error('Failed to update sale status');
    }
  });
};
