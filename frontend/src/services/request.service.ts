import api from '@/lib/api';
import { ApiResponse } from '@/types';

export interface PartRequestDto {
  id: string;
  customerId: string;
  customerName: string;
  partId: string;
  partName: string;
  partSKU: string;
  notes?: string;
  status: 'Pending' | 'Reviewed' | 'Ordered' | 'Fulfilled' | 'Cancelled';
  createdAt: string;
}

export interface CreatePartRequestDto {
  partId: string;
  notes?: string;
}

export interface UpdatePartRequestStatusDto {
  status: 'Pending' | 'Reviewed' | 'Ordered' | 'Fulfilled' | 'Cancelled';
}

class RequestService {
  async getMyRequests() {
    const { data } = await api.get<ApiResponse<PartRequestDto[]>>('/requests/my');
    return data;
  }

  async createRequest(payload: CreatePartRequestDto) {
    const { data } = await api.post<ApiResponse<PartRequestDto>>('/requests', payload);
    return data;
  }

  async getAllRequests(statusFilter?: string) {
    const params = statusFilter ? { statusFilter } : undefined;
    const { data } = await api.get<ApiResponse<PartRequestDto[]>>('/requests', { params });
    return data;
  }

  async updateRequestStatus(id: string, payload: UpdatePartRequestStatusDto) {
    const { data } = await api.patch<ApiResponse<PartRequestDto>>(`/requests/${id}/status`, payload);
    return data;
  }
}

export const requestService = new RequestService();
