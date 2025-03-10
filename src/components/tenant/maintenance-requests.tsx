import * as React from 'react'
import { formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button-component'
import Link from 'next/link'

const requests = [
  {
    id: 1,
    title: 'Leaking Faucet',
    status: 'in_progress',
    priority: 'medium',
    date: '2024-01-15',
    description: 'Kitchen sink faucet is dripping continuously',
    assignedTo: 'John Smith'
  },
  {
    id: 2,
    title: 'AC Not Cooling',
    status: 'open',
    priority: 'high',
    date: '2024-01-18',
    description: 'Air conditioner is running but not cooling effectively',
    assignedTo: 'Pending Assignment'
  },
  {
    id: 3,
    title: 'Light Fixture Replacement',
    status: 'completed',
    priority: 'low',
    date: '2024-01-10',
    description: 'Living room ceiling light needs replacement',
    assignedTo: 'Mike Johnson'
  }
]

const statusColors = {
  open: 'text-yellow-500',
  in_progress: 'text-blue-500',
  completed: 'text-green-500'
}

const priorityColors = {
  low: 'bg-gray-100',
  medium: 'bg-yellow-100',
  high: 'bg-red-100'
}

export function MaintenanceRequests() {
  const activeRequests = requests.filter(
    (request) => request.status !== 'completed'
  )
  const completedRequests = requests.filter(
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
                  Submitted {formatDate(request.date)}
                </p>
              </div>
              <div
                className={`px-2 py-1 rounded text-sm ${
                  priorityColors[request.priority as keyof typeof priorityColors]
                }`}
              >
                {request.priority.charAt(0).toUpperCase() +
                  request.priority.slice(1)}
              </div>
            </div>
            <p className="text-sm mb-2">{request.description}</p>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">
                Assigned to: {request.assignedTo}
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
                      Completed {formatDate(request.date)}
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