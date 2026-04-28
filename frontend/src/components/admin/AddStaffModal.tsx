'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createStaffSchema, CreateStaffFormValues } from '@/lib/validations/auth';
import { useCreateStaffMutation } from '@/hooks/api/useUserApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  X,
  UserPlus,
  Loader2,
  ArrowRight
} from 'lucide-react';

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddStaffModal({ isOpen, onClose }: AddStaffModalProps) {
  const createStaffMutation = useCreateStaffMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CreateStaffFormValues>({
    resolver: zodResolver(createStaffSchema),
    defaultValues: {
      role: 'Staff'
    }
  });

  const onSubmit = (data: CreateStaffFormValues) => {
    createStaffMutation.mutate(data, {
      onSuccess: () => {
        reset();
        onClose();
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-zinc-100 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-zinc-50 flex items-center justify-between bg-zinc-50/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-zinc-950 text-white rounded-xl shadow-lg shadow-black/10">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900">Add Team Member</h2>
              <p className="text-xs font-medium text-zinc-400">Register a new staff or admin user.</p>
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
          {createStaffMutation.isError && (
            <div className="p-4 bg-red-50 border border-red-100 text-xs font-bold text-red-600 rounded-xl">
              {(createStaffMutation.error as any)?.response?.data?.message || 'Failed to create user. Please try again.'}
            </div>
          )}

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider ml-1" htmlFor="fullName">Full Name</label>
              <div className="relative group">
                <Input
                  {...register('fullName')}
                  id="fullName"
                  placeholder="Full Name"
                  className={`h-11 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 rounded-xl text-sm font-medium transition-all outline-none focus-visible:ring-0 ${errors.fullName ? 'border-red-200 bg-red-50/20' : ''}`}
                />
              </div>
              {errors.fullName && <p className="text-[10px] font-bold text-red-600 mt-1 ml-1">{errors.fullName.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider ml-1" htmlFor="email">Work Email</label>
              <div className="relative group">
                <Input
                  {...register('email')}
                  id="email"
                  type="email"
                  placeholder="staff@yantrik.com"
                  className={`h-11 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 rounded-xl text-sm font-medium transition-all outline-none focus-visible:ring-0 ${errors.email ? 'border-red-200 bg-red-50/20' : ''}`}
                />
              </div>
              {errors.email && <p className="text-[10px] font-bold text-red-600 mt-1 ml-1">{errors.email.message}</p>}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider ml-1" htmlFor="phone">Phone Number</label>
              <Input
                {...register('phone')}
                id="phone"
                placeholder="+1 234..."
                className={`h-11 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 rounded-xl text-sm font-medium transition-all outline-none focus-visible:ring-0 ${errors.phone ? 'border-red-200 bg-red-50/20' : ''}`}
              />
              {errors.phone && <p className="text-[10px] font-bold text-red-600 mt-1 ml-1">{errors.phone.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider ml-1" htmlFor="role">Account Role</label>
              <select
                {...register('role')}
                id="role"
                className="w-full h-11 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 rounded-xl text-sm font-bold transition-all outline-none px-4 appearance-none cursor-pointer"
              >
                <option value="Staff">Staff Member</option>
                <option value="Admin">System Admin</option>
              </select>
              {errors.role && <p className="text-[10px] font-bold text-red-600 mt-1 ml-1">{errors.role.message}</p>}
            </div>
          </div>

          <div className="p-4 bg-zinc-50/50 rounded-2xl border border-zinc-100 mt-4">
            <p className="text-[10px] font-medium text-zinc-500 leading-relaxed">
              A secure temporary password will be automatically generated and sent to the provided work email. The user will be required to create a new password upon their first login.
            </p>
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
              disabled={createStaffMutation.isPending}
              className="flex-[2] h-12 bg-zinc-950 text-white hover:bg-zinc-800 rounded-xl text-sm font-bold transition-all shadow-xl shadow-black/10 cursor-pointer active:scale-[0.98]"
            >
              {createStaffMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Register Member <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
