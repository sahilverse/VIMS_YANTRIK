import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { ApiResponse } from '@/types';

export interface StaffDashboardData {
  todaySales: number;
  partsSoldToday: number;
  pendingPaymentsCount: number;
  recentSales: {
    id: string;
    invoiceNumber: string;
    customerName: string;
    totalAmount: number;
    paymentStatus: string;
    date: string;
  }[];
  lowStockAlerts: {
    partName: string;
    sku: string;
    currentStock: number;
    minStockLevel: number;
  }[];
}

export const useStaffDashboardQuery = () => {
  return useQuery({
    queryKey: ['dashboard', 'staff'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<StaffDashboardData>>('/dashboard/staff');
      return response.data;
    },
  });
};
