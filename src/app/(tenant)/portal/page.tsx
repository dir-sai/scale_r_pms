import { Suspense } from 'react'
import { Metadata } from 'next'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { PaymentHistory } from '@/components/tenant/payment-history'
import { MaintenanceRequests } from '@/components/tenant/maintenance-requests'
import { LeaseDetails } from '@/components/tenant/lease-details'
import { DocumentList } from '@/components/tenant/document-list'
import { PropertyInfo } from '@/components/tenant/property-info'
import { TenantHeader } from '@/components/tenant/tenant-header'

export const metadata: Metadata = {
  title: 'Tenant Portal - Scale-R PMS',
  description: 'Manage your rental property, payments, and maintenance requests'
}

export default function TenantPortalPage() {
  return (
    <div className="space-y-6">
      <TenantHeader />
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Property Information</h2>
          <Suspense fallback={<Skeleton className="h-[200px]" />}>
            <PropertyInfo />
          </Suspense>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Lease Details</h2>
          <Suspense fallback={<Skeleton className="h-[200px]" />}>
            <LeaseDetails />
          </Suspense>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Payment History</h2>
          <Suspense fallback={<Skeleton className="h-[300px]" />}>
            <PaymentHistory />
          </Suspense>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Maintenance Requests</h2>
          <Suspense fallback={<Skeleton className="h-[300px]" />}>
            <MaintenanceRequests />
          </Suspense>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Documents</h2>
        <Suspense fallback={<Skeleton className="h-[200px]" />}>
          <DocumentList />
        </Suspense>
      </Card>
    </div>
  )
} 