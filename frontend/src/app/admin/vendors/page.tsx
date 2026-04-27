'use client';

import React, { useState } from 'react';
import { useVendorListQuery, useDeleteVendorMutation } from '@/hooks/api/useVendorApi';
import { Vendor } from '@/types';
import { Button } from '@/components/ui/button';
import { Search, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import VendorTable from '@/components/admin/VendorTable';
import AddVendorModal from '@/components/admin/AddVendorModal';
import EditVendorModal from '@/components/admin/EditVendorModal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

export default function VendorsPage() {
  const [search, setSearch] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [vendorToDelete, setVendorToDelete] = useState<string | null>(null);

  const pageSize = 10;
  const { data, isLoading } = useVendorListQuery({ pageNumber, pageSize, search });
  const deleteMutation = useDeleteVendorMutation();

  const paged = data?.data;
  const vendors = paged?.items ?? [];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPageNumber(1);
  };

  const handleDeleteClick = (id: string) => {
    setVendorToDelete(id);
  };

  const confirmDelete = () => {
    if (vendorToDelete) {
      deleteMutation.mutate(vendorToDelete, {
        onSuccess: () => {
          setVendorToDelete(null);
        }
      });
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Vendor Management</h1>
          <p className="text-xs font-bold text-zinc-400 mt-1 uppercase tracking-wider">
            {paged ? `${paged.totalItems} suppliers` : 'Loading...'}
          </p>
        </div>
        <Button
          onClick={() => setIsAddOpen(true)}
          size="sm"
          className="h-11 bg-zinc-950 text-white hover:bg-zinc-800 rounded-xl text-xs font-bold px-6 transition-all shadow-xl shadow-black/10 cursor-pointer active:scale-[0.98]"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Vendor
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md group">
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
          <input
            type="text"
            placeholder="Search by company name, email, or contact person..."
            value={search}
            onChange={handleSearch}
            className="w-full h-11 pl-11 pr-4 bg-white border border-zinc-200/50 focus:border-zinc-300 rounded-xl text-sm font-medium transition-all outline-none shadow-sm"
          />
        </div>
      </div>

      <VendorTable
        vendors={vendors}
        isLoading={isLoading}
        onEdit={(vendor) => setEditingVendor(vendor)}
        onDelete={handleDeleteClick}
        deletePendingId={deleteMutation.isPending ? (deleteMutation.variables as string) : null}
      />

      {paged && paged.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-xs font-bold text-zinc-400">
            Page {paged.pageNumber} of {paged.totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
              disabled={!paged.hasPreviousPage}
              className="p-2.5 border border-zinc-200 rounded-xl text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPageNumber((p) => p + 1)}
              disabled={!paged.hasNextPage}
              className="p-2.5 border border-zinc-200 rounded-xl text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <AddVendorModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
      <EditVendorModal isOpen={!!editingVendor} onClose={() => setEditingVendor(null)} vendor={editingVendor} />

      <ConfirmModal
        isOpen={!!vendorToDelete}
        title="Delete Vendor"
        description="Are you sure you want to delete this vendor? This action cannot be undone and will remove all associated data."
        confirmText="Delete Vendor"
        isDestructive
        isLoading={deleteMutation.isPending}
        onConfirm={confirmDelete}
        onClose={() => setVendorToDelete(null)}
      />
    </>
  );
}
