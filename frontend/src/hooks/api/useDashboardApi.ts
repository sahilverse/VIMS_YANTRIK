import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { ApiResponse } from '@/types';

export interface StaffDashboardData {
  todaySales: number;
  partsSoldToday: number;
  pendingPaymentsCount: number;
  totalCustomers: number;
  activeAppointmentsCount: number;
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

export interface CustomerDashboardData {
  totalSpent: number;
  vehicleCount: number;
  appointmentCount: number;
  recentVehicles: {
    id: string;
    plateNumber: string;
    brand: string;
    model: string;
  }[];
  upcomingAppointments: {
    id: string;
    appointmentDate: string;
    serviceType: string;
    status: string;
    plateNumber: string;
  }[];
  recentInvoices: {
    id: string;
    invoiceNumber: string;
    totalAmount: number;
    date: string;
    paymentStatus: string;
  }[];
}

export const useCustomerDashboardQuery = () => {
  return useQuery({
    queryKey: ['dashboard', 'customer'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<CustomerDashboardData>>('/dashboard/customer');
      return response.data;
    },
  });
};
