import { useQuery } from '@tanstack/react-query';
import { HistoryService, HistoryFilterParams } from '@/services/history.service';

export function useMyHistoryQuery(params?: HistoryFilterParams) {
  return useQuery({
    queryKey: ['my-history', params],
    queryFn: () => HistoryService.getMyHistory(params),
  });
}

export function useCustomerHistoryQuery(customerId: string, params?: HistoryFilterParams) {
  return useQuery({
    queryKey: ['customer-history', customerId, params],
    queryFn: () => HistoryService.getCustomerHistory(customerId, params),
    enabled: !!customerId,
  });
}
