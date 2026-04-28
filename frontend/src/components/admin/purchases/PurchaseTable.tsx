import { useState } from 'react';
import { usePurchaseListQuery } from '@/hooks/api/usePurchaseApi';
import { Receipt, Loader2, ArrowRight } from 'lucide-react';
import ViewPurchaseModal from './ViewPurchaseModal';

export default function PurchaseTable() {
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedPurchaseId, setSelectedPurchaseId] = useState<string | null>(null);
  const pageSize = 10;
  
  const { data: response, isLoading } = usePurchaseListQuery({
    pageNumber,
    pageSize,
  });
  
  const paged = response?.data;
  const purchases = paged?.items || [];
  const totalPages = paged?.totalPages || 1;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-zinc-200/50 overflow-hidden">
      <div className="p-6 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight">Purchase History</h2>
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">
            {paged ? `${paged.totalItems} Invoices` : 'Loading...'}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50/50">
              <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest whitespace-nowrap">Invoice & Date</th>
              <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest whitespace-nowrap">Vendor</th>
              <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest whitespace-nowrap">Status</th>
              <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest whitespace-nowrap text-right">Total Amount</th>
              <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest whitespace-nowrap text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <Loader2 className="h-6 w-6 text-zinc-300 animate-spin mx-auto mb-2" />
                  <p className="text-xs font-bold text-zinc-400">Loading purchases...</p>
                </td>
              </tr>
            ) : purchases.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-50 mb-3">
                    <Receipt className="h-5 w-5 text-zinc-300" />
                  </div>
                  <p className="text-sm font-bold text-zinc-900">No purchases found</p>
                  <p className="text-xs text-zinc-500 mt-1">Create an invoice to get started</p>
                </td>
              </tr>
            ) : (
              purchases.map((purchase) => {
                let statusColor = 'bg-zinc-100 text-zinc-600';
                if (purchase.paymentStatus === 'Paid') statusColor = 'bg-emerald-100 text-emerald-700';
                if (purchase.paymentStatus === 'Overdue') statusColor = 'bg-red-100 text-red-700';
                if (purchase.paymentStatus === 'Credit') statusColor = 'bg-orange-100 text-orange-700';

                return (
                  <tr key={purchase.id} className="hover:bg-zinc-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-zinc-100 rounded-xl">
                          <Receipt className="h-4 w-4 text-zinc-500" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-zinc-900">{purchase.invoiceNumber}</div>
                          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">
                            {new Date(purchase.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-zinc-900">{purchase.vendorName}</div>
                      <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">Supplier</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${statusColor}`}>
                        {purchase.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-sm font-extrabold text-zinc-900">Rs. {purchase.totalAmount.toFixed(2)}</div>
                      <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">
                        {purchase.itemCount || purchase.items?.length || 0} items
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedPurchaseId(purchase.id)}
                        className="inline-flex items-center justify-center p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-all cursor-pointer"
                        title="View Details"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </button>
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
              className="px-4 py-2 text-xs font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-white border border-zinc-200 hover:bg-zinc-50"
            >
              Previous
            </button>
            <button
              disabled={pageNumber === totalPages}
              onClick={() => setPageNumber(p => Math.min(totalPages, p + 1))}
              className="px-4 py-2 text-xs font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-white border border-zinc-200 hover:bg-zinc-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <ViewPurchaseModal 
        isOpen={!!selectedPurchaseId} 
        onClose={() => setSelectedPurchaseId(null)} 
        purchaseId={selectedPurchaseId} 
      />
    </div>
  );
}
