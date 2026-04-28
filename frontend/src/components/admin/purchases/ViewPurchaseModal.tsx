import { X, Receipt, Building2, Calendar, FileText, Loader2 } from 'lucide-react';
import { usePurchaseDetailQuery } from '@/hooks/api/usePurchaseApi';

interface ViewPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchaseId: string | null;
}

export default function ViewPurchaseModal({ isOpen, onClose, purchaseId }: ViewPurchaseModalProps) {
  const { data: response, isLoading } = usePurchaseDetailQuery(purchaseId!, isOpen && !!purchaseId);
  const purchase = response?.data;

  if (!isOpen) return null;

  const getStatusColor = (status?: string) => {
    if (status === 'Paid') return 'bg-emerald-100 text-emerald-700';
    if (status === 'Overdue') return 'bg-red-100 text-red-700';
    if (status === 'Credit') return 'bg-orange-100 text-orange-700';
    return 'bg-zinc-100 text-zinc-600';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/20 backdrop-blur-sm overflow-y-auto">
      <div 
        className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-zinc-100 rounded-xl">
              <Receipt className="h-5 w-5 text-zinc-700" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight">{purchase?.invoiceNumber || 'Loading...'}</h2>
              {purchase && (
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest mt-1 ${getStatusColor(purchase.paymentStatus)}`}>
                  {purchase.paymentStatus}
                </span>
              )}
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isLoading || !purchase ? (
          <div className="p-16 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 text-zinc-400 animate-spin" />
            <p className="text-sm font-bold text-zinc-500">Loading invoice details...</p>
          </div>
        ) : (
          <div className="p-6 space-y-8">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-100">
                <div className="flex items-center gap-2 mb-1">
                <Building2 className="h-4 w-4 text-zinc-400" />
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Vendor</p>
              </div>
              <p className="text-sm font-bold text-zinc-900">{purchase.vendorName}</p>
            </div>
            
            <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-100">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-zinc-400" />
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Date</p>
              </div>
              <p className="text-sm font-bold text-zinc-900">
                {new Date(purchase.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>

            <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-100 col-span-2">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="h-4 w-4 text-zinc-400" />
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Created By</p>
              </div>
              <p className="text-sm font-bold text-zinc-900">{purchase.staffName}</p>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Line Items</h3>
            <div className="border border-zinc-100 rounded-2xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-zinc-50">
                  <tr>
                    <th className="px-4 py-3 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Part</th>
                    <th className="px-4 py-3 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">Qty</th>
                    <th className="px-4 py-3 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">Unit Price</th>
                    <th className="px-4 py-3 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {purchase.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-zinc-50/50">
                      <td className="px-4 py-3">
                        <div className="text-sm font-bold text-zinc-900">{item.partName}</div>
                        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">SKU: {item.sku}</div>
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-medium text-zinc-600">{item.quantity}</td>
                      <td className="px-4 py-3 text-right text-sm font-medium text-zinc-600">Rs. {item.unitPrice.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right text-sm font-black text-zinc-900">Rs. {(item.quantity * item.unitPrice).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-zinc-950 text-white rounded-2xl p-6 flex items-center justify-between shadow-xl shadow-black/5">
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Total Amount</span>
            <span className="text-2xl font-black">Rs. {purchase.totalAmount.toFixed(2)}</span>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
