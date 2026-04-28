import api from '@/lib/api';
import { ApiResponse, PaginationParams, PagedResponse, PurchaseInvoiceDto, CreatePurchaseRequest } from '@/types';

export const PurchaseService = {
  getPurchases: async (params: PaginationParams): Promise<ApiResponse<PagedResponse<PurchaseInvoiceDto>>> => {
    const response = await api.get('/purchase', { params });
    return response.data;
  },

  getPurchaseById: async (id: string): Promise<ApiResponse<PurchaseInvoiceDto>> => {
    const response = await api.get(`/purchase/${id}`);
    return response.data;
  },

  createPurchase: async (data: CreatePurchaseRequest): Promise<ApiResponse<PurchaseInvoiceDto>> => {
    const response = await api.post('/purchase', data);
    return response.data;
  }
};
