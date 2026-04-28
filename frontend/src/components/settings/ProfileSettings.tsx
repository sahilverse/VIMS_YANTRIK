'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useProfileQuery, useUpdateProfileMutation } from '@/hooks/api/useUserApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, User, Phone, MapPin, Mail, ShieldCheck, Fingerprint } from 'lucide-react';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfileSettings() {
  const { data: response, isLoading } = useProfileQuery();
  const updateMutation = useUpdateProfileMutation();
  const profile = response?.data;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty }
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (profile) {
      reset({
        fullName: profile.fullName,
        phone: profile.phone || '',
        address: profile.address || '',
      });
    }
  }, [profile, reset]);

  const onSubmit = (data: ProfileFormValues) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 text-zinc-900 animate-spin" />
        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Loading Profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid gap-8 md:grid-cols-3">
        {/* Profile Info Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-zinc-200/50 shadow-sm text-center">
            <div className="w-24 h-24 bg-zinc-950 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-black/20">
              <User className="h-10 w-10" />
            </div>
            <h2 className="text-xl font-extrabold tracking-tight text-zinc-900">{profile?.fullName}</h2>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">{profile?.role}</p>
            
            <div className="mt-8 pt-8 border-t border-zinc-100 flex flex-col items-center gap-4">
               <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-widest">
                  <Fingerprint className="h-3 w-3" />
                  {profile?.role === 'Customer' ? 'Customer ID' : 'Employee ID'}
               </div>
               <div className="px-4 py-2 bg-zinc-50 rounded-xl font-mono text-sm font-black text-zinc-900 border border-zinc-100">
                  {profile?.code}
               </div>
            </div>
          </div>

          <div className="bg-zinc-900 p-6 rounded-3xl text-white shadow-xl shadow-black/10">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              <h3 className="text-sm font-bold uppercase tracking-widest">Security Note</h3>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
              Your unique identification code is system-generated and cannot be changed. 
              If you notice any discrepancies, please contact the system administrator.
            </p>
          </div>
        </div>

        {/* Edit Form */}
        <div className="md:col-span-2">
          <div className="bg-white p-10 rounded-3xl border border-zinc-200/50 shadow-sm">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-black text-zinc-400 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-3.5 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
                    <Input
                      {...register('fullName')}
                      placeholder="Your full name"
                      className="h-12 pl-12 rounded-xl border-zinc-200 focus:ring-0 focus:border-zinc-900 transition-all font-bold"
                    />
                  </div>
                  {errors.fullName && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest ml-1">{errors.fullName.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-zinc-400 uppercase tracking-widest ml-1">Phone Number</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-3.5 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
                    <Input
                      {...register('phone')}
                      placeholder="Your contact number"
                      className="h-12 pl-12 rounded-xl border-zinc-200 focus:ring-0 focus:border-zinc-900 transition-all font-bold"
                    />
                  </div>
                  {errors.phone && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest ml-1">{errors.phone.message}</p>}
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className="text-xs font-black text-zinc-400 uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative group opacity-60">
                    <Mail className="absolute left-4 top-3.5 h-4 w-4 text-zinc-400" />
                    <Input
                      value={profile?.email}
                      disabled
                      className="h-12 pl-12 rounded-xl border-zinc-200 bg-zinc-50 font-bold cursor-not-allowed"
                    />
                  </div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1 italic">Email cannot be changed by the user.</p>
                </div>

                {profile?.role === 'Customer' && (
                  <div className="space-y-2 sm:col-span-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="text-xs font-black text-zinc-400 uppercase tracking-widest ml-1">Residential Address</label>
                    <div className="relative group">
                      <MapPin className="absolute left-4 top-3.5 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
                      <Input
                        {...register('address')}
                        placeholder="Your residential address"
                        className="h-12 pl-12 rounded-xl border-zinc-200 focus:ring-0 focus:border-zinc-900 transition-all font-bold"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={updateMutation.isPending || !isDirty}
                  className="h-12 px-8 bg-zinc-950 text-white hover:bg-zinc-800 rounded-xl text-xs font-bold transition-all shadow-xl shadow-black/10 active:scale-[0.98] disabled:opacity-30"
                >
                  {updateMutation.isPending ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Updating...</>
                  ) : (
                    'Save Profile Changes'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
