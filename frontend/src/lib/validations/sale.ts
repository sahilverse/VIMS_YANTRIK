import { z } from 'zod';

export const saleItemSchema = z.object({
  partId: z.string().min(1, 'Part is required'),
  quantity: z.coerce.number().int().min(1, 'Quantity must be at least 1'),
  unitPrice: z.coerce.number().min(0.01, 'Price must be greater than 0'),
});

export const createSaleSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  paymentStatus: z.enum(['Pending', 'Paid', 'Partial', 'Overdue']),
  items: z.array(saleItemSchema).min(1, 'At least one item is required'),
  date: z.string().optional(),
});

export type SaleItemFormValues = z.infer<typeof saleItemSchema>;
export type CreateSaleFormValues = z.infer<typeof createSaleSchema>;
