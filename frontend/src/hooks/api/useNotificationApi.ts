import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { ApiResponse, NotificationDto, NotificationCountDto } from '@/types';

export const useNotificationApi = (type?: string) => {
  const queryClient = useQueryClient();

  const { data: notificationsData, isLoading } = useQuery({
    queryKey: ['notifications', type],
    queryFn: async () => {
      const response = await api.get<ApiResponse<NotificationDto[]>>('/notifications', {
        params: { type }
      });
      return response.data.data;
    },
    refetchInterval: 60000,
  });

  const { data: countData } = useQuery({
    queryKey: ['notifications-count', type],
    queryFn: async () => {
      const response = await api.get<ApiResponse<NotificationCountDto>>('/notifications/unread-count', {
        params: { type }
      });
      return response.data.data;
    },
    refetchInterval: 60000,
  });

  const markAsRead = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.put<ApiResponse<boolean>>(`/notifications/${id}/read`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-count'] });
    },
  });

  const markAllAsRead = useMutation({
    mutationFn: async () => {
      const response = await api.put<ApiResponse<boolean>>('/notifications/read-all', {
        params: { type }
      });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-count'] });
    },
  });

  return {
    notifications: notificationsData,
    unreadCount: countData?.unreadCount || 0,
    isLoading,
    markAsRead,
    markAllAsRead,
  };
};
