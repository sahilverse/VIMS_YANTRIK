'use client';

import React, { useState } from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { CustomerSidebar } from '@/components/dashboard/CustomerSidebar';
import { usePartListQuery, useCategoryListQuery } from '@/hooks/api/useInventoryApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PartDetailModal from '@/components/dashboard/PartDetailModal';
import {
  Search,
  Package,
  Tag,
  AlertCircle,
  Loader2,
  ChevronRight,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function StorePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedPart, setSelectedPart] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleDetailClick = (part: any) => {
    setSelectedPart(part);
    setIsDetailModalOpen(true);
  };

  const { data: categoriesData } = useCategoryListQuery();
  const { data: partsData, isLoading, isError } = usePartListQuery({
    pageNumber,
    pageSize: 12,
    search: searchTerm,
    categoryId: selectedCategory
  });

  const categories = categoriesData?.data || [];
  const parts = partsData?.data?.items || [];
  const totalPages = partsData?.data?.totalPages || 1;

  return (
    <AuthGuard roles={['Customer']}>
      <div className="flex min-h-screen bg-white text-zinc-900 font-sans selection:bg-zinc-950 selection:text-white">
        <CustomerSidebar />

        <main className="flex-1 overflow-y-auto bg-zinc-50/30">
          <header className="h-20 border-b border-zinc-100 flex items-center justify-between px-10 sticky top-0 bg-white/80 backdrop-blur-md z-10">
            <div className="flex items-center gap-4">
              <Package className="h-5 w-5 text-zinc-400" />
              <h1 className="text-xl font-bold tracking-tight text-zinc-900">Parts Store</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative group">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
                <Input
                  placeholder="Search parts, brands..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10 w-64 bg-zinc-50 border-zinc-100 focus:bg-white focus:border-zinc-200 rounded-xl transition-all text-xs font-bold"
                />
              </div>
            </div>
          </header>

          <div className="p-10 space-y-8 animate-in fade-in duration-500">
            {/* Filter Bar */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
              <button
                onClick={() => setSelectedCategory(undefined)}
                className={cn(
                  "px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border",
                  !selectedCategory
                    ? "bg-zinc-950 text-white border-zinc-950 shadow-lg shadow-black/10"
                    : "bg-white text-zinc-500 border-zinc-100 hover:border-zinc-300"
                )}
              >
                All Categories
              </button>
              {categories.map((cat: any) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border",
                    selectedCategory === cat.id
                      ? "bg-zinc-950 text-white border-zinc-950 shadow-lg shadow-black/10"
                      : "bg-white text-zinc-500 border-zinc-100 hover:border-zinc-300"
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {isLoading ? (
              <div className="h-96 flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 text-zinc-900 animate-spin" strokeWidth={1.5} />
                <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Browsing Catalog...</p>
              </div>
            ) : isError ? (
              <div className="h-96 flex flex-col items-center justify-center gap-4 text-center">
                <div className="p-4 bg-red-50 text-red-500 rounded-2xl">
                  <AlertCircle className="h-10 w-10" />
                </div>
                <p className="text-lg font-bold text-zinc-900">Failed to load parts</p>
                <p className="text-sm text-zinc-500">Please try again later.</p>
              </div>
            ) : parts.length === 0 ? (
              <div className="py-24 flex flex-col items-center justify-center text-center bg-white border border-zinc-200/50 rounded-[2.5rem] shadow-sm">
                <div className="w-20 h-20 bg-zinc-50 rounded-2xl flex items-center justify-center mb-6">
                  <Search className="h-10 w-10 text-zinc-200" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 mb-2">No parts found</h3>
                <p className="text-sm font-medium text-zinc-400 max-w-xs mx-auto">We couldn't find any parts matching your search or category.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-white border border-zinc-200/50 rounded-[2.5rem] overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-zinc-50/50 border-b border-zinc-100">
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Part Details</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Category</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Stock Status</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Unit Price</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-50">
                        {parts.map((part: any) => (
                          <tr key={part.id} className="group hover:bg-zinc-50/50 transition-colors">
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-400 group-hover:bg-zinc-950 group-hover:text-white transition-all duration-500">
                                  <Package className="h-5 w-5" />
                                </div>
                                <div>
                                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">{part.brand || 'Original'}</p>
                                  <h4 className="text-sm font-bold text-zinc-900 group-hover:text-zinc-950">{part.name}</h4>
                                  <p className="text-[10px] font-medium text-zinc-400 mt-0.5 tabular-nums">SKU: {part.sku}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-tight">
                                <Tag className="h-3 w-3" /> {part.categoryName}
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <div className={cn(
                                "px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest w-fit border",
                                part.stockQuantity > 5
                                  ? "text-emerald-500 bg-emerald-50 border-emerald-100"
                                  : part.stockQuantity > 0
                                    ? "text-amber-500 bg-amber-50 border-amber-100"
                                    : "text-red-500 bg-red-50 border-red-100"
                              )}>
                                {part.stockQuantity > 0 ? `${part.stockQuantity} available` : 'Out of Stock'}
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <span className="text-base font-black text-zinc-950 tabular-nums">
                                Rs. {part.unitPrice.toLocaleString()}
                              </span>
                            </td>
                            <td className="px-8 py-6 text-right">
                              <Button
                                onClick={() => handleDetailClick(part)}
                                variant="ghost"
                                className="h-10 rounded-xl hover:bg-zinc-950 hover:text-white text-xs font-black uppercase tracking-widest gap-2 transition-all"
                              >
                                Details <ChevronRight className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-4">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPageNumber(i + 1)}
                        className={cn(
                          "h-10 w-10 rounded-xl text-xs font-black transition-all",
                          pageNumber === i + 1
                            ? "bg-zinc-950 text-white shadow-lg shadow-black/10"
                            : "bg-white text-zinc-400 hover:bg-zinc-50 border border-zinc-100"
                        )}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </main>

        <PartDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          part={selectedPart}
        />
      </div>
    </AuthGuard>
  );
}
