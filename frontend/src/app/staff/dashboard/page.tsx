'use client';

import React from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  Users, 
  FileText, 
  LogOut,
  Settings,
  Plus,
  AlertTriangle,
  ClipboardCheck,
  LayoutDashboard,
  Search,
  Bell,
  ArrowRight
} from 'lucide-react';

export default function StaffDashboard() {
  const { user, logout } = useAuth();

  return (
    <AuthGuard roles={['Staff', 'Admin']}>
      <div className="flex min-h-screen bg-white text-zinc-900 font-sans selection:bg-zinc-950 selection:text-white">
        {/* Modern Minimal Sidebar */}
        <aside className="w-64 border-r border-zinc-100 flex flex-col shrink-0 bg-white">
          <div className="p-8 flex items-center gap-3 mb-4">
            <div className="p-2 bg-zinc-950 text-white rounded-xl shadow-lg shadow-black/5">
              <Package className="h-5 w-5" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold tracking-tight">Staff Portal</span>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            <div className="px-4 py-3 bg-zinc-950 text-white text-sm font-bold rounded-xl flex items-center gap-3 shadow-xl shadow-black/10">
              <LayoutDashboard className="h-4 w-4" /> Overview
            </div>
            <button className="w-full px-4 py-3 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 text-sm font-bold rounded-xl flex items-center gap-3 transition-all text-left cursor-pointer group">
              <ClipboardCheck className="h-4 w-4 text-zinc-400 group-hover:text-zinc-900 transition-colors" /> Services
            </button>
            <button className="w-full px-4 py-3 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 text-sm font-bold rounded-xl flex items-center gap-3 transition-all text-left cursor-pointer group">
              <Package className="h-4 w-4 text-zinc-400 group-hover:text-zinc-900 transition-colors" /> Parts
            </button>
            <button className="w-full px-4 py-3 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 text-sm font-bold rounded-xl flex items-center gap-3 transition-all text-left cursor-pointer group">
              <Users className="h-4 w-4 text-zinc-400 group-hover:text-zinc-900 transition-colors" /> Customers
            </button>
            <button className="w-full px-4 py-3 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 text-sm font-bold rounded-xl flex items-center gap-3 transition-all text-left cursor-pointer group">
              <FileText className="h-4 w-4 text-zinc-400 group-hover:text-zinc-900 transition-colors" /> Invoices
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
                  placeholder="Search jobs, customers, or parts..." 
                  className="w-full h-11 pl-11 pr-4 bg-zinc-50 border border-transparent focus:bg-white focus:border-zinc-200 rounded-xl text-sm font-medium transition-all outline-none"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4 ml-8">
              <button className="p-2.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 rounded-xl transition-all mr-2 cursor-pointer">
                <Bell className="h-5 w-5" />
              </button>
              <Button variant="outline" className="h-11 border-zinc-200 rounded-xl text-xs font-bold px-6 hover:bg-zinc-50 transition-all cursor-pointer">
                <Package className="h-4 w-4 mr-2 text-zinc-400" /> Stock In
              </Button>
              <Button className="h-11 bg-zinc-950 text-white hover:bg-zinc-800 rounded-xl text-xs font-bold px-6 transition-all shadow-xl shadow-black/10 cursor-pointer active:scale-[0.98]">
                <Plus className="h-4 w-4 mr-2" /> New Job
              </Button>
            </div>
          </header>

          <div className="p-10">
            <div className="grid gap-8 md:grid-cols-4 mb-10">
              <div className="p-8 bg-white border border-zinc-200/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest block mb-4 group-hover:text-zinc-900 transition-colors">Active Jobs</label>
                <div className="text-4xl font-extrabold tracking-tight">0</div>
              </div>
              
              <div className="p-8 bg-white border border-zinc-200/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group cursor-pointer">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-400" />
                <div className="flex justify-between items-start mb-4">
                  <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest group-hover:text-zinc-900 transition-colors">Low Stock</label>
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                </div>
                <div className="text-4xl font-extrabold tracking-tight text-amber-600">0</div>
                <button className="mt-4 text-[10px] font-bold text-amber-600 hover:underline transition-all flex items-center gap-1 cursor-pointer">
                  View parts <ArrowRight className="h-3 w-3" />
                </button>
              </div>

              <div className="p-8 bg-white border border-zinc-200/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest block mb-4 group-hover:text-zinc-900 transition-colors">Today's Revenue</label>
                <div className="text-4xl font-extrabold tracking-tight">$0.00</div>
              </div>

              <div className="p-8 bg-white border border-zinc-200/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest block mb-4 group-hover:text-zinc-900 transition-colors">Pending</label>
                <div className="text-4xl font-extrabold tracking-tight">0</div>
              </div>
            </div>

            <div className="bg-white border border-zinc-200/50 rounded-3xl shadow-sm overflow-hidden">
              <div className="p-6 px-8 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                <h3 className="text-sm font-bold uppercase tracking-widest">Recent Activity</h3>
                <Button variant="ghost" className="text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-100 px-4 h-8 rounded-lg transition-all">View All</Button>
              </div>
              <div className="p-24 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-zinc-50 rounded-2xl flex items-center justify-center mb-6">
                  <ClipboardCheck className="h-10 w-10 text-zinc-200" strokeWidth={1.5} />
                </div>
                <p className="text-lg font-bold mb-2 text-zinc-900">No activity yet.</p>
                <p className="text-sm font-medium text-zinc-400 max-w-xs">New service jobs and sales will be recorded here.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
