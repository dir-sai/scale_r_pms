import * as React from 'react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button-component'
import Link from 'next/link'

const leaseDetails = {
  startDate: '2023-09-01',
  endDate: '2024-08-31',
  monthlyRent: 1200,
  securityDeposit: 1800,
  leaseType: 'Fixed Term',
  rentDueDay: 1,
  lateFeeAmount: 50,
  lateFeeAfterDays: 5,
  occupants: 2,
  pets: 'No pets allowed',
  utilities: [
    'Water - Included',
    'Electricity - Tenant responsibility',
    'Gas - Tenant responsibility',
    'Internet - Tenant responsibility'
  ]
}

export function LeaseDetails() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-muted-foreground">Lease Period</p>
          <p className="font-medium">
            {formatDate(leaseDetails.startDate)} -{' '}
            {formatDate(leaseDetails.endDate)}
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/portal/lease/view">View Full Lease</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-sm text-muted-foreground">Monthly Rent</p>
          <p className="font-medium">
            {formatCurrency(leaseDetails.monthlyRent)}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Security Deposit</p>
          <p className="font-medium">
            {formatCurrency(leaseDetails.securityDeposit)}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Lease Type</p>
          <p className="font-medium">{leaseDetails.leaseType}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Rent Due Date</p>
          <p className="font-medium">Day {leaseDetails.rentDueDay} of each month</p>
        </div>
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-1">Late Fee Policy</p>
        <p className="text-sm">
          {formatCurrency(leaseDetails.lateFeeAmount)} after{' '}
          {leaseDetails.lateFeeAfterDays} days
        </p>
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-1">Occupancy</p>
        <p className="text-sm">
          Maximum {leaseDetails.occupants} occupants | {leaseDetails.pets}
        </p>
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-2">Utilities</p>
        <ul className="text-sm space-y-1">
          {leaseDetails.utilities.map((utility, index) => (
            <li key={index}>{utility}</li>
          ))}
        </ul>
      </div>
    </div>
  )
} 