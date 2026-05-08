import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { VehicleService } from '@/services/vehicle.service';
import { queryKeys } from '@/lib/query-keys';
import { PaginationParams, VehicleRegistrationRequest, Vehicle } from '@/types';
import { toast } from 'sonner';

export const useMyVehiclesQuery = (params: PaginationParams) => {
  return useQuery({
    queryKey: queryKeys.vehicles.my(params),
    queryFn: () => VehicleService.getMyVehicles(params),
  });
};

export const useAddVehicleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: VehicleRegistrationRequest) => VehicleService.addVehicle(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vehicles.all });
      toast.success('Vehicle added successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add vehicle');
    },
  });
};

export const useUpdateVehicleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: Partial<Vehicle> }) => 
      VehicleService.updateVehicle(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vehicles.all });
      toast.success('Vehicle updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update vehicle');
    },
  });
};

export const useDeleteVehicleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => VehicleService.deleteVehicle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vehicles.all });
      toast.success('Vehicle removed successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to remove vehicle');
    },
  });
};
