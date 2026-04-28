'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createVendorSchema, CreateVendorFormValues } from '@/lib/validations/admin';
import { useCreateVendorMutation } from '@/hooks/api/useVendorApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Truck, Loader2, ArrowRight } from 'lucide-react';

interface AddVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddVendorModal({ isOpen, onClose }: AddVendorModalProps) {
  const createMutation = useCreateVendorMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CreateVendorFormValues>({
    resolver: zodResolver(createVendorSchema),
  });

  const onSubmit = (data: CreateVendorFormValues) => {
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
      <div
        className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-zinc-100 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-zinc-50 flex items-center justify-between bg-zinc-50/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-zinc-950 text-white rounded-xl shadow-lg shadow-black/10">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900">Add Vendor</h2>
              <p className="text-xs font-medium text-zinc-400">Register a new supplier.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          {createMutation.isError && (
            <div className="p-4 bg-red-50 border border-red-100 text-xs font-bold text-red-600 rounded-xl">
              {(createMutation.error as any)?.response?.data?.message || 'Failed to create vendor. Please try again.'}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider ml-1" htmlFor="companyName">Company Name</label>
            <Input
              {...register('companyName')}
              id="companyName"
              placeholder="e.g. AutoParts Inc."
              className={`h-11 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 rounded-xl text-sm font-medium transition-all outline-none focus-visible:ring-0 ${errors.companyName ? 'border-red-200 bg-red-50/20' : ''}`}
            />
            {errors.companyName && <p className="text-[10px] font-bold text-red-600 mt-1 ml-1">{errors.companyName.message}</p>}
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider ml-1" htmlFor="contactPerson">Contact Person</label>
              <Input
                {...register('contactPerson')}
                id="contactPerson"
                placeholder="John Doe"
                className={`h-11 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 rounded-xl text-sm font-medium transition-all outline-none focus-visible:ring-0 ${errors.contactPerson ? 'border-red-200 bg-red-50/20' : ''}`}
              />
              {errors.contactPerson && <p className="text-[10px] font-bold text-red-600 mt-1 ml-1">{errors.contactPerson.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider ml-1" htmlFor="phone">Phone</label>
              <Input
                {...register('phone')}
                id="phone"
                placeholder="+1 234..."
                className={`h-11 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 rounded-xl text-sm font-medium transition-all outline-none focus-visible:ring-0 ${errors.phone ? 'border-red-200 bg-red-50/20' : ''}`}
              />
              {errors.phone && <p className="text-[10px] font-bold text-red-600 mt-1 ml-1">{errors.phone.message}</p>}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider ml-1" htmlFor="email">Email (Optional)</label>
              <Input
                {...register('email')}
                id="email"
                type="email"
                placeholder="contact@company.com"
                className={`h-11 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 rounded-xl text-sm font-medium transition-all outline-none focus-visible:ring-0 ${errors.email ? 'border-red-200 bg-red-50/20' : ''}`}
              />
              {errors.email && <p className="text-[10px] font-bold text-red-600 mt-1 ml-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider ml-1" htmlFor="address">Address (Optional)</label>
              <Input
                {...register('address')}
                id="address"
                placeholder="123 Main St..."
                className={`h-11 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 rounded-xl text-sm font-medium transition-all outline-none focus-visible:ring-0 ${errors.address ? 'border-red-200 bg-red-50/20' : ''}`}
              />
              {errors.address && <p className="text-[10px] font-bold text-red-600 mt-1 ml-1">{errors.address.message}</p>}
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-12 border-zinc-200 rounded-xl text-sm font-bold hover:bg-zinc-50 transition-all cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="flex-[2] h-12 bg-zinc-950 text-white hover:bg-zinc-800 rounded-xl text-sm font-bold transition-all shadow-xl shadow-black/10 cursor-pointer active:scale-[0.98]"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  Add Vendor <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
