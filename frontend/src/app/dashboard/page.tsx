'use client';

import { AuthGuard } from '@/components/auth/AuthGuard';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Bell, ChevronRight, Plus, Calendar, CreditCard, Car, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CustomerSidebar } from '@/components/dashboard/CustomerSidebar';
import { useMyVehiclesQuery } from '@/hooks/api/useVehicleApi';
import { useMyAppointmentsQuery } from '@/hooks/api/useAppointmentApi';
import VehicleModal from '@/components/dashboard/VehicleModal';
import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: vehiclesData, isLoading: isVehiclesLoading } = useMyVehiclesQuery({ pageNumber: 1, pageSize: 3 });
  const { data: appointments, isLoading: isAppointmentsLoading } = useMyAppointmentsQuery();

  const upcomingAppointments = appointments?.filter((a: any) => 
    a.status.toLowerCase() !== 'cancelled' && 
    a.status.toLowerCase() !== 'completed'
  ).slice(0, 2);

  return (
    <AuthGuard roles={['Customer']}>
      <div className="flex min-h-screen bg-white text-zinc-900 font-sans selection:bg-zinc-950 selection:text-white">
        <CustomerSidebar />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-zinc-50/30">
          <header className="h-20 border-b border-zinc-100 flex items-center justify-between px-10 sticky top-0 bg-white/80 backdrop-blur-md z-10">
            <h1 className="text-xl font-bold tracking-tight">Dashboard</h1>
            <div className="flex items-center gap-6">
              <button className="p-2.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 rounded-xl transition-all cursor-pointer">
                <Bell className="h-5 w-5" />
              </button>
              <div className="h-8 w-px bg-zinc-100" />
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-zinc-900">{user?.fullName}</p>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Customer</p>
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
            <div className="grid gap-8 md:grid-cols-3">
              {/* Profile Card */}
              <div className="p-8 bg-white border border-zinc-200/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-52 cursor-pointer group">
                <div>
                  <label className="text-[11px] font-bold text-zinc-400 mb-4 block uppercase tracking-widest group-hover:text-zinc-900 transition-colors">My Profile</label>
                  <h3 className="text-2xl font-bold truncate text-zinc-900">{user?.fullName}</h3>
                  <p className="text-xs font-medium text-zinc-500 mt-1">{user?.email}</p>
                </div>
                <button className="flex items-center text-[10px] font-bold text-zinc-900 uppercase tracking-widest hover:underline cursor-pointer group">
                  Edit Details <ChevronRight className="h-3 w-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              {/* Reward/Status Card */}
              <div className="p-8 bg-white border border-zinc-200/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 h-52 flex flex-col justify-center items-center text-center cursor-pointer group">
                <label className="text-[11px] font-bold text-zinc-400 mb-4 block uppercase tracking-widest group-hover:text-zinc-900 transition-colors">Membership</label>
                <div className="text-4xl font-extrabold tracking-tight text-zinc-900">0</div>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-4 px-4 py-1.5 bg-zinc-50 rounded-full">Bronze Status</p>
              </div>

              {/* Action Card */}
              <div className="p-8 bg-white border border-zinc-200/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 space-y-4 h-52 flex flex-col justify-center">
                <Button variant="outline" className="w-full justify-start text-[11px] font-bold uppercase tracking-widest h-12 border-zinc-200 rounded-xl cursor-pointer px-5 hover:bg-zinc-50 transition-all">
                  <Calendar className="h-4 w-4 mr-3 text-zinc-400" /> Book Service
                </Button>
                <Button variant="outline" className="w-full justify-start text-[11px] font-bold uppercase tracking-widest h-12 border-zinc-200 rounded-xl cursor-pointer px-5 hover:bg-zinc-50 transition-all">
                  <CreditCard className="h-4 w-4 mr-3 text-zinc-400" /> Make Payment
                </Button>
              </div>

              {/* Main Data Section */}
              <div className="md:col-span-3 grid md:grid-cols-2 gap-8 mt-2">
                {/* Vehicles List */}
                <div className="bg-white border border-zinc-200/50 rounded-3xl shadow-sm overflow-hidden flex flex-col">
                  <div className="p-6 px-10 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                    <h3 className="text-xs font-black uppercase tracking-[0.15em] text-zinc-400">Your Vehicles</h3>
                    <Link href="/dashboard/vehicles" className="text-[10px] font-bold text-zinc-900 uppercase tracking-widest hover:underline transition-all">View All</Link>
                  </div>

                  {isVehiclesLoading ? (
                    <div className="flex-1 p-20 flex justify-center items-center">
                      <Loader2 className="h-6 w-6 animate-spin text-zinc-200" />
                    </div>
                  ) : vehiclesData?.items && vehiclesData.items.length > 0 ? (
                    <div className="p-6 px-10 space-y-4">
                      {vehiclesData.items.map((vehicle: any) => (
                        <div key={vehicle.id} className="flex items-center justify-between p-4 bg-zinc-50/50 rounded-2xl border border-transparent hover:border-zinc-200 hover:bg-white transition-all group cursor-pointer">
                          <div className="flex items-center gap-4">
                            <div className="p-2.5 bg-white border border-zinc-100 rounded-xl shadow-sm group-hover:bg-zinc-950 group-hover:text-white group-hover:border-zinc-950 transition-all">
                              <Car className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="font-black text-zinc-950 uppercase tracking-tight text-xs">
                                {vehicle.plateNumber}
                              </div>
                              <div className="text-[10px] font-bold text-zinc-400 mt-0.5">
                                {vehicle.brand} {vehicle.model}
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="h-3 w-3 text-zinc-300 group-hover:text-zinc-900 transition-colors" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex-1 p-12 flex flex-col items-center justify-center text-center">
                      <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">No vehicles added</p>
                    </div>
                  )}
                </div>

                {/* Upcoming Appointments */}
                <div className="bg-white border border-zinc-200/50 rounded-3xl shadow-sm overflow-hidden flex flex-col">
                  <div className="p-6 px-10 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                    <h3 className="text-xs font-black uppercase tracking-[0.15em] text-zinc-400">Scheduled Visits</h3>
                    <Link href="/dashboard/appointments" className="text-[10px] font-bold text-zinc-900 uppercase tracking-widest hover:underline transition-all">All Visits</Link>
                  </div>

                  {isAppointmentsLoading ? (
                    <div className="flex-1 p-20 flex justify-center items-center">
                      <Loader2 className="h-6 w-6 animate-spin text-zinc-200" />
                    </div>
                  ) : upcomingAppointments && upcomingAppointments.length > 0 ? (
                    <div className="p-6 px-10 space-y-4">
                      {upcomingAppointments.map((appointment: any) => (
                        <div key={appointment.id} className="flex items-center justify-between p-4 bg-zinc-50/50 rounded-2xl border border-transparent hover:border-zinc-200 hover:bg-white transition-all group cursor-pointer">
                          <div className="flex items-center gap-4">
                            <div className="flex flex-col items-center justify-center min-w-[44px] h-[44px] bg-white border border-zinc-100 rounded-xl shadow-sm group-hover:bg-zinc-950 group-hover:text-white group-hover:border-zinc-950 transition-all">
                              <span className="text-[8px] font-black uppercase tracking-tighter opacity-50 leading-none mb-0.5">
                                {format(new Date(appointment.appointmentDate), 'MMM')}
                              </span>
                              <span className="text-sm font-black tabular-nums leading-none">
                                {format(new Date(appointment.appointmentDate), 'dd')}
                              </span>
                            </div>
                            <div>
                              <div className="font-black text-zinc-950 uppercase tracking-tight text-xs">
                                {appointment.serviceType}
                              </div>
                              <div className="text-[10px] font-bold text-zinc-400 mt-0.5">
                                {appointment.plateNumber} • {format(new Date(appointment.appointmentDate), 'p')}
                              </div>
                            </div>
                          </div>
                          <div className={cn(
                            "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                            appointment.status.toLowerCase() === 'confirmed' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                          )}>
                            {appointment.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex-1 p-12 flex flex-col items-center justify-center text-center">
                      <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">No upcoming visits</p>
                      <Button 
                        asChild 
                        variant="outline" 
                        size="sm" 
                        className="h-8 rounded-lg text-[10px] font-black uppercase tracking-widest px-4 border-zinc-100"
                      >
                        <Link href="/dashboard/appointments">Book Now</Link>
                      </Button>
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
