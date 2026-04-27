import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UserService } from '@/services/user.service';
import { queryKeys } from '@/lib/query-keys';
import { PaginationParams, UserDto, ApiResponse, PagedResponse } from '@/types';
import { toast } from 'sonner';

export const useStaffListQuery = (params: PaginationParams, enabled = true) => {
  return useQuery({
    queryKey: [...queryKeys.auth.users(), params],
    queryFn: () => UserService.getStaff(params),
    enabled,
  });
};

export const useCreateStaffMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: UserService.createStaff,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.users() });
      toast.success(res.message || 'Staff member created successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create staff member');
    }
  });
};

export const useRegisterCustomerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: UserService.registerCustomer,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success(res.message || 'Customer registered successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to register customer');
    }
  });
};

export const useUpdateStaffMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => UserService.updateStaff(id, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.users() });
      toast.success(res.message || 'Staff member updated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update staff member');
    }
  });
};

export const useToggleStaffStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => UserService.toggleStatus(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.auth.users() });

      const previousQueries = queryClient.getQueriesData<ApiResponse<PagedResponse<UserDto>>>({
        queryKey: queryKeys.auth.users()
      });

      queryClient.setQueriesData({ queryKey: queryKeys.auth.users() }, (old: ApiResponse<PagedResponse<UserDto>> | undefined) => {
        if (!old || !old.data) return old;
        return {
          ...old,
          data: {
            ...old.data,
            items: old.data.items.map((user) =>
              user.id === id ? { ...user, isActive: !user.isActive } : user
            )
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
      toast.error('Failed to update status');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.users() });
    },
    onSuccess: (res) => {
      toast.success(res.message || 'Status updated successfully');
    }
  });
};
