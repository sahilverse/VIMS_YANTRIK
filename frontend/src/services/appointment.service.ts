import api from '@/lib/api';
import { ApiResponse } from '@/types';

export interface AppointmentDto {
  id: string;
  vehicleId: string;
  plateNumber: string;
  vehicleName: string;
  serviceType: string;
  appointmentDate: string;
  status: string;
}

export interface BookAppointmentRequest {
  vehicleId: string;
  serviceType: string;
  appointmentDate: string;
}



export const AppointmentService = {
  getMyAppointments: async (): Promise<AppointmentDto[]> => {
    const response = await api.get<ApiResponse<AppointmentDto[]>>('/appointments/my');
    return response.data.data || [];
  },

  bookAppointment: async (request: BookAppointmentRequest): Promise<AppointmentDto> => {
    const response = await api.post<ApiResponse<AppointmentDto>>('/appointments', request);
    return response.data.data!;
  },

  updateAppointment: async (id: string, request: BookAppointmentRequest): Promise<AppointmentDto> => {
    const response = await api.put<ApiResponse<AppointmentDto>>(`/appointments/${id}`, request);
    return response.data.data!;
  },

  cancelAppointment: async (id: string): Promise<boolean> => {
    const response = await api.delete<ApiResponse<boolean>>(`/appointments/${id}`);
    return response.data.success;
  },

  getAllAppointments: async (statusFilter?: string): Promise<AppointmentDto[]> => {
    const params = statusFilter ? { statusFilter } : undefined;
    const response = await api.get<ApiResponse<AppointmentDto[]>>('/appointments', { params });
    return response.data.data || [];
  },

  updateAppointmentStatus: async (id: string, status: string): Promise<AppointmentDto> => {
    const response = await api.patch<ApiResponse<AppointmentDto>>(`/appointments/${id}/status`, { status });
    return response.data.data!;
  },

  deleteAppointment: async (id: string): Promise<boolean> => {
    const response = await api.delete<ApiResponse<boolean>>(`/appointments/staff/${id}`);
    return response.data.success;
  },
};
