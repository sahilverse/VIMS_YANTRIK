'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { AuthGuard } from '@/components/auth/AuthGuard';
import {
  useMyAppointmentsQuery,
  useCancelAppointmentMutation,
  useMyPartRequestsQuery
} from '@/hooks/api/useAppointmentApi';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Clock,
  Car,
  MoreVertical,
  XCircle,
  Plus,
  Loader2,
  AlertCircle,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CustomerSidebar } from '@/components/dashboard/CustomerSidebar';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { format } from 'date-fns';
import BookAppointmentModal from '@/components/dashboard/BookAppointmentModal';
import PartRequestModal from '@/components/dashboard/PartRequestModal';
import { cn } from '@/lib/utils';

export default function AppointmentsPage() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'appointments' | 'parts'>('appointments');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'parts') {
      setActiveTab('parts');
    } else if (tab === 'appointments') {
      setActiveTab('appointments');
    }
  }, [searchParams]);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isPartModalOpen, setIsPartModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [editingAppointment, setEditingAppointment] = useState<any>(null);

  const { data: appointments, isLoading, isError } = useMyAppointmentsQuery();
  const cancelMutation = useCancelAppointmentMutation();

  const handleCancelClick = (appointment: any) => {
    setSelectedAppointment(appointment);
    setIsCancelModalOpen(true);
  };

  const handleEditClick = (appointment: any) => {
    setEditingAppointment(appointment);
    setIsBookModalOpen(true);
  };

  const closeBookModal = () => {
    setIsBookModalOpen(false);
    setEditingAppointment(null);
  };

  const confirmCancel = () => {
    if (selectedAppointment) {
      cancelMutation.mutate(selectedAppointment.id, {
        onSuccess: () => {
          setIsCancelModalOpen(false);
          setSelectedAppointment(null);
        }
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'text-amber-500 bg-amber-50 border-amber-100';
      case 'confirmed': return 'text-emerald-500 bg-emerald-50 border-emerald-100';
      case 'cancelled': return 'text-red-500 bg-red-50 border-red-100';
      case 'completed': return 'text-blue-500 bg-blue-50 border-blue-100';
      default: return 'text-zinc-500 bg-zinc-50 border-zinc-100';
    }
  };

  return (
    <AuthGuard roles={['Customer']}>
      <div className="flex min-h-screen bg-white text-zinc-900 font-sans selection:bg-zinc-950 selection:text-white">
        <CustomerSidebar />
        <main className="flex-1 overflow-y-auto bg-zinc-50/30 pb-20">
          <div className="p-10 space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black tracking-tight text-zinc-900">Service & Parts</h1>
                <p className="text-zinc-500 font-medium mt-1">Schedule maintenance or request unavailable parts.</p>
              </div>
              <div className="flex items-center gap-3">
                {activeTab === 'appointments' ? (
                  <Button
                    onClick={() => setIsBookModalOpen(true)}
                    className="h-12 bg-zinc-950 text-white hover:bg-zinc-800 rounded-2xl text-sm font-bold px-8 transition-all shadow-xl shadow-black/10 cursor-pointer active:scale-[0.98]"
                  >
                    <Plus className="h-5 w-5 mr-2" /> Book Appointment
                  </Button>
                ) : (
                  <Button
                    onClick={() => setIsPartModalOpen(true)}
                    className="h-12 bg-zinc-950 text-white hover:bg-zinc-800 rounded-2xl text-sm font-bold px-8 transition-all shadow-xl shadow-black/10 cursor-pointer active:scale-[0.98]"
                  >
                    <Plus className="h-5 w-5 mr-2" /> New Request
                  </Button>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 p-1 bg-zinc-100 rounded-2xl w-fit">
              <button
                onClick={() => setActiveTab('appointments')}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer",
                  activeTab === 'appointments'
                    ? "bg-white text-zinc-900 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-600"
                )}
              >
                Appointments
              </button>
              <button
                onClick={() => setActiveTab('parts')}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer",
                  activeTab === 'parts'
                    ? "bg-white text-zinc-900 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-600"
                )}
              >
                Part Requests
              </button>
            </div>

            {activeTab === 'appointments' ? (
              isLoading ? (
                <div className="h-96 flex flex-col items-center justify-center gap-4">
                  <Loader2 className="h-10 w-10 text-zinc-900 animate-spin" strokeWidth={1.5} />
                  <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Loading Appointments...</p>
                </div>
              ) : isError ? (
                <div className="h-96 flex flex-col items-center justify-center gap-4 text-center">
                  <div className="p-4 bg-red-50 text-red-500 rounded-2xl">
                    <AlertCircle className="h-10 w-10" />
                  </div>
                  <p className="text-lg font-bold text-zinc-900">Failed to load appointments</p>
                  <p className="text-sm text-zinc-500">Please try again later.</p>
                </div>
              ) : appointments?.length === 0 ? (
                <div className="py-24 flex flex-col items-center justify-center text-center bg-white border border-zinc-200/50 rounded-[2.5rem] shadow-sm">
                  <div className="w-20 h-20 bg-zinc-50 rounded-2xl flex items-center justify-center mb-6">
                    <Calendar className="h-10 w-10 text-zinc-200" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 mb-2">No appointments yet</h3>
                  <Button
                    onClick={() => setIsBookModalOpen(true)}
                    variant="outline"
                    className="mt-8 h-12 rounded-xl border-zinc-200 font-bold px-8"
                  >
                    Schedule Now
                  </Button>
                </div>
              ) : (
                <div className="grid gap-6">
                  {appointments?.map((appointment: any) => (
                    <div
                      key={appointment.id}
                      className="bg-white border border-zinc-200/50 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
                    >
                      <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                        <div className="flex flex-col items-center justify-center min-w-[100px] py-4 px-6 bg-zinc-50 rounded-2xl group-hover:bg-zinc-950 group-hover:text-white transition-all duration-500">
                          <span className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1">
                            {format(new Date(appointment.appointmentDate), 'MMM')}
                          </span>
                          <span className="text-3xl font-black tabular-nums">
                            {format(new Date(appointment.appointmentDate), 'dd')}
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-widest opacity-50 mt-1">
                            {format(new Date(appointment.appointmentDate), 'EEE')}
                          </span>
                        </div>

                        <div className="flex-1 space-y-4 w-full">
                          <div className="flex items-center justify-between">
                            <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-[0.15em] ${getStatusColor(appointment.status)}`}>
                              {appointment.status}
                            </div>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-zinc-100 cursor-pointer">
                                  <MoreVertical className="h-4 w-4 text-zinc-400" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-zinc-100 shadow-xl shadow-black/5">
                                {(appointment.status.toLowerCase() === 'pending' || appointment.status.toLowerCase() === 'confirmed') && (
                                  <>
                                    <DropdownMenuItem
                                      className="rounded-xl font-bold text-xs uppercase tracking-widest py-3 cursor-pointer focus:bg-zinc-50"
                                      onClick={() => handleEditClick(appointment)}
                                    >
                                      <Clock className="mr-3 h-4 w-4 text-zinc-400" /> Reschedule
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="rounded-xl font-bold text-xs uppercase tracking-widest py-3 cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50"
                                      onClick={() => handleCancelClick(appointment)}
                                    >
                                      <XCircle className="mr-3 h-4 w-4" /> Cancel Appointment
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          <div className="flex flex-col md:flex-row md:items-center gap-6">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Vehicle</label>
                              <div className="flex items-center gap-3">
                                <Car className="h-4 w-4 text-zinc-400" />
                                <span className="font-black text-zinc-900 uppercase tracking-tight">{appointment.plateNumber}</span>
                                <span className="text-zinc-400 font-bold text-xs">•</span>
                                <span className="text-xs font-bold text-zinc-500">{appointment.vehicleName}</span>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Service Type</label>
                              <div className="flex items-center gap-3">
                                <CheckCircle2 className="h-4 w-4 text-zinc-400" />
                                <span className="text-sm font-bold text-zinc-900">{appointment.serviceType}</span>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Time</label>
                              <div className="flex items-center gap-3">
                                <Clock className="h-4 w-4 text-zinc-400" />
                                <span className="text-sm font-bold text-zinc-900">{format(new Date(appointment.appointmentDate), 'p')}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <PartRequestsList onNewRequest={() => setIsPartModalOpen(true)} />
            )}
          </div>
        </main>

        <BookAppointmentModal
          isOpen={isBookModalOpen}
          onClose={closeBookModal}
          appointment={editingAppointment}
        />

        <PartRequestModal
          isOpen={isPartModalOpen}
          onClose={() => setIsPartModalOpen(false)}
        />

        <ConfirmModal
          isOpen={isCancelModalOpen}
          title="Cancel Appointment"
          description={`Are you sure you want to cancel your appointment for ${selectedAppointment?.plateNumber} on ${selectedAppointment ? format(new Date(selectedAppointment.appointmentDate), 'PPp') : ''}?`}
          confirmText="Yes, Cancel Appointment"
          isDestructive={true}
          onConfirm={confirmCancel}
          onClose={() => setIsCancelModalOpen(false)}
        />
      </div>
    </AuthGuard>
  );
}

function PartRequestsList({ onNewRequest }: { onNewRequest: () => void }) {
  const { data: requests, isLoading, isError } = useMyPartRequestsQuery();

  if (isLoading) return (
    <div className="h-96 flex flex-col items-center justify-center gap-4">
      <Loader2 className="h-10 w-10 text-zinc-900 animate-spin" strokeWidth={1.5} />
      <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Loading Part Requests...</p>
    </div>
  );

  if (isError) return (
    <div className="h-96 flex flex-col items-center justify-center gap-4 text-center">
      <div className="p-4 bg-red-50 text-red-500 rounded-2xl">
        <AlertCircle className="h-10 w-10" />
      </div>
      <p className="text-lg font-bold text-zinc-900">Failed to load part requests</p>
    </div>
  );

  if (requests?.length === 0) return (
    <div className="py-24 flex flex-col items-center justify-center text-center bg-white border border-zinc-200/50 rounded-[2.5rem] shadow-sm">
      <div className="w-20 h-20 bg-zinc-50 rounded-2xl flex items-center justify-center mb-6">
        <AlertTriangle className="h-10 w-10 text-zinc-200" strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-bold text-zinc-900 mb-2">No part requests yet</h3>
      <p className="text-sm font-medium text-zinc-400 max-w-xs mx-auto">Can't find a specific part? Request it and we'll notify you when it's available.</p>
      <Button
        onClick={onNewRequest}
        variant="outline"
        className="mt-8 h-12 rounded-xl border-zinc-200 font-bold px-8"
      >
        Request Now
      </Button>
    </div>
  );

  return (
    <div className="grid gap-4">
      {requests?.map((request: any) => (
        <div key={request.id} className="bg-white border border-zinc-200/50 rounded-2xl p-6 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <h4 className="font-black text-zinc-900 uppercase tracking-tight">{request.partName}</h4>
            <p className="text-xs font-bold text-zinc-500">{request.notes || 'No additional notes'}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                Requested on {format(new Date(request.createdAt), 'PP')}
              </span>
            </div>
          </div>
          <div className={cn(
            "px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-[0.15em]",
            request.status.toLowerCase() === 'requested' ? "text-amber-500 bg-amber-50 border-amber-100" :
              request.status.toLowerCase() === 'available' ? "text-emerald-500 bg-emerald-50 border-emerald-100" :
                "text-zinc-500 bg-zinc-50 border-zinc-100"
          )}>
            {request.status}
          </div>
        </div>
      ))}
    </div>
  );
}
