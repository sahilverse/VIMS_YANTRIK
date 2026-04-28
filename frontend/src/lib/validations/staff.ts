import { z } from 'zod';

export const updateStaffSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  role: z.enum(['Admin', 'Staff'], {
    message: 'Please select a valid role',
  }),
});

export type UpdateStaffFormValues = z.infer<typeof updateStaffSchema>;
