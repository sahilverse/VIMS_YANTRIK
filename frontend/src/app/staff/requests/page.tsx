'use client';

import React, { useState } from 'react';
import { useAllRequestsQuery, useUpdateRequestStatusMutation } from '@/hooks/api/useRequestApi';
import { Loader2, ArchiveRestore, AlertCircle, Clock, CheckCircle2, XCircle, Search, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

const STATUS_OPTIONS = ['All', 'Pending', 'Reviewed', 'Ordered', 'Fulfilled', 'Cancelled'] as const;
type StatusOption = typeof STATUS_OPTIONS[number];

export default function StaffRequestsPage() {
  const [selectedStatus, setSelectedStatus] = useState<StatusOption>('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Pass undefined for 'All' to get everything, otherwise pass the status
  const filterValue = selectedStatus === 'All' ? undefined : selectedStatus;
  const { data: requestsData, isLoading, isError } = useAllRequestsQuery(filterValue);
  const updateMutation = useUpdateRequestStatusMutation();

  const requests = requestsData?.data || [];

  // Client-side search filtering (since backend doesn't have a search param for requests yet)
  const filteredRequests = requests.filter(req => 
    req.partName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.partSKU.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusChange = (id: string, newStatus: any) => {
    updateMutation.mutate({ id, data: { status: newStatus } });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <Clock className="h-4 w-4 text-amber-500" />;
      case 'Reviewed': return <Search className="h-4 w-4 text-blue-500" />;
      case 'Ordered': return <Package className="h-4 w-4 text-purple-500" />;
      case 'Fulfilled': return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case 'Cancelled': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-zinc-500" />;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Pending': return "bg-amber-50 text-amber-700 border-amber-200/50";
      case 'Reviewed': return "bg-blue-50 text-blue-700 border-blue-200/50";
      case 'Ordered': return "bg-purple-50 text-purple-700 border-purple-200/50";
      case 'Fulfilled': return "bg-emerald-50 text-emerald-700 border-emerald-200/50";
      case 'Cancelled': return "bg-red-50 text-red-700 border-red-200/50";
      default: return "bg-zinc-50 text-zinc-700 border-zinc-200/50";
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-[2rem] border border-zinc-200/50 shadow-sm">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-zinc-900 flex items-center gap-3">
            <ArchiveRestore className="h-7 w-7 text-zinc-400" />
            Part Requests
          </h1>
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">
            Manage customer out-of-stock requests
          </p>
        </div>
        <div className="relative group w-full sm:w-auto">
          <Search className="absolute left-4 top-3 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
          <Input
            placeholder="Search part or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 h-10 w-full sm:w-72 bg-zinc-50 border-zinc-100 focus:bg-white focus:border-zinc-200 rounded-xl transition-all text-xs font-bold"
          />
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {STATUS_OPTIONS.map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={cn(
              "px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border",
              selectedStatus === status
                ? "bg-zinc-950 text-white border-zinc-950 shadow-lg shadow-black/10"
                : "bg-white text-zinc-500 border-zinc-100 hover:border-zinc-300"
            )}
          >
            {status}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="h-96 flex flex-col items-center justify-center gap-4 bg-white rounded-[2.5rem] border border-zinc-200/50">
          <Loader2 className="h-10 w-10 text-zinc-900 animate-spin" strokeWidth={1.5} />
          <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Loading Requests...</p>
        </div>
      ) : isError ? (
        <div className="h-96 flex flex-col items-center justify-center gap-4 text-center bg-white rounded-[2.5rem] border border-zinc-200/50">
          <div className="p-4 bg-red-50 text-red-500 rounded-2xl">
            <AlertCircle className="h-10 w-10" />
          </div>
          <p className="text-lg font-bold text-zinc-900">Failed to load requests</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="py-24 flex flex-col items-center justify-center text-center bg-white border border-zinc-200/50 rounded-[2.5rem] shadow-sm">
          <div className="w-20 h-20 bg-zinc-50 rounded-2xl flex items-center justify-center mb-6">
            <ArchiveRestore className="h-10 w-10 text-zinc-200" strokeWidth={1.5} />
          </div>
          <h3 className="text-xl font-bold text-zinc-900 mb-2">No Requests Found</h3>
          <p className="text-sm font-medium text-zinc-400 max-w-xs mx-auto">
            {searchTerm || selectedStatus !== 'All' 
              ? "No requests match your current filters." 
              : "There are no part requests from customers at this time."}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-zinc-200/50 rounded-[2.5rem] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/50 border-b border-zinc-100">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Date</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Customer</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Part Details</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Current Status</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {filteredRequests.map((req: any) => (
                  <tr key={req.id} className="group hover:bg-zinc-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-zinc-900">
                          {new Date(req.createdAt).toLocaleDateString()}
                        </span>
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1">
                          {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-zinc-100 text-zinc-600 rounded-xl flex items-center justify-center font-bold text-sm">
                          {req.customerName.charAt(0)}
                        </div>
                        <span className="text-sm font-bold text-zinc-900">{req.customerName}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div>
                        <h4 className="text-sm font-bold text-zinc-900">{req.partName}</h4>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">SKU: {req.partSKU}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest w-fit border",
                        getStatusStyle(req.status)
                      )}>
                        {getStatusIcon(req.status)}
                        {req.status}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <select
                        value={req.status}
                        onChange={(e) => handleStatusChange(req.id, e.target.value)}
                        disabled={updateMutation.isPending}
                        className="bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs font-bold rounded-xl focus:ring-zinc-950 focus:border-zinc-950 block w-full p-2.5 cursor-pointer outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="Pending">Mark Pending</option>
                        <option value="Reviewed">Mark Reviewed</option>
                        <option value="Ordered">Mark Ordered</option>
                        <option value="Fulfilled">Mark Fulfilled</option>
                        <option value="Cancelled">Cancel Request</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
