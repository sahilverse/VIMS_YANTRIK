import { z } from 'zod';

// Staff
export const updateStaffSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  role: z.enum(['Admin', 'Staff'], {
    message: 'Please select a valid role',
  }),
});

export type UpdateStaffFormValues = z.infer<typeof updateStaffSchema>;

// Vendor
export const createVendorSchema = z.object({
  companyName: z.string().min(2, 'Company name is required'),
  contactPerson: z.string().min(2, 'Contact person is required'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  address: z.string().optional(),
});

export type CreateVendorFormValues = z.infer<typeof createVendorSchema>;

// Category
export const createCategorySchema = z.object({
  name: z.string().min(2, 'Category name is required').max(50),
  description: z.string().optional(),
});

export type CreateCategoryFormValues = z.infer<typeof createCategorySchema>;

// Part
export const createPartSchema = z.object({
  name: z.string().min(2, 'Part name is required').max(100),
  sku: z.string().min(1, 'SKU is required').max(50),
  unitPrice: z.coerce.number().min(0, 'Must be 0 or more'),
  costPrice: z.coerce.number().min(0, 'Must be 0 or more'),
  stockQuantity: z.coerce.number().int().min(0, 'Must be 0 or more'),
  minThreshold: z.coerce.number().int().min(0).default(10),
  categoryId: z.string().min(1, 'Category is required'),
  description: z.string().optional(),
});

export type CreatePartFormValues = z.infer<typeof createPartSchema>;

// Purchase
export const purchaseItemSchema = z.object({
  partId: z.string().min(1, 'Part is required'),
  quantity: z.coerce.number().int().min(1, 'Quantity must be at least 1'),
  unitPrice: z.coerce.number().min(0.01, 'Price must be greater than 0'),
});

export const createPurchaseSchema = z.object({
  vendorId: z.string().min(1, 'Vendor is required'),
  paymentStatus: z.enum(['Paid', 'Unpaid', 'Partial']),
  items: z.array(purchaseItemSchema).min(1, 'At least one item is required'),
});

export type PurchaseItemFormValues = z.infer<typeof purchaseItemSchema>;
export type CreatePurchaseFormValues = z.infer<typeof createPurchaseSchema>;
