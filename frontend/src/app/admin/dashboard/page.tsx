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
} from 'lucide-react';
import AddStaffModal from '@/components/admin/AddStaffModal';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

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
          onClick={() => setIsAddModalOpen(true)}
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
              <TrendingUp className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold text-emerald-600 px-2 py-1 bg-emerald-50 rounded-full">+12.5%</span>
          </div>
          <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">Total Revenue</label>
          <div className="text-3xl font-extrabold tracking-tight">Rs. 0.00</div>
          <button className="mt-6 text-[10px] font-bold text-zinc-400 hover:text-zinc-900 transition-colors uppercase tracking-widest flex items-center gap-1 cursor-pointer">
            View full report <ArrowRight className="h-3 w-3" />
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
          <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">Staff Online</label>
          <div className="text-3xl font-extrabold tracking-tight">1</div>
          <div className="mt-6 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Across all shifts</div>
        </div>

        <div className="p-8 bg-white border border-zinc-200/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group">
          <div className="flex justify-between items-start mb-6">
            <div className="p-2.5 bg-zinc-50 text-zinc-900 rounded-xl group-hover:bg-zinc-950 group-hover:text-white transition-all">
              <Activity className="h-5 w-5" />
            </div>
          </div>
          <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">System Status</label>
          <div className="text-3xl font-extrabold tracking-tight text-emerald-500">Normal</div>
          <div className="mt-6 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">All services operational</div>
        </div>
      </div>

      {/* Activity & Logs */}
      <div className="grid gap-8 md:grid-cols-2">
        <div className="bg-white border border-zinc-200/50 rounded-3xl shadow-sm overflow-hidden">
          <div className="p-6 px-8 border-b border-zinc-100 flex justify-between items-center">
            <h3 className="text-sm font-bold uppercase tracking-widest">Recent Activity</h3>
          </div>
          <div className="p-24 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center mb-6">
              <Activity className="h-8 w-8 text-zinc-200" strokeWidth={1.5} />
            </div>
            <p className="text-xs font-bold text-zinc-400 italic">No recent events recorded.</p>
          </div>
        </div>

        <div className="bg-white border border-zinc-200/50 rounded-3xl shadow-sm overflow-hidden">
          <div className="p-6 px-8 border-b border-zinc-100 flex justify-between items-center">
            <h3 className="text-sm font-bold uppercase tracking-widest">System Logs</h3>
          </div>
          <div className="p-24 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center mb-6">
              <FileText className="h-8 w-8 text-zinc-200" strokeWidth={1.5} />
            </div>
            <p className="text-xs font-bold text-zinc-400 italic">No logs detected.</p>
          </div>
        </div>
      </div>

      <AddStaffModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </>
  );
}
