'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useAuth } from '@/context/AuthContext';
import {
  Shield,
  LayoutDashboard,
  Users,
  Truck,
  Package,
  Receipt,
  BarChart4,
  Settings,
  LogOut,
  Search,
  Bell
} from 'lucide-react';

const navItems = [
  { label: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Staff', href: '/admin/staff', icon: Users },
  { label: 'Vendors', href: '/admin/vendors', icon: Truck },
  { label: 'Inventory', href: '/admin/inventory', icon: Package },
  { label: 'Purchases', href: '/admin/purchases', icon: Receipt },
  { label: 'Reports', href: '/admin/reports', icon: BarChart4 },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <AuthGuard roles={['Admin']}>
      <div className="flex min-h-screen bg-white text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white">
        {/* Sidebar */}
        <aside className="w-64 border-r border-zinc-100 flex flex-col shrink-0 bg-white sticky top-0 h-screen">
          <div className="p-8 flex items-center gap-3 mb-4">
            <div className="p-2 bg-zinc-950 text-white rounded-xl shadow-lg shadow-black/5">
              <Shield className="h-5 w-5" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold tracking-tight">Admin</span>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`w-full px-4 py-3 text-sm font-bold rounded-xl flex items-center gap-3 transition-all ${
                    isActive
                      ? 'bg-zinc-950 text-white shadow-xl shadow-black/10'
                      : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 group'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? '' : 'text-zinc-400 group-hover:text-zinc-900 transition-colors'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 mt-auto border-t border-zinc-50 space-y-1">
            <Link
              href="/admin/settings"
              className="w-full px-4 py-3 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 text-sm font-bold rounded-xl flex items-center gap-3 transition-all group"
            >
              <Settings className="h-4 w-4 text-zinc-400 group-hover:text-zinc-900 transition-colors" /> Settings
            </Link>
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
              </div>
            </div>
          </header>

          <div className="p-10">
            {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
