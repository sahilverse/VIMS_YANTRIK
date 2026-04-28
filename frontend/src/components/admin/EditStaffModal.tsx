'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateStaffSchema, UpdateStaffFormValues } from '@/lib/validations/admin';
import { useUpdateStaffMutation } from '@/hooks/api/useUserApi';
import { UserDto } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Edit3, Loader2, ArrowRight } from 'lucide-react';

interface EditStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: UserDto | null;
}

export default function EditStaffModal({ isOpen, onClose, staff }: EditStaffModalProps) {
  const updateMutation = useUpdateStaffMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<UpdateStaffFormValues>({
    resolver: zodResolver(updateStaffSchema),
  });

  useEffect(() => {
    if (staff) {
      reset({
        fullName: staff.fullName,
        email: staff.email,
        phone: staff.phone || '',
        role: staff.role as 'Admin' | 'Staff',
      });
    }
  }, [staff, reset]);

  const onSubmit = (data: UpdateStaffFormValues) => {
    if (!staff) return;
    updateMutation.mutate(
      { id: staff.id, data },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  if (!isOpen || !staff) return null;

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
              <Edit3 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900">Edit Staff</h2>
              <p className="text-xs font-medium text-zinc-400">{staff.code}</p>
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
          {updateMutation.isError && (
            <div className="p-4 bg-red-50 border border-red-100 text-xs font-bold text-red-600 rounded-xl">
              {(updateMutation.error as any)?.response?.data?.message || 'Failed to update. Please try again.'}
            </div>
          )}

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider ml-1" htmlFor="edit-fullName">Full Name</label>
              <Input
                {...register('fullName')}
                id="edit-fullName"
                placeholder="Full Name"
                className={`h-11 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 rounded-xl text-sm font-medium transition-all outline-none focus-visible:ring-0 ${errors.fullName ? 'border-red-200 bg-red-50/20' : ''}`}
              />
              {errors.fullName && <p className="text-[10px] font-bold text-red-600 mt-1 ml-1">{errors.fullName.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider ml-1" htmlFor="edit-email">Work Email</label>
              <Input
                {...register('email')}
                id="edit-email"
                type="email"
                placeholder="staff@yantrik.com"
                className={`h-11 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 rounded-xl text-sm font-medium transition-all outline-none focus-visible:ring-0 ${errors.email ? 'border-red-200 bg-red-50/20' : ''}`}
              />
              {errors.email && <p className="text-[10px] font-bold text-red-600 mt-1 ml-1">{errors.email.message}</p>}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider ml-1" htmlFor="edit-phone">Phone Number</label>
              <Input
                {...register('phone')}
                id="edit-phone"
                placeholder="+977 98..."
                className={`h-11 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 rounded-xl text-sm font-medium transition-all outline-none focus-visible:ring-0 ${errors.phone ? 'border-red-200 bg-red-50/20' : ''}`}
              />
              {errors.phone && <p className="text-[10px] font-bold text-red-600 mt-1 ml-1">{errors.phone.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider ml-1" htmlFor="edit-role">Account Role</label>
              <select
                {...register('role')}
                id="edit-role"
                className="w-full h-11 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 rounded-xl text-sm font-bold transition-all outline-none px-4 appearance-none cursor-pointer"
              >
                <option value="Staff">Staff Member</option>
                <option value="Admin">System Admin</option>
              </select>
              {errors.role && <p className="text-[10px] font-bold text-red-600 mt-1 ml-1">{errors.role.message}</p>}
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
              disabled={updateMutation.isPending}
              className="flex-[2] h-12 bg-zinc-950 text-white hover:bg-zinc-800 rounded-xl text-sm font-bold transition-all shadow-xl shadow-black/10 cursor-pointer active:scale-[0.98]"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  Save Changes <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
