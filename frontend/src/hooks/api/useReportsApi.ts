import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { ApiResponse, CustomerReport } from '@/types';

export const useCustomerReportQuery = () => {
  return useQuery({
    queryKey: ['reports', 'customer'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<CustomerReport>>('/reports/customer');
      return response.data;
    },
  });
};
