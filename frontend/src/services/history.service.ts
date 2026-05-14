import api from '@/lib/api';
import { ApiResponse } from '@/types';

export interface HistoryItemDto {
  id: string;
  title: string;
  description: string;
  type: 'Invoice' | 'Service';
  date: string;
  status: string;
  amount?: number;
  referenceNumber?: string;
  subTotal?: number;
  taxAmount?: number;
  plateNumber?: string;
  vehicleBrand?: string;
  vehicleModel?: string;
  lineItems?: HistoryLineItemDto[];
}

export interface HistoryLineItemDto {
  partName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface HistoryPagedResult {
  items: HistoryItemDto[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface HistoryFilterParams {
  startDate?: string;
  endDate?: string;
  type?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export const HistoryService = {
  getMyHistory: async (params?: HistoryFilterParams): Promise<HistoryPagedResult> => {
    const response = await api.get<ApiResponse<HistoryPagedResult>>('/history/my', { params });
    return response.data.data!;
  },

  getCustomerHistory: async (customerId: string, params?: HistoryFilterParams): Promise<HistoryPagedResult> => {
    const response = await api.get<ApiResponse<HistoryPagedResult>>(`/history/customer/${customerId}`, { params });
    return response.data.data!;
  },
};
