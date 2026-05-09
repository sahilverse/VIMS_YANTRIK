import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { requestService, CreatePartRequestDto, UpdatePartRequestStatusDto } from '@/services/request.service';
import { toast } from 'sonner';

export const useMyRequestsQuery = () => {
  return useQuery({
    queryKey: ['my-requests'],
    queryFn: () => requestService.getMyRequests(),
  });
};

export const useAllRequestsQuery = (statusFilter?: string) => {
  return useQuery({
    queryKey: ['all-requests', statusFilter],
    queryFn: () => requestService.getAllRequests(statusFilter),
  });
};

export const useCreateRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePartRequestDto) => requestService.createRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-requests'] });
      toast.success('Part request submitted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit request');
    },
  });
};

export const useUpdateRequestStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePartRequestStatusDto }) => 
      requestService.updateRequestStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-requests'] });
      toast.success('Request status updated');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update request');
    },
  });
};
