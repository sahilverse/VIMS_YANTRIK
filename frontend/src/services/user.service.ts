import api from '@/lib/api';
import { ApiResponse, UserDto, PagedResponse, PaginationParams, UserProfileDto, UpdateProfileRequest } from '@/types';
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
  getEmployees: async (params: PaginationParams) => {
    const response = await api.get<ApiResponse<PagedResponse<UserDto>>>('/users/employees', { params });
    return response.data;
  },

  createEmployee: async (data: CreateStaffFormValues) => {
    const response = await api.post<ApiResponse<UserDto>>('/users/employee', data);
    return response.data;
  },

  registerCustomer: async (data: CreateCustomerFormValues) => {
    const response = await api.post<ApiResponse<UserDto>>('/users/customer', data);
    return response.data;
  },

  updateEmployee: async (id: string, data: any) => {
    const response = await api.put<ApiResponse<boolean>>(`/users/employee/${id}`, data);
    return response.data;
  },

  toggleEmployeeStatus: async (id: string) => {
    const response = await api.patch<ApiResponse<boolean>>(`/users/employee/${id}/toggle-status`);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get<ApiResponse<UserProfileDto>>('/users/profile');
    return response.data;
  },

  updateProfile: async (data: UpdateProfileRequest) => {
    const response = await api.put<ApiResponse<boolean>>('/users/profile', data);
    return response.data;
  }
};
