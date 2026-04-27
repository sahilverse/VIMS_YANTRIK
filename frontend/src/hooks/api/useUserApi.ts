import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UserService } from '@/services/user.service';
import { queryKeys } from '@/lib/query-keys';
import { PaginationParams } from '@/types';

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.users() });
    }
  });
};

export const useRegisterCustomerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: UserService.registerCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    }
  });
};

export const useUpdateStaffMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => UserService.updateStaff(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.users() });
    }
  });
};

export const useToggleStaffStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => UserService.toggleStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.users() });
    }
  });
};
