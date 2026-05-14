'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  useAllAppointmentsQuery, 
  useUpdateAppointmentStatusMutation, 
  useDeleteAppointmentMutation,
  useCompleteAppointmentMutation 
} from '@/hooks/api/useAppointmentApi';
import { CompleteAppointmentModal } from '@/components/staff/CompleteAppointmentModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { format } from 'date-fns';
import {
  Calendar as CalendarIcon,
  Search,
  Loader2,
  AlertCircle,
  MoreVertical,
  Clock,
  CheckCircle2,
  Trash2,
  XCircle,
  Filter
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

const STATUSES = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'];

function StaffAppointmentsContent() {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  const { data: appointmentsData, isLoading, isError } = useAllAppointmentsQuery(
    statusFilter === 'All' ? undefined : statusFilter
  );

  const updateStatusMutation = useUpdateAppointmentStatusMutation();
  const completeMutation = useCompleteAppointmentMutation();
  const deleteMutation = useDeleteAppointmentMutation();

  const appointments = appointmentsData || [];

  const filteredAppointments = appointments.filter((appointment: any) =>
    appointment.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.serviceType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (appointment: any) => {
    setSelectedAppointment(appointment);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedAppointment) {
      deleteMutation.mutate(selectedAppointment.id, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setSelectedAppointment(null);
        }
      });
    }
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    if (newStatus === 'Completed') {
      const appt = appointments.find((a: any) => a.id === id);
      setSelectedAppointment(appt);
      setIsCompleteModalOpen(true);
      return;
    }
    updateStatusMutation.mutate({ id, status: newStatus });
  };

  const confirmComplete = (data: any) => {
    if (selectedAppointment) {
      completeMutation.mutate({ 
        id: selectedAppointment.id, 
        request: data 
      }, {
        onSuccess: () => {
          setIsCompleteModalOpen(false);
          setSelectedAppointment(null);
        }
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'text-amber-500 bg-amber-50 border-amber-100';
      case 'confirmed': return 'text-blue-500 bg-blue-50 border-blue-100';
      case 'completed': return 'text-emerald-500 bg-emerald-50 border-emerald-100';
      case 'cancelled': return 'text-red-500 bg-red-50 border-red-100';
      default: return 'text-zinc-500 bg-zinc-50 border-zinc-100';
    }
  };

  return (
    <div className="p-10 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-900">Manage Appointments</h1>
          <p className="text-zinc-500 font-medium mt-1">View and update customer service appointments.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-zinc-200/50 shadow-sm">
        <div className="relative group w-full md:w-96">
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
          <Input
            placeholder="Search by plate number, vehicle, or service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 h-12 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 rounded-xl transition-all font-bold"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
          <Filter className="h-4 w-4 text-zinc-400 shrink-0 ml-2 md:ml-0" />
          {STATUSES.map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap",
                statusFilter === status
                  ? "bg-zinc-950 text-white shadow-md shadow-black/10"
                  : "bg-zinc-50 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
              )}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-8 w-8 text-zinc-900 animate-spin" strokeWidth={1.5} />
          <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Loading Appointments...</p>
        </div>
      ) : isError ? (
        <div className="h-64 flex flex-col items-center justify-center gap-4 text-center">
          <div className="p-4 bg-red-50 text-red-500 rounded-2xl">
            <AlertCircle className="h-8 w-8" />
          </div>
          <p className="text-lg font-bold text-zinc-900">Failed to load appointments</p>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="py-24 flex flex-col items-center justify-center text-center bg-white border border-zinc-200/50 rounded-[2.5rem] shadow-sm">
          <div className="w-20 h-20 bg-zinc-50 rounded-2xl flex items-center justify-center mb-6">
            <CalendarIcon className="h-10 w-10 text-zinc-200" strokeWidth={1.5} />
          </div>
          <h3 className="text-xl font-bold text-zinc-900 mb-2">No appointments found</h3>
          <p className="text-sm font-medium text-zinc-400 max-w-xs mx-auto">There are no appointments matching your current filters.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredAppointments.map((appointment: any) => (
            <div key={appointment.id} className="bg-white border border-zinc-200/50 rounded-2xl p-6 flex flex-col lg:flex-row lg:items-center justify-between shadow-sm hover:shadow-md transition-all gap-6">
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-center justify-center h-16 w-16 bg-zinc-50 rounded-2xl shrink-0">
                  <span className="text-xs font-black uppercase tracking-widest opacity-50 mb-0.5">
                    {format(new Date(appointment.appointmentDate), 'MMM')}
                  </span>
                  <span className="text-xl font-black tabular-nums leading-none">
                    {format(new Date(appointment.appointmentDate), 'dd')}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-black text-zinc-900 uppercase tracking-tight">{appointment.plateNumber}</h4>
                    <span className="text-zinc-300">•</span>
                    <span className="text-sm font-bold text-zinc-500">{appointment.vehicleName}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-bold text-zinc-400 mt-2">
                    <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {format(new Date(appointment.appointmentDate), 'p')}</span>
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" /> {appointment.serviceType}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <select
                  value={appointment.status}
                  onChange={(e) => handleStatusChange(appointment.id, e.target.value)}
                  disabled={updateStatusMutation.isPending || appointment.status === 'Completed'}
                  className={cn(
                    "px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border outline-none appearance-none transition-all min-w-[140px] text-center",
                    appointment.status === 'Completed' ? "cursor-not-allowed opacity-80" : "cursor-pointer",
                    getStatusColor(appointment.status)
                  )}
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-zinc-100 cursor-pointer">
                      <MoreVertical className="h-4 w-4 text-zinc-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 p-2 rounded-2xl border-zinc-100 shadow-xl shadow-black/5">
                    <DropdownMenuItem
                      className="rounded-xl font-bold text-xs uppercase tracking-widest py-3 cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50"
                      onClick={() => handleDeleteClick(appointment)}
                    >
                      <Trash2 className="mr-3 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Appointment"
        description="Are you sure you want to permanently delete this appointment? This action cannot be undone."
        confirmText="Delete Appointment"
        isDestructive={true}
        onConfirm={confirmDelete}
        onClose={() => setIsDeleteModalOpen(false)}
      />

      <CompleteAppointmentModal
        isOpen={isCompleteModalOpen}
        appointment={selectedAppointment}
        isSubmitting={completeMutation.isPending}
        onClose={() => setIsCompleteModalOpen(false)}
        onComplete={confirmComplete}
      />
    </div>
  );
}

export default function StaffAppointmentsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StaffAppointmentsContent />
    </Suspense>
  );
}
