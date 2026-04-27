import api from '@/lib/api';
import { ApiResponse, FinancialReportDto } from '@/types';

export const ReportService = {
  getDailyReport: async (date?: string): Promise<ApiResponse<FinancialReportDto>> => {
    const response = await api.get('/Reports/daily', { params: { date } });
    return response.data;
  },

  getMonthlyReport: async (year?: number, month?: number): Promise<ApiResponse<FinancialReportDto>> => {
    const response = await api.get('/Reports/monthly', { params: { year, month } });
    return response.data;
  },

  getYearlyReport: async (year?: number): Promise<ApiResponse<FinancialReportDto>> => {
    const response = await api.get('/Reports/yearly', { params: { year } });
    return response.data;
  }
};
