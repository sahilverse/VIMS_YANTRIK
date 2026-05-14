'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ChevronLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Car,
  Receipt,
  History,
  TrendingUp,
  Award,
  ArrowRight,
  Loader2,
  Clock,
  Search,
  AlertCircle
} from 'lucide-react';
import { useCustomerDetailQuery } from '@/hooks/api/useCustomerApi';
import { useCustomerHistoryQuery } from '@/hooks/api/useHistoryApi';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import ViewSaleModal from '@/components/staff/sales/ViewSaleModal';
import { format } from 'date-fns';

export default function CustomerProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'vehicles' | 'sales' | 'services'>('sales');
  const [selectedSaleId, setSelectedSaleId] = useState<string | null>(null);
  const [timelineSearch, setTimelineSearch] = useState('');

  const { data: customer, isLoading: isCustomerLoading } = useCustomerDetailQuery(id as string);

  const { data: history, isLoading: isHistoryLoading } = useCustomerHistoryQuery(id as string, {
    pageSize: 50,
    search: timelineSearch || undefined,
    type: 'Service'
  });

  const isLoading = isCustomerLoading;

  if (isLoading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 text-zinc-950 animate-spin" />
        <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Retreiving Customer Data...</p>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center space-y-4 text-center">
        <div className="p-4 bg-zinc-50 rounded-full">
          <AlertCircle className="h-8 w-8 text-zinc-400" />
        </div>
        <h2 className="text-xl font-black text-zinc-900">Customer Not Found</h2>
        <p className="text-sm text-zinc-500 max-w-xs">The customer record you are looking for does not exist or has been removed.</p>
        <Button
          onClick={() => router.back()}
          className="mt-4 bg-zinc-950 text-white rounded-xl"
        >
          Go Back
        </Button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Pending': return 'bg-zinc-50 text-zinc-600 border-zinc-100';
      case 'Overdue': return 'bg-rose-50 text-rose-700 border-rose-100';
      default: return 'bg-zinc-50 text-zinc-600 border-zinc-100';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header & Back Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-white hover:shadow-md rounded-xl transition-all text-zinc-400 hover:text-zinc-900 cursor-pointer"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-zinc-900">Customer Profile</h1>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-0.5">Management & History</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-xl shadow-zinc-200/20 p-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-zinc-950 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-black/20 mb-4">
                <User className="h-10 w-10" />
              </div>
              <h2 className="text-2xl font-black text-zinc-900">{customer.fullName}</h2>
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1 px-3 py-1 bg-zinc-50 rounded-full border border-zinc-100">
                {customer.customerCode}
              </span>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-4 p-3 bg-zinc-50 rounded-2xl border border-zinc-100/50">
                <div className="p-2 bg-white rounded-xl shadow-sm text-zinc-500">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Phone Number</p>
                  <p className="text-sm font-bold text-zinc-900">{customer.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 bg-zinc-50 rounded-2xl border border-zinc-100/50">
                <div className="p-2 bg-white rounded-xl shadow-sm text-zinc-500">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Email Address</p>
                  <p className="text-sm font-bold text-zinc-900">{customer.email || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 bg-zinc-50 rounded-2xl border border-zinc-100/50">
                <div className="p-2 bg-white rounded-xl shadow-sm text-zinc-500">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Location</p>
                  <p className="text-sm font-bold text-zinc-900">{customer.address || 'Not provided'}</p>
                </div>
              </div>
            </div>

            <Button
              className="w-full mt-8 bg-zinc-950 text-white hover:bg-zinc-800 rounded-2xl h-12 font-bold shadow-lg shadow-black/10 transition-all active:scale-95"
              onClick={() => router.push(`/staff/sales?customerId=${customer.id}&action=new`)}
            >
              Record New Sale
            </Button>
          </div>

          {/* Mini Stats Card */}
          <div className="bg-zinc-950 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-black/20">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-6">Financial Summary</h3>
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2 text-emerald-400">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Total Revenue</span>
                </div>
                <p className="text-3xl font-black italic">Rs. {customer.totalSpend.toLocaleString()}</p>
              </div>

              <div className="pt-6 border-t border-zinc-800">
                <div className="flex items-center gap-2 mb-2 text-amber-400">
                  <Award className="h-4 w-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Loyalty Reward</span>
                </div>
                <p className="text-xl font-black">{customer.loyaltyPoints} <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Points</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed View */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="bg-white p-2 rounded-3xl border border-zinc-100 shadow-sm flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('sales')}
              className={`flex-1 py-3 px-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 ${activeTab === 'sales'
                ? 'bg-zinc-950 text-white shadow-lg shadow-black/10'
                : 'text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50'}`}
            >
              <Receipt className="h-4 w-4" /> Sales
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`flex-1 py-3 px-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 ${activeTab === 'services'
                ? 'bg-zinc-950 text-white shadow-lg shadow-black/10'
                : 'text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50'}`}
            >
              <History className="h-4 w-4" /> Service History
            </button>
            <button
              onClick={() => setActiveTab('vehicles')}
              className={`flex-1 py-3 px-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 ${activeTab === 'vehicles'
                ? 'bg-zinc-950 text-white shadow-lg shadow-black/10'
                : 'text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50'}`}
            >
              <Car className="h-4 w-4" /> Vehicles
            </button>
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm overflow-hidden min-h-[500px]">
            {activeTab === 'sales' ? (
              <div className="divide-y divide-zinc-50">
                {!customer.salesHistory || customer.salesHistory.length === 0 ? (
                  <div className="p-20 text-center flex flex-col items-center">
                    <div className="p-4 bg-zinc-50 rounded-full mb-4">
                      <Receipt className="h-8 w-8 text-zinc-300" />
                    </div>
                    <p className="font-bold text-zinc-900">No Sales Record</p>
                    <p className="text-xs text-zinc-400 mt-1">This customer hasn't purchased any parts yet.</p>
                  </div>
                ) : (
                  customer.salesHistory.map((sale) => (
                    <div
                      key={sale.id}
                      className="p-6 flex items-center justify-between hover:bg-zinc-50/50 transition-colors group cursor-pointer"
                      onClick={() => setSelectedSaleId(sale.id)}
                    >
                      <div className="flex items-center gap-5">
                        <div className="p-3 bg-zinc-100 rounded-2xl text-zinc-400 group-hover:text-zinc-900 transition-colors">
                          <Receipt className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-zinc-900">{sale.invoiceNumber}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="h-3 w-3 text-zinc-400" />
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                              {format(new Date(sale.date), 'MMM dd, yyyy')}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-8">
                        <div className="text-right">
                          <p className="text-base font-black text-zinc-900">Rs. {sale.totalAmount.toLocaleString()}</p>
                          <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border mt-1 ${getStatusColor(sale.paymentStatus)}`}>
                            {sale.paymentStatus}
                          </div>
                        </div>
                        <div className="p-2 text-zinc-300 group-hover:text-zinc-900 transition-all">
                          <ArrowRight className="h-5 w-5" />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : activeTab === 'services' ? (
              <div className="divide-y divide-zinc-50">
                {/* Service History Search Header */}
                <div className="p-6 bg-zinc-50/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="relative w-full sm:w-64 group">
                    <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
                    <input
                      type="text"
                      placeholder="Search service history..."
                      value={timelineSearch}
                      onChange={(e) => setTimelineSearch(e.target.value)}
                      className="w-full h-9 pl-9 pr-3 bg-white border border-zinc-200 rounded-xl text-[10px] font-bold outline-none focus:ring-1 focus:ring-zinc-200 transition-all"
                    />
                  </div>
                  {timelineSearch && (
                    <Button
                      variant="ghost"
                      onClick={() => setTimelineSearch('')}
                      className="h-9 px-3 text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-950"
                    >
                      Clear Filter
                    </Button>
                  )}
                </div>

                {isHistoryLoading ? (
                  <div className="p-20 flex flex-col items-center justify-center space-y-4">
                    <Loader2 className="h-8 w-8 text-zinc-900 animate-spin opacity-20" />
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Loading Records...</p>
                  </div>
                ) : !history?.items || history.items.length === 0 ? (
                  <div className="p-20 text-center flex flex-col items-center">
                    <div className="p-4 bg-zinc-50 rounded-full mb-4">
                      <History className="h-8 w-8 text-zinc-300" />
                    </div>
                    <p className="font-bold text-zinc-900">No Services Found</p>
                    <p className="text-xs text-zinc-400 mt-1">No maintenance records found for this customer.</p>
                  </div>
                ) : (
                  history.items.map((item) => (
                    <div key={item.id} className="p-6 flex items-center justify-between hover:bg-zinc-50/50 transition-colors group">
                      <div className="flex items-center gap-5">
                        <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 transition-colors">
                          <History className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-black text-zinc-900">{item.title}</p>
                            {item.plateNumber && (
                              <Badge variant="outline" className="bg-zinc-50 font-black text-[9px] px-2 py-0 rounded-full border-zinc-200">
                                {item.plateNumber}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-zinc-500 mt-0.5 line-clamp-1">{item.description}</p>
                          <div className="flex items-center gap-2 mt-2 text-[9px] font-black text-zinc-400 uppercase tracking-[0.1em]">
                            <Clock className="h-3 w-3" />
                            {format(new Date(item.date), 'MMM dd, yyyy')}
                            {item.vehicleBrand && item.vehicleModel && (
                              <div className="flex items-center gap-1.5 ml-1 text-zinc-500">
                                <span className="text-zinc-300">•</span>
                                <Car className="h-3 w-3" />
                                <span>{item.vehicleBrand} {item.vehicleModel}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-zinc-900">
                          {item.amount ? `Rs. ${item.amount.toLocaleString()}` : '—'}
                        </p>
                        <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mt-1">{item.status}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="divide-y divide-zinc-50">
                {customer.vehicles.length === 0 ? (
                  <div className="p-20 text-center flex flex-col items-center">
                    <div className="p-4 bg-zinc-50 rounded-full mb-4">
                      <Car className="h-8 w-8 text-zinc-300" />
                    </div>
                    <p className="font-bold text-zinc-900">No Vehicles</p>
                    <p className="text-xs text-zinc-400 mt-1">This customer doesn't have any vehicles yet.</p>
                  </div>
                ) : (
                  customer.vehicles.map((v) => (
                    <div key={v.id} className="p-6 flex items-center justify-between hover:bg-zinc-50/50 transition-colors group">
                      <div className="flex items-center gap-5">
                        <div className="p-3 bg-zinc-100 rounded-2xl text-zinc-400 group-hover:text-zinc-900 transition-colors">
                          <Car className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <p className="text-sm font-black text-zinc-900">{v.brand} {v.model}</p>
                            <Badge variant="outline" className="bg-zinc-50 font-black text-[9px] px-2 py-0 rounded-full border-zinc-200">
                              {v.plateNumber}
                            </Badge>
                          </div>
                          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">
                            {v.year ? `Year ${v.year}` : 'Year Unknown'} • {v.vin || 'No VIN'}
                          </p>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        onClick={() => {
                          setActiveTab('services');
                          setTimelineSearch(v.plateNumber);
                        }}
                        className="h-10 px-4 rounded-xl text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-950 hover:bg-zinc-100 flex items-center gap-2"
                      >
                        Service History <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <ViewSaleModal
        isOpen={!!selectedSaleId}
        onClose={() => setSelectedSaleId(null)}
        saleId={selectedSaleId}
      />
    </div>
  );
}
