import api from '@/lib/api';
import { ApiResponse, PagedResponse, Customer, RegisterCustomerRequest } from '@/types';

export const CustomerService = {
  getCustomers: async (params: { pageNumber?: number; pageSize?: number; search?: string }) => {
    const response = await api.get<PagedResponse<Customer>>('/customers', { params });
    return response.data;
  },

  getCustomerById: async (id: string) => {
    const response = await api.get<Customer>(`/customers/${id}`);
    return response.data;
  },

  registerCustomer: async (data: RegisterCustomerRequest) => {
    const response = await api.post<ApiResponse<{ id: string }>>('/users/customer', data);
    return response.data;
  }
};
