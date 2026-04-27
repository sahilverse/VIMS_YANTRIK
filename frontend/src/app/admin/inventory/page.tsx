'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PackagePlus, PackageOpen, LayoutGrid, Package } from 'lucide-react';
import PartTable from '@/components/admin/inventory/PartTable';
import CategoryTable from '@/components/admin/inventory/CategoryTable';
import AddPartModal from '@/components/admin/inventory/AddPartModal';
import AddCategoryModal from '@/components/admin/inventory/AddCategoryModal';

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState<'parts' | 'categories'>('parts');
  const [isAddPartModalOpen, setIsAddPartModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);

  return (
    <>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Inventory Management</h1>
          <p className="text-xs font-bold text-zinc-400 mt-1 uppercase tracking-wider">
            Manage parts, stock levels, and categories
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {activeTab === 'parts' ? (
            <Button
              onClick={() => setIsAddPartModalOpen(true)}
              size="sm"
              className="h-11 bg-zinc-950 text-white hover:bg-zinc-800 rounded-xl text-xs font-bold px-6 transition-all shadow-xl shadow-black/10 cursor-pointer active:scale-[0.98]"
            >
              <PackagePlus className="h-4 w-4 mr-2" /> Add Part
            </Button>
          ) : (
            <Button
              onClick={() => setIsAddCategoryModalOpen(true)}
              size="sm"
              className="h-11 bg-zinc-950 text-white hover:bg-zinc-800 rounded-xl text-xs font-bold px-6 transition-all shadow-xl shadow-black/10 cursor-pointer active:scale-[0.98]"
            >
              <PackageOpen className="h-4 w-4 mr-2" /> Add Category
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-8 bg-zinc-100 p-1.5 rounded-2xl w-max">
        <button
          onClick={() => setActiveTab('parts')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'parts' 
              ? 'bg-white text-zinc-900 shadow-sm' 
              : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/50'
          }`}
        >
          <Package className="h-4 w-4" /> Parts Catalog
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'categories' 
              ? 'bg-white text-zinc-900 shadow-sm' 
              : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/50'
          }`}
        >
          <LayoutGrid className="h-4 w-4" /> Categories
        </button>
      </div>

      {/* Content */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === 'parts' ? <PartTable /> : <CategoryTable />}
      </div>

      {/* Modals */}
      <AddPartModal
        isOpen={isAddPartModalOpen}
        onClose={() => setIsAddPartModalOpen(false)}
      />
      <AddCategoryModal
        isOpen={isAddCategoryModalOpen}
        onClose={() => setIsAddCategoryModalOpen(false)}
      />
    </>
  );
}
