'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { vehicleInfoSchema } from '@/lib/validations/customer';
import { useAddVehicleMutation, useUpdateVehicleMutation } from '@/hooks/api/useVehicleApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Car,
  Hash,
  Calendar,
  X,
  Loader2,
  Plus,
  Save,
  Edit2
} from 'lucide-react';
import { Vehicle, VehicleRegistrationRequest } from '@/types';

interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle?: Vehicle | null;
}

type FormValues = z.infer<typeof vehicleInfoSchema>;

export default function VehicleModal({ isOpen, onClose, vehicle }: VehicleModalProps) {
  const isEdit = !!vehicle;
  const addMutation = useAddVehicleMutation();
  const updateMutation = useUpdateVehicleMutation();

  const currentMutation = isEdit ? updateMutation : addMutation;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(vehicleInfoSchema),
    defaultValues: {
      plateNumber: '',
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      vin: ''
    }
  });

  useEffect(() => {
    if (isOpen) {
      if (vehicle) {
        reset({
          plateNumber: vehicle.plateNumber,
          brand: vehicle.brand || '',
          model: vehicle.model || '',
          year: vehicle.year || new Date().getFullYear(),
          vin: vehicle.vin || ''
        });
      } else {
        reset({
          plateNumber: '',
          brand: '',
          model: '',
          year: new Date().getFullYear(),
          vin: ''
        });
      }
    }
  }, [isOpen, vehicle, reset]);

  const onSubmit = async (data: FormValues) => {
    if (isEdit && vehicle) {
      updateMutation.mutate({ id: vehicle.id, request: data as VehicleRegistrationRequest }, {
        onSuccess: () => {
          onClose();
        }
      });
    } else {
      addMutation.mutate(data as VehicleRegistrationRequest, {
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
              {isEdit ? <Edit2 className="h-5 w-5" /> : <Car className="h-5 w-5" />}
            </div>
            <div>
              <h2 className="text-xl font-black text-zinc-900">{isEdit ? 'Edit Vehicle' : 'Add Vehicle'}</h2>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-0.5">
                {isEdit ? `Updating ${vehicle.plateNumber}` : 'Register a new vehicle to your profile'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-50 rounded-xl transition-all cursor-pointer text-zinc-400 hover:text-zinc-900">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Plate Number</Label>
              <div className="relative group">
                <Hash className="absolute left-4 top-3.5 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
                <Input
                  {...register('plateNumber')}
                  placeholder="e.g. BA 2 PA 1234"
                  className="pl-11 h-12 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 rounded-xl transition-all uppercase font-bold"
                />
              </div>
              {errors.plateNumber && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest ml-1">{errors.plateNumber.message as string}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">VIN (Optional)</Label>
              <div className="relative group">
                <Hash className="absolute left-4 top-3.5 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
                <Input
                  {...register('vin')}
                  placeholder="Chassis Number"
                  className="pl-11 h-12 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 rounded-xl transition-all uppercase"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Brand</Label>
              <Input
                {...register('brand')}
                placeholder="e.g. Yamaha"
                className="h-12 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 rounded-xl transition-all font-bold"
              />
              {errors.brand && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest ml-1">{errors.brand.message as string}</p>}
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Model</Label>
              <Input
                {...register('model')}
                placeholder="e.g. FZ-S V3"
                className="h-12 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 rounded-xl transition-all font-bold"
              />
              {errors.model && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest ml-1">{errors.model.message as string}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Year</Label>
            <div className="relative group">
              <Calendar className="absolute left-4 top-3.5 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
              <Input
                {...register('year', { valueAsNumber: true })}
                type="number"
                className="pl-11 h-12 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 rounded-xl transition-all font-bold"
              />
            </div>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={currentMutation.isPending}
              className="w-full h-14 bg-zinc-950 text-white hover:bg-zinc-800 rounded-2xl text-sm font-black transition-all shadow-xl shadow-black/10 cursor-pointer active:scale-[0.98]"
            >
              {currentMutation.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  {isEdit ? <Save className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                  {isEdit ? 'Update Vehicle' : 'Register Vehicle'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
