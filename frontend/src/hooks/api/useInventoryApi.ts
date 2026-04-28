import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { InventoryService } from '@/services/inventory.service';
import { queryKeys } from '@/lib/query-keys';
import { InventoryPaginationParams, Category,  ApiResponse } from '@/types';
import { toast } from 'sonner';
import { CreateCategoryFormValues, CreatePartFormValues } from '@/lib/validations/admin';

// Categories

export const useCategoryListQuery = (enabled = true) => {
  return useQuery({
    queryKey: [...queryKeys.inventory.all, 'categories'],
    queryFn: InventoryService.getCategories,
    enabled,
  });
};

export const useCreateCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: InventoryService.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...queryKeys.inventory.all, 'categories'] });
      toast.success('Category created successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create category');
    }
  });
};

export const useUpdateCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateCategoryFormValues }) => InventoryService.updateCategory(id, data),
    onMutate: async ({ id, data }) => {
      const qKey = [...queryKeys.inventory.all, 'categories'];
      await queryClient.cancelQueries({ queryKey: qKey });

      const previousQueries = queryClient.getQueriesData<ApiResponse<Category[]>>({ queryKey: qKey });

      queryClient.setQueriesData({ queryKey: qKey }, (old: any) => {
        if (!old || !old.data) return old;
        return {
          ...old,
          data: old.data.map((cat: Category) => cat.id === id ? { ...cat, ...data } : cat)
        };
      });

      return { previousQueries, qKey };
    },
    onError: (err, variables, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          if (data) queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error('Failed to update category');
    },
    onSettled: (data, error, variables, context) => {
      queryClient.invalidateQueries({ queryKey: context?.qKey });
    },
    onSuccess: () => {
      toast.success('Category updated successfully');
    }
  });
};

export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: InventoryService.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...queryKeys.inventory.all, 'categories'] });
      toast.success('Category deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete category');
    }
  });
};

// Parts

export const usePartListQuery = (params: InventoryPaginationParams, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.inventory.list(params),
    queryFn: () => InventoryService.getParts(params),
    enabled,
  });
};

export const useCreatePartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: InventoryService.createPart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.dashboard() });
      toast.success('Part created successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create part');
    }
  });
};

export const useUpdatePartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreatePartFormValues }) => InventoryService.updatePart(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.dashboard() });
      toast.success('Part updated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update part');
    }
  });
};

export const useDeletePartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: InventoryService.deletePart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.dashboard() });
      toast.success('Part deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete part');
    }
  });
};

export const useLowStockPartsQuery = (enabled = true) => {
  return useQuery({
    queryKey: [...queryKeys.inventory.all, 'low-stock'],
    queryFn: InventoryService.getLowStockParts,
    enabled,
  });
};

export const usePartDetailQuery = (id: string, enabled = true) => {
  return useQuery({
    queryKey: [...queryKeys.inventory.all, 'detail', id],
    queryFn: () => InventoryService.getPartById(id),
    enabled: enabled && !!id,
  });
};
