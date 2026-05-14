'use client';

import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { UserService } from '@/services/user.service';
import { UserDto } from '@/types';
import { Loader2, Wrench } from 'lucide-react';

interface CompleteAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: { cost: number; description: string; employeeId: string }) => void;
  appointment: any;
  isSubmitting?: boolean;
}

export function CompleteAppointmentModal({
  isOpen,
  onClose,
  onComplete,
  appointment,
  isSubmitting
}: CompleteAppointmentModalProps) {
  const [technicians, setTechnicians] = useState<UserDto[]>([]);
  const [isLoadingTechs, setIsLoadingTechs] = useState(false);
  const [cost, setCost] = useState('0');
  const [description, setDescription] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setCost('0');
      setDescription(appointment?.serviceType || '');
      setEmployeeId('');
      setErrors({});
      fetchTechnicians();
    }
  }, [isOpen, appointment]);

  const fetchTechnicians = async () => {
    setIsLoadingTechs(true);
    try {
      const response = await UserService.getEmployees({ pageNumber: 1, pageSize: 100 });
      if (response.success && response.data) {
        setTechnicians(response.data.items.filter((u: UserDto) => u.isActive && u.profileId));
      }
    } catch (error) {
      console.error('Failed to fetch technicians', error);
    } finally {
      setIsLoadingTechs(false);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const costNum = parseFloat(cost);
    if (isNaN(costNum) || costNum < 0) newErrors.cost = 'Cost must be 0 or greater';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!employeeId) newErrors.employeeId = 'Please select a technician';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onComplete({
      cost: parseFloat(cost),
      description: description.trim(),
      employeeId,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden">
        <div className="bg-zinc-950 p-8 text-white">
          <DialogHeader>
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-white/10 rounded-2xl">
                <Wrench className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-black italic">Finalize Service</DialogTitle>
                <DialogDescription className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest mt-1">
                  {appointment?.plateNumber} • {appointment?.vehicleName}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Technician */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">
              Assigned Technician
            </label>
            <select
              value={employeeId}
              onChange={(e) => { setEmployeeId(e.target.value); setErrors(prev => ({...prev, employeeId: ''})); }}
              className="w-full h-12 px-4 bg-zinc-50 border-transparent rounded-2xl font-bold text-sm outline-none focus:ring-1 focus:ring-zinc-200 appearance-none cursor-pointer transition-all"
            >
              <option value="">{isLoadingTechs ? 'Loading...' : 'Select a technician'}</option>
              {technicians.map((tech) => (
                <option key={tech.profileId} value={tech.profileId!}>
                  {tech.fullName} ({tech.code})
                </option>
              ))}
            </select>
            {errors.employeeId && (
              <p className="text-[10px] font-bold uppercase tracking-tight text-red-500 ml-1">{errors.employeeId}</p>
            )}
          </div>

          {/* Cost */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">
              Service Cost (Rs.)
            </label>
            <Input
              type="number"
              value={cost}
              onChange={(e) => { setCost(e.target.value); setErrors(prev => ({...prev, cost: ''})); }}
              className="h-12 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 rounded-2xl font-black italic text-lg"
            />
            {errors.cost && (
              <p className="text-[10px] font-bold uppercase tracking-tight text-red-500 ml-1">{errors.cost}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">
              Service Summary / Work Done
            </label>
            <Textarea
              value={description}
              onChange={(e) => { setDescription(e.target.value); setErrors(prev => ({...prev, description: ''})); }}
              placeholder="Describe the maintenance performed..."
              className="min-h-[100px] bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 rounded-2xl font-medium resize-none"
            />
            {errors.description && (
              <p className="text-[10px] font-bold uppercase tracking-tight text-red-500 ml-1">{errors.description}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="flex-1 h-12 rounded-2xl font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-[2] h-12 bg-zinc-950 text-white hover:bg-zinc-800 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-black/10 transition-all active:scale-95"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Complete & Save"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
