import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CustomerService } from '@/services/customer.service';
import { queryKeys } from '@/lib/query-keys';
import { PaginationParams } from '@/types';
import { toast } from 'sonner';

export const useCustomerListQuery = (params: PaginationParams, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.customers.list(params),
    queryFn: () => CustomerService.getCustomers(params),
    enabled,
  });
};

export const useCustomerDetailQuery = (id: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.customers.detail(id),
    queryFn: () => CustomerService.getCustomerById(id),
    enabled: enabled && !!id,
  });
};

export const useRegisterCustomerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: CustomerService.registerCustomer,
    onMutate: async (newCustomer) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.customers.all });
      const previousCustomers = queryClient.getQueryData(queryKeys.customers.all);

      queryClient.setQueriesData({ queryKey: queryKeys.customers.all }, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          totalItems: (old.totalItems || 0) + 1,
          items: [
            {
              id: 'temp-id-' + Date.now(),
              ...newCustomer,
              customerCode: 'CUST-TEMP',
              totalSpend: 0,
              loyaltyPoints: 0,
              vehicles: [
                {
                  id: 'v-temp',
                  plateNumber: (newCustomer as any).plateNumber,
                  make: (newCustomer as any).make,
                  model: (newCustomer as any).model
                }
              ],
              createdAt: new Date().toISOString()
            },
            ...(old.items || [])
          ]
        };
      });

      return { previousCustomers };
    },
    onError: (err, newCustomer, context) => {
      if (context?.previousCustomers) {
        queryClient.setQueryData(queryKeys.customers.all, context.previousCustomers);
      }
      toast.error('Failed to register customer');
    },
    onSuccess: () => {
      toast.success('Customer registered');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
    }
  });
};
