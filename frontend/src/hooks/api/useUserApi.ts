import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UserService } from '@/services/user.service';
import { queryKeys } from '@/lib/query-keys';
import { PaginationParams, UserDto, ApiResponse, PagedResponse, UserProfileDto, UpdateProfileRequest } from '@/types';
import { toast } from 'sonner';

export const useStaffListQuery = (params: PaginationParams, enabled = true) => {
  return useQuery({
    queryKey: [...queryKeys.auth.users(), params],
    queryFn: () => UserService.getEmployees(params),
    enabled,
  });
};

export const useCreateStaffMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: UserService.createEmployee,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.users() });
      toast.success('Employee created successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create employee');
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
    mutationFn: ({ id, data }: { id: string; data: any }) => UserService.updateEmployee(id, data),
    onMutate: async ({ id, data }) => {
      const qKey = queryKeys.auth.users();
      await queryClient.cancelQueries({ queryKey: qKey });

      const previousQueries = queryClient.getQueriesData<ApiResponse<PagedResponse<UserDto>>>({ queryKey: qKey });

      queryClient.setQueriesData({ queryKey: qKey }, (old: any) => {
        if (!old || !old.data || !old.data.items) return old;
        return {
          ...old,
          data: {
            ...old.data,
            items: old.data.items.map((user: UserDto) => user.id === id ? { ...user, ...data } : user)
          }
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
      toast.error('Failed to update employee');
    },
    onSettled: (data, error, variables, context) => {
      queryClient.invalidateQueries({ queryKey: context?.qKey });
    },
    onSuccess: (res) => {
      toast.success(res.message || 'Employee updated successfully');
    }
  });
};

export const useToggleStaffStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => UserService.toggleEmployeeStatus(id),
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

export const useProfileQuery = (enabled = true) => {
  return useQuery({
    queryKey: [...queryKeys.auth.all, 'profile'],
    queryFn: UserService.getProfile,
    enabled,
  });
};

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: UserService.updateProfile,
    onMutate: async (data) => {
      const qKey = [...queryKeys.auth.all, 'profile'];
      await queryClient.cancelQueries({ queryKey: qKey });

      const previousProfile = queryClient.getQueryData<ApiResponse<UserProfileDto>>(qKey);

      if (previousProfile && previousProfile.data) {
        queryClient.setQueryData(qKey, {
          ...previousProfile,
          data: { ...previousProfile.data, ...data }
        });
      }

      return { previousProfile, qKey };
    },
    onError: (err, variables, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData(context.qKey, context.previousProfile);
      }
      toast.error('Failed to update profile');
    },
    onSettled: (data, error, variables, context) => {
      queryClient.invalidateQueries({ queryKey: context?.qKey });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() });
    },
    onSuccess: (res) => {
      toast.success(res.message || 'Profile updated successfully');
    }
  });
};
