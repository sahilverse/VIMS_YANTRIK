import React, { useState } from 'react';
import { useCategoryListQuery, useDeleteCategoryMutation } from '@/hooks/api/useInventoryApi';
import { Category } from '@/types';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import EditCategoryModal from './EditCategoryModal';
import { Edit2, Trash2, Search, Loader2 } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

export default function CategoryTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const { data: response, isLoading } = useCategoryListQuery();
  const deleteMutation = useDeleteCategoryMutation();

  const categories = response?.data || [];

  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    (c.description && c.description.toLowerCase().includes(debouncedSearch.toLowerCase()))
  );

  const handleDelete = () => {
    if (categoryToDelete) {
      deleteMutation.mutate(categoryToDelete, {
        onSuccess: () => setCategoryToDelete(null),
      });
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-zinc-200/50 overflow-hidden">
      <div className="p-6 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight">Categories</h2>
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">
            {categories.length} Total Classifications
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-zinc-50 border border-transparent focus:bg-white focus:border-zinc-300 rounded-xl text-sm font-medium transition-all outline-none"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50/50">
              <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest whitespace-nowrap">Category Name</th>
              <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest whitespace-nowrap">Description</th>
              <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest whitespace-nowrap text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {isLoading ? (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center">
                  <Loader2 className="h-6 w-6 text-zinc-300 animate-spin mx-auto mb-2" />
                  <p className="text-xs font-bold text-zinc-400">Loading categories...</p>
                </td>
              </tr>
            ) : filteredCategories.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-50 mb-3">
                    <Search className="h-5 w-5 text-zinc-300" />
                  </div>
                  <p className="text-sm font-bold text-zinc-900">No categories found</p>
                  <p className="text-xs text-zinc-500 mt-1">Try adjusting your search</p>
                </td>
              </tr>
            ) : (
              filteredCategories.map((category) => (
                <tr key={category.id} className="hover:bg-zinc-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-zinc-900">{category.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs font-medium text-zinc-500 max-w-md truncate">
                      {category.description || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setCategoryToEdit(category)}
                        className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-all cursor-pointer"
                        title="Edit Category"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setCategoryToDelete(category.id)}
                        className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                        title="Delete Category"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <EditCategoryModal
        isOpen={!!categoryToEdit}
        onClose={() => setCategoryToEdit(null)}
        category={categoryToEdit}
      />

      <ConfirmModal
        isOpen={!!categoryToDelete}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Category"
        description="Are you sure you want to delete this category? This action cannot be undone. You can only delete categories that have no parts associated with them."
        confirmText={deleteMutation.isPending ? "Deleting..." : "Delete"}
        isDestructive={true}
      />
    </div>
  );
}
