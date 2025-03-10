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

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) return null

  const {
    properties,
    maintenanceRequests,
    payments,
    tenancies,
    totalRevenue,
    pendingPayments
  } = await getOverviewData(session.user.id)

  const stats: StatItem[] = [
    {
      name: 'Total Properties',
      value: properties,
      icon: BuildingOfficeIcon as IconComponent,
      change: 2,
      trend: 'up'
    },
    {
      name: 'Active Tenants',
      value: tenancies,
      icon: UserGroupIcon as IconComponent,
      change: 5,
      trend: 'up'
    },
    {
      name: 'Pending Maintenance',
      value: maintenanceRequests.length,
      icon: WrenchScrewdriverIcon as IconComponent,
      change: 1,
      trend: 'down'
    },
    {
      name: 'Pending Payments',
      value: pendingPayments,
      icon: CreditCardIcon as IconComponent,
      change: 3,
      trend: 'up'
    }
  ]

  const UpIcon = ArrowUpIcon as IconComponent
  const DownIcon = ArrowDownIcon as IconComponent

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back, {session.user.name}
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.name}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.name}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    {stat.trend === 'up' ? (
                      <UpIcon className="mr-1 h-4 w-4 text-green-500" />
                    ) : (
                      <DownIcon className="mr-1 h-4 w-4 text-red-500" />
                    )}
                    <span>
                      {stat.change}% from last month
                    </span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Recent Activity */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Recent Maintenance */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Maintenance Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {maintenanceRequests.map((request: MaintenanceRequestWithRelations) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">{request.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {request.property.name} - Unit {request.unit.number}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        request.priority === 'high'
                          ? 'bg-red-100 text-red-700'
                          : request.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {request.priority}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Payments */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payments.map((payment: PaymentWithRelations) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">
                        {payment.tenancy.user.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {payment.property.name} - Unit {payment.unit.number}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {formatCurrency(payment.amount)}
                      </p>
                      <p
                        className={`text-xs font-medium ${
                          payment.status === 'completed'
                            ? 'text-green-600'
                            : payment.status === 'pending'
                            ? 'text-yellow-600'
                            : 'text-red-600'
                        }`}
                      >
                        {payment.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
} 