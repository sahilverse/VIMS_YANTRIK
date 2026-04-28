import React, { useState } from 'react';
import { usePartListQuery, useDeletePartMutation } from '@/hooks/api/useInventoryApi';
import { useDebounce } from '@/hooks/useDebounce';
import { Part } from '@/types';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import EditPartModal from './EditPartModal';
import { Edit2, Trash2, Search, Loader2, AlertCircle, Package } from 'lucide-react';

export default function PartTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;

  const [partToEdit, setPartToEdit] = useState<Part | null>(null);
  const [partToDelete, setPartToDelete] = useState<string | null>(null);

  const { data: response, isLoading } = usePartListQuery({
    pageNumber,
    pageSize,
    search: debouncedSearch,
  });

  const deleteMutation = useDeletePartMutation();

  const paged = response?.data;
  const parts = paged?.items || [];
  const totalPages = paged?.totalPages || 1;

  const handleDelete = () => {
    if (partToDelete) {
      deleteMutation.mutate(partToDelete, {
        onSuccess: () => setPartToDelete(null),
      });
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPageNumber(1);
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-zinc-200/50 overflow-hidden">
      <div className="p-6 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight">Inventory Parts</h2>
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">
            {paged ? `${paged.totalItems} Items` : 'Loading...'}
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by SKU or Name..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full h-10 pl-10 pr-4 bg-zinc-50 border border-transparent focus:bg-white focus:border-zinc-300 rounded-xl text-sm font-medium transition-all outline-none"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50/50">
              <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest whitespace-nowrap">Part Details</th>
              <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest whitespace-nowrap">Category</th>
              <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest whitespace-nowrap text-right">Pricing</th>
              <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest whitespace-nowrap text-center">Stock</th>
              <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest whitespace-nowrap text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <Loader2 className="h-6 w-6 text-zinc-300 animate-spin mx-auto mb-2" />
                  <p className="text-xs font-bold text-zinc-400">Loading inventory...</p>
                </td>
              </tr>
            ) : parts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-50 mb-3">
                    <Package className="h-5 w-5 text-zinc-300" />
                  </div>
                  <p className="text-sm font-bold text-zinc-900">No parts found</p>
                  <p className="text-xs text-zinc-500 mt-1">Try adjusting your search criteria</p>
                </td>
              </tr>
            ) : (
              parts.map((part) => {
                const isLowStock = part.stockQuantity <= part.minThreshold;

                return (
                  <tr key={part.id} className="hover:bg-zinc-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-zinc-100 rounded-xl">
                          <Package className="h-4 w-4 text-zinc-500" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-zinc-900">{part.name}</div>
                          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">SKU: {part.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-600 uppercase tracking-widest">
                        {part.categoryName || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-sm font-bold text-zinc-900">Rs. {part.unitPrice.toFixed(2)}</div>
                      <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">
                        Cost: Rs. {part.costPrice.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-center justify-center">
                        <span className={`text-sm font-extrabold ${isLowStock ? 'text-red-600' : 'text-zinc-900'}`}>
                          {part.stockQuantity}
                        </span>
                        {isLowStock && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 mt-1 uppercase tracking-widest">
                            <AlertCircle className="h-3 w-3" /> Low Stock
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setPartToEdit(part)}
                          className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-all cursor-pointer"
                          title="Edit Part"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setPartToDelete(part.id)}
                          className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                          title="Delete Part"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
            Page {pageNumber} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={pageNumber === 1}
              onClick={() => setPageNumber(p => Math.max(1, p - 1))}
              className="px-4 py-2 text-xs font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-white border border-zinc-200 hover:bg-zinc-50 cursor-pointer"
            >
              Previous
            </button>
            <button
              disabled={pageNumber === totalPages}
              onClick={() => setPageNumber(p => Math.min(totalPages, p + 1))}
              className="px-4 py-2 text-xs font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-white border border-zinc-200 hover:bg-zinc-50 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {partToEdit && (
        <EditPartModal
          isOpen={!!partToEdit}
          onClose={() => setPartToEdit(null)}
          part={partToEdit}
        />
      )}

      <ConfirmModal
        isOpen={!!partToDelete}
        onClose={() => setPartToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Part"
        description="Are you sure you want to delete this part? This action cannot be undone."
        confirmText={deleteMutation.isPending ? "Deleting..." : "Delete"}
        isDestructive={true}
      />
    </div>
  );
}
