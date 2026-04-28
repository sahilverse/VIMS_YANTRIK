'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePasswordSchema, ChangePasswordFormValues } from '@/lib/validations/auth';
import { useChangePasswordMutation } from '@/hooks/api/useAuthApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, ArrowRight, Lock, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function ChangePasswordPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const changePasswordMutation = useChangePasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema)
  });

  const onSubmit = (data: ChangePasswordFormValues) => {
    setServerError(null);
    changePasswordMutation.mutate(data, {
      onError: (err: any) => {
        setServerError(err.response?.data?.message || 'Failed to change password. Please try again.');
      }
    });
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Side - Security Focus */}
      <div className="hidden lg:flex lg:w-1/2 bg-zinc-50 flex-col items-center justify-center p-12 border-r border-zinc-100">
        <div className="w-full max-w-sm space-y-12">
          <div className="space-y-4 mb-6">
            <h2 className="text-4xl font-extrabold tracking-tight text-zinc-900 leading-tight">
              Security is <br />our priority.
            </h2>
            <p className="text-zinc-500 font-medium leading-relaxed max-w-xs">
              Update your password to keep your account and your data safe.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-6 bg-white border border-zinc-200/60 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-zinc-50 text-zinc-900 rounded-xl group-hover:bg-zinc-950 group-hover:text-white transition-colors duration-300">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">Strong Encryption</h3>
                  <p className="text-xs font-medium text-zinc-400 mt-0.5">We use enterprise-grade hashing.</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white border border-zinc-200/60 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-zinc-50 text-zinc-900 rounded-xl group-hover:bg-zinc-950 group-hover:text-white transition-colors duration-300">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">Protected Account</h3>
                  <p className="text-xs font-medium text-zinc-400 mt-0.5">Your sessions are fully managed.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-20">
        <div className="w-full max-w-sm space-y-10">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Change Password</h1>
            <p className="text-sm font-medium text-zinc-500">
              Please choose a secure password for your account.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {serverError && (
              <div className="p-4 rounded-xl bg-red-50/50 border border-red-100 text-xs font-bold text-red-600 animate-in fade-in slide-in-from-top-1 duration-300">
                {serverError}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider ml-1" htmlFor="currentPassword">Current Password</label>
              <Input
                {...register('currentPassword')}
                id="currentPassword"
                type="password"
                placeholder="••••••••"
                className={`h-12 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 rounded-xl text-sm font-medium transition-all outline-none focus-visible:ring-0 ${errors.currentPassword ? 'border-red-200 bg-red-50/20' : ''}`}
              />
              {errors.currentPassword && (
                <p className="text-[10px] font-bold text-red-600 mt-1 ml-1">{errors.currentPassword.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider ml-1" htmlFor="newPassword">New Password</label>
              <Input
                {...register('newPassword')}
                id="newPassword"
                type="password"
                placeholder="••••••••"
                className={`h-12 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 rounded-xl text-sm font-medium transition-all outline-none focus-visible:ring-0 ${errors.newPassword ? 'border-red-200 bg-red-50/20' : ''}`}
              />
              {errors.newPassword && (
                <p className="text-[10px] font-bold text-red-600 mt-1 ml-1">{errors.newPassword.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider ml-1" htmlFor="confirmPassword">Confirm New Password</label>
              <Input
                {...register('confirmPassword')}
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                className={`h-12 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 rounded-xl text-sm font-medium transition-all outline-none focus-visible:ring-0 ${errors.confirmPassword ? 'border-red-200 bg-red-50/20' : ''}`}
              />
              {errors.confirmPassword && (
                <p className="text-[10px] font-bold text-red-600 mt-1 ml-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-zinc-950 text-white hover:bg-zinc-800 rounded-xl text-sm font-bold transition-all shadow-xl shadow-black/10 cursor-pointer active:scale-[0.98]"
              disabled={changePasswordMutation.isPending}
            >
              {changePasswordMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating Password...
                </>
              ) : (
                <>
                  Update Password <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            <div className="pt-8 text-center text-[11px] font-medium text-zinc-400 border-t border-zinc-50">
              Need help?{' '}
              <Link
                href="#"
                className="text-zinc-900 hover:underline cursor-pointer font-bold"
              >
                Contact Administrator
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
