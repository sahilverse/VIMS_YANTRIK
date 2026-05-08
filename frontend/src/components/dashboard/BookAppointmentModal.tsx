'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useBookAppointmentMutation, useUpdateAppointmentMutation } from '@/hooks/api/useAppointmentApi';
import { useMyVehiclesQuery } from '@/hooks/api/useVehicleApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Calendar,
  X,
  Loader2,
  CheckCircle2,
  Car,
  ChevronDown
} from 'lucide-react';
import { format, addDays } from 'date-fns';

const bookAppointmentSchema = z.object({
  vehicleId: z.string().min(1, 'Please select a vehicle'),
  serviceType: z.string().min(2, 'Service type is required'),
  appointmentDate: z.string().min(1, 'Please select a date and time'),
});

type FormValues = z.infer<typeof bookAppointmentSchema>;

interface BookAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment?: any; // Add this
}

const SERVICE_TYPES = [
  'Regular Maintenance',
  'Oil Change',
  'Brake Inspection/Repair',
  'Engine Diagnostic',
  'Tire Rotation/Replacement',
  'Battery Replacement',
  'Electrical System Repair',
  'AC Service',
  'Other'
];

export default function BookAppointmentModal({ isOpen, onClose, appointment }: BookAppointmentModalProps) {
  const { data: vehiclesData, isLoading: isVehiclesLoading } = useMyVehiclesQuery({ pageNumber: 1, pageSize: 50 });
  const bookMutation = useBookAppointmentMutation();
  const updateMutation = useUpdateAppointmentMutation();

  const isEditing = !!appointment;

  const minDate = format(new Date(), "yyyy-MM-dd'T'HH:mm");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(bookAppointmentSchema),
    defaultValues: {
      serviceType: appointment?.serviceType || 'Regular Maintenance',
      appointmentDate: appointment
        ? format(new Date(appointment.appointmentDate), "yyyy-MM-dd'T'HH:mm")
        : format(addDays(new Date(), 1), "yyyy-MM-dd'T'10:00"),
      vehicleId: appointment?.vehicleId || '',
    }
  });

  // Reset form when appointment changes
  React.useEffect(() => {
    if (appointment) {
      setValue('serviceType', appointment.serviceType);
      setValue('appointmentDate', format(new Date(appointment.appointmentDate), "yyyy-MM-dd'T'HH:mm"));
      setValue('vehicleId', appointment.vehicleId);
    } else {
      reset({
        serviceType: 'Regular Maintenance',
        appointmentDate: format(addDays(new Date(), 1), "yyyy-MM-dd'T'10:00"),
        vehicleId: '',
      });
    }
  }, [appointment, setValue, reset]);

  const onSubmit = async (data: FormValues) => {
    const requestData = {
      ...data,
      appointmentDate: new Date(data.appointmentDate).toISOString()
    };

    if (isEditing) {
      updateMutation.mutate({ id: appointment.id, request: requestData }, {
        onSuccess: () => {
          onClose();
        }
      });
    } else {
      bookMutation.mutate(requestData, {
        onSuccess: () => {
          reset();
          onClose();
        }
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-zinc-100 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 pb-6 flex items-center justify-between border-b border-zinc-50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-zinc-950 text-white rounded-2xl shadow-lg shadow-black/10">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-zinc-900">{isEditing ? 'Reschedule Appointment' : 'Book Appointment'}</h2>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-0.5">{isEditing ? 'Change your visit details' : 'Schedule your next service visit'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-50 rounded-xl transition-all cursor-pointer text-zinc-400 hover:text-zinc-900">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Select Vehicle</Label>
            <div className="relative group">
              <Car className="absolute left-4 top-3.5 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
              <select
                {...register('vehicleId')}
                className="w-full pl-11 pr-10 h-12 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 rounded-xl transition-all appearance-none font-bold text-sm outline-none"
                disabled={isVehiclesLoading || isEditing}
              >
                <option value="">Choose a vehicle...</option>
                {vehiclesData?.items.map((vehicle: any) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.plateNumber} - {vehicle.brand} {vehicle.model}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-4 h-4 w-4 text-zinc-400 pointer-events-none" />
            </div>
            {errors.vehicleId && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest ml-1">{errors.vehicleId.message}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Service Type</Label>
            <div className="relative group">
              <CheckCircle2 className="absolute left-4 top-3.5 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
              <select
                {...register('serviceType')}
                className="w-full pl-11 pr-10 h-12 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 rounded-xl transition-all appearance-none font-bold text-sm outline-none"
              >
                {SERVICE_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-4 h-4 w-4 text-zinc-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Date & Time</Label>
            <div className="relative group">
              <Calendar className="absolute left-4 top-3.5 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
              <Input
                {...register('appointmentDate')}
                type="datetime-local"
                min={minDate}
                className="pl-11 h-12 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 rounded-xl transition-all font-bold"
              />
            </div>
            {errors.appointmentDate && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest ml-1">{errors.appointmentDate.message}</p>}
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={bookMutation.isPending || updateMutation.isPending}
              className="w-full h-14 bg-zinc-950 text-white hover:bg-zinc-800 rounded-2xl text-sm font-black transition-all shadow-xl shadow-black/10 cursor-pointer active:scale-[0.98]"
            >
              {bookMutation.isPending || updateMutation.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>{isEditing ? 'Save Changes' : 'Confirm Booking'}</>
              )}
            </Button>
            <p className="text-[10px] font-bold text-zinc-400 text-center mt-4 uppercase tracking-widest">
              You can cancel or reschedule up to 24 hours before.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
