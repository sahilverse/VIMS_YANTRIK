'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormValues } from '@/lib/validations/auth';
import { useLoginMutation } from '@/hooks/api/useAuthApi';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, ArrowRight, Car, History, Calendar, FileText } from 'lucide-react';

export default function RootPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const loginMutation = useLoginMutation();
  const { user, isLoading, mustChangePassword } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      if (mustChangePassword) {
        router.push('/change-password');
      } else {
        const dashboardMap: Record<string, string> = {
          'Admin': '/admin/dashboard',
          'Staff': '/staff/dashboard',
          'Customer': '/dashboard',
        };
        router.push(dashboardMap[user.role] || '/dashboard');
      }
    }
  }, [user, isLoading, mustChangePassword, router]);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = (data: LoginFormValues) => {
    setServerError(null);
    loginMutation.mutate(data, {
      onError: (err: any) => {
        setServerError(err.response?.data?.message || 'Invalid email or password.');
      }
    });
  };

  if (isLoading || user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Side - Modern Minimal Feature Stack */}
      <div className="hidden lg:flex lg:w-1/2 bg-zinc-50 flex-col items-center justify-center p-12 border-r border-zinc-100">
        <div className="w-full max-w-sm space-y-12">
          <div className="space-y-4 mb-6">
            <h2 className="text-4xl font-extrabold tracking-tight text-zinc-900 leading-tight">
              A better way <br />to manage.
            </h2>
            <p className="text-zinc-500 font-medium leading-relaxed max-w-xs">
              Experience a modern, minimalist approach to vehicle and service management.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="space-y-4">
            <div className="p-6 bg-white border border-zinc-200/60 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-zinc-50 text-zinc-900 rounded-xl group-hover:bg-zinc-950 group-hover:text-white transition-colors duration-300">
                  <History className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">Vehicle History</h3>
                  <p className="text-xs font-medium text-zinc-400 mt-0.5">Your full history, in one clean place.</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white border border-zinc-200/60 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-zinc-50 text-zinc-900 rounded-xl group-hover:bg-zinc-950 group-hover:text-white transition-colors duration-300">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">Smart Booking</h3>
                  <p className="text-xs font-medium text-zinc-400 mt-0.5">Appointments made simple for everyone.</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white border border-zinc-200/60 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-zinc-50 text-zinc-900 rounded-xl group-hover:bg-zinc-950 group-hover:text-white transition-colors duration-300">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">Clear Billing</h3>
                  <p className="text-xs font-medium text-zinc-400 mt-0.5">Digital invoices, instant access.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-20">
        <div className="w-full max-w-sm space-y-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 mb-8">
              <div className="p-2 bg-zinc-950 text-white rounded-xl shadow-lg shadow-black/5">
                <Car className="h-5 w-5" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold tracking-tight">Yantrik</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Sign in</h1>
            <p className="text-sm font-medium text-zinc-500">
              Enter your details to access your account.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {(serverError || loginMutation.isError) && (
              <div className="p-4 rounded-xl bg-red-50/50 border border-red-100 text-xs font-bold text-red-600 animate-in fade-in slide-in-from-top-1 duration-300">
                {serverError || 'Login Failed. Please check your credentials.'}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider ml-1" htmlFor="email">Email Address</label>
              <Input
                {...register('email')}
                id="email"
                type="email"
                placeholder="name@example.com"
                className={`h-12 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 rounded-xl text-sm font-medium transition-all outline-none focus-visible:ring-0 ${errors.email ? 'border-red-200 bg-red-50/20' : ''}`}
              />
              {errors.email && (
                <p className="text-[10px] font-bold text-red-600 mt-1 ml-1">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider" htmlFor="password">Password</label>
                <Link href="#" className="text-[10px] font-bold hover:text-black transition-colors text-zinc-400">Forgot?</Link>
              </div>
              <Input
                {...register('password')}
                id="password"
                type="password"
                placeholder="••••••••"
                className={`h-12 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 rounded-xl text-sm font-medium transition-all outline-none focus-visible:ring-0 ${errors.password ? 'border-red-200 bg-red-50/20' : ''}`}
              />
              {errors.password && (
                <p className="text-[10px] font-bold text-red-600 mt-1 ml-1">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-zinc-950 text-white hover:bg-zinc-800 rounded-xl text-sm font-bold transition-all shadow-xl shadow-black/10 cursor-pointer active:scale-[0.98]"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            <div className="pt-8 text-center text-[11px] font-medium text-zinc-400 border-t border-zinc-50">
              New to the platform?{' '}
              <Link
                href="/register"
                className="text-zinc-900 hover:underline cursor-pointer font-bold"
              >
                Create an account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
