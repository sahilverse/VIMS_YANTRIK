'use client';

import React from 'react';
import { 
  Users, 
  Package, 
  Receipt, 
  TrendingUp, 
  Plus, 
  UserPlus, 
  ArrowUpRight,
  AlertCircle,
  Clock,
  Loader2,
  Calendar,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { useStaffDashboardQuery } from '@/hooks/api/useDashboardApi';
import { format } from 'date-fns';

export default function StaffDashboard() {
  const { data: response, isLoading } = useStaffDashboardQuery();
  const dashboard = response?.data;

  if (isLoading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="h-16 w-16 border-4 border-zinc-100 rounded-full" />
          <div className="h-16 w-16 border-4 border-zinc-950 rounded-full border-t-transparent animate-spin absolute top-0" />
        </div>
        <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest animate-pulse">Loading Operations...</p>
      </div>
    );
  }

  const stats = [
    { 
      label: "Today's Sales", 
      value: `Rs. ${dashboard?.todaySales.toLocaleString() ?? '0'}`, 
      icon: TrendingUp, 
      color: "text-emerald-600", 
      bg: "bg-emerald-50",
      description: "Gross revenue today"
    },
    { 
      label: "Parts Sold", 
      value: `${dashboard?.partsSoldToday ?? '0'} Units`, 
      icon: Package, 
      color: "text-blue-600", 
      bg: "bg-blue-50",
      description: "Inventory movement"
    },
    { 
      label: "Pending Payments", 
      value: dashboard?.pendingPaymentsCount.toString() ?? '0', 
      icon: Clock, 
      color: "text-amber-600", 
      bg: "bg-amber-50",
      description: "Unpaid invoices"
    },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-8 bg-zinc-950 rounded-full" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Live Dashboard</p>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-zinc-900 leading-none">Operations Overview</h1>
          <p className="text-zinc-500 font-medium mt-3 text-lg">Real-time performance metrics and actionable task summary.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link 
            href="/staff/customers?action=register"
            className="flex items-center gap-2.5 px-6 py-3 bg-white border border-zinc-200 hover:border-zinc-300 text-zinc-900 rounded-2xl text-sm font-bold transition-all shadow-sm hover:shadow-md active:scale-95 group"
          >
            <UserPlus className="h-4 w-4 text-zinc-400 group-hover:text-zinc-900 transition-colors" /> Register Customer
          </Link>
          <Link 
            href="/staff/sales?action=new"
            className="flex items-center gap-2.5 px-8 py-3 bg-zinc-950 text-white hover:bg-zinc-800 rounded-2xl text-sm font-bold transition-all shadow-xl shadow-black/10 hover:shadow-black/20 active:scale-95"
          >
            <Plus className="h-4 w-4" /> Create Sale
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-7 rounded-[2.5rem] border border-zinc-100 shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <div className={`p-3.5 rounded-2xl ${stat.bg} ${stat.color} w-max mb-6`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.15em]">{stat.label}</p>
              <h3 className="text-3xl font-black text-zinc-900 mt-2">{stat.value}</h3>
              <p className="text-xs font-bold text-zinc-400 mt-2 flex items-center gap-1.5 transition-opacity">
                {stat.description}
              </p>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-[0.03]">
              <stat.icon className="h-32 w-32" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 bg-zinc-950 rounded-full" />
              <h2 className="text-2xl font-black text-zinc-900">Recent Sales</h2>
            </div>
            <Link href="/staff/sales" className="flex items-center gap-2 text-[10px] font-black text-zinc-400 hover:text-zinc-900 transition-colors uppercase tracking-[0.2em] group">
              View Directory <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
          
          <div className="bg-white rounded-[2rem] border border-zinc-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50/50">
                    <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-100">Invoice Details</th>
                    <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-100">Customer</th>
                    <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-100">Transaction</th>
                    <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-100">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {dashboard?.recentSales.map((row, i) => (
                    <tr key={i} className="transition-all cursor-pointer group">
                      <td className="px-8 py-6">
                        <div className="font-black text-zinc-900">{row.invoiceNumber}</div>
                        <div className="text-[10px] font-bold text-zinc-400 flex items-center gap-1.5 mt-1">
                          <Calendar className="h-3 w-3" /> {format(new Date(row.date), 'MMM dd, hh:mm a')}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="font-bold text-zinc-700">{row.customerName}</div>
                      </td>
                      <td className="px-8 py-6 font-black text-zinc-900">Rs. {row.totalAmount.toLocaleString()}</td>
                      <td className="px-8 py-6">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          row.paymentStatus === 'Paid' ? 'bg-emerald-100/50 text-emerald-700' : 
                          row.paymentStatus === 'Partial' ? 'bg-amber-100/50 text-amber-700' :
                          'bg-red-100/50 text-red-700'
                        }`}>
                          {row.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {(!dashboard?.recentSales || dashboard.recentSales.length === 0) && (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <Receipt className="h-10 w-10 text-zinc-100" />
                          <p className="text-sm font-bold text-zinc-400">No recent sales recorded today.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Side Panel: Inventory Alerts */}
        <div className="space-y-6">
          <div className="px-2 flex items-center gap-3">
            <div className="h-8 w-1 bg-red-500 rounded-full" />
            <h2 className="text-2xl font-black text-zinc-900">Critical Alerts</h2>
          </div>
          
          <div className="space-y-4">
            {dashboard?.lowStockAlerts.map((alert, i) => (
              <div key={i} className="p-6 bg-white rounded-3xl border border-zinc-100 shadow-sm flex items-start gap-5 group relative overflow-hidden">
                <div className="p-3 bg-red-50 text-red-500 rounded-2xl">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-base font-black text-zinc-900">{alert.partName}</h4>
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-[0.1em] mt-1">{alert.sku}</p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="px-3 py-1 bg-red-50 text-[10px] font-black text-red-600 rounded-lg uppercase tracking-widest border border-red-100">
                      Stock: {alert.currentStock}
                    </div>
                    <div className="text-[10px] font-bold text-zinc-400">
                      Min: {alert.minStockLevel}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {(!dashboard?.lowStockAlerts || dashboard.lowStockAlerts.length === 0) && (
              <div className="p-10 text-center bg-emerald-50/30 rounded-3xl border border-dashed border-emerald-100">
                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl w-max mx-auto mb-4">
                  <Package className="h-6 w-6" />
                </div>
                <p className="text-sm font-bold text-emerald-800">All stock levels healthy.</p>
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">No critical alerts</p>
              </div>
            )}
            
            <button className="w-full p-6 border-2 border-dashed border-zinc-200 hover:bg-zinc-950 hover:text-white rounded-[2rem] text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-95">
              Request Stock from Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
