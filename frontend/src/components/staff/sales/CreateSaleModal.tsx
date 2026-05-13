import React, { useMemo } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createSaleSchema, CreateSaleFormValues } from '@/lib/validations/sale';
import { useCreateSaleMutation } from '@/hooks/api/useSalesApi';
import { useCustomerListQuery } from '@/hooks/api/useCustomerApi';
import { usePartListQuery } from '@/hooks/api/useInventoryApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SearchableSelect from '@/components/ui/SearchableSelect';
import { useDebounce } from '@/hooks/useDebounce';
import { Receipt, Plus, Trash2, X, Info } from 'lucide-react';

interface CreateSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCustomerId?: string;
}

export default function CreateSaleModal({ isOpen, onClose, initialCustomerId }: CreateSaleModalProps) {
  const { register, handleSubmit, control, setValue, formState: { errors }, reset } = useForm<CreateSaleFormValues>({
    resolver: zodResolver(createSaleSchema) as any,
    defaultValues: {
      customerId: initialCustomerId || '',
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

  const customerId = useWatch({
    control,
    name: 'customerId'
  });

  const [customerSearch, setCustomerSearch] = React.useState('');
  const [partSearch, setPartSearch] = React.useState('');

  const debouncedCustomerSearch = useDebounce(customerSearch, 300);
  const debouncedPartSearch = useDebounce(partSearch, 300);

  const { data: customerResponse, isLoading: isLoadingCustomers } = useCustomerListQuery({
    search: debouncedCustomerSearch,
    pageSize: 10
  }, isOpen);

  const { data: partResponse, isLoading: isLoadingParts } = usePartListQuery({
    search: debouncedPartSearch,
    pageSize: 10
  }, isOpen);

  const createSale = useCreateSaleMutation();

  const customers = useMemo(() => {
    return customerResponse?.items?.map(c => ({ 
      id: c.id, 
      label: c.fullName, 
      subLabel: `${c.phone} | ${c.customerCode}` 
    })) || [];
  }, [customerResponse]);

  const partOptions = useMemo(() => {
    return partResponse?.data?.items?.map(p => ({ 
      id: p.id, 
      label: p.name, 
      subLabel: `SKU: ${p.sku} | Price: Rs. ${p.unitPrice} | Stock: ${p.stockQuantity}`,
    })) || [];
  }, [partResponse]);

  const partsLookup = useMemo(() => {
    const map = new Map<string, { stock: number; price: number }>();
    partResponse?.data?.items?.forEach(p => {
      map.set(p.id, { stock: p.stockQuantity, price: p.unitPrice });
    });
    return map;
  }, [partResponse]);

  const subTotal = useMemo(() => {
    return watchItems.reduce((total, item) => total + (Number(item.quantity) * Number(item.unitPrice || 0)), 0);
  }, [watchItems]);

  const discount = useMemo(() => {
    return subTotal > 5000 ? subTotal * 0.10 : 0;
  }, [subTotal]);

  const totalAmount = subTotal - discount;

  if (!isOpen) return null;

  const onSubmit = (data: CreateSaleFormValues) => {
    createSale.mutate(data, {
      onSuccess: () => {
        reset();
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/20 backdrop-blur-sm overflow-y-auto">
      <div
        className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50 sticky top-0 z-10 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-zinc-100 rounded-xl">
              <Receipt className="h-5 w-5 text-zinc-700" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight">New Sales Invoice</h2>
              <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">Generate bill for customer parts</p>
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
              <Label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Select Customer</Label>
              <SearchableSelect
                options={customers}
                value={customerId}
                onChange={(val) => setValue('customerId', val, { shouldValidate: true })}
                onSearch={setCustomerSearch}
                isLoading={isLoadingCustomers}
                placeholder="Search or select customer..."
              />
              {errors.customerId && <p className="text-xs font-bold text-red-500">{errors.customerId.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentStatus" className="text-xs font-bold uppercase tracking-wider text-zinc-500">Payment Status</Label>
              <select
                id="paymentStatus"
                {...register('paymentStatus')}
                className="w-full h-11 px-3 bg-white border border-zinc-200 focus:border-zinc-300 rounded-xl text-sm font-medium transition-all outline-none"
              >
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Partial">Partial</option>
                <option value="Overdue">Overdue</option>
              </select>
              {errors.paymentStatus && <p className="text-xs font-bold text-red-500">{errors.paymentStatus.message}</p>}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Sales Items</Label>
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
                const selectedPartId = watchItems[index]?.partId;
                const partData = partsLookup.get(selectedPartId);
                const isOutOfStock = partData && partData.stock < watchItems[index]?.quantity;

                return (
                  <div key={field.id} className="flex flex-wrap md:flex-nowrap gap-3 items-start p-4 rounded-xl border border-zinc-100 bg-white shadow-sm">
                    <div className="flex-1 min-w-[200px] space-y-1">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1 block mb-1">Part</span>
                      <SearchableSelect
                        options={partOptions}
                        value={selectedPartId}
                        onChange={(val) => {
                          setValue(`items.${index}.partId`, val, { shouldValidate: true });
                          const p = partsLookup.get(val);
                          if (p) {
                            setValue(`items.${index}.unitPrice`, p.price);
                          }
                        }}
                        onSearch={setPartSearch}
                        isLoading={isLoadingParts}
                        placeholder="Select Part..."
                      />
                      {itemError?.partId && <p className="text-[10px] font-bold text-red-500">{itemError.partId.message}</p>}
                    </div>

                    <div className="w-24 space-y-1">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1 block mb-1">Qty</span>
                      <Input
                        type="number"
                        placeholder="Qty"
                        {...register(`items.${index}.quantity`)}
                        className={`h-10 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 rounded-lg ${isOutOfStock ? 'border-red-500 bg-red-50' : ''}`}
                      />
                      {isOutOfStock && <p className="text-[9px] font-bold text-red-500 leading-tight">Stock: {partData.stock}</p>}
                      {itemError?.quantity && <p className="text-[10px] font-bold text-red-500">{itemError.quantity.message}</p>}
                    </div>

                    <div className="w-32 space-y-1">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1 block mb-1">Price</span>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Unit Price"
                        {...register(`items.${index}.unitPrice`)}
                        className="h-10 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 rounded-lg"
                      />
                      {itemError?.unitPrice && <p className="text-[10px] font-bold text-red-500">{itemError.unitPrice.message}</p>}
                    </div>

                    <div className="w-32 h-10 mt-5 flex items-center justify-end px-3 bg-zinc-50 rounded-lg">
                      <span className="text-sm font-extrabold text-zinc-900">
                        Rs. {(Number(watchItems[index]?.quantity || 0) * Number(watchItems[index]?.unitPrice || 0)).toFixed(2)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="h-10 w-10 mt-5 flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-6 flex flex-col md:flex-row items-center justify-between border-t border-zinc-100 gap-6">
            <div className="flex-1 w-full md:w-auto p-4 bg-zinc-950 text-white rounded-2xl shadow-xl shadow-black/5 flex items-center justify-between gap-8">
              <div className="flex gap-8">
                <div>
                  <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">Subtotal</p>
                  <p className="text-sm font-bold text-zinc-300">Rs. {subTotal.toFixed(2)}</p>
                </div>
                {discount > 0 && (
                  <div>
                    <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest mb-0.5">Loyalty (10%)</p>
                    <p className="text-sm font-bold text-emerald-400">- Rs. {discount.toFixed(2)}</p>
                  </div>
                )}
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-0.5">Final Total Bill</p>
                <p className="text-2xl font-black italic">Rs. {totalAmount.toFixed(2)}</p>
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
                disabled={createSale.isPending || watchItems.length === 0}
                className="h-11 bg-zinc-950 text-white hover:bg-zinc-800 rounded-xl text-xs font-bold px-8 transition-all shadow-xl shadow-black/10"
              >
                {createSale.isPending ? 'Processing...' : 'Complete Sale'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
