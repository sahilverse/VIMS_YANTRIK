import { useQuery } from '@tanstack/react-query';
import { ReportService } from '@/services/report.service';
import { queryKeys } from '@/lib/query-keys';

export const useDailyReportQuery = (date?: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.reports.daily(date),
    queryFn: () => ReportService.getDailyReport(date),
    enabled,
  });
};

export const useMonthlyReportQuery = (year?: number, month?: number, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.reports.monthly(year, month),
    queryFn: () => ReportService.getMonthlyReport(year, month),
    enabled,
  });
};

export const useYearlyReportQuery = (year?: number, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.reports.yearly(year),
    queryFn: () => ReportService.getYearlyReport(year),
    enabled,
  });
};
