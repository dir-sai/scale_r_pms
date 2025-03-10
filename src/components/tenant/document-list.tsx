import * as React from 'react'
import { formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button-component'
import {
  DocumentIcon,
  DocumentTextIcon,
  DocumentCheckIcon
} from '@heroicons/react/24/outline'

const documents = [
  {
    id: 1,
    name: 'Lease Agreement',
    type: 'contract',
    date: '2023-09-01',
    size: '2.4 MB',
    status: 'signed'
  },
  {
    id: 2,
    name: 'Move-in Inspection',
    type: 'report',
    date: '2023-09-01',
    size: '1.8 MB',
    status: 'signed'
  },
  {
    id: 3,
    name: 'Rent Payment Schedule',
    type: 'document',
    date: '2023-09-01',
    size: '156 KB',
    status: 'active'
  },
  {
    id: 4,
    name: 'Building Rules',
    type: 'document',
    date: '2023-09-01',
    size: '342 KB',
    status: 'active'
  }
]

const documentIcons = {
  contract: DocumentCheckIcon,
  report: DocumentTextIcon,
  document: DocumentIcon
}

export function DocumentList() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {documents.map((doc) => {
          const Icon = documentIcons[doc.type as keyof typeof documentIcons]
          return (
            <div
              key={doc.id}
              className="flex items-start space-x-4 rounded-lg border p-4"
            >
              <div className="mt-1">
                <Icon className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{doc.name}</p>
                  <span className="text-xs text-muted-foreground">
                    {doc.size}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Added {formatDate(doc.date)}
                </p>
                <div className="flex items-center justify-between pt-2">
                  <span
                    className={`text-xs ${
                      doc.status === 'signed'
                        ? 'text-green-500'
                        : 'text-blue-500'
                    }`}
                  >
                    {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                  </span>
                  <Button variant="ghost" size="sm">
                    Download
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
} 