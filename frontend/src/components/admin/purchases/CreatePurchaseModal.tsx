import React, { useMemo } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createPurchaseSchema, CreatePurchaseFormValues } from '@/lib/validations/admin';
import { useCreatePurchaseMutation } from '@/hooks/api/usePurchaseApi';
import { useVendorListQuery } from '@/hooks/api/useVendorApi';
import { usePartListQuery } from '@/hooks/api/useInventoryApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AddVendorModal from '../AddVendorModal';
import AddPartModal from '../inventory/AddPartModal';
import SearchableSelect from '@/components/ui/SearchableSelect';
import { useDebounce } from '@/hooks/useDebounce';
import { Receipt, Plus, Trash2, X } from 'lucide-react';

interface CreatePurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreatePurchaseModal({ isOpen, onClose }: CreatePurchaseModalProps) {
  const [isAddVendorOpen, setIsAddVendorOpen] = React.useState(false);
  const [isAddPartOpen, setIsAddPartOpen] = React.useState(false);
  const [activePartIndex, setActivePartIndex] = React.useState<number | null>(null);

  const { register, handleSubmit, control, setValue, formState: { errors }, reset } = useForm<CreatePurchaseFormValues>({
    resolver: zodResolver(createPurchaseSchema) as any,
    defaultValues: {
      items: [{ partId: '', quantity: 1, unitPrice: 0 }],
      paymentStatus: 'Paid',
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  });

  const watchItems = useWatch({
    control,
    name: 'items'
  }) || [];

  const vendorId = useWatch({
    control,
    name: 'vendorId'
  });

  const [vendorSearch, setVendorSearch] = React.useState('');
  const [partSearch, setPartSearch] = React.useState('');
  const [localVendors, setLocalVendors] = React.useState<any[]>([]);
  const [localParts, setLocalParts] = React.useState<any[]>([]);

  const debouncedVendorSearch = useDebounce(vendorSearch, 300);
  const debouncedPartSearch = useDebounce(partSearch, 300);

  const { data: vendorResponse, isLoading: isLoadingVendors } = useVendorListQuery({
    search: debouncedVendorSearch,
    pageSize: 10
  }, isOpen);

  const { data: partResponse, isLoading: isLoadingParts } = usePartListQuery({
    search: debouncedPartSearch,
    pageSize: 10
  }, isOpen);

  const createPurchase = useCreatePurchaseMutation();

  const vendors = useMemo(() => {
    const serverVendors = vendorResponse?.data?.items?.map(v => ({ id: v.id, label: v.companyName, subLabel: v.phone })) || [];
    const combined = [...localVendors, ...serverVendors];
    return Array.from(new Map(combined.map(v => [v.id, v])).values());
  }, [vendorResponse, localVendors]);

  const parts = useMemo(() => {
    const serverParts = partResponse?.data?.items?.map(p => ({ id: p.id, label: p.name, subLabel: `SKU: ${p.sku} | Rs. ${p.unitPrice}` })) || [];
    const combined = [...localParts, ...serverParts];
    return Array.from(new Map(combined.map(p => [p.id, p])).values());
  }, [partResponse, localParts]);

  const totalAmount = useMemo(() => {
    return watchItems.reduce((total, item) => total + (Number(item.quantity) * Number(item.unitPrice || 0)), 0);
  }, [watchItems]);

  if (!isOpen) return null;

  const onSubmit = (data: CreatePurchaseFormValues) => {
    createPurchase.mutate(data, {
      onSuccess: () => {
        reset();
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/20 backdrop-blur-sm overflow-y-auto">
      <div
        className="bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-zinc-100 rounded-xl">
              <Receipt className="h-5 w-5 text-zinc-700" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight">New Purchase Invoice</h2>
              <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">Procure inventory from vendors</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-50/50 p-6 rounded-2xl border border-zinc-100">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Select Vendor</Label>
              <SearchableSelect
                options={vendors}
                value={vendorId}
                onChange={(val) => setValue('vendorId', val, { shouldValidate: true })}
                onSearch={setVendorSearch}
                isLoading={isLoadingVendors}
                onQuickAdd={() => setIsAddVendorOpen(true)}
                quickAddLabel="Register New Vendor"
                placeholder="Search or select vendor..."
              />
              {errors.vendorId && <p className="text-xs font-bold text-red-500">{errors.vendorId.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentStatus" className="text-xs font-bold uppercase tracking-wider text-zinc-500">Payment Status</Label>
              <select
                id="paymentStatus"
                {...register('paymentStatus')}
                className="w-full h-11 px-3 bg-white border border-zinc-200 focus:border-zinc-300 rounded-xl text-sm font-medium transition-all outline-none"
              >
                <option value="Paid">Paid</option>
                <option value="Credit">Credit</option>
                <option value="Overdue">Overdue</option>
              </select>
              {errors.paymentStatus && <p className="text-xs font-bold text-red-500">{errors.paymentStatus.message}</p>}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Purchase Items</Label>
              <Button
                type="button"
                onClick={() => append({ partId: '', quantity: 1, unitPrice: 0 })}
                variant="outline"
                size="sm"
                className="h-8 rounded-lg text-xs font-bold"
              >
                <Plus className="h-3 w-3 mr-1" /> Add Line Item
              </Button>
            </div>

            {typeof errors.items?.message === 'string' && (
              <p className="text-xs font-bold text-red-500">{errors.items.message}</p>
            )}

            <div className="space-y-3">
              {fields.map((field, index) => {
                const itemError = errors.items?.[index];

                return (
                  <div key={field.id} className="flex flex-wrap md:flex-nowrap gap-3 items-start p-4 rounded-xl border border-zinc-100 bg-white shadow-sm">
                    <div className="flex-1 min-w-[200px] space-y-1">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1 block mb-1">Part</span>
                      <SearchableSelect
                        options={parts}
                        value={watchItems[index]?.partId}
                        onChange={(val) => {
                          setValue(`items.${index}.partId`, val, { shouldValidate: true });
                          const selectedPart = partResponse?.data?.items.find(p => p.id === val);
                          if (selectedPart) {
                            setValue(`items.${index}.unitPrice`, selectedPart.costPrice);
                          }
                        }}
                        onSearch={setPartSearch}
                        isLoading={isLoadingParts}
                        onQuickAdd={() => {
                          setActivePartIndex(index);
                          setIsAddPartOpen(true);
                        }}
                        quickAddLabel="New Part"
                        placeholder="Select Part..."
                      />
                      {itemError?.partId && <p className="text-[10px] font-bold text-red-500">{itemError.partId.message}</p>}
                    </div>

                    <div className="w-24 space-y-1">
                      <Input
                        type="number"
                        placeholder="Qty"
                        {...register(`items.${index}.quantity`)}
                        className="h-10 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 rounded-lg"
                      />
                      {itemError?.quantity && <p className="text-[10px] font-bold text-red-500">{itemError.quantity.message}</p>}
                    </div>

                    <div className="w-32 space-y-1">
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Unit Price"
                        {...register(`items.${index}.unitPrice`)}
                        className="h-10 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 rounded-lg"
                      />
                      {itemError?.unitPrice && <p className="text-[10px] font-bold text-red-500">{itemError.unitPrice.message}</p>}
                    </div>

                    <div className="w-32 h-10 flex items-center justify-end px-3 bg-zinc-50 rounded-lg">
                      <span className="text-sm font-extrabold text-zinc-900">
                        Rs. {(Number(watchItems[index]?.quantity || 0) * Number(watchItems[index]?.unitPrice || 0)).toFixed(2)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="h-10 w-10 flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-6 flex items-center justify-between border-t border-zinc-100">
            <div className="p-4 bg-zinc-950 text-white rounded-xl shadow-lg shadow-black/5 flex items-center gap-4">
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Total Invoice Amount</p>
                <p className="text-xl font-black">Rs. {totalAmount.toFixed(2)}</p>
              </div>
            </div>

            <div className="flex gap-3">
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
                disabled={createPurchase.isPending || watchItems.length === 0}
                className="h-11 bg-zinc-950 text-white hover:bg-zinc-800 rounded-xl text-xs font-bold px-8 transition-all shadow-xl shadow-black/10"
              >
                {createPurchase.isPending ? 'Processing...' : 'Confirm Purchase'}
              </Button>
            </div>
          </div>
        </form>
      </div>
      <AddVendorModal
        isOpen={isAddVendorOpen}
        onClose={() => setIsAddVendorOpen(false)}
        onSuccess={(vendorId) => {
          setValue('vendorId', vendorId);
          setLocalVendors(prev => [{ id: vendorId, label: 'New Vendor (Refreshing...)' }, ...prev]);
        }}
      />

      <AddPartModal
        isOpen={isAddPartOpen}
        onClose={() => {
          setIsAddPartOpen(false);
          setActivePartIndex(null);
        }}
        onSuccess={(partId) => {
          if (activePartIndex !== null) {
            setValue(`items.${activePartIndex}.partId`, partId);
            setLocalParts(prev => [{ id: partId, label: 'New Part (Refreshing...)' }, ...prev]);
          }
        }}
      />
    </div>
  );
}
