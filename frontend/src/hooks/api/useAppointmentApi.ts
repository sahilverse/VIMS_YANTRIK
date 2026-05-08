import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AppointmentService, BookAppointmentRequest, CreatePartRequestDto } from '@/services/appointment.service';
import { queryKeys } from '@/lib/query-keys';
import { toast } from 'sonner';

export const useMyAppointmentsQuery = () => {
  return useQuery({
    queryKey: queryKeys.appointments.my(),
    queryFn: () => AppointmentService.getMyAppointments(),
  });
};

export const useBookAppointmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: BookAppointmentRequest) => AppointmentService.bookAppointment(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all });
      toast.success('Appointment booked successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to book appointment');
    },
  });
};

export const useUpdateAppointmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: BookAppointmentRequest }) => 
      AppointmentService.updateAppointment(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all });
      toast.success('Appointment updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update appointment');
    },
  });
};

export const useCancelAppointmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => AppointmentService.cancelAppointment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all });
      toast.success('Appointment cancelled successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to cancel appointment');
    },
  });
};

export const useMyPartRequestsQuery = () => {
  return useQuery({
    queryKey: queryKeys.partRequests.my(),
    queryFn: () => AppointmentService.getMyPartRequests(),
  });
};

export const useCreatePartRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreatePartRequestDto) => AppointmentService.createPartRequest(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.partRequests.all });
      toast.success('Part request submitted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit part request');
    },
  });
};
