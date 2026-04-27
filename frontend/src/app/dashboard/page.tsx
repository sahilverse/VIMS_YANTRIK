'use client';

import React from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Car, 
  Calendar, 
  History, 
  CreditCard, 
  Settings, 
  LogOut,
  ChevronRight,
  Plus,
  LayoutDashboard,
  Bell
} from 'lucide-react';

export default function CustomerDashboard() {
  const { user, logout } = useAuth();

  return (
    <AuthGuard roles={['Customer']}>
      <div className="flex min-h-screen bg-white text-zinc-900 font-sans selection:bg-zinc-950 selection:text-white">
        {/* Modern Minimal Sidebar */}
        <aside className="w-64 border-r border-zinc-100 flex flex-col shrink-0 bg-white">
          <div className="p-8 flex items-center gap-3 mb-4">
            <div className="p-2 bg-zinc-950 text-white rounded-xl shadow-lg shadow-black/5">
              <Car className="h-5 w-5" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold tracking-tight">Yantrik</span>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            <div className="px-4 py-3 bg-zinc-950 text-white text-sm font-bold rounded-xl flex items-center gap-3 shadow-xl shadow-black/10">
              <LayoutDashboard className="h-4 w-4" /> Overview
            </div>
            <button className="w-full px-4 py-3 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 text-sm font-bold rounded-xl flex items-center gap-3 transition-all text-left cursor-pointer group">
              <Car className="h-4 w-4 text-zinc-400 group-hover:text-zinc-900 transition-colors" /> My Vehicles
            </button>
            <button className="w-full px-4 py-3 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 text-sm font-bold rounded-xl flex items-center gap-3 transition-all text-left cursor-pointer group">
              <Calendar className="h-4 w-4 text-zinc-400 group-hover:text-zinc-900 transition-colors" /> Appointments
            </button>
            <button className="w-full px-4 py-3 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 text-sm font-bold rounded-xl flex items-center gap-3 transition-all text-left cursor-pointer group">
              <History className="h-4 w-4 text-zinc-400 group-hover:text-zinc-900 transition-colors" /> History
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
            <h1 className="text-xl font-bold tracking-tight">Dashboard</h1>
            <div className="flex items-center gap-6">
              <button className="p-2.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 rounded-xl transition-all cursor-pointer">
                <Bell className="h-5 w-5" />
              </button>
              <div className="h-8 w-px bg-zinc-100" />
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-zinc-900">{user?.fullName}</p>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Customer</p>
                </div>
                <Button className="h-11 bg-zinc-950 text-white hover:bg-zinc-800 rounded-xl text-xs font-bold px-6 transition-all shadow-xl shadow-black/10 cursor-pointer active:scale-[0.98]">
                  <Plus className="h-4 w-4 mr-2" /> Add Vehicle
                </Button>
              </div>
            </div>
          </header>

          <div className="p-10 space-y-10">
            <div className="grid gap-8 md:grid-cols-3">
              {/* Profile Card */}
              <div className="p-8 bg-white border border-zinc-200/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-52 cursor-pointer group">
                <div>
                  <label className="text-[11px] font-bold text-zinc-400 mb-4 block uppercase tracking-widest group-hover:text-zinc-900 transition-colors">My Profile</label>
                  <h3 className="text-2xl font-bold truncate text-zinc-900">{user?.fullName}</h3>
                  <p className="text-xs font-medium text-zinc-500 mt-1">{user?.email}</p>
                </div>
                <button className="flex items-center text-[10px] font-bold text-zinc-900 uppercase tracking-widest hover:underline cursor-pointer group">
                  Edit Details <ChevronRight className="h-3 w-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              {/* Reward/Status Card */}
              <div className="p-8 bg-white border border-zinc-200/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 h-52 flex flex-col justify-center items-center text-center cursor-pointer group">
                <label className="text-[11px] font-bold text-zinc-400 mb-4 block uppercase tracking-widest group-hover:text-zinc-900 transition-colors">Membership</label>
                <div className="text-4xl font-extrabold tracking-tight text-zinc-900">0</div>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-4 px-4 py-1.5 bg-zinc-50 rounded-full">Bronze Status</p>
              </div>

              {/* Action Card */}
              <div className="p-8 bg-white border border-zinc-200/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 space-y-4 h-52 flex flex-col justify-center">
                <Button variant="outline" className="w-full justify-start text-[11px] font-bold uppercase tracking-widest h-12 border-zinc-200 rounded-xl cursor-pointer px-5 hover:bg-zinc-50 transition-all">
                  <Calendar className="h-4 w-4 mr-3 text-zinc-400" /> Book Service
                </Button>
                <Button variant="outline" className="w-full justify-start text-[11px] font-bold uppercase tracking-widest h-12 border-zinc-200 rounded-xl cursor-pointer px-5 hover:bg-zinc-50 transition-all">
                  <CreditCard className="h-4 w-4 mr-3 text-zinc-400" /> Make Payment
                </Button>
              </div>

              {/* Main Data Section */}
              <div className="md:col-span-3 bg-white border border-zinc-200/50 rounded-3xl shadow-sm overflow-hidden mt-2">
                <div className="p-6 px-10 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                  <h3 className="text-sm font-bold uppercase tracking-widest">Your Vehicles</h3>
                </div>
                <div className="p-24 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-zinc-50 rounded-2xl flex items-center justify-center mb-6">
                    <Car className="h-10 w-10 text-zinc-200" strokeWidth={1.5} />
                  </div>
                  <p className="text-lg font-bold mb-2 text-zinc-900">No vehicles added yet.</p>
                  <p className="text-sm font-medium text-zinc-400 max-w-xs">Register your first vehicle to track service history and receive maintenance alerts.</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
