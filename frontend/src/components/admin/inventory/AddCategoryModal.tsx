import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createCategorySchema, CreateCategoryFormValues } from '@/lib/validations/admin';
import { useCreateCategoryMutation } from '@/hooks/api/useInventoryApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Package } from 'lucide-react';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (categoryId: string) => void;
}

export default function AddCategoryModal({ isOpen, onClose, onSuccess }: AddCategoryModalProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateCategoryFormValues>({
    resolver: zodResolver(createCategorySchema),
  });

  const createCategory = useCreateCategoryMutation();

  if (!isOpen) return null;

  const onSubmit = (data: CreateCategoryFormValues) => {
    createCategory.mutate(data, {
      onSuccess: (response) => {
        reset();
        if (onSuccess && response.data?.id) {
          onSuccess(response.data.id);
        }
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/20 backdrop-blur-sm">
      <div 
        className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-zinc-100 rounded-xl">
              <Package className="h-5 w-5 text-zinc-700" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight">New Category</h2>
              <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">Inventory Classification</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-zinc-500">Category Name</Label>
            <Input
              id="name"
              {...register('name')}
              className="h-11 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-300 rounded-xl"
              placeholder="e.g. Engine Components"
            />
            {errors.name && <p className="text-xs font-bold text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-xs font-bold uppercase tracking-wider text-zinc-500">Description (Optional)</Label>
            <Input
              id="description"
              {...register('description')}
              className="h-11 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-300 rounded-xl"
              placeholder="Description of the category"
            />
            {errors.description && <p className="text-xs font-bold text-red-500">{errors.description.message}</p>}
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-zinc-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-11 rounded-xl text-xs font-bold px-6 border-zinc-200 hover:bg-zinc-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createCategory.isPending}
              className="h-11 bg-zinc-950 text-white hover:bg-zinc-800 rounded-xl text-xs font-bold px-8 transition-all shadow-xl shadow-black/10"
            >
              {createCategory.isPending ? 'Creating...' : 'Create Category'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
