'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePasswordSchema, ChangePasswordFormValues } from '@/lib/validations/auth';
import { useChangePasswordMutation } from '@/hooks/api/useAuthApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, ArrowRight, Lock, KeyRound } from 'lucide-react';

export default function ChangePasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const changePasswordMutation = useChangePasswordMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema)
  });

  const onSubmit = (data: ChangePasswordFormValues) => {
    setServerError(null);
    changePasswordMutation.mutate(data, {
      onSuccess: () => {
        reset();
      },
      onError: (err: any) => {
        setServerError(err.response?.data?.message || 'Failed to change password. Please try again.');
      }
    });
  };

  return (
    <div className="max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-10 rounded-3xl border border-zinc-200/50 shadow-sm">
        <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-zinc-50 text-zinc-900 rounded-2xl">
                <Lock className="h-6 w-6" />
            </div>
            <div>
                <h2 className="text-xl font-extrabold tracking-tight text-zinc-900">Update Password</h2>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-0.5">Ensure your account is protected</p>
            </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {serverError && (
            <div className="p-4 rounded-xl bg-red-50/50 border border-red-100 text-xs font-bold text-red-600 animate-in fade-in slide-in-from-top-1 duration-300">
              {serverError}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest ml-1" htmlFor="currentPassword">Current Password</label>
            <div className="relative group">
                <KeyRound className="absolute left-4 top-3.5 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
                <Input
                    {...register('currentPassword')}
                    id="currentPassword"
                    type="password"
                    placeholder="••••••••"
                    className="h-12 pl-12 rounded-xl border-zinc-200 focus:ring-0 focus:border-zinc-900 transition-all font-bold"
                />
            </div>
            {errors.currentPassword && (
              <p className="text-[10px] font-bold text-red-600 mt-1 ml-1 uppercase tracking-widest">{errors.currentPassword.message}</p>
            )}
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest ml-1" htmlFor="newPassword">New Password</label>
              <Input
                {...register('newPassword')}
                id="newPassword"
                type="password"
                placeholder="••••••••"
                className="h-12 px-5 rounded-xl border-zinc-200 focus:ring-0 focus:border-zinc-900 transition-all font-bold"
              />
              {errors.newPassword && (
                <p className="text-[10px] font-bold text-red-600 mt-1 ml-1 uppercase tracking-widest">{errors.newPassword.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest ml-1" htmlFor="confirmPassword">Confirm Password</label>
              <Input
                {...register('confirmPassword')}
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                className="h-12 px-5 rounded-xl border-zinc-200 focus:ring-0 focus:border-zinc-900 transition-all font-bold"
              />
              {errors.confirmPassword && (
                <p className="text-[10px] font-bold text-red-600 mt-1 ml-1 uppercase tracking-widest">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full h-12 bg-zinc-950 text-white hover:bg-zinc-800 rounded-xl text-xs font-bold transition-all shadow-xl shadow-black/10 cursor-pointer active:scale-[0.98] disabled:opacity-30"
              disabled={changePasswordMutation.isPending}
            >
              {changePasswordMutation.isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</>
              ) : (
                <>Change My Password <ArrowRight className="ml-2 h-4 w-4" /></>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
