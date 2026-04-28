'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import PurchaseTable from '@/components/admin/purchases/PurchaseTable';
import CreatePurchaseModal from '@/components/admin/purchases/CreatePurchaseModal';

export default function PurchasesPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Procurement</h1>
          <p className="text-xs font-bold text-zinc-400 mt-1 uppercase tracking-wider">
            Manage vendor purchases and stock intake
          </p>
        </div>

        <Button
          onClick={() => setIsCreateModalOpen(true)}
          size="sm"
          className="h-11 bg-zinc-950 text-white hover:bg-zinc-800 rounded-xl text-xs font-bold px-6 transition-all shadow-xl shadow-black/10 cursor-pointer active:scale-[0.98]"
        >
          <Plus className="h-4 w-4 mr-2" /> New Purchase Invoice
        </Button>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <PurchaseTable />
      </div>

      <CreatePurchaseModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  );
}
