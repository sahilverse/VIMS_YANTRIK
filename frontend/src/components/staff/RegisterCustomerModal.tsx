'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegisterCustomerMutation } from '@/hooks/api/useCustomerApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  UserPlus, 
  User, 
  Phone, 
  Mail,
  MapPin, 
  Calendar, 
  Hash, 
  ChevronRight, 
  ChevronLeft,
  X,
  Loader2
} from 'lucide-react';
import { 
  customerInfoSchema,
  vehicleInfoSchema,
  RegisterCustomerFormValues 
} from '@/lib/validations';

interface RegisterCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RegisterCustomerModal({ isOpen, onClose }: RegisterCustomerModalProps) {
  const [step, setStep] = useState(1);
  const registerMutation = useRegisterCustomerMutation();

  // Form 1: Customer Details
  const customerForm = useForm({
    resolver: zodResolver(customerInfoSchema),
    mode: 'onBlur',
  });

  // Form 2: Vehicle Details
  const vehicleForm = useForm({
    resolver: zodResolver(vehicleInfoSchema),
    mode: 'onBlur',
    defaultValues: {
      year: new Date().getFullYear(),
    }
  });

  const handleNext = async () => {
    const isValid = await customerForm.trigger();
    if (isValid) setStep(2);
  };

  const handleFinalSubmit = async () => {
    const isVehicleValid = await vehicleForm.trigger();
    if (!isVehicleValid) return;

    const customerData = customerForm.getValues();
    const vehicleData = vehicleForm.getValues();

    const finalData: RegisterCustomerFormValues = {
      ...customerData,
      ...vehicleData,
    } as any;

    registerMutation.mutate(finalData, {
      onSuccess: () => {
        customerForm.reset();
        vehicleForm.reset();
        setStep(1);
        onClose();
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-zinc-100 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 pb-6 flex items-center justify-between border-b border-zinc-50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-zinc-950 text-white rounded-2xl shadow-lg shadow-black/10">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-zinc-900">New Registration</h2>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-0.5">
                Step {step} of 2 • {step === 1 ? 'Customer Info' : 'Vehicle Details'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-50 rounded-xl transition-all cursor-pointer text-zinc-400 hover:text-zinc-900">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar min-h-[350px]">
          {/* Step 1: Customer Details */}
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-left-4 duration-300">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Full Name</Label>
                <div className="relative group">
                  <User className="absolute left-4 top-3.5 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
                  <Input 
                    {...customerForm.register('fullName')}
                    autoComplete="off"
                    placeholder="e.g. Sahil Shrestha"
                    className="pl-11 h-12 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 rounded-xl transition-all"
                  />
                </div>
                {customerForm.formState.errors.fullName && (
                  <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest ml-1">
                    {customerForm.formState.errors.fullName.message as string}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Phone Number</Label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-3.5 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
                    <Input 
                      {...customerForm.register('phone')}
                      autoComplete="off"
                      placeholder="e.g. 9841XXXXXX"
                      className="pl-11 h-12 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 rounded-xl transition-all"
                    />
                  </div>
                  {customerForm.formState.errors.phone && (
                    <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest ml-1">
                      {customerForm.formState.errors.phone.message as string}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Email Address</Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-3.5 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
                    <Input 
                      {...customerForm.register('email')}
                      autoComplete="off"
                      placeholder="e.g. sahil@example.com"
                      className="pl-11 h-12 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 rounded-xl transition-all"
                    />
                  </div>
                  {customerForm.formState.errors.email && (
                    <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest ml-1">
                      {customerForm.formState.errors.email.message as string}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Address (Optional)</Label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-3.5 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
                  <Input 
                    {...customerForm.register('address')}
                    autoComplete="off"
                    placeholder="e.g. Kathmandu, Nepal"
                    className="pl-11 h-12 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 rounded-xl transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Vehicle Details */}
          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Plate Number</Label>
                  <div className="relative group">
                    <Hash className="absolute left-4 top-3.5 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
                    <Input 
                      {...vehicleForm.register('plateNumber')}
                      autoComplete="off"
                      placeholder="e.g. BA 2 PA 1234"
                      className="pl-11 h-12 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 rounded-xl transition-all uppercase"
                    />
                  </div>
                  {vehicleForm.formState.errors.plateNumber && (
                    <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest ml-1">
                      {vehicleForm.formState.errors.plateNumber.message as string}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-zinc-500">VIN / Chassis No. (Optional)</Label>
                  <div className="relative group">
                    <Hash className="absolute left-4 top-3.5 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
                    <Input 
                      {...vehicleForm.register('vin')}
                      autoComplete="off"
                      placeholder="e.g. 17-digit VIN"
                      className="pl-11 h-12 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 rounded-xl transition-all uppercase"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Brand</Label>
                  <Input 
                    {...vehicleForm.register('brand')}
                    autoComplete="off"
                    placeholder="e.g. Yamaha"
                    className="h-12 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 rounded-xl transition-all"
                  />
                  {vehicleForm.formState.errors.brand && (
                    <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest ml-1">
                      {vehicleForm.formState.errors.brand.message as string}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Model</Label>
                  <Input 
                    {...vehicleForm.register('model')}
                    autoComplete="off"
                    placeholder="e.g. FZ-S V3"
                    className="h-12 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 rounded-xl transition-all"
                  />
                  {vehicleForm.formState.errors.model && (
                    <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest ml-1">
                      {vehicleForm.formState.errors.model.message as string}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Year (Optional)</Label>
                <div className="relative group">
                  <Calendar className="absolute left-4 top-3.5 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
                  <Input 
                    {...vehicleForm.register('year')}
                    autoComplete="off"
                    type="number"
                    className="pl-11 h-12 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 rounded-xl transition-all"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-8 pt-4 flex gap-3 bg-white border-t border-zinc-50">
          {step === 2 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(1)}
              className="flex-1 h-12 border-zinc-200 rounded-xl text-sm font-bold hover:bg-zinc-50 transition-all cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4 mr-2" /> Back
            </Button>
          )}
          
          {step === 1 ? (
            <Button
              type="button"
              onClick={handleNext}
              className="flex-1 h-12 bg-zinc-950 text-white hover:bg-zinc-800 rounded-xl text-sm font-bold transition-all shadow-xl shadow-black/10 cursor-pointer active:scale-[0.98]"
            >
              Continue <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleFinalSubmit}
              disabled={registerMutation.isPending}
              className="flex-1 h-12 bg-zinc-950 text-white hover:bg-zinc-800 rounded-xl text-sm font-bold transition-all shadow-xl shadow-black/10 cursor-pointer active:scale-[0.98]"
            >
              {registerMutation.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>Complete Registration</>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
