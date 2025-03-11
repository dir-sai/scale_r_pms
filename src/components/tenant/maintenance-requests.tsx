import * as React from 'react'
import { formatDate } from '@/utils/format-date'
import { Button } from '../ui/button'
import Link from 'next/link'

interface MaintenanceRequest {
  id: number
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  createdAt: string
  updatedAt: string
}

const mockRequests: MaintenanceRequest[] = [
  {
    id: 1,
    title: 'Water Leak in Kitchen',
    description: 'Water is leaking from under the kitchen sink. The cabinet below is getting water damage.',
    status: 'pending',
    priority: 'high',
    createdAt: '2024-03-08T10:00:00Z',
    updatedAt: '2024-03-08T10:00:00Z'
  },
  {
    id: 2,
    title: 'AC Not Cooling Properly',
    description: 'The air conditioner is running but not cooling effectively. Room temperature remains high even on maximum settings.',
    status: 'in_progress',
    priority: 'medium',
    createdAt: '2024-03-07T15:30:00Z',
    updatedAt: '2024-03-08T09:00:00Z'
  },
  {
    id: 3,
    title: 'Electrical Socket Issue',
    description: 'The electrical socket in the living room is loose and sparking when plugs are inserted. This seems dangerous.',
    status: 'completed',
    priority: 'high',
    createdAt: '2024-03-05T08:00:00Z',
    updatedAt: '2024-03-06T14:00:00Z'
  },
  {
    id: 4,
    title: 'Bathroom Tiles Cracking',
    description: 'Several tiles in the bathroom floor are cracking and becoming loose. Concerned about water damage to the subfloor.',
    status: 'pending',
    priority: 'medium',
    createdAt: '2024-03-04T11:20:00Z',
    updatedAt: '2024-03-04T11:20:00Z'
  }
];

const statusColors: Record<MaintenanceRequest['status'], string> = {
  pending: 'text-yellow-500',
  in_progress: 'text-blue-500',
  completed: 'text-green-500'
}

const priorityColors: Record<MaintenanceRequest['priority'], string> = {
  low: 'bg-gray-100',
  medium: 'bg-yellow-100',
  high: 'bg-red-100'
}

export function MaintenanceRequests() {
  const activeRequests = mockRequests.filter(
    (request) => request.status !== 'completed'
  )
  const completedRequests = mockRequests.filter(
    (request) => request.status === 'completed'
  )

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Active Requests</h3>
        <Button variant="outline" size="sm" asChild>
          <Link href="/portal/maintenance/new">New Request</Link>
        </Button>
      </div>

      <div className="space-y-4">
        {activeRequests.map((request) => (
          <div
            key={request.id}
            className="rounded-lg border p-4 hover:border-primary transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium">{request.title}</h4>
                <p className="text-sm text-muted-foreground">
                  Submitted {formatDate(request.createdAt)}
                </p>
              </div>
              <div
                className={`px-2 py-1 rounded text-sm ${priorityColors[request.priority as keyof typeof priorityColors]
                  }`}
              >
                {request.priority.charAt(0).toUpperCase() +
                  request.priority.slice(1)}
              </div>
            </div>
            <p className="text-sm mb-2">{request.description}</p>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">
                Updated: {formatDate(request.updatedAt)}
              </span>
              <span
                className={
                  statusColors[request.status as keyof typeof statusColors]
                }
              >
                {request.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {completedRequests.length > 0 && (
        <>
          <h3 className="font-semibold mt-6">Completed Requests</h3>
          <div className="space-y-2">
            {completedRequests.map((request) => (
              <div
                key={request.id}
                className="rounded-lg border p-4 bg-muted/50"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{request.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      Completed {formatDate(request.createdAt)}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {request.description}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
} 