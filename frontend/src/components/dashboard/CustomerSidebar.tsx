'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Car,
  Calendar,
  History,
  Settings,
  LogOut,
  LayoutDashboard,
  Package,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function CustomerSidebar() {
  const { logout } = useAuth();
  const pathname = usePathname();

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Vehicles', href: '/dashboard/vehicles', icon: Car },
    { name: 'Appointments', href: '/dashboard/appointments', icon: Calendar },
    { name: 'Parts Store', href: '/dashboard/store', icon: Package },
    { name: 'History', href: '/dashboard/history', icon: History },
  ];

  return (
    <aside className="w-64 border-r border-zinc-100 flex flex-col shrink-0 bg-white min-h-screen sticky top-0">
      <div className="p-8 flex items-center gap-3 mb-4">
        <div className="p-2 bg-zinc-950 text-white rounded-xl shadow-lg shadow-black/5">
          <Car className="h-5 w-5" strokeWidth={2.5} />
        </div>
        <span className="text-xl font-bold tracking-tight">Yantrik</span>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "w-full px-4 py-3 text-sm font-bold rounded-xl flex items-center gap-3 transition-all",
                isActive
                  ? "bg-zinc-950 text-white shadow-xl shadow-black/10"
                  : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
              )}
            >
              <item.icon className={cn("h-4 w-4", isActive ? "text-white" : "text-zinc-400 group-hover:text-zinc-900")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-zinc-50 space-y-1">
        <Link 
          href="/dashboard/settings"
          className={cn(
            "w-full px-4 py-3 text-sm font-bold rounded-xl flex items-center gap-3 transition-all",
            pathname === '/dashboard/settings'
              ? "bg-zinc-950 text-white shadow-xl shadow-black/10"
              : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 group"
          )}
        >
          <Settings className={cn("h-4 w-4 transition-colors", pathname === '/dashboard/settings' ? "text-white" : "text-zinc-400 group-hover:text-zinc-900")} /> Settings
        </Link>
        <button
          onClick={logout}
          className="w-full px-4 py-3 text-red-500 hover:bg-red-50 text-sm font-bold rounded-xl flex items-center gap-3 transition-all text-left cursor-pointer group"
        >
          <LogOut className="h-4 w-4 text-red-400 group-hover:text-red-500 transition-colors" /> Log Out
        </button>
      </div>
    </aside>
  );
}
