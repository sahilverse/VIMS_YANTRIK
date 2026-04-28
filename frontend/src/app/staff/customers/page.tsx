'use client';

import React, { useState } from 'react';
import {
  Users,
  Search,
  UserPlus,
  Phone,
  MapPin,
  Car,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  ExternalLink,
  History,
  Mail
} from 'lucide-react';
import { useCustomerListQuery } from '@/hooks/api/useCustomerApi';
import { useDebounce } from '@/hooks/useDebounce';
import RegisterCustomerModal from '@/components/staff/RegisterCustomerModal';
import { Customer, Vehicle } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

export default function CustomersPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = useCustomerListQuery({
    pageNumber: page,
    pageSize: 10,
    search: debouncedSearch
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-900">Customer Directory</h1>
          <p className="text-zinc-500 text-sm font-medium mt-1">Search, register, and manage vehicle service records.</p>
        </div>

        <Button
          onClick={() => setIsRegisterOpen(true)}
          className="bg-zinc-950 text-white hover:bg-zinc-800 rounded-2xl h-12 px-6 font-bold transition-all shadow-xl shadow-black/10 active:scale-95 flex items-center gap-2 cursor-pointer"
        >
          <UserPlus className="h-5 w-5" /> Register Customer
        </Button>
      </div>

      {/* Main Card with Search and Table */}
      <div className="bg-white rounded-[2rem] border border-zinc-200/50 shadow-sm overflow-hidden">
        
        {/* Sleek Search Header */}
        <div className="p-6 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-extrabold tracking-tight">All Customers</h2>
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mt-1">
              {isLoading ? 'Scanning records...' : `${data?.totalCount || 0} Registered Entities`}
            </p>
          </div>

          <div className="relative w-full sm:w-80 group">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
            <input
              type="text"
              placeholder="Search by name, phone or plate..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full h-10 pl-11 pr-4 bg-zinc-50 border border-transparent focus:bg-white focus:border-zinc-200 rounded-xl text-sm font-medium transition-all outline-none"
            />
          </div>
        </div>

        {/* Customer List Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/30">
                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">ID</th>
                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Name</th>
                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Contact</th>
                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Email</th>
                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Vehicle Info</th>
                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Total Spend</th>
                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50 text-sm">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-8 py-6"><Skeleton className="h-4 w-16" /></td>
                    <td className="px-8 py-6"><Skeleton className="h-4 w-32" /></td>
                    <td className="px-8 py-6"><Skeleton className="h-4 w-24" /></td>
                    <td className="px-8 py-6"><Skeleton className="h-4 w-40" /></td>
                    <td className="px-8 py-6"><Skeleton className="h-8 w-48 rounded-xl" /></td>
                    <td className="px-8 py-6"><Skeleton className="h-4 w-20" /></td>
                    <td className="px-8 py-6"><Skeleton className="h-10 w-10 rounded-xl" /></td>
                  </tr>
                ))
              ) : data?.items?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center">
                      <div className="p-4 bg-zinc-50 rounded-full mb-4">
                        <Search className="h-8 w-8 text-zinc-300" />
                      </div>
                      <p className="text-zinc-900 font-bold">No customers found</p>
                      <p className="text-zinc-400 text-xs font-medium mt-1">Try a different search term or register a new customer.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                data?.items?.map((customer: Customer) => (
                  <tr key={customer.id} className="hover:bg-zinc-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <span className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">
                        {customer.customerCode}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-bold text-zinc-900 text-[15px]">{customer.fullName}</p>
                    </td>
                    <td className="px-8 py-6 text-zinc-600 font-medium">
                      {customer.phone}
                    </td>
                    <td className="px-8 py-6 text-zinc-600 font-medium">
                      {customer.email || '—'}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-wrap gap-2">
                        {customer.vehicles.map((v: Vehicle) => (
                          <div key={v.id} className="flex items-center gap-2 bg-zinc-50 border border-zinc-100 px-2.5 py-1.5 rounded-xl shadow-sm">
                            <span className="text-[10px] font-black text-zinc-950 tracking-wider uppercase border-r border-zinc-200 pr-2 mr-1">
                              {v.plateNumber}
                            </span>
                            <span className="text-[11px] font-bold text-zinc-500">{v.make} {v.model}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div>
                        <p className="font-black text-zinc-900 text-base">Rs. {customer.totalSpend.toLocaleString()}</p>
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-0.5">{customer.loyaltyPoints} Points</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/staff/customers/${customer.id}`}
                          className="p-2.5 hover:bg-zinc-100 rounded-xl text-zinc-400 hover:text-zinc-900 transition-all cursor-pointer"
                          title="View History"
                        >
                          <History className="h-5 w-5" />
                        </Link>
                        <Link
                          href={`/staff/sales?customerId=${customer.id}`}
                          className="p-2.5 hover:bg-zinc-100 rounded-xl text-zinc-400 hover:text-zinc-900 transition-all cursor-pointer"
                          title="New Sale"
                        >
                          <ExternalLink className="h-5 w-5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && data.totalCount > 10 && (
          <div className="px-8 py-6 border-t border-zinc-50 flex items-center justify-between bg-zinc-50/20">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
              Showing {Math.min(data.items.length, 10)} of {data.totalCount} customers
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="h-10 w-10 p-0 rounded-xl border-zinc-200 bg-white hover:bg-zinc-50 cursor-pointer shadow-sm"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                disabled={page * 10 >= data.totalCount}
                onClick={() => setPage(p => p + 1)}
                className="h-10 w-10 p-0 rounded-xl border-zinc-200 bg-white hover:bg-zinc-50 cursor-pointer shadow-sm"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <RegisterCustomerModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />
    </div>
  );
}
