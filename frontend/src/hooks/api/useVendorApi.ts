import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { VendorService } from '@/services/vendor.service';
import { queryKeys } from '@/lib/query-keys';
import { PaginationParams, Vendor, ApiResponse, PagedResponse } from '@/types';
import { CreateVendorFormValues } from '@/lib/validations/admin';
import { toast } from 'sonner';

export const useVendorListQuery = (params: PaginationParams, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.vendors.list(params),
    queryFn: () => VendorService.getVendors(params),
    enabled,
  });
};

export const useCreateVendorMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: VendorService.createVendor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vendors.all });
      toast.success('Vendor created successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create vendor');
    }
  });
};

export const useUpdateVendorMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateVendorFormValues }) => VendorService.updateVendor(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.vendors.all });

      const previousQueries = queryClient.getQueriesData<ApiResponse<PagedResponse<Vendor>>>({
        queryKey: queryKeys.vendors.all
      });

      queryClient.setQueriesData({ queryKey: queryKeys.vendors.all }, (old: any) => {
        if (!old || !old.data) return old;
        return {
          ...old,
          data: {
            ...old.data,
            items: old.data.items.map((vendor: Vendor) => 
              vendor.id === id ? { ...vendor, ...data } : vendor
            )
          }
        };
      });

      return { previousQueries };
    },
    onError: (err, variables, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          if (data) {
            queryClient.setQueryData(queryKey, data);
          }
        });
      }
      toast.error('Failed to update vendor');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vendors.all });
    },
    onSuccess: () => {
      toast.success('Vendor updated successfully');
    }
  });
};

export const useDeleteVendorMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: VendorService.deleteVendor,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.vendors.all });

      const previousQueries = queryClient.getQueriesData<ApiResponse<PagedResponse<Vendor>>>({
        queryKey: queryKeys.vendors.all
      });

      queryClient.setQueriesData({ queryKey: queryKeys.vendors.all }, (old: any) => {
        if (!old || !old.data) return old;
        return {
          ...old,
          data: {
            ...old.data,
            items: old.data.items.filter((vendor: Vendor) => vendor.id !== id),
            totalItems: Math.max(0, old.data.totalItems - 1)
          }
        };
      });

      return { previousQueries };
    },
    onError: (err, id, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          if (data) {
            queryClient.setQueryData(queryKey, data);
          }
        });
      }
      toast.error('Failed to delete vendor');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vendors.all });
    },
    onSuccess: () => {
      toast.success('Vendor deleted successfully');
    }
  });
};
