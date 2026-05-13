'use client';

import { AuthGuard } from '@/components/auth/AuthGuard';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Bell, ChevronRight, Plus, Calendar, CreditCard, Car, Loader2, Wallet, History, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CustomerSidebar } from '@/components/dashboard/CustomerSidebar';
import { useCustomerDashboardQuery } from '@/hooks/api/useDashboardApi';
import VehicleModal from '@/components/dashboard/VehicleModal';
import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: dashboard, isLoading } = useCustomerDashboardQuery();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <Loader2 className="h-10 w-10 animate-spin text-zinc-900" />
      </div>
    );
  }

  const stats = [
    {
      label: "Total Spent",
      value: `Rs. ${dashboard?.data?.totalSpent.toLocaleString() ?? '0'}`,
      icon: Wallet,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      description: "Lifetime investment"
    },
    {
      label: "My Vehicles",
      value: `${dashboard?.data?.vehicleCount ?? '0'} Registered`,
      icon: Car,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      description: "Active fleet"
    },
    {
      label: "Total Services",
      value: `${dashboard?.data?.appointmentCount ?? '0'} Visits`,
      icon: History,
      color: "text-blue-600",
      bg: "bg-blue-50",
      description: "Service records"
    },
  ];

  return (
    <AuthGuard roles={['Customer']}>
      <div className="flex h-screen overflow-hidden bg-white text-zinc-900 font-sans selection:bg-zinc-950 selection:text-white">
        <CustomerSidebar />

        {/* Main Content */}
        <main className="flex-1 h-full overflow-y-auto bg-zinc-50/30">
          <header className="h-20 border-b border-zinc-100 flex items-center justify-between px-10 sticky top-0 bg-white/80 backdrop-blur-md z-10">
            <h1 className="text-xl font-bold tracking-tight">Center Overview</h1>
            <div className="flex items-center gap-6">
              <button className="p-2.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 rounded-xl transition-all cursor-pointer">
                <Bell className="h-5 w-5" />
              </button>
              <div className="h-8 w-px bg-zinc-100" />
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-zinc-900">{user?.fullName}</p>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Customer Portal</p>
                </div>
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="h-11 bg-zinc-950 text-white hover:bg-zinc-800 rounded-xl text-xs font-bold px-6 transition-all shadow-xl shadow-black/10 cursor-pointer active:scale-[0.98]"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Vehicle
                </Button>
              </div>
            </div>
          </header>

          <div className="p-10 space-y-10">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white p-7 rounded-[2.5rem] border border-zinc-100 shadow-sm relative overflow-hidden group">
                  <div className="relative z-10 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">{stat.label}</p>
                      <h4 className="text-2xl font-black text-zinc-950">{stat.value}</h4>
                      <p className="text-[10px] font-bold text-zinc-400 mt-1 uppercase tracking-tight">{stat.description}</p>
                    </div>
                    <div className={cn("p-4 rounded-2xl transition-all group-hover:scale-110 duration-500", stat.bg, stat.color)}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Upcoming Appointments */}
              <div className="bg-white border border-zinc-100 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col h-[480px]">
                <div className="p-8 px-10 border-b border-zinc-50 flex justify-between items-center bg-zinc-50/30">
                  <h3 className="text-xs font-black uppercase tracking-[0.15em] text-zinc-400">Scheduled Visits</h3>
                  <Link href="/dashboard/appointments" className="text-[10px] font-bold text-zinc-900 uppercase tracking-widest hover:underline decoration-2 underline-offset-4">View Calendar</Link>
                </div>

                <div className="flex-1 p-8 px-10 space-y-4 overflow-y-auto custom-scrollbar">
                  {dashboard?.data?.upcomingAppointments && dashboard.data.upcomingAppointments.length > 0 ? (
                    dashboard.data.upcomingAppointments.map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between p-5 bg-zinc-50/50 rounded-3xl border border-transparent hover:border-zinc-100 hover:bg-white transition-all duration-300 group cursor-pointer">
                        <div className="flex items-center gap-5">
                          <div className="flex flex-col items-center justify-center min-w-[52px] h-[52px] bg-white border border-zinc-100 rounded-2xl shadow-sm group-hover:bg-zinc-950 group-hover:text-white group-hover:border-zinc-950 transition-all duration-500">
                            <span className="text-[8px] font-black uppercase tracking-tighter opacity-50 leading-none mb-1">
                              {format(new Date(appointment.appointmentDate), 'MMM')}
                            </span>
                            <span className="text-lg font-black tabular-nums leading-none">
                              {format(new Date(appointment.appointmentDate), 'dd')}
                            </span>
                          </div>
                          <div>
                            <div className="font-black text-zinc-950 uppercase tracking-tight text-xs">
                              {appointment.serviceType}
                            </div>
                            <div className="text-[10px] font-bold text-zinc-400 mt-1 uppercase tracking-wide">
                              {appointment.plateNumber} • {format(new Date(appointment.appointmentDate), 'p')}
                            </div>
                          </div>
                        </div>
                        <div className={cn(
                          "px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest",
                          appointment.status.toLowerCase() === 'confirmed' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                        )}>
                          {appointment.status}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center py-20">
                      <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-4">
                        <Calendar className="h-6 w-6 text-zinc-300" />
                      </div>
                      <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-6">No upcoming visits</p>
                      <Button asChild variant="outline" className="h-10 rounded-xl text-[10px] font-black uppercase tracking-widest px-8 border-zinc-200 hover:bg-zinc-950 hover:text-white hover:border-zinc-950 transition-all">
                        <Link href="/dashboard/appointments">Book Now</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Invoices */}
              <div className="bg-white border border-zinc-100 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col h-[480px]">
                <div className="p-8 px-10 border-b border-zinc-50 flex justify-between items-center bg-zinc-50/30">
                  <h3 className="text-xs font-black uppercase tracking-[0.15em] text-zinc-400">Recent Purchases</h3>
                  <Link href="/dashboard/history" className="text-[10px] font-bold text-zinc-900 uppercase tracking-widest hover:underline decoration-2 underline-offset-4">Full History</Link>
                </div>

                <div className="flex-1 p-8 px-10 space-y-4 overflow-y-auto custom-scrollbar">
                  {dashboard?.data?.recentInvoices && dashboard.data.recentInvoices.length > 0 ? (
                    dashboard.data.recentInvoices.map((invoice) => (
                      <div key={invoice.id} className="flex items-center justify-between p-5 bg-zinc-50/50 rounded-3xl border border-transparent hover:border-zinc-100 hover:bg-white transition-all duration-300 group cursor-pointer">
                        <div className="flex items-center gap-5">
                          <div className="p-3.5 bg-white border border-zinc-100 rounded-2xl shadow-sm group-hover:bg-zinc-950 group-hover:text-white group-hover:border-zinc-950 transition-all duration-500">
                            <CreditCard className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-black text-zinc-950 uppercase tracking-tight text-xs">
                              {invoice.invoiceNumber}
                            </div>
                            <div className="text-[10px] font-bold text-zinc-400 mt-1 uppercase tracking-wide">
                              {format(new Date(invoice.date), 'MMM dd, yyyy')}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-black text-zinc-950 tracking-tight">
                            Rs. {invoice.totalAmount.toLocaleString()}
                          </div>
                          <div className="text-[8px] font-black uppercase tracking-widest text-emerald-600 mt-1">
                            {invoice.paymentStatus}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center py-20">
                      <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-4">
                        <History className="h-6 w-6 text-zinc-300" />
                      </div>
                      <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">No purchase history</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Vehicles Grid - Full Width */}
              <div className="md:col-span-2 bg-white border border-zinc-100 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col">
                <div className="p-8 px-10 border-b border-zinc-50 flex justify-between items-center bg-zinc-50/30">
                  <h3 className="text-xs font-black uppercase tracking-[0.15em] text-zinc-400">My Vehicles</h3>
                  <Link href="/dashboard/vehicles" className="text-[10px] font-bold text-zinc-900 uppercase tracking-widest hover:underline decoration-2 underline-offset-4">Manage Garage</Link>
                </div>

                <div className="p-8 px-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dashboard?.data?.recentVehicles && dashboard.data.recentVehicles.length > 0 ? (
                    dashboard.data.recentVehicles.map((vehicle) => (
                      <div key={vehicle.id} className="group relative p-6 bg-zinc-50/50 rounded-3xl border border-transparent hover:border-zinc-100 hover:bg-white transition-all duration-500 cursor-pointer overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <Settings className="h-4 w-4 text-zinc-400 hover:text-zinc-900 transition-colors" />
                        </div>
                        <div className="mb-6 inline-flex p-4 bg-white border border-zinc-100 rounded-2xl shadow-sm group-hover:bg-zinc-950 group-hover:text-white group-hover:border-zinc-950 transition-all duration-500">
                          <Car className="h-6 w-6" />
                        </div>
                        <h4 className="text-lg font-black text-zinc-950 tracking-tight uppercase leading-tight mb-1">{vehicle.plateNumber}</h4>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{vehicle.brand} {vehicle.model}</p>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-3 py-10 flex flex-col items-center justify-center text-center">
                      <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Your garage is empty</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>

        <VehicleModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </AuthGuard>
  );
}
