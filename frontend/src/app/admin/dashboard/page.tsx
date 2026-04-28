'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Users,
  UserPlus,
  TrendingUp,
  Activity,
  ArrowRight,
  FileText,
  Briefcase,
  AlertCircle,
  ShoppingCart,
  Loader2
} from 'lucide-react';
import AddStaffModal from '@/components/admin/AddStaffModal';
import ViewPurchaseModal from '@/components/admin/purchases/ViewPurchaseModal';
import EditPartModal from '@/components/admin/inventory/EditPartModal';

import { useAdminDashboardStatsQuery } from '@/hooks/api/useReportApi';
import { usePartDetailQuery } from '@/hooks/api/useInventoryApi';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [isAddStaffOpen, setIsAddStaffOpen] = React.useState(false);
  const [selectedPurchaseId, setSelectedPurchaseId] = React.useState<string | null>(null);
  const [selectedPartId, setSelectedPartId] = React.useState<string | null>(null);

  const { data: statsResponse, isLoading } = useAdminDashboardStatsQuery();
  const stats = statsResponse?.data;

  // Fetch full part data when a part is selected for editing
  const { data: partDetailResponse } = usePartDetailQuery(selectedPartId!, !!selectedPartId);
  const selectedPart = partDetailResponse?.data || null;

  if (isLoading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 text-zinc-950 animate-spin" />
        <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Dashboard</h1>
          <p className="text-xs font-bold text-zinc-400 mt-1 uppercase tracking-wider">
            Welcome back, {user?.fullName}
          </p>
        </div>
        <Button
          onClick={() => setIsAddStaffOpen(true)}
          size="sm"
          className="h-11 bg-zinc-950 text-white hover:bg-zinc-800 rounded-xl text-xs font-bold px-6 transition-all shadow-xl shadow-black/10 cursor-pointer active:scale-[0.98]"
        >
          <UserPlus className="h-4 w-4 mr-2" /> Add Staff
        </Button>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-8 md:grid-cols-3 mb-10">
        <div className="p-8 bg-white border border-zinc-200/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group">
          <div className="flex justify-between items-start mb-6">
            <div className="p-2.5 bg-zinc-50 text-zinc-900 rounded-xl group-hover:bg-zinc-950 group-hover:text-white transition-all">
              <Briefcase className="h-5 w-5" />
            </div>
          </div>
          <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">Total Vendors</label>
          <div className="text-3xl font-extrabold tracking-tight">{stats?.totalVendorCount || 0}</div>
          <button className="mt-6 text-[10px] font-bold text-zinc-400 hover:text-zinc-900 transition-colors uppercase tracking-widest flex items-center gap-1 cursor-pointer">
            Manage vendors <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div className="p-8 bg-white border border-zinc-200/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group">
          <div className="flex justify-between items-start mb-6">
            <div className="p-2.5 bg-zinc-50 text-zinc-900 rounded-xl group-hover:bg-zinc-950 group-hover:text-white transition-all">
              <Users className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Active</span>
            </div>
          </div>
          <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">Total Staff</label>
          <div className="text-3xl font-extrabold tracking-tight">{Math.max(0, (stats?.totalEmployeeCount || 0) - 1)}</div>
          <div className="mt-6 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Across all shifts</div>
        </div>

        <div className="p-8 bg-white border border-zinc-200/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group">
          <div className="flex justify-between items-start mb-6">
            <div className="p-2.5 bg-zinc-50 text-zinc-900 rounded-xl group-hover:bg-zinc-950 group-hover:text-white transition-all">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">Today's Revenue</label>
          <div className="text-3xl font-extrabold tracking-tight text-emerald-600">Rs. {(stats?.todayRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className="mt-6 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">From {stats?.todaySalesCount || 0} sales today</div>
        </div>
      </div>

      {/* Activity & Logs */}
      <div className="grid gap-8 md:grid-cols-2">
        <div className="bg-white border border-zinc-200/50 rounded-3xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 px-8 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
            <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-zinc-400" /> Recent Purchases
            </h3>
          </div>
          <div className="flex-1 p-0">
            {!stats?.recentPurchases || stats.recentPurchases.length === 0 ? (
              <div className="p-24 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center mb-6">
                  <Activity className="h-8 w-8 text-zinc-200" strokeWidth={1.5} />
                </div>
                <p className="text-xs font-bold text-zinc-400 italic">No recent purchases recorded.</p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-100">
                {stats.recentPurchases.map(purchase => (
                  <div 
                    key={purchase.id} 
                    onClick={() => setSelectedPurchaseId(purchase.id)}
                    className="p-6 flex items-center justify-between hover:bg-zinc-50/80 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-zinc-100 text-zinc-600 rounded-xl flex items-center justify-center font-bold text-xs group-hover:bg-zinc-950 group-hover:text-white transition-colors">
                        {purchase.vendorName.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-zinc-900 group-hover:text-zinc-950 transition-colors">{purchase.vendorName}</p>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">{purchase.invoiceNumber} • {new Date(purchase.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-extrabold text-zinc-900">Rs. {purchase.totalAmount.toFixed(2)}</p>
                      <p className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${purchase.paymentStatus === 'Paid' ? 'text-emerald-500' : 'text-orange-500'}`}>
                        {purchase.paymentStatus}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-zinc-200/50 rounded-3xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 px-8 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
            <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-zinc-400" /> Low Stock Alerts
            </h3>
            {(stats?.lowStockCount || 0) > 0 && (
              <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                {stats?.lowStockCount} Total
              </span>
            )}
          </div>
          <div className="flex-1 p-0">
            {!stats?.lowStockParts || stats.lowStockParts.length === 0 ? (
              <div className="p-24 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
                  <FileText className="h-8 w-8 text-emerald-400" strokeWidth={1.5} />
                </div>
                <p className="text-xs font-bold text-emerald-600">All inventory levels are healthy.</p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-100">
                {stats.lowStockParts.map(part => (
                  <div 
                    key={part.id} 
                    onClick={() => setSelectedPartId(part.id)}
                    className="p-6 flex items-center justify-between hover:bg-red-50/50 transition-all cursor-pointer group"
                  >
                    <div>
                      <p className="text-sm font-bold text-zinc-900 group-hover:text-red-900 transition-colors">{part.name}</p>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">SKU: {part.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-extrabold text-red-600">{part.stockQuantity} in stock</p>
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">Reorder threshold: {part.minThreshold}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <AddStaffModal
        isOpen={isAddStaffOpen}
        onClose={() => setIsAddStaffOpen(false)}
      />

      <ViewPurchaseModal
        isOpen={!!selectedPurchaseId}
        onClose={() => setSelectedPurchaseId(null)}
        purchaseId={selectedPurchaseId}
      />

      <EditPartModal
        isOpen={!!selectedPartId}
        onClose={() => setSelectedPartId(null)}
        part={selectedPart}
      />
    </>
  );
}
