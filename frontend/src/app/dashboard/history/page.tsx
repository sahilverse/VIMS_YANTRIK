'use client';

import React from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { CustomerSidebar } from '@/components/dashboard/CustomerSidebar';
import { useMyHistoryQuery } from '@/hooks/api/useHistoryApi';
import SubmitReviewModal from '@/components/dashboard/SubmitReviewModal';
import HistoryDetailModal from '@/components/dashboard/HistoryDetailModal';
import { Input } from '@/components/ui/input';
import {
  History,
  FileText,
  Wrench,
  Calendar,
  AlertCircle,
  Loader2,
  ChevronRight,
  Download,
  Star,
  Search
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function HistoryPage() {
  const [isReviewModalOpen, setIsReviewModalOpen] = React.useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = React.useState(false);
  const [selectedService, setSelectedService] = React.useState<any>(null);
  const [selectedItem, setSelectedItem] = React.useState<any>(null);

  // Filters
  const [searchTerm, setSearchTerm] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [startDate, setStartDate] = React.useState<string>('');
  const [endDate, setEndDate] = React.useState<string>('');
  const [typeFilter, setTypeFilter] = React.useState<'all' | 'Service' | 'Invoice'>('all');
  const [page, setPage] = React.useState(1);
  const pageSize = 10;

  // Debounce search input (400ms)
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: result, isLoading, isError } = useMyHistoryQuery({
    search: debouncedSearch || undefined,
    type: typeFilter === 'all' ? undefined : typeFilter,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    page,
    pageSize,
  });

  const items = result?.items ?? [];
  const totalPages = result?.totalPages ?? 0;
  const totalCount = result?.totalCount ?? 0;

  const handleReviewClick = (item: any) => {
    setSelectedService(item);
    setIsReviewModalOpen(true);
  };

  const handleDetailClick = (item: any) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'Invoice': return <FileText className="h-5 w-5" />;
      case 'Service': return <Wrench className="h-5 w-5" />;
      default: return <History className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
      case 'completed':
        return "text-emerald-500 bg-emerald-50 border-emerald-100";
      case 'pending':
      case 'overdue':
        return "text-amber-500 bg-amber-50 border-amber-100";
      default:
        return "text-zinc-500 bg-zinc-50 border-zinc-100";
    }
  };

  return (
    <AuthGuard roles={['Customer']}>
      <div className="flex min-h-screen bg-white text-zinc-900 font-sans selection:bg-zinc-950 selection:text-white">
        <CustomerSidebar />

        <main className="flex-1 overflow-y-auto bg-zinc-50/30">
          <header className="h-20 border-b border-zinc-100 flex items-center justify-between px-10 sticky top-0 bg-white/80 backdrop-blur-md z-10">
            <div className="flex items-center gap-4">
              <History className="h-5 w-5 text-zinc-400" />
              <h1 className="text-xl font-bold tracking-tight text-zinc-900">History</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" className="h-10 rounded-xl border-zinc-100 text-xs font-bold uppercase tracking-widest gap-2">
                <Download className="h-4 w-4" /> Export All
              </Button>
            </div>
          </header>

          <div className="p-10 max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Filter Bar */}
            <div className="bg-white border border-zinc-200/50 rounded-[2rem] p-6 shadow-sm flex flex-wrap items-end gap-6">
              <div className="flex-1 min-w-[240px] space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Search</label>
                <div className="relative group">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
                  <Input
                    placeholder="Search by Invoice, Service or Reference..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                    className="pl-10 h-10 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 rounded-xl text-xs font-bold transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Type</label>
                <div className="flex p-1 bg-zinc-100 rounded-xl w-fit">
                  {(['all', 'Service', 'Invoice'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => { setTypeFilter(t); setPage(1); }}
                      className={cn(
                        "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                        typeFilter === t ? "bg-white text-zinc-950 shadow-sm" : "text-zinc-400 hover:text-zinc-600"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Date Range</label>
                <div className="flex items-center gap-3">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
                    className="h-10 px-4 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 rounded-xl text-xs font-bold transition-all outline-none"
                  />
                  <span className="text-zinc-300 font-bold">to</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
                    className="h-10 px-4 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 rounded-xl text-xs font-bold transition-all outline-none"
                  />
                </div>
              </div>

              <Button
                variant="ghost"
                onClick={() => { setSearchTerm(''); setStartDate(''); setEndDate(''); setTypeFilter('all'); setPage(1); }}
                className="h-10 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900"
              >
                Clear
              </Button>
            </div>

            {isLoading ? (
              <div className="h-96 flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 text-zinc-900 animate-spin" strokeWidth={1.5} />
                <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Reconstructing your history...</p>
              </div>
            ) : isError ? (
              <div className="h-96 flex flex-col items-center justify-center gap-4 text-center">
                <div className="p-4 bg-red-50 text-red-500 rounded-2xl">
                  <AlertCircle className="h-10 w-10" />
                </div>
                <p className="text-lg font-bold text-zinc-900">Failed to load history</p>
              </div>
            ) : items.length === 0 ? (
              <div className="py-24 flex flex-col items-center justify-center text-center bg-white border border-zinc-200/50 rounded-[2.5rem] shadow-sm">
                <div className="w-20 h-20 bg-zinc-50 rounded-2xl flex items-center justify-center mb-6">
                  <Calendar className="h-10 w-10 text-zinc-200" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 mb-2">No history found</h3>
                <p className="text-sm font-medium text-zinc-400 max-w-xs mx-auto">Try adjusting your filters to find what you're looking for.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-white border border-zinc-200/50 rounded-[2.5rem] overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-zinc-50/50 border-b border-zinc-100">
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Event</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Ref #</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Date</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Status</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Amount</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-50">
                        {items.map((item: any) => (
                          <tr key={item.id} className="group hover:bg-zinc-50/50 transition-colors">
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                <div className={cn(
                                  "h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                                  item.type === 'Invoice' ? "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white" : "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white"
                                )}>
                                  {getIcon(item.type)}
                                </div>
                                <div>
                                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">{item.type}</p>
                                  <h4 className="text-sm font-bold text-zinc-900 group-hover:text-zinc-950">{item.title}</h4>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <span className="text-xs font-black text-zinc-400 uppercase tracking-tight">{item.referenceNumber}</span>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex flex-col">
                                <span className="text-sm font-bold text-zinc-900">{format(new Date(item.date), 'MMM dd, yyyy')}</span>
                                <span className="text-[10px] font-medium text-zinc-400 uppercase">{format(new Date(item.date), 'p')}</span>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <div className={cn(
                                "px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest w-fit border",
                                getStatusColor(item.status)
                              )}>
                                {item.status}
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <span className="text-base font-black text-zinc-950 tabular-nums">
                                {item.amount ? `Rs. ${item.amount.toLocaleString()}` : '—'}
                              </span>
                            </td>
                            <td className="px-8 py-6 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {item.type === 'Service' && (
                                  <Button
                                    onClick={() => handleReviewClick(item)}
                                    variant="ghost"
                                    className="h-10 rounded-xl hover:bg-amber-50 text-xs font-black uppercase tracking-widest gap-2 text-amber-600"
                                  >
                                    <Star className="h-4 w-4" /> Review
                                  </Button>
                                )}
                                <Button
                                  onClick={() => handleDetailClick(item)}
                                  variant="ghost"
                                  className="h-10 rounded-xl hover:bg-zinc-950 hover:text-white text-xs font-black uppercase tracking-widest gap-2 transition-all"
                                >
                                  Details <ChevronRight className="h-4 w-4" />
                                </Button>
                              </div>
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
                        onClick={() => setPage(i + 1)}
                        className={cn(
                          "h-10 w-10 rounded-xl text-xs font-black transition-all",
                          page === i + 1
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

        <SubmitReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          serviceTitle={selectedService?.title || ''}
          appointmentId={selectedService?.id || ''}
        />

        <HistoryDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          item={selectedItem}
        />
      </div>
    </AuthGuard>
  );
}
