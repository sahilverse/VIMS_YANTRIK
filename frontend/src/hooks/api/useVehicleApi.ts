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
    onMutate: async (newVehicle) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.vehicles.all });
      const previousVehicles = queryClient.getQueryData(queryKeys.vehicles.all);
      return { previousVehicles };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vehicles.all });
      toast.success('Vehicle added successfully');
    },
    onError: (error: any, __, context) => {
      if (context?.previousVehicles) {
        queryClient.setQueryData(queryKeys.vehicles.all, context.previousVehicles);
      }
      toast.error(error.message || 'Failed to add vehicle');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vehicles.all });
    },
  });
};

export const useUpdateVehicleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: Partial<Vehicle> }) =>
      VehicleService.updateVehicle(id, request),
    onMutate: async ({ id, request }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.vehicles.all });

      // Get all vehicle queries to update them optimistically
      const queries = queryClient.getQueriesData({ queryKey: queryKeys.vehicles.all });

      queries.forEach(([queryKey, oldData]: [any, any]) => {
        if (oldData?.items) {
          queryClient.setQueryData(queryKey, {
            ...oldData,
            items: oldData.items.map((v: Vehicle) =>
              v.id === id ? { ...v, ...request } : v
            )
          });
        }
      });

      return { queries };
    },
    onSuccess: () => {
      toast.success('Vehicle updated successfully');
    },
    onError: (error: any, __, context) => {
      if (context?.queries) {
        context.queries.forEach(([queryKey, oldData]) => {
          queryClient.setQueryData(queryKey, oldData);
        });
      }
      toast.error(error.message || 'Failed to update vehicle');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vehicles.all });
    },
  });
};

export const useDeleteVehicleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => VehicleService.deleteVehicle(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.vehicles.all });

      const queries = queryClient.getQueriesData({ queryKey: queryKeys.vehicles.all });

      queries.forEach(([queryKey, oldData]: [any, any]) => {
        if (oldData?.items) {
          queryClient.setQueryData(queryKey, {
            ...oldData,
            items: oldData.items.filter((v: Vehicle) => v.id !== id),
            totalItems: oldData.totalItems - 1
          });
        }
      });

      return { queries };
    },
    onSuccess: () => {
      toast.success('Vehicle removed successfully');
    },
    onError: (error: any, __, context) => {
      if (context?.queries) {
        context.queries.forEach(([queryKey, oldData]) => {
          queryClient.setQueryData(queryKey, oldData);
        });
      }
      toast.error(error.message || 'Failed to remove vehicle');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vehicles.all });
    },
  });
};
