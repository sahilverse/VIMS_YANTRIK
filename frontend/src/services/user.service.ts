import api from '@/lib/api';
import { ApiResponse, UserDto, PagedResponse, PaginationParams } from '@/types';
import { CreateStaffFormValues } from '@/lib/validations/auth'; 

export interface CreateCustomerFormValues {
  fullName: string;
  phone: string;
  email?: string;
  address?: string;
  plateNumber: string;
  make?: string;
  model?: string;
  year?: number;
}

export const UserService = {
  getStaff: async (params: PaginationParams) => {
    const response = await api.get<ApiResponse<PagedResponse<UserDto>>>('/users/staff', { params });
    return response.data;
  },

  createStaff: async (data: CreateStaffFormValues) => {
    const response = await api.post<ApiResponse<UserDto>>('/users/staff', data);
    return response.data;
  },

  registerCustomer: async (data: CreateCustomerFormValues) => {
    const response = await api.post<ApiResponse<UserDto>>('/users/customer', data);
    return response.data;
  },

  updateStaff: async (id: string, data: any) => {
    const response = await api.put<ApiResponse<boolean>>(`/users/staff/${id}`, data);
    return response.data;
  },

  toggleStatus: async (id: string) => {
    const response = await api.patch<ApiResponse<boolean>>(`/users/staff/${id}/toggle-status`);
    return response.data;
  }
};
