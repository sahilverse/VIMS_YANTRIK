import { z } from 'zod';

// Step 1: Customer Information
export const customerInfoSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  address: z.string().optional(),
});

// Step 2: Vehicle Information
export const vehicleInfoSchema = z.object({
  plateNumber: z.string().min(1, 'Plate number is required').max(20),
  vin: z.string().optional(),
  brand: z.string().min(1, 'Brand is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1).optional(),
});

// Complete Registration 
export const registerCustomerSchema = customerInfoSchema.merge(vehicleInfoSchema);

export type RegisterCustomerFormValues = z.infer<typeof registerCustomerSchema>;
