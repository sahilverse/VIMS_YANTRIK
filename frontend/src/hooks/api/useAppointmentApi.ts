import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AppointmentService, BookAppointmentRequest, CompleteAppointmentRequest } from '@/services/appointment.service';
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

export const useAllAppointmentsQuery = (statusFilter?: string) => {
  return useQuery({
    queryKey: [...queryKeys.appointments.all, statusFilter],
    queryFn: () => AppointmentService.getAllAppointments(statusFilter),
  });
};

export const useUpdateAppointmentStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      AppointmentService.updateAppointmentStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all });
      toast.success('Appointment status updated');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update status');
    },
  });
};

export const useCompleteAppointmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: CompleteAppointmentRequest }) => 
      AppointmentService.completeAppointment(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all });
      queryClient.invalidateQueries({ queryKey: ['customer-history'] });
      toast.success('Appointment completed and service record created');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to complete appointment');
    },
  });
};

export const useDeleteAppointmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => AppointmentService.deleteAppointment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all });
      toast.success('Appointment deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete appointment');
    },
  });
};
