'use client';

import React, { useState, useEffect } from 'react';
import { 
  Receipt, 
  Plus, 
  Search, 
  TrendingUp,
  History,
  ShoppingCart
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import SalesTable from '@/components/staff/sales/SalesTable';
import CreateSaleModal from '@/components/staff/sales/CreateSaleModal';
import { Button } from '@/components/ui/button';
import { useSalesStatsQuery } from '@/hooks/api/useSalesApi';

export default function SalesPage() {
  const searchParams = useSearchParams();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const initialCustomerId = searchParams.get('customerId') || undefined;

  const { data: statsResponse } = useSalesStatsQuery();
  const stats = statsResponse?.data;

  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      setIsCreateOpen(true);
    }
  }, [searchParams]);

  const statItems = [
    { 
      label: "Today's Sales", 
      value: `Rs. ${stats?.todayRevenue?.toFixed(2) || '0.00'}`, 
      icon: TrendingUp, 
      color: "text-emerald-600", 
      bg: "bg-emerald-50" 
    },
    { 
      label: "Total Transactions", 
      value: stats?.totalTransactions?.toString() || '0', 
      icon: Receipt, 
      color: "text-blue-600", 
      bg: "bg-blue-50" 
    },
    { 
      label: "Pending Payments", 
      value: stats?.pendingPaymentsCount?.toString() || '0', 
      icon: History, 
      color: "text-amber-600", 
      bg: "bg-amber-50" 
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-zinc-950 text-white rounded-xl shadow-lg shadow-black/10">
              <ShoppingCart className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-zinc-900">Sales & Invoicing</h1>
          </div>
          <p className="text-zinc-500 text-sm font-medium">Manage transactions, generate invoices, and track revenue.</p>
        </div>

        <Button
          onClick={() => setIsCreateOpen(true)}
          className="bg-zinc-950 text-white hover:bg-zinc-800 h-12 px-8 rounded-2xl font-bold transition-all shadow-xl shadow-black/10 active:scale-95 flex items-center gap-2"
        >
          <Plus className="h-5 w-5" /> New Sales Invoice
        </Button>
      </div>

      {/* Stats Summary (Mini) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {statItems.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">{stat.label}</p>
              <h3 className="text-xl font-black text-zinc-900 mt-0.5">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Main Table Content */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
        <SalesTable />
      </div>

      {/* Modals */}
      <CreateSaleModal 
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        initialCustomerId={initialCustomerId}
      />
    </div>
  );
}
