import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PurchaseService } from '@/services/purchase.service';
import { queryKeys } from '@/lib/query-keys';
import { PaginationParams, CreatePurchaseRequest } from '@/types';
import { toast } from 'sonner';

export const usePurchaseListQuery = (params: PaginationParams, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.purchases.list(params),
    queryFn: () => PurchaseService.getPurchases(params),
    enabled,
  });
};

export const usePurchaseDetailQuery = (id: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.purchases.detail(id),
    queryFn: () => PurchaseService.getPurchaseById(id),
    enabled,
  });
};

export const useCreatePurchaseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: PurchaseService.createPurchase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.purchases.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.all }); // Invalidating inventory because stock will update
      toast.success('Purchase invoice created successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create purchase invoice');
    }
  });
};
