import api from '@/lib/api';
import { ApiResponse, FinancialReportDto, AdminDashboardStatsDto } from '@/types';

export const ReportService = {
  getDailyReport: async (date?: string): Promise<ApiResponse<FinancialReportDto>> => {
    const response = await api.get('/reports/daily', { params: { date } });
    return response.data;
  },

  getMonthlyReport: async (year?: number, month?: number): Promise<ApiResponse<FinancialReportDto>> => {
    const response = await api.get('/reports/monthly', { params: { year, month } });
    return response.data;
  },

  getYearlyReport: async (year?: number): Promise<ApiResponse<FinancialReportDto>> => {
    const response = await api.get('/reports/yearly', { params: { year } });
    return response.data;
  },

  getDashboardStats: async (): Promise<ApiResponse<AdminDashboardStatsDto>> => {
    const response = await api.get('/reports/dashboard-stats');
    return response.data;
  }
};
