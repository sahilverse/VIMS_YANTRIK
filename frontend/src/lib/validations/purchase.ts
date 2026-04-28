import { z } from 'zod';

export const createVendorSchema = z.object({
  companyName: z.string().min(2, 'Company name is required'),
  contactPerson: z.string().min(2, 'Contact person is required'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  address: z.string().optional(),
});

export type CreateVendorFormValues = z.infer<typeof createVendorSchema>;

export const purchaseItemSchema = z.object({
  partId: z.string().min(1, 'Part is required'),
  quantity: z.coerce.number().int().min(1, 'Quantity must be at least 1'),
  unitPrice: z.coerce.number().min(0.01, 'Price must be greater than 0'),
});

export const createPurchaseSchema = z.object({
  vendorId: z.string().min(1, 'Vendor is required'),
  paymentStatus: z.enum(['Pending', 'Paid', 'Partial', 'Overdue']),
  items: z.array(purchaseItemSchema).min(1, 'At least one item is required'),
  date: z.string().optional(),
});

export type PurchaseItemFormValues = z.infer<typeof purchaseItemSchema>;
export type CreatePurchaseFormValues = z.infer<typeof createPurchaseSchema>;
