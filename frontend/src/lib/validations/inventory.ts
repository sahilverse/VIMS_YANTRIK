import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(2, 'Category name is required').max(50),
  description: z.string().optional(),
});

export type CreateCategoryFormValues = z.infer<typeof createCategorySchema>;

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
