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

export interface PartRequestDto {
  id: string;
  partName: string;
  notes?: string;
  status: string;
  createdAt: string;
}

export interface CreatePartRequestDto {
  partName: string;
  notes?: string;
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

  getMyPartRequests: async (): Promise<PartRequestDto[]> => {
    const response = await api.get<ApiResponse<PartRequestDto[]>>('/appointments/part-requests');
    return response.data.data || [];
  },

  createPartRequest: async (request: CreatePartRequestDto): Promise<PartRequestDto> => {
    const response = await api.post<ApiResponse<PartRequestDto>>('/appointments/part-requests', request);
    return response.data.data!;
  },
};
