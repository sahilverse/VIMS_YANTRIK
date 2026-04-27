'use client';

import React from 'react';
import { Vendor } from '@/types';
import { Edit3, Trash2, MoreHorizontal } from 'lucide-react';

interface VendorTableProps {
  vendors: Vendor[];
  isLoading: boolean;
  onEdit: (vendor: Vendor) => void;
  onDelete: (id: string) => void;
  deletePendingId?: string | null;
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-6 py-5"><div className="h-4 bg-zinc-100 rounded-lg w-40" /></td>
      <td className="px-6 py-5"><div className="h-4 bg-zinc-100 rounded-lg w-32" /></td>
      <td className="px-6 py-5"><div className="h-4 bg-zinc-100 rounded-lg w-40" /></td>
      <td className="px-6 py-5"><div className="h-4 bg-zinc-100 rounded-lg w-24" /></td>
      <td className="px-6 py-5"><div className="h-4 bg-zinc-100 rounded-lg w-20" /></td>
    </tr>
  );
}

export default function VendorTable({ vendors, isLoading, onEdit, onDelete, deletePendingId }: VendorTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white border border-zinc-200/50 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-100">
              <th className="px-6 py-4 text-left text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Company</th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Contact Person</th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Email</th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Phone</th>
              <th className="px-6 py-4 text-right text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}
          </tbody>
        </table>
      </div>
    );
  }

  if (!vendors || vendors.length === 0) {
    return (
      <div className="bg-white border border-zinc-200/50 rounded-2xl shadow-sm p-16 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center mb-6">
          <MoreHorizontal className="h-8 w-8 text-zinc-200" strokeWidth={1.5} />
        </div>
        <p className="text-sm font-bold text-zinc-400">No vendors found.</p>
        <p className="text-xs text-zinc-300 mt-1">Try adjusting your search or add a new vendor.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-zinc-200/50 rounded-2xl shadow-sm overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-zinc-100">
            <th className="px-6 py-4 text-left text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Company</th>
            <th className="px-6 py-4 text-left text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Contact Person</th>
            <th className="px-6 py-4 text-left text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Email</th>
            <th className="px-6 py-4 text-left text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Phone</th>
            <th className="px-6 py-4 text-right text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Actions</th>
          </tr>
        </thead>
        <tbody>
          {vendors.map((vendor) => (
            <tr
              key={vendor.id}
              className="border-b border-zinc-50 last:border-0 hover:bg-zinc-50/50 transition-colors"
            >
              <td className="px-6 py-5">
                <span className="text-sm font-bold text-zinc-900">{vendor.companyName}</span>
              </td>
              <td className="px-6 py-5">
                <span className="text-sm text-zinc-500">{vendor.contactPerson || '—'}</span>
              </td>
              <td className="px-6 py-5">
                <span className="text-sm text-zinc-500">{vendor.email || '—'}</span>
              </td>
              <td className="px-6 py-5">
                <span className="text-sm text-zinc-500">{vendor.phone || '—'}</span>
              </td>
              <td className="px-6 py-5">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEdit(vendor)}
                    className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-all cursor-pointer"
                    title="Edit"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(vendor.id)}
                    disabled={deletePendingId === vendor.id}
                    className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer disabled:opacity-50"
                    title="Delete Vendor"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
