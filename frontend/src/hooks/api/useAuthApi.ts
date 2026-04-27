import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AuthService } from '@/services/auth.service';
import { queryKeys } from '@/lib/query-keys';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const useLoginMutation = () => {
  const { setAuth } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: AuthService.login,
    onSuccess: (response) => {
      if (response.success && response.data) {
        setAuth(response.data);
        toast.success(response.message || 'Logged in successfully');

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
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Login failed');
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
        toast.success(response.message || 'Registered successfully');
        router.push('/dashboard');
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Registration failed');
    }
  });
};

export const useChangePasswordMutation = () => {
  const router = useRouter();
  const { user, mustChangePassword, refreshSession } = useAuth();

  return useMutation({
    mutationFn: AuthService.changePassword,
    onSuccess: async (response) => {
      if (response.success) {
        toast.success(response.message || 'Password changed successfully');
        if (mustChangePassword) {
          await refreshSession();

          const dashboardMap: Record<string, string> = {
            'Admin': '/admin/dashboard',
            'Staff': '/staff/dashboard',
            'Customer': '/dashboard',
          };
          router.push(user ? (dashboardMap[user.role] || '/dashboard') : '/dashboard');
        }
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to change password');
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
    },
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
