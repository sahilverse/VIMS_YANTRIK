'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormValues } from '@/lib/validations/auth';
import { useRegisterMutation } from '@/hooks/api/useAuthApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserPlus, Loader2, ArrowRight, Car, History, Calendar, FileText } from 'lucide-react';

export default function RegisterPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const registerMutation = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = (data: RegisterFormValues) => {
    setServerError(null);
    registerMutation.mutate(data, {
      onError: (err: any) => {
        setServerError(err.response?.data?.message || 'Registration failed.');
      }
    });
  };

  const isSubmitting = registerMutation.isPending;

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Side - Modern Minimal Feature Stack */}
      <div className="hidden lg:flex lg:w-1/2 bg-zinc-50 flex-col items-center justify-center p-12 border-r border-zinc-100">
        <div className="w-full max-w-sm space-y-12">
          <div className="space-y-4 mb-6">
            <h2 className="text-4xl font-extrabold tracking-tight text-zinc-900 leading-tight">
              Precision <br />in every detail.
            </h2>
            <p className="text-zinc-500 font-medium leading-relaxed max-w-xs">
              Create your account and experience a unified approach to vehicle and service management.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="space-y-4">
            <div className="p-6 bg-white border border-zinc-200/60 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-zinc-50 text-zinc-900 rounded-xl group-hover:bg-zinc-950 group-hover:text-white transition-colors duration-300">
                  <History className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">Digital Logbook</h3>
                  <p className="text-xs font-medium text-zinc-400 mt-0.5">Permanent, transparent service history.</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white border border-zinc-200/60 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-zinc-50 text-zinc-900 rounded-xl group-hover:bg-zinc-950 group-hover:text-white transition-colors duration-300">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">Unified Booking</h3>
                  <p className="text-xs font-medium text-zinc-400 mt-0.5">Schedule and track from one place.</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white border border-zinc-200/60 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-zinc-50 text-zinc-900 rounded-xl group-hover:bg-zinc-950 group-hover:text-white transition-colors duration-300">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">Secure Billing</h3>
                  <p className="text-xs font-medium text-zinc-400 mt-0.5">Automated invoices, instantly ready.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-20 overflow-y-auto">
        <div className="w-full max-w-md space-y-10 py-12">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 mb-8">
              <div className="p-2 bg-zinc-950 text-white rounded-xl shadow-lg shadow-black/5">
                <Car className="h-5 w-5" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold tracking-tight">Yantrik</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Create Account</h1>
            <p className="text-sm font-medium text-zinc-500">
              Join Yantrik today. One account for all your needs.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {(serverError || registerMutation.isError) && (
              <div className="p-4 rounded-xl bg-red-50/50 border border-red-100 text-xs font-bold text-red-600 animate-in fade-in slide-in-from-top-1 duration-300">
                {serverError || 'Registration Failed. Please try again.'}
              </div>
            )}
            
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider ml-1" htmlFor="fullName">Full Name</label>
                <Input 
                  {...register('fullName')}
                  id="fullName"
                  placeholder="John Doe" 
                  className={`h-12 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 rounded-xl text-sm font-medium transition-all outline-none focus-visible:ring-0 ${errors.fullName ? 'border-red-200 bg-red-50/20' : ''}`}
                />
                {errors.fullName && <p className="text-[10px] font-bold text-red-600 mt-1 ml-1">{errors.fullName.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider ml-1" htmlFor="email">Email Address</label>
                <Input 
                  {...register('email')}
                  id="email"
                  type="email" 
                  placeholder="name@example.com" 
                  className={`h-12 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 rounded-xl text-sm font-medium transition-all outline-none focus-visible:ring-0 ${errors.email ? 'border-red-200 bg-red-50/20' : ''}`}
                />
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
                  className={`h-12 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 rounded-xl text-sm font-medium transition-all outline-none focus-visible:ring-0 ${errors.phone ? 'border-red-200 bg-red-50/20' : ''}`}
                />
                {errors.phone && <p className="text-[10px] font-bold text-red-600 mt-1 ml-1">{errors.phone.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider ml-1" htmlFor="address">Location</label>
                <Input 
                  {...register('address')}
                  id="address"
                  placeholder="City, Country" 
                  className="h-12 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 rounded-xl text-sm font-medium transition-all outline-none focus-visible:ring-0"
                />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 border-t border-zinc-50 pt-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider ml-1" htmlFor="password">Password</label>
                <Input 
                  {...register('password')}
                  id="password"
                  type="password" 
                  placeholder="••••••••" 
                  className={`h-12 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 rounded-xl text-sm font-medium transition-all outline-none focus-visible:ring-0 ${errors.password ? 'border-red-200 bg-red-50/20' : ''}`}
                />
                {errors.password && <p className="text-[10px] font-bold text-red-600 mt-1 ml-1">{errors.password.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider ml-1" htmlFor="confirmPassword">Confirm Password</label>
                <Input 
                  {...register('confirmPassword')}
                  id="confirmPassword"
                  type="password" 
                  placeholder="••••••••" 
                  className={`h-12 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 rounded-xl text-sm font-medium transition-all outline-none focus-visible:ring-0 ${errors.confirmPassword ? 'border-red-200 bg-red-50/20' : ''}`}
                />
                {errors.confirmPassword && <p className="text-[10px] font-bold text-red-600 mt-1 ml-1">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-zinc-950 text-white hover:bg-zinc-800 rounded-xl text-sm font-bold transition-all shadow-xl shadow-black/10 cursor-pointer active:scale-[0.98] mt-4"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            <div className="pt-8 text-center text-[11px] font-medium text-zinc-400 border-t border-zinc-50">
              Already have an account?{' '}
              <Link
                href="/"
                className="text-zinc-900 hover:underline cursor-pointer font-bold"
              >
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
