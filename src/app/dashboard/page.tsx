'use client'

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
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GuestCommunication } from "@/components/communication/guest-communication"
import { UnifiedInbox } from "@/components/inbox/unified-inbox"
import { ChannelManager } from "@/components/channel-manager/channel-manager"
import { TeamManagement } from "@/components/team/team-management"
import { TaskManagement } from "@/components/tasks/task-management"

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
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button>Add Property</Button>
        </div>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="inbox">Unified Inbox</TabsTrigger>
          <TabsTrigger value="channels">Channel Manager</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="p-4">
              <h3 className="font-semibold">Active Properties</h3>
              <p className="text-2xl font-bold">12</p>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold">Pending Tasks</h3>
              <p className="text-2xl font-bold">8</p>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold">New Messages</h3>
              <p className="text-2xl font-bold">24</p>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold">Team Members</h3>
              <p className="text-2xl font-bold">6</p>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="communication" className="space-y-4">
          <GuestCommunication />
        </TabsContent>
        <TabsContent value="inbox" className="space-y-4">
          <UnifiedInbox />
        </TabsContent>
        <TabsContent value="channels" className="space-y-4">
          <ChannelManager />
        </TabsContent>
        <TabsContent value="team" className="space-y-4">
          <TeamManagement />
        </TabsContent>
        <TabsContent value="tasks" className="space-y-4">
          <TaskManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
} 