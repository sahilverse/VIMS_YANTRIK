'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreatePartRequestMutation } from '@/hooks/api/useAppointmentApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Package, 
  X,
  Loader2,
  FileText,
  AlertTriangle
} from 'lucide-react';

const partRequestSchema = z.object({
  partName: z.string().min(2, 'Part name must be at least 2 characters'),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof partRequestSchema>;

interface PartRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PartRequestModal({ isOpen, onClose }: PartRequestModalProps) {
  const createMutation = useCreatePartRequestMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(partRequestSchema),
    defaultValues: {
      partName: '',
      notes: '',
    }
  });

  const onSubmit = async (data: FormValues) => {
    createMutation.mutate(data, {
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
              <Package className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-zinc-900">Request a Part</h2>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-0.5">Let us find it for you</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-50 rounded-xl transition-all cursor-pointer text-zinc-400 hover:text-zinc-900">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex gap-4 items-start">
            <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-xs font-medium text-amber-800 leading-relaxed">
              Use this form only if you couldn't find the part in our store. We will contact you once we've sourced it.
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Part Name</Label>
            <div className="relative group">
              <Package className="absolute left-4 top-3.5 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
              <Input 
                {...register('partName')}
                placeholder="e.g. Brake Pads for 2022 Toyota Camry"
                className="pl-11 h-12 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 rounded-xl transition-all font-bold"
              />
            </div>
            {errors.partName && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest ml-1">{errors.partName.message}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Additional Notes (Optional)</Label>
            <div className="relative group">
              <FileText className="absolute left-4 top-3.5 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
              <textarea 
                {...register('notes')}
                rows={4}
                placeholder="Any specific details, OEM numbers, or preferences..."
                className="w-full pl-11 pr-4 py-3 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 rounded-xl transition-all font-bold text-sm outline-none resize-none"
              />
            </div>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="w-full h-14 bg-zinc-950 text-white hover:bg-zinc-800 rounded-2xl text-sm font-black transition-all shadow-xl shadow-black/10 cursor-pointer active:scale-[0.98]"
            >
              {createMutation.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>Submit Request</>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
