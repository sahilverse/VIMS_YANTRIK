'use client';

import React from 'react';
import { Bell, Package, Check, Clock, AlertTriangle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useNotificationApi } from '@/hooks/api/useNotificationApi';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

export default function NotificationDropdown() {
  const { 
    notifications, 
    unreadCount,
    isLoading, 
    markAsRead, 
    markAllAsRead 
  } = useNotificationApi('StockAlert');

  const stockAlerts = notifications || [];
  const unreadStockCount = unreadCount;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button className="p-2.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 rounded-xl transition-all relative cursor-pointer group active:scale-95">
          <Bell className={cn("h-5 w-5 transition-transform group-hover:rotate-12", unreadStockCount > 0 && "text-zinc-950 font-bold")} />
          {unreadStockCount > 0 && (
            <span className="absolute top-2 right-2 h-4 min-w-[1rem] px-1 bg-red-500 text-[10px] font-black text-white rounded-full border-2 border-white flex items-center justify-center animate-in zoom-in duration-300">
              {unreadStockCount > 9 ? '9+' : unreadStockCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        align="end" 
        className="w-80 p-0 rounded-[2rem] border-zinc-100 shadow-2xl shadow-black/10 overflow-hidden animate-in slide-in-from-top-2 duration-300 z-[110]"
      >
        <div className="p-5 border-b border-zinc-50 flex items-center justify-between bg-zinc-50/50">
          <div>
            <h3 className="text-sm font-black text-zinc-900 uppercase tracking-tighter">Inventory Alerts</h3>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">
              {unreadStockCount} Unread Notifications
            </p>
          </div>
          {unreadStockCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => markAllAsRead.mutate()}
              className="h-8 px-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 hover:bg-white shadow-sm transition-all"
            >
              <Check className="h-3 w-3 mr-1" /> Clear
            </Button>
          )}
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="p-10 flex flex-col items-center justify-center gap-3">
              <div className="h-5 w-5 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Checking Stock...</p>
            </div>
          ) : stockAlerts.length === 0 ? (
            <div className="p-10 text-center">
              <div className="h-12 w-12 bg-zinc-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Check className="h-6 w-6 text-zinc-200" />
              </div>
              <p className="text-xs font-bold text-zinc-900">All sets!</p>
              <p className="text-[10px] font-medium text-zinc-400 mt-1">Inventory is healthy.</p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-50">
              {stockAlerts.map((n) => (
                <DropdownMenuItem
                  key={n.id}
                  onClick={() => !n.isRead && markAsRead.mutate(n.id)}
                  className={cn(
                    "p-4 flex gap-4 cursor-pointer transition-colors focus:bg-zinc-50 outline-none",
                    !n.isRead ? "bg-white" : "opacity-60"
                  )}
                >
                  <div className={cn(
                    "h-10 w-10 shrink-0 rounded-xl flex items-center justify-center transition-all",
                    !n.isRead ? "bg-amber-50 text-amber-600 shadow-sm" : "bg-zinc-50 text-zinc-400"
                  )}>
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className={cn(
                      "text-[11px] leading-relaxed font-bold tracking-tight",
                      !n.isRead ? "text-zinc-900" : "text-zinc-500"
                    )}>
                      {n.message}
                    </p>
                    <div className="flex items-center gap-2 text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                    </div>
                  </div>
                  {!n.isRead && (
                    <div className="h-2 w-2 rounded-full bg-amber-500 mt-1 shrink-0 shadow-sm" />
                  )}
                </DropdownMenuItem>
              ))}
            </div>
          )}
        </div>

        <div className="p-3 bg-white border-t border-zinc-50">
          <Button 
            variant="ghost" 
            className="w-full h-10 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 transition-all"
            onClick={() => window.location.href = '/admin/inventory'}
          >
            Manage Inventory
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
