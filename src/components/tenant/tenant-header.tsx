import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  BanknotesIcon,
  DocumentTextIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline'

const quickActions = [
  {
    name: 'Make Payment',
    href: '/portal/payments/new',
    icon: BanknotesIcon,
    color: 'text-green-500'
  },
  {
    name: 'Submit Request',
    href: '/portal/maintenance/new',
    icon: WrenchScrewdriverIcon,
    color: 'text-blue-500'
  },
  {
    name: 'View Documents',
    href: '/portal/documents',
    icon: DocumentTextIcon,
    color: 'text-purple-500'
  }
]

export function TenantHeader() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome Back, John</h1>
          <p className="text-muted-foreground">
            Here's what's happening with your rental
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/portal/profile">View Profile</Link>
          </Button>
          <Button variant="default" asChild>
            <Link href="/portal/settings">Settings</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {quickActions.map((action) => (
          <Link
            key={action.name}
            href={action.href}
            className="group relative rounded-lg border p-4 hover:border-primary"
          >
            <div className="flex items-center gap-3">
              <action.icon
                className={`h-6 w-6 ${action.color} transition-transform group-hover:scale-110`}
              />
              <div>
                <h3 className="font-semibold">{action.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Click to proceed
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border p-4">
          <div className="text-2xl font-bold text-green-500">$1,200</div>
          <p className="text-sm text-muted-foreground">Next Payment Due</p>
          <p className="text-sm">January 1, 2024</p>
        </div>

        <div className="rounded-lg border p-4">
          <div className="text-2xl font-bold text-blue-500">2</div>
          <p className="text-sm text-muted-foreground">Open Requests</p>
          <p className="text-sm">View all requests</p>
        </div>

        <div className="rounded-lg border p-4">
          <div className="text-2xl font-bold text-purple-500">8</div>
          <p className="text-sm text-muted-foreground">Documents</p>
          <p className="text-sm">View all documents</p>
        </div>
      </div>
    </div>
  )
} 