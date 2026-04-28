import React, { useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createPartSchema, CreatePartFormValues } from '@/lib/validations/admin';
import { useCreatePartMutation, useCategoryListQuery } from '@/hooks/api/useInventoryApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, PackagePlus } from 'lucide-react';
import SearchableSelect from '@/components/ui/SearchableSelect';
import AddCategoryModal from './AddCategoryModal';

interface AddPartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (partId: string) => void;
}

export default function AddPartModal({ isOpen, onClose, onSuccess }: AddPartModalProps) {
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');
  const [localCategories, setLocalCategories] = useState<any[]>([]);

  const { register, handleSubmit, control, setValue, formState: { errors }, reset } = useForm<CreatePartFormValues>({
    resolver: zodResolver(createPartSchema) as any,
    defaultValues: {
      minThreshold: 10,
      stockQuantity: 0,
      unitPrice: 0,
      costPrice: 0,
      categoryId: ''
    }
  });

  const categoryId = useWatch({
    control,
    name: 'categoryId'
  });

  const { data: categoryResponse, isLoading: isLoadingCategories } = useCategoryListQuery(isOpen);
  
  const categories = useMemo(() => {
    const serverCategories = categoryResponse?.data?.map(c => ({ id: c.id, label: c.name })) || [];
    const combined = [...localCategories, ...serverCategories];
    return Array.from(new Map(combined.map(c => [c.id, c])).values());
  }, [categoryResponse, localCategories]);

  const createPart = useCreatePartMutation();

  if (!isOpen) return null;

  const onSubmit = (data: CreatePartFormValues) => {
    createPart.mutate(data, {
      onSuccess: (response) => {
        reset();
        setLocalCategories([]);
        if (onSuccess && response.data?.id) {
          onSuccess(response.data.id);
        }
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/20 backdrop-blur-sm overflow-y-auto">
      <div 
        className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50 sticky top-0 z-10 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-zinc-100 rounded-xl">
              <PackagePlus className="h-5 w-5 text-zinc-700" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight">New Inventory Part</h2>
              <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">Add item to catalog</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="sku" className="text-xs font-bold uppercase tracking-wider text-zinc-500">SKU / Item Code</Label>
              <Input
                id="sku"
                {...register('sku')}
                className="h-11 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-300 rounded-xl"
                placeholder="e.g. ENG-001"
              />
              {errors.sku && <p className="text-xs font-bold text-red-500">{errors.sku.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-zinc-500">Part Name</Label>
              <Input
                id="name"
                {...register('name')}
                className="h-11 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-300 rounded-xl"
                placeholder="e.g. Spark Plug"
              />
              {errors.name && <p className="text-xs font-bold text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Category</Label>
              <SearchableSelect
                options={categories}
                value={categoryId}
                onChange={(val) => setValue('categoryId', val, { shouldValidate: true })}
                onSearch={setCategorySearch}
                isLoading={isLoadingCategories}
                onQuickAdd={() => setIsAddCategoryOpen(true)}
                quickAddLabel="Create New Category"
                placeholder="Search or select category..."
              />
              {errors.categoryId && <p className="text-xs font-bold text-red-500">{errors.categoryId.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="costPrice" className="text-xs font-bold uppercase tracking-wider text-zinc-500">Cost Price (Rs.)</Label>
              <Input
                id="costPrice"
                type="number"
                step="0.01"
                {...register('costPrice')}
                className="h-11 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-300 rounded-xl"
              />
              {errors.costPrice && <p className="text-xs font-bold text-red-500">{errors.costPrice.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="unitPrice" className="text-xs font-bold uppercase tracking-wider text-zinc-500">Selling Price (Rs.)</Label>
              <Input
                id="unitPrice"
                type="number"
                step="0.01"
                {...register('unitPrice')}
                className="h-11 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-300 rounded-xl"
              />
              {errors.unitPrice && <p className="text-xs font-bold text-red-500">{errors.unitPrice.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="stockQuantity" className="text-xs font-bold uppercase tracking-wider text-zinc-500">Initial Stock</Label>
              <Input
                id="stockQuantity"
                type="number"
                {...register('stockQuantity')}
                className="h-11 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-300 rounded-xl"
              />
              {errors.stockQuantity && <p className="text-xs font-bold text-red-500">{errors.stockQuantity.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="minThreshold" className="text-xs font-bold uppercase tracking-wider text-zinc-500">Low Stock Threshold</Label>
              <Input
                id="minThreshold"
                type="number"
                {...register('minThreshold')}
                className="h-11 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-300 rounded-xl"
              />
              {errors.minThreshold && <p className="text-xs font-bold text-red-500">{errors.minThreshold.message}</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description" className="text-xs font-bold uppercase tracking-wider text-zinc-500">Description (Optional)</Label>
              <Input
                id="description"
                {...register('description')}
                className="h-11 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-300 rounded-xl"
              />
              {errors.description && <p className="text-xs font-bold text-red-500">{errors.description.message}</p>}
            </div>
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
              disabled={createPart.isPending}
              className="h-11 bg-zinc-950 text-white hover:bg-zinc-800 rounded-xl text-xs font-bold px-8 transition-all shadow-xl shadow-black/10"
            >
              {createPart.isPending ? 'Creating...' : 'Create Part'}
            </Button>
          </div>
        </form>
      </div>

      <AddCategoryModal 
        isOpen={isAddCategoryOpen}
        onClose={() => setIsAddCategoryOpen(false)}
        onSuccess={(categoryId) => {
          setValue('categoryId', categoryId, { shouldValidate: true });
          setLocalCategories(prev => [{ id: categoryId, label: 'New Category (Refreshing...)' }, ...prev]);
        }}
      />
    </div>
  );
}

