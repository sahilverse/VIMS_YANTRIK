'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { vehicleInfoSchema } from '@/lib/validations/customer';
import { useAddVehicleMutation } from '@/hooks/api/useVehicleApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Plus, 
  Car, 
  Hash, 
  Calendar, 
  X,
  Loader2
} from 'lucide-react';

interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddVehicleModal({ isOpen, onClose }: AddVehicleModalProps) {
  const addMutation = useAddVehicleMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(vehicleInfoSchema),
    defaultValues: {
      year: new Date().getFullYear(),
    }
  });

  const onSubmit = async (data: any) => {
    addMutation.mutate(data, {
      onSuccess: () => {
        reset();
        onClose();
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-zinc-100 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 pb-6 flex items-center justify-between border-b border-zinc-50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-zinc-950 text-white rounded-2xl shadow-lg shadow-black/10">
              <Car className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-zinc-900">Add Vehicle</h2>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-0.5">Register a new vehicle to your profile</p>
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
                {...register('year')}
                type="number"
                className="pl-11 h-12 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 rounded-xl transition-all font-bold"
              />
            </div>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={addMutation.isPending}
              className="w-full h-14 bg-zinc-950 text-white hover:bg-zinc-800 rounded-2xl text-sm font-black transition-all shadow-xl shadow-black/10 cursor-pointer active:scale-[0.98]"
            >
              {addMutation.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>Register Vehicle</>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
