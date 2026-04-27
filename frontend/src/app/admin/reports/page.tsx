'use client';

import React, { useState } from 'react';
import { useDailyReportQuery, useMonthlyReportQuery, useYearlyReportQuery } from '@/hooks/api/useReportApi';
import ReportCharts from '@/components/admin/reports/ReportCharts';
import { BarChart4, TrendingUp, TrendingDown, DollarSign, Activity, Package, Receipt } from 'lucide-react';

export default function ReportsPage() {
  const [reportType, setReportType] = useState<'daily' | 'monthly' | 'yearly'>('monthly');

  // Currently defaulting to current dates. In a full system, you would have date pickers here.
  const today = new Date();
  
  const dailyQuery = useDailyReportQuery(undefined, reportType === 'daily');
  const monthlyQuery = useMonthlyReportQuery(today.getFullYear(), today.getMonth() + 1, reportType === 'monthly');
  const yearlyQuery = useYearlyReportQuery(today.getFullYear(), reportType === 'yearly');

  const getActiveQuery = () => {
    switch (reportType) {
      case 'daily': return dailyQuery;
      case 'yearly': return yearlyQuery;
      case 'monthly':
      default: return monthlyQuery;
    }
  };

  const { data: response, isLoading } = getActiveQuery();
  const report = response?.data;

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Financial Reports</h1>
          <p className="text-xs font-bold text-zinc-400 mt-1 uppercase tracking-wider">
            Analytics and financial performance
          </p>
        </div>
        
        <div className="flex items-center gap-1 bg-zinc-100 p-1.5 rounded-2xl w-max">
          <button
            onClick={() => setReportType('daily')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
              reportType === 'daily' 
                ? 'bg-white text-zinc-900 shadow-sm' 
                : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/50'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setReportType('monthly')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
              reportType === 'monthly' 
                ? 'bg-white text-zinc-900 shadow-sm' 
                : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/50'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setReportType('yearly')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
              reportType === 'yearly' 
                ? 'bg-white text-zinc-900 shadow-sm' 
                : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/50'
            }`}
          >
            Yearly
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64 bg-zinc-50 rounded-3xl border border-zinc-100">
          <div className="text-center">
            <Activity className="h-8 w-8 text-zinc-300 animate-pulse mx-auto mb-3" />
            <p className="text-sm font-bold text-zinc-400">Compiling financial data...</p>
          </div>
        </div>
      ) : report ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
          
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            
            <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm relative overflow-hidden group">
              <div className="absolute -right-6 -top-6 bg-zinc-50 w-24 h-24 rounded-full transition-transform group-hover:scale-110" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-zinc-950 text-white rounded-2xl shadow-lg shadow-black/10">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <span className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${report.netProfit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {report.netProfit >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {report.netProfit >= 0 ? 'Profit' : 'Loss'}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Net Profit</p>
                  <h3 className="text-2xl font-black tracking-tight">Rs. {report.netProfit.toLocaleString()}</h3>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Total Revenue</p>
                <h3 className="text-2xl font-black tracking-tight">Rs. {report.totalRevenue.toLocaleString()}</h3>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
                  <TrendingDown className="h-5 w-5" />
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Total Expenses</p>
                <h3 className="text-2xl font-black tracking-tight">Rs. {report.totalExpense.toLocaleString()}</h3>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm">
              <div className="flex items-center gap-6 h-full">
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Sales Volume</p>
                  <div className="flex items-center gap-2">
                    <Receipt className="h-4 w-4 text-emerald-500" />
                    <h3 className="text-lg font-black tracking-tight">{report.totalSalesCount}</h3>
                  </div>
                </div>
                <div className="w-px h-12 bg-zinc-100" />
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Purchases</p>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-red-500" />
                    <h3 className="text-lg font-black tracking-tight">{report.totalPurchasesCount}</h3>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Charts */}
          <ReportCharts data={report.chartData} />

        </div>
      ) : (
        <div className="h-64 flex items-center justify-center bg-zinc-50 rounded-3xl border border-zinc-100">
          <p className="text-sm font-bold text-zinc-400">Failed to load reports</p>
        </div>
      )}
    </>
  );
}
