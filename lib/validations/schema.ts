import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
})

export const registerSchema = loginSchema.extend({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters' })
    .max(50, { message: 'Name must be less than 50 characters' }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const propertySchema = z.object({
  title: z
    .string()
    .min(5, { message: 'Title must be at least 5 characters' })
    .max(100, { message: 'Title must be less than 100 characters' }),
  description: z
    .string()
    .min(20, { message: 'Description must be at least 20 characters' })
    .max(1000, { message: 'Description must be less than 1000 characters' }),
  price: z
    .number()
    .min(0, { message: 'Price must be greater than 0' })
    .max(1000000000, { message: 'Price must be less than 1 billion' }),
  location: z.object({
    address: z.string().min(5, { message: 'Address is required' }),
    city: z.string().min(2, { message: 'City is required' }),
    state: z.string().length(2, { message: 'State must be 2 characters' }),
    zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, { message: 'Invalid ZIP code' })
  }),
  features: z.array(z.string()).min(1, { message: 'At least one feature is required' }),
  type: z.enum(['APARTMENT', 'HOUSE', 'CONDO', 'TOWNHOUSE'], {
    errorMap: () => ({ message: 'Invalid property type' })
  }),
  status: z.enum(['AVAILABLE', 'RENTED', 'MAINTENANCE'], {
    errorMap: () => ({ message: 'Invalid property status' })
  })
})

export const maintenanceRequestSchema = z.object({
  title: z
    .string()
    .min(5, { message: 'Title must be at least 5 characters' })
    .max(100, { message: 'Title must be less than 100 characters' }),
  description: z
    .string()
    .min(20, { message: 'Description must be at least 20 characters' })
    .max(1000, { message: 'Description must be less than 1000 characters' }),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'EMERGENCY'], {
    errorMap: () => ({ message: 'Invalid priority level' })
  }),
  propertyId: z.string().uuid({ message: 'Invalid property ID' }),
  category: z.enum([
    'PLUMBING',
    'ELECTRICAL',
    'HVAC',
    'APPLIANCE',
    'STRUCTURAL',
    'OTHER'
  ], {
    errorMap: () => ({ message: 'Invalid maintenance category' })
  }),
  availableDates: z
    .array(z.date())
    .min(1, { message: 'At least one available date is required' })
    .max(5, { message: 'Maximum 5 available dates allowed' })
})

export const paymentSchema = z.object({
  amount: z
    .number()
    .min(0.01, { message: 'Amount must be greater than 0' })
    .max(1000000, { message: 'Amount must be less than 1 million' }),
  method: z.enum(['CREDIT_CARD', 'BANK_TRANSFER', 'CASH'], {
    errorMap: () => ({ message: 'Invalid payment method' })
  }),
  description: z
    .string()
    .min(5, { message: 'Description must be at least 5 characters' })
    .max(200, { message: 'Description must be less than 200 characters' }),
  propertyId: z.string().uuid({ message: 'Invalid property ID' }),
  tenantId: z.string().uuid({ message: 'Invalid tenant ID' }),
  date: z.date({
    required_error: 'Date is required',
    invalid_type_error: 'Invalid date format'
  })
}) 