import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { paymentSchema } from '@/lib/validations/property'
import type { Payment } from '@/lib/validations/property'
import { Button } from '@/components/ui/button-component'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

type FormData = Omit<Payment, 'id'>

export function PaymentForm({
  onSubmit,
  initialData,
  isLoading
}: {
  onSubmit: (data: FormData) => void
  initialData?: Partial<FormData>
  isLoading?: boolean
}) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: initialData?.amount || 0,
      type: initialData?.type || 'rent',
      status: initialData?.status || 'pending',
      date: initialData?.date || new Date().toISOString(),
      dueDate: initialData?.dueDate || new Date().toISOString(),
      method: initialData?.method || 'credit_card',
      tenantId: initialData?.tenantId || '',
      propertyId: initialData?.propertyId || '',
      unitId: initialData?.unitId || '',
      description: initialData?.description || ''
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? 'Edit Payment' : 'New Payment'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700"
            >
              Amount
            </label>
            <input
              {...register('amount', { valueAsNumber: true })}
              type="number"
              step="0.01"
              id="amount"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700"
            >
              Type
            </label>
            <select
              {...register('type')}
              id="type"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            >
              <option value="rent">Rent</option>
              <option value="deposit">Deposit</option>
              <option value="late_fee">Late Fee</option>
              <option value="other">Other</option>
            </select>
            {errors.type && (
              <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="method"
              className="block text-sm font-medium text-gray-700"
            >
              Payment Method
            </label>
            <select
              {...register('method')}
              id="method"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            >
              <option value="credit_card">Credit Card</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="cash">Cash</option>
              <option value="check">Check</option>
            </select>
            {errors.method && (
              <p className="mt-1 text-sm text-red-600">{errors.method.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="dueDate"
              className="block text-sm font-medium text-gray-700"
            >
              Due Date
            </label>
            <input
              {...register('dueDate')}
              type="date"
              id="dueDate"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
            {errors.dueDate && (
              <p className="mt-1 text-sm text-red-600">
                {errors.dueDate.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              {...register('description')}
              id="description"
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Processing...' : initialData ? 'Update' : 'Submit'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
} 