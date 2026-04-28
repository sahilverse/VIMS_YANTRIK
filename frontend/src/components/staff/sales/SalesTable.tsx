import { useState } from 'react';
import { useSalesListQuery, useUpdateSaleStatusMutation } from '@/hooks/api/useSalesApi';
import { Receipt, Loader2, ArrowRight, Search, Calendar, Filter, CheckCircle2, Clock, AlertCircle, MoreHorizontal, ChevronDown, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ViewSaleModal from './ViewSaleModal';

export default function SalesTable() {
  const [pageNumber, setPageNumber] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedSaleId, setSelectedSaleId] = useState<string | null>(null);
  const [editingStatusId, setEditingStatusId] = useState<string | null>(null);
  const pageSize = 10;

  const { data: paged, isLoading } = useSalesListQuery({
    pageNumber,
    pageSize,
    search,
    status: status || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  const updateStatusMutation = useUpdateSaleStatusMutation();

  const sales = paged?.items || [];
  const totalPages = paged?.totalPages || 1;

  const handleStatusUpdate = (id: string, newStatus: any) => {
    updateStatusMutation.mutate({ id, status: newStatus }, {
      onSuccess: () => setEditingStatusId(null)
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Paid': return <CheckCircle2 className="h-3 w-3 mr-1.5" />;
      case 'Pending': return <Clock className="h-3 w-3 mr-1.5" />;
      case 'Partial': return <MoreHorizontal className="h-3 w-3 mr-1.5" />;
      case 'Overdue': return <AlertCircle className="h-3 w-3 mr-1.5" />;
      default: return null;
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Pending': return 'bg-zinc-50 text-zinc-600 border-zinc-100';
      case 'Partial': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Overdue': return 'bg-rose-50 text-rose-700 border-rose-100';
      default: return 'bg-zinc-50 text-zinc-600 border-zinc-100';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-3xl shadow-sm border border-zinc-200/50">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search Invoice ID or Customer..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPageNumber(1);
            }}
            className="pl-10 h-10 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-300 rounded-xl text-xs font-bold transition-all"
          />
        </div>

        <div className="w-40 relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPageNumber(1);
            }}
            className="w-full h-10 pl-10 pr-4 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-300 rounded-xl text-xs font-bold appearance-none outline-none cursor-pointer transition-all"
          >
            <option value="">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Partial">Partial</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>

        <div className="flex items-center gap-2 bg-zinc-50 p-1 rounded-xl border border-zinc-100">
          <div className="flex items-center px-2 gap-2">
            <Calendar className="h-3.5 w-3.5 text-zinc-400" />
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">From</span>
          </div>
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setPageNumber(1);
            }}
            className="bg-white border border-zinc-200 rounded-lg px-2 py-1 text-[10px] font-bold outline-none"
          />
          <span className="text-zinc-300 text-[10px] font-bold">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setPageNumber(1);
            }}
            className="bg-white border border-zinc-200 rounded-lg px-2 py-1 text-[10px] font-bold outline-none"
          />
          {(startDate || endDate || status || search) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearch('');
                setStatus('');
                setStartDate('');
                setEndDate('');
                setPageNumber(1);
              }}
              className="h-8 px-2 text-[10px] font-black text-zinc-400 hover:text-rose-500 uppercase tracking-widest"
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-zinc-200/50 overflow-hidden">
        <div className="p-6 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-extrabold tracking-tight">Sales History</h2>
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
                <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest whitespace-nowrap">Customer</th>
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
                    <p className="text-xs font-bold text-zinc-400">Loading sales...</p>
                  </td>
                </tr>
              ) : sales.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-50 mb-3">
                      <Receipt className="h-5 w-5 text-zinc-300" />
                    </div>
                    <p className="text-sm font-bold text-zinc-900">No sales found</p>
                    <p className="text-xs text-zinc-500 mt-1">Generate your first invoice to see it here</p>
                  </td>
                </tr>
              ) : (
                sales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-zinc-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-zinc-100 rounded-xl">
                          <Receipt className="h-4 w-4 text-zinc-500" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-zinc-900">{sale.invoiceNumber}</div>
                          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">
                            {new Date(sale.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-zinc-900">{sale.customerName}</div>
                      <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">Customer</div>
                    </td>
                    <td className="px-6 py-4">
                      {editingStatusId === sale.id ? (
                        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-200">
                          <select
                            value={sale.paymentStatus}
                            onChange={(e) => handleStatusUpdate(sale.id, e.target.value)}
                            disabled={updateStatusMutation.isPending}
                            className="text-[10px] font-bold uppercase tracking-widest p-2 rounded-xl border-2 border-zinc-900 outline-none bg-white shadow-lg"
                            autoFocus
                            onBlur={() => !updateStatusMutation.isPending && setEditingStatusId(null)}
                          >
                            <option value="Paid">Paid</option>
                            <option value="Pending">Pending</option>
                            <option value="Partial">Partial</option>
                            <option value="Overdue">Overdue</option>
                          </select>
                          {updateStatusMutation.isPending && <Loader2 className="h-4 w-4 text-zinc-400 animate-spin" />}
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditingStatusId(sale.id)}
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 transition-all hover:scale-105 active:scale-95 group/status ${getStatusStyles(sale.paymentStatus)} shadow-sm hover:shadow-md cursor-pointer`}
                        >
                          {getStatusIcon(sale.paymentStatus)}
                          {sale.paymentStatus}
                          <ChevronDown className="h-3 w-3 ml-2 text-current opacity-50 group-hover/status:opacity-100 transition-opacity" />
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-sm font-extrabold text-zinc-900">Rs. {sale.totalAmount.toFixed(2)}</div>
                      <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">
                        {sale.itemCount} items
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedSaleId(sale.id)}
                        className="inline-flex items-center justify-center p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-all cursor-pointer"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

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

        <ViewSaleModal
          isOpen={!!selectedSaleId}
          onClose={() => setSelectedSaleId(null)}
          saleId={selectedSaleId}
        />
      </div>
    </div>
  );
}
