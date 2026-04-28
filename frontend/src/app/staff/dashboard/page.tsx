'use client';

import React from 'react';
import { 
  Users, 
  Package, 
  Receipt, 
  TrendingUp, 
  Plus, 
  UserPlus, 
  Search, 
  ArrowUpRight,
  AlertCircle,
  Clock
} from 'lucide-react';
import Link from 'next/link';

export default function StaffDashboard() {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-900">Operations Overview</h1>
          <p className="text-zinc-500 font-medium mt-1">Ready to serve your next customer? Here's what's happening today.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link 
            href="/staff/customers?action=register"
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-zinc-200 hover:border-zinc-300 text-zinc-900 rounded-2xl text-sm font-bold transition-all shadow-sm active:scale-95"
          >
            <UserPlus className="h-4 w-4" /> Register Customer
          </Link>
          <Link 
            href="/staff/sales?action=new"
            className="flex items-center gap-2 px-6 py-2.5 bg-zinc-950 text-white hover:bg-zinc-800 rounded-2xl text-sm font-bold transition-all shadow-xl shadow-black/10 active:scale-95"
          >
            <Plus className="h-4 w-4" /> Create Sale
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Today's Sales", value: "Rs. 45,250", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Parts Sold", value: "24 Units", icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "New Customers", value: "12", icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Pending Tasks", value: "5", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm hover:shadow-md transition-all group">
            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} w-max mb-4 group-hover:scale-110 transition-transform`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-2xl font-black text-zinc-900 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-extrabold text-zinc-900">Recent Sales</h2>
            <Link href="/staff/sales" className="text-xs font-bold text-zinc-400 hover:text-zinc-900 transition-colors uppercase tracking-widest">View All</Link>
          </div>
          
          <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50/50">
                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Invoice</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Customer</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Amount</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50 text-sm">
                  {[
                    { id: "#INV-8821", name: "Sahil Shrestha", amount: "Rs. 1,200", status: "Paid" },
                    { id: "#INV-8822", name: "Aarav Sharma", amount: "Rs. 4,500", status: "Partial" },
                    { id: "#INV-8823", name: "Priya Thapa", amount: "Rs. 850", status: "Paid" },
                    { id: "#INV-8824", name: "Binod Rai", amount: "Rs. 12,400", status: "Paid" },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-zinc-50/50 transition-colors cursor-pointer">
                      <td className="px-6 py-4 font-bold text-zinc-900">{row.id}</td>
                      <td className="px-6 py-4 font-medium text-zinc-500">{row.name}</td>
                      <td className="px-6 py-4 font-black text-zinc-900">{row.amount}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                          row.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Side Panel: Low Stock Alerts */}
        <div className="space-y-4">
          <div className="px-2">
            <h2 className="text-lg font-extrabold text-zinc-900">Critical Alerts</h2>
          </div>
          
          <div className="space-y-3">
            {[
              { part: "Mobile Oil 4T", sku: "OIL-4T", qty: 2 },
              { part: "Brake Pad (Front)", sku: "BRK-F", qty: 5 },
            ].map((alert, i) => (
              <div key={i} className="p-4 bg-white rounded-2xl border border-zinc-100 shadow-sm flex items-start gap-4">
                <div className="p-2 bg-red-50 text-red-500 rounded-xl">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900">{alert.part}</h4>
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-0.5">{alert.sku} • Stock: {alert.qty}</p>
                </div>
              </div>
            ))}
            
            <button className="w-full p-4 border-2 border-dashed border-zinc-100 hover:border-zinc-200 hover:bg-zinc-50 text-zinc-400 hover:text-zinc-600 rounded-2xl text-xs font-bold transition-all transition-all">
              Request Stock from Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
