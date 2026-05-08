import api from '@/lib/api';
import { ApiResponse, PagedResponse, PaginationParams, Vehicle, VehicleRegistrationRequest } from '@/types';

export const VehicleService = {
  getMyVehicles: async (params: PaginationParams): Promise<PagedResponse<Vehicle>> => {
    const response = await api.get<ApiResponse<PagedResponse<Vehicle>>>('/vehicles/my', { params });
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch vehicles');
    }
    return response.data.data;
  },

  addVehicle: async (request: VehicleRegistrationRequest): Promise<Vehicle> => {
    const response = await api.post<ApiResponse<Vehicle>>('/vehicles', request);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to add vehicle');
    }
    return response.data.data;
  },

  updateVehicle: async (id: string, request: Partial<Vehicle>): Promise<Vehicle> => {
    const response = await api.put<ApiResponse<Vehicle>>(`/vehicles/${id}`, request);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to update vehicle');
    }
    return response.data.data;
  },

  deleteVehicle: async (id: string): Promise<boolean> => {
    const response = await api.delete<ApiResponse<boolean>>(`/vehicles/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete vehicle');
    }
    return true;
  }
};
