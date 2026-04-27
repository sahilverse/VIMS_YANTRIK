'use client';

import React, { useState } from 'react';
import { useStaffListQuery, useToggleStaffStatusMutation } from '@/hooks/api/useUserApi';
import { UserDto } from '@/types';
import { Button } from '@/components/ui/button';
import { Search, UserPlus, ChevronLeft, ChevronRight } from 'lucide-react';
import StaffTable from '@/components/admin/StaffTable';
import AddStaffModal from '@/components/admin/AddStaffModal';
import EditStaffModal from '@/components/admin/EditStaffModal';

export default function StaffPage() {
  const [search, setSearch] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<UserDto | null>(null);

  const pageSize = 10;
  const { data, isLoading } = useStaffListQuery({ pageNumber, pageSize, search });
  const toggleMutation = useToggleStaffStatusMutation();

  const paged = data?.data;
  const staff = paged?.items ?? [];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPageNumber(1);
  };

  return (
    <>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Staff Management</h1>
          <p className="text-xs font-bold text-zinc-400 mt-1 uppercase tracking-wider">
            {paged ? `${paged.totalItems} team members` : 'Loading...'}
          </p>
        </div>
        <Button
          onClick={() => setIsAddOpen(true)}
          size="sm"
          className="h-11 bg-zinc-950 text-white hover:bg-zinc-800 rounded-xl text-xs font-bold px-6 transition-all shadow-xl shadow-black/10 cursor-pointer active:scale-[0.98]"
        >
          <UserPlus className="h-4 w-4 mr-2" /> Add Staff
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md group">
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
          <input
            type="text"
            placeholder="Search by name, email, or code..."
            value={search}
            onChange={handleSearch}
            className="w-full h-11 pl-11 pr-4 bg-white border border-zinc-200/50 focus:border-zinc-300 rounded-xl text-sm font-medium transition-all outline-none shadow-sm"
          />
        </div>
      </div>

      {/* Table */}
      <StaffTable
        staff={staff}
        isLoading={isLoading}
        onEdit={(member) => setEditingStaff(member)}
        onToggleStatus={(id) => toggleMutation.mutate(id)}
        togglePendingId={toggleMutation.isPending ? (toggleMutation.variables as string) : null}
      />

      {/* Pagination */}
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

      {/* Modals */}
      <AddStaffModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
      <EditStaffModal isOpen={!!editingStaff} onClose={() => setEditingStaff(null)} staff={editingStaff} />
    </>
  );
}
