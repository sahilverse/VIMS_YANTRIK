'use client';

import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  CreditCard, 
  Award, 
  TrendingUp, 
  ArrowRight, 
  Receipt,
  Calendar,
  Search,
  Filter,
  Download,
  Loader2,
  AlertCircle,
  History,
  Star
} from 'lucide-react';
import { useCustomerReportQuery } from '@/hooks/api/useReportsApi';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function ReportsPage() {
  const [activeView, setActiveView] = useState<'regulars' | 'spenders' | 'credits'>('regulars');
  const { data: reportResponse, isLoading } = useCustomerReportQuery();
  const report = reportResponse?.data;

  if (isLoading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 text-zinc-950 animate-spin" />
        <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Compiling Analytics...</p>
      </div>
    );
  }

  const statCards = [
    { label: 'Regulars', count: report?.regulars.length || 0, icon: History, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'High Spenders', count: report?.highSpenders.length || 0, icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Pending Credits', count: report?.pendingCredits.length || 0, icon: CreditCard, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-zinc-950 text-white rounded-xl shadow-lg shadow-black/10">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-zinc-900">Performance Reports</h1>
          </div>
          <p className="text-zinc-500 text-sm font-medium">Customer behavioral insights and credit management tracking.</p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="h-12 px-6 rounded-2xl border-zinc-200 font-bold flex items-center gap-2">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Summary Mini Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-zinc-100 shadow-sm flex items-center gap-4">
            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">{stat.label}</p>
              <h3 className="text-2xl font-black text-zinc-900 mt-0.5">{stat.count}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Main Reporting Section */}
      <div className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm overflow-hidden">
        {/* Navigation Tabs */}
        <div className="p-2 flex gap-2 border-b border-zinc-50">
          {[
            { id: 'regulars', label: 'Regular Customers', icon: History },
            { id: 'spenders', label: 'High Spenders', icon: Award },
            { id: 'credits', label: 'Pending Credits', icon: CreditCard },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              className={`flex-1 py-4 px-6 rounded-2xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-3 ${activeView === tab.id 
                ? 'bg-zinc-950 text-white shadow-xl shadow-black/10' 
                : 'text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50'}`}
            >
              <tab.icon className="h-4 w-4" /> {tab.label}
            </button>
          ))}
        </div>

        {/* Dynamic Content */}
        <div className="overflow-x-auto">
          {activeView === 'regulars' && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/30">
                  <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Customer</th>
                  <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Code</th>
                  <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Total Visits</th>
                  <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Revenue Generated</th>
                  <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {report?.regulars.map((c) => (
                  <tr key={c.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-8 py-6 font-bold text-zinc-900">{c.fullName}</td>
                    <td className="px-8 py-6 text-xs font-black text-zinc-400 uppercase tracking-widest">{c.customerCode}</td>
                    <td className="px-8 py-6">
                      <Badge className="bg-zinc-100 text-zinc-900 font-black px-3 py-1 rounded-full border-none shadow-none">
                        {c.visitCount} Visits
                      </Badge>
                    </td>
                    <td className="px-8 py-6 font-black text-zinc-900">Rs. {c.totalSpent.toLocaleString()}</td>
                    <td className="px-8 py-6 text-right">
                      <Link href={`/staff/customers/${c.id}`} className="text-zinc-400 hover:text-zinc-950 transition-colors">
                        <ArrowRight className="h-5 w-5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeView === 'spenders' && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/30">
                  <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Top Spender</th>
                  <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Code</th>
                  <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Contribution</th>
                  <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Avg per Visit</th>
                  <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {report?.highSpenders.map((c) => (
                  <tr key={c.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-8 py-6 font-bold text-zinc-900">{c.fullName}</td>
                    <td className="px-8 py-6 text-xs font-black text-zinc-400 uppercase tracking-widest">{c.customerCode}</td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-emerald-600">
                        <TrendingUp className="h-4 w-4" />
                        <span className="font-black">Rs. {c.totalSpent.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 font-bold text-zinc-600">
                      Rs. {c.visitCount > 0 ? (c.totalSpent / c.visitCount).toLocaleString(undefined, { maximumFractionDigits: 0 }) : 0}
                    </td>
                    <td className="px-8 py-6">
                      <Link href={`/staff/customers/${c.id}`} className="text-zinc-400 hover:text-zinc-950 transition-colors">
                        <ArrowRight className="h-5 w-5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeView === 'credits' && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/30">
                  <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Invoice</th>
                  <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Customer</th>
                  <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Amount Due</th>
                  <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Date</th>
                  <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {report?.pendingCredits.map((inv) => (
                  <tr key={inv.invoiceId} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-8 py-6 font-black text-zinc-900 flex items-center gap-2">
                      <Receipt className="h-4 w-4 text-zinc-300" /> {inv.invoiceNumber}
                    </td>
                    <td className="px-8 py-6 font-bold text-zinc-900">{inv.customerName}</td>
                    <td className="px-8 py-6 font-black text-rose-600">Rs. {inv.amount.toLocaleString()}</td>
                    <td className="px-8 py-6 text-zinc-500 font-medium">
                      {new Date(inv.date).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-6">
                      <Badge className="bg-amber-50 text-amber-600 border-none px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-widest shadow-none">
                        {inv.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
