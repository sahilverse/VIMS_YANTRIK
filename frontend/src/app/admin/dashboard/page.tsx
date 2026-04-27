'use client';

import React from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Shield,
  BarChart4,
  Users,
  Settings,
  LogOut,
  UserPlus,
  TrendingUp,
  Activity,
  LayoutDashboard,
  ArrowRight,
  FileText,
  Search,
  Bell
} from 'lucide-react';
import AddStaffModal from '@/components/admin/AddStaffModal';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

  return (
    <AuthGuard roles={['Admin']}>
      <div className="flex min-h-screen bg-white text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white">
        {/* Modern Minimal Sidebar */}
        <aside className="w-64 border-r border-zinc-100 flex flex-col shrink-0 bg-white">
          <div className="p-8 flex items-center gap-3 mb-4">
            <div className="p-2 bg-zinc-950 text-white rounded-xl shadow-lg shadow-black/5">
              <Shield className="h-5 w-5" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold tracking-tight">Admin</span>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            <div className="px-4 py-3 bg-zinc-950 text-white text-sm font-bold rounded-xl flex items-center gap-3 shadow-xl shadow-black/10">
              <LayoutDashboard className="h-4 w-4" /> Overview
            </div>
            <button className="w-full px-4 py-3 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 text-sm font-bold rounded-xl flex items-center gap-3 transition-all text-left cursor-pointer group">
              <BarChart4 className="h-4 w-4 text-zinc-400 group-hover:text-zinc-900 transition-colors" /> Reports
            </button>
            <button className="w-full px-4 py-3 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 text-sm font-bold rounded-xl flex items-center gap-3 transition-all text-left cursor-pointer group">
              <Users className="h-4 w-4 text-zinc-400 group-hover:text-zinc-900 transition-colors" /> Staff
            </button>
            <button className="w-full px-4 py-3 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 text-sm font-bold rounded-xl flex items-center gap-3 transition-all text-left cursor-pointer group">
              <FileText className="h-4 w-4 text-zinc-400 group-hover:text-zinc-900 transition-colors" /> Activity Logs
            </button>
          </nav>

          <div className="p-4 mt-auto border-t border-zinc-50 space-y-1">
            <button className="w-full px-4 py-3 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 text-sm font-bold rounded-xl flex items-center gap-3 transition-all text-left cursor-pointer group">
              <Settings className="h-4 w-4 text-zinc-400 group-hover:text-zinc-900 transition-colors" /> Settings
            </button>
            <button
              onClick={logout}
              className="w-full px-4 py-3 text-red-500 hover:bg-red-50 text-sm font-bold rounded-xl flex items-center gap-3 transition-all text-left cursor-pointer group"
            >
              <LogOut className="h-4 w-4 text-red-400 group-hover:text-red-500 transition-colors" /> Log Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-zinc-50/30">
          <header className="h-20 border-b border-zinc-100 flex items-center justify-between px-10 sticky top-0 bg-white/80 backdrop-blur-md z-10">
            <div className="flex items-center gap-4 flex-1 max-w-xl">
              <div className="relative w-full group">
                <Search className="absolute left-4 top-3.5 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
                <input
                  type="text"
                  placeholder="Global search..."
                  className="w-full h-11 pl-11 pr-4 bg-zinc-50 border border-transparent focus:bg-white focus:border-zinc-200 rounded-xl text-sm font-medium transition-all outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-6 ml-8">
              <button className="p-2.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 rounded-xl transition-all relative cursor-pointer">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white" />
              </button>
              <div className="h-8 w-px bg-zinc-100 mx-2" />
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-zinc-900">{user?.fullName}</p>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Admin Account</p>
                </div>
                <Button 
                  onClick={() => setIsAddModalOpen(true)}
                  size="sm" 
                  className="h-11 bg-zinc-950 text-white hover:bg-zinc-800 rounded-xl text-xs font-bold px-6 transition-all shadow-xl shadow-black/10 cursor-pointer active:scale-[0.98]"
                >
                  <UserPlus className="h-4 w-4 mr-2" /> Add Staff
                </Button>
              </div>
            </div>
          </header>

          <div className="p-10 space-y-10">
            <div className="grid gap-8 md:grid-cols-3">
              {/* Refined Metric Cards */}
              <div className="p-8 bg-white border border-zinc-200/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-2.5 bg-zinc-50 text-zinc-900 rounded-xl group-hover:bg-zinc-950 group-hover:text-white transition-all">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 px-2 py-1 bg-emerald-50 rounded-full">+12.5%</span>
                </div>
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">Total Revenue</label>
                <div className="text-3xl font-extrabold tracking-tight">$0.00</div>
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
          </div>
        </main>
      </div>

      <AddStaffModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </AuthGuard>
  );
}
