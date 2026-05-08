'use client';

import React from 'react';
import { 
  X, 
  FileText, 
  Wrench, 
  Calendar, 
  CreditCard, 
  CheckCircle2, 
  Clock,
  Printer,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface HistoryDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: any;
}

export default function HistoryDetailModal({ isOpen, onClose, item }: HistoryDetailModalProps) {
  if (!isOpen || !item) return null;

  const isInvoice = item.type === 'Invoice';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/20 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl shadow-black/10 overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-8 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <div className="flex items-center gap-4">
            <div className={cn(
              "h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg",
              isInvoice ? "bg-blue-600 text-white" : "bg-emerald-600 text-white"
            )}>
              {isInvoice ? <FileText className="h-6 w-6" /> : <Wrench className="h-6 w-6" />}
            </div>
            <div>
              <h2 className="text-xl font-black text-zinc-900">{item.title}</h2>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-0.5">
                {isInvoice ? 'Billing Statement' : 'Service Report'} • {format(new Date(item.date), 'MMMM dd, yyyy')}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-50 rounded-xl transition-all cursor-pointer text-zinc-400 hover:text-zinc-900">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-10 space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Reference</label>
              <p className="text-sm font-bold text-zinc-900 uppercase tracking-tight">{item.referenceNumber}</p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Status</label>
              <div className="flex items-center gap-2 text-sm font-bold text-zinc-900">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> {item.status}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Type</label>
              <p className="text-sm font-bold text-zinc-900">{item.type}</p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Total Amount</label>
              <p className="text-sm font-black text-zinc-900 tabular-nums">Rs. {item.amount?.toLocaleString() || '0'}</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Line Items for Invoices */}
            {isInvoice && item.lineItems && item.lineItems.length > 0 && (
              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                  Items Purchased
                </label>
                <div className="border border-zinc-100 rounded-2xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-zinc-50/50 border-b border-zinc-100">
                        <th className="px-5 py-3 text-[9px] font-black uppercase tracking-widest text-zinc-400">Item</th>
                        <th className="px-5 py-3 text-[9px] font-black uppercase tracking-widest text-zinc-400 text-center">Qty</th>
                        <th className="px-5 py-3 text-[9px] font-black uppercase tracking-widest text-zinc-400 text-right">Price</th>
                        <th className="px-5 py-3 text-[9px] font-black uppercase tracking-widest text-zinc-400 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                      {item.lineItems.map((li: any, idx: number) => (
                        <tr key={idx} className="hover:bg-zinc-50/50">
                          <td className="px-5 py-3 text-xs font-bold text-zinc-900">{li.partName}</td>
                          <td className="px-5 py-3 text-xs font-bold text-zinc-500 text-center">{li.quantity}</td>
                          <td className="px-5 py-3 text-xs font-bold text-zinc-500 text-right tabular-nums">Rs. {li.unitPrice.toLocaleString()}</td>
                          <td className="px-5 py-3 text-xs font-black text-zinc-900 text-right tabular-nums">Rs. {li.total.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Description for Services */}
            {!isInvoice && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                  <Clock className="h-3 w-3" /> Service Notes
                </label>
                <div className="p-6 bg-zinc-50 rounded-2xl">
                  <p className="text-sm text-zinc-600 font-medium leading-relaxed italic">
                    &ldquo;{item.description}&rdquo;
                  </p>
                </div>
              </div>
            )}

            {/* Financial Breakdown */}
            {isInvoice && (
              <div className="p-6 bg-zinc-50 rounded-2xl space-y-2">
                <div className="flex justify-between text-xs font-bold text-zinc-400">
                  <span>Subtotal</span>
                  <span>Rs. {(item.subTotal || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-zinc-400">
                  <span>Tax</span>
                  <span>Rs. {(item.taxAmount || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-zinc-900 pt-2 border-t border-zinc-100">
                  <span>Total Amount</span>
                  <span>Rs. {(item.amount || 0).toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 pt-4">
            <div className="flex items-center gap-4 p-4 border border-zinc-100 rounded-2xl flex-1">
              <CreditCard className="h-5 w-5 text-zinc-400" />
              <div>
                <p className="text-xs font-bold text-zinc-900">Payment Verified</p>
                <p className="text-[10px] text-zinc-400 font-medium">This transaction is settled and verified.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-8 bg-zinc-50 border-t border-zinc-100 flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 h-14 rounded-2xl border-zinc-200 text-xs font-black uppercase tracking-widest"
          >
            Close
          </Button>
          <Button
            className="h-14 w-14 bg-zinc-200 text-zinc-900 hover:bg-zinc-300 rounded-2xl p-0"
            title="Print"
          >
            <Printer className="h-5 w-5" />
          </Button>
          <Button
            className="flex-[2] h-14 bg-zinc-950 text-white hover:bg-zinc-800 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-black/10 gap-2"
          >
            <Download className="h-5 w-5" /> Download PDF
          </Button>
        </div>
      </div>
    </div>
  );
}
