'use client';

import React from 'react';
import { 
  X, 
  Package, 
  Tag, 
  Info, 
  ShieldCheck, 
  Truck, 
  AlertTriangle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PartDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  part: any;
}

export default function PartDetailModal({ isOpen, onClose, part }: PartDetailModalProps) {
  if (!isOpen || !part) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/20 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl shadow-black/10 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col md:flex-row">
        {/* Left Side - Visual */}
        <div className="w-full md:w-2/5 bg-zinc-50 p-12 flex flex-col items-center justify-center border-r border-zinc-100">
          <div className="h-32 w-32 bg-zinc-950 text-white rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-black/20 mb-8 transform -rotate-6">
            <Package className="h-14 w-14" strokeWidth={1.5} />
          </div>
          <div className="space-y-4 text-center">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">{part.brand || 'Original Equipment'}</p>
            <h3 className="text-xl font-black text-zinc-900 leading-tight">{part.name}</h3>
            <div className="flex items-center justify-center gap-2 pt-2">
              <span className="text-2xl font-black text-zinc-950 tabular-nums">Rs. {part.unitPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Right Side - Details */}
        <div className="flex-1 p-10 space-y-8 relative">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-zinc-50 rounded-xl transition-all cursor-pointer text-zinc-400 hover:text-zinc-900">
            <X className="h-5 w-5" />
          </button>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <Info className="h-3 w-3" /> Description
              </label>
              <p className="text-sm text-zinc-500 font-medium leading-relaxed">
                {part.description || "High-quality replacement part designed for durability and perfect fit. Meets or exceeds OEM specifications."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Category</label>
                <div className="flex items-center gap-2 text-sm font-bold text-zinc-900">
                  <Tag className="h-4 w-4 text-zinc-400" /> {part.categoryName}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Stock Status</label>
                <div className={cn(
                  "text-sm font-bold",
                  part.stockQuantity > 0 ? "text-emerald-500" : "text-red-500"
                )}>
                  {part.stockQuantity > 0 ? `${part.stockQuantity} Units Available` : 'Out of Stock'}
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-zinc-50">
              <div className="flex items-start gap-4 p-4 bg-zinc-50 rounded-2xl">
                <ShieldCheck className="h-5 w-5 text-zinc-900 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-zinc-900">Warranty Included</p>
                  <p className="text-[10px] text-zinc-400 font-medium">12-month standard warranty on all genuine parts.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-zinc-50 rounded-2xl">
                <Truck className="h-5 w-5 text-zinc-900 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-zinc-900">Ready for Installation</p>
                  <p className="text-[10px] text-zinc-400 font-medium">In-stock items are ready for immediate service booking.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 h-14 rounded-2xl border-zinc-200 text-xs font-black uppercase tracking-widest"
            >
              Close
            </Button>
            {part.stockQuantity > 0 ? (
              <Button
                asChild
                className="flex-[2] h-14 bg-zinc-950 text-white hover:bg-zinc-800 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-black/10"
              >
                <a href="/dashboard/appointments">Book Installation</a>
              </Button>
            ) : (
              <Button
                asChild
                className="flex-[2] h-14 bg-amber-500 text-white hover:bg-amber-600 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-amber-500/10"
              >
                <a href="/dashboard/appointments?tab=parts">Request Notification</a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
