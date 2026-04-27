import api from '@/lib/api';
import { ApiResponse, PagedResponse, PaginationParams, Vendor } from '@/types';
import { CreateVendorFormValues } from '@/lib/validations/admin';

export const VendorService = {
  getVendors: async (params: PaginationParams) => {
    const response = await api.get<ApiResponse<PagedResponse<Vendor>>>('/vendors', { params });
    return response.data;
  },

  createVendor: async (data: CreateVendorFormValues) => {
    const response = await api.post<ApiResponse<Vendor>>('/vendors', data);
    return response.data;
  },

  updateVendor: async (id: string, data: CreateVendorFormValues) => {
    const response = await api.put<ApiResponse<Vendor>>(`/vendors/${id}`, data);
    return response.data;
  },

  deleteVendor: async (id: string) => {
    const response = await api.delete<ApiResponse<boolean>>(`/vendors/${id}`);
    return response.data;
  }
};
