import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { maintenanceRequestSchema } from '@/lib/validations/property'
import type { MaintenanceRequest } from '@/lib/validations/property'
import { Button } from '@/components/ui/button-component'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

type FormData = Omit<MaintenanceRequest, 'id' | 'updates'>

export function MaintenanceRequestForm({
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
    resolver: zodResolver(maintenanceRequestSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      priority: initialData?.priority || 'medium',
      status: initialData?.status || 'open',
      date: initialData?.date || new Date().toISOString(),
      propertyId: initialData?.propertyId || '',
      unitId: initialData?.unitId || '',
      tenantId: initialData?.tenantId || '',
      images: initialData?.images || []
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {initialData ? 'Edit Maintenance Request' : 'New Maintenance Request'}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              {...register('title')}
              type="text"
              id="title"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
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
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="priority"
              className="block text-sm font-medium text-gray-700"
            >
              Priority
            </label>
            <select
              {...register('priority')}
              id="priority"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            {errors.priority && (
              <p className="mt-1 text-sm text-red-600">
                {errors.priority.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="images"
              className="block text-sm font-medium text-gray-700"
            >
              Images
            </label>
            <input
              {...register('images')}
              type="file"
              id="images"
              multiple
              accept="image/*"
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
            {errors.images && (
              <p className="mt-1 text-sm text-red-600">
                {errors.images.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Submitting...' : initialData ? 'Update' : 'Submit'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
} 