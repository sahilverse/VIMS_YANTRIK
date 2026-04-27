import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AuthService } from '@/services/auth.service';
import { queryKeys } from '@/lib/query-keys';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';


export const useLoginMutation = () => {
  const { setAuth } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: AuthService.login,
    onSuccess: (response) => {
      if (response.success && response.data) {
        setAuth(response.data);

        if (response.data.mustChangePassword) {
          router.push('/change-password');
        } else {
          const dashboardMap: Record<string, string> = {
            'Admin': '/admin/dashboard',
            'Staff': '/staff/dashboard',
            'Customer': '/dashboard',
          };
          router.push(dashboardMap[response.data.user.role] || '/dashboard');
        }
      }
    }
  });
};

export const useRegisterMutation = () => {
  const { setAuth } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: AuthService.register,
    onSuccess: (response) => {
      if (response.success && response.data) {
        setAuth(response.data);
        router.push('/dashboard');
      }
    }
  });
};

export const useChangePasswordMutation = () => {
  const router = useRouter();
  const { user, mustChangePassword, refreshSession } = useAuth();

  return useMutation({
    mutationFn: AuthService.changePassword,
    onSuccess: async (response) => {
      if (response.success && mustChangePassword) {
        await refreshSession();

        const dashboardMap: Record<string, string> = {
          'Admin': '/admin/dashboard',
          'Staff': '/staff/dashboard',
          'Customer': '/dashboard',
        };
        router.push(user ? (dashboardMap[user.role] || '/dashboard') : '/dashboard');
      }
    }
  });
};

export const useLogoutMutation = () => {
  const { clearAuth } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AuthService.logout,
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
    }
  });
};

export const useCreateStaffMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AuthService.createStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.users() });
    }
  });
};

export const useStaffListQuery = (enabled = true) => {
  return useQuery({
    queryKey: queryKeys.auth.users(),
    queryFn: AuthService.getAllStaff,
    enabled,
  });
};

export const useProfileQuery = (enabled = true) => {
  return useQuery({
    queryKey: queryKeys.auth.user(),
    queryFn: AuthService.getProfile,
    enabled,
    staleTime: Infinity,
  });
};
