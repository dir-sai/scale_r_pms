import * as React from 'react'
import { Metadata } from 'next'
import type { ComponentType } from 'react'
import type { SVGProps } from 'react'
import {
  BuildingOfficeIcon,
  WrenchScrewdriverIcon,
  CreditCardIcon,
  UserGroupIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { formatCurrency } from '@/lib/utils'
import { MaintenanceRequests } from '@/components/tenant/maintenance-requests'
import { TenantHeader } from '@/components/tenant/tenant-header'

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>

type StatItem = {
  name: string
  value: number
  icon: IconComponent
  change: number
  trend: 'up' | 'down'
}

type MaintenanceRequestWithRelations = {
  id: string
  title: string
  priority: 'high' | 'medium' | 'low'
  property: { name: string }
  unit: { number: string }
}

type PaymentWithRelations = {
  id: string
  amount: number
  status: 'completed' | 'pending' | 'failed'
  property: { name: string }
  unit: { number: string }
  tenancy: {
    user: { name: string }
  }
}

async function getOverviewData(userId: string) {
  const [
    properties,
    maintenanceRequests,
    payments,
    tenancies
  ] = await Promise.all([
    db.property.count({
      where: { ownerId: userId }
    }),
    db.maintenanceRequest.findMany({
      where: {
        property: { ownerId: userId },
        status: { not: 'completed' }
      },
      orderBy: { date: 'desc' },
      take: 5,
      include: {
        property: true,
        unit: true
      }
    }),
    db.payment.findMany({
      where: {
        property: { ownerId: userId }
      },
      orderBy: { date: 'desc' },
      take: 5,
      include: {
        property: true,
        unit: true,
        tenancy: {
          include: {
            user: true
          }
        }
      }
    }),
    db.tenancy.count({
      where: {
        unit: {
          property: {
            ownerId: userId
          }
        },
        endDate: {
          gte: new Date()
        }
      }
    })
  ])

  const totalRevenue = payments.reduce((sum: number, payment: PaymentWithRelations) => sum + payment.amount, 0)
  const pendingPayments = payments.filter(
    (payment: PaymentWithRelations) => payment.status === 'pending'
  ).length

  return {
    properties,
    maintenanceRequests: maintenanceRequests as MaintenanceRequestWithRelations[],
    payments: payments as PaymentWithRelations[],
    tenancies,
    totalRevenue,
    pendingPayments
  }
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <TenantHeader />
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Maintenance Requests</h2>
          <MaintenanceRequests />
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Recent Activity</h2>
          <div className="rounded-lg border">
            <div className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Rent Payment Processed</p>
                    <p className="text-xs text-gray-500">March 1, 2024</p>
                  </div>
                  <span className="text-green-600">$1,200</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Maintenance Request Updated</p>
                    <p className="text-xs text-gray-500">February 28, 2024</p>
                  </div>
                  <span className="text-blue-600">In Progress</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">New Document Added</p>
                    <p className="text-xs text-gray-500">February 25, 2024</p>
                  </div>
                  <span className="text-purple-600">Lease Agreement</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 