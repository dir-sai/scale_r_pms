import * as z from 'zod'

export const propertySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Property name is required'),
  unit: z.string().min(1, 'Unit number is required'),
  address: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().length(2, 'State must be 2 characters'),
    zip: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code')
  }),
  amenities: z.array(z.string()),
  contacts: z.object({
    propertyManager: z.object({
      name: z.string().min(1, 'Property manager name is required'),
      phone: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, 'Invalid phone number'),
      email: z.string().email('Invalid email address')
    }),
    maintenance: z.object({
      name: z.string().min(1, 'Maintenance contact name is required'),
      phone: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, 'Invalid phone number'),
      email: z.string().email('Invalid email address')
    })
  })
})

export const maintenanceRequestSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  priority: z.enum(['low', 'medium', 'high']),
  status: z.enum(['open', 'in_progress', 'completed', 'cancelled']),
  date: z.string(),
  assignedTo: z.string().optional(),
  propertyId: z.string(),
  unitId: z.string(),
  tenantId: z.string(),
  images: z.array(z.string()).optional(),
  updates: z.array(
    z.object({
      date: z.string(),
      status: z.enum(['open', 'in_progress', 'completed', 'cancelled']),
      comment: z.string(),
      updatedBy: z.string()
    })
  ).optional()
})

export const paymentSchema = z.object({
  id: z.string().optional(),
  amount: z.number().positive('Amount must be greater than 0'),
  type: z.enum(['rent', 'deposit', 'late_fee', 'other']),
  status: z.enum(['pending', 'completed', 'failed', 'refunded']),
  date: z.string(),
  dueDate: z.string(),
  method: z.enum(['credit_card', 'bank_transfer', 'cash', 'check']),
  tenantId: z.string(),
  propertyId: z.string(),
  unitId: z.string(),
  description: z.string().optional(),
  transactionId: z.string().optional(),
  receiptUrl: z.string().optional()
})

export type Property = z.infer<typeof propertySchema>
export type MaintenanceRequest = z.infer<typeof maintenanceRequestSchema>
export type Payment = z.infer<typeof paymentSchema> 