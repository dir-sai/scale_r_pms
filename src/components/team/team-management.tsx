'use client'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScheduleDialog } from "./schedule-dialog"

type TeamMember = {
  id: string
  name: string
  role: string
  email: string
  status: 'active' | 'inactive'
  properties: string[]
}

const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'John Smith',
    role: 'Property Manager',
    email: 'john@example.com',
    status: 'active',
    properties: ['Property A', 'Property B']
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    role: 'Maintenance Staff',
    email: 'sarah@example.com',
    status: 'active',
    properties: ['Property A']
  },
  {
    id: '3',
    name: 'Mike Brown',
    role: 'Cleaner',
    email: 'mike@example.com',
    status: 'active',
    properties: ['Property B', 'Property C']
  }
]

export function TeamManagement() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Management</CardTitle>
        <CardDescription>
          Manage your team members and their schedules
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockTeamMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <h3 className="font-medium">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
                <p className="text-sm text-muted-foreground">{member.email}</p>
                <div className="mt-1">
                  {member.properties.map((property) => (
                    <span
                      key={property}
                      className="inline-block px-2 py-1 mr-2 text-xs bg-secondary rounded-full"
                    >
                      {property}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <ScheduleDialog teamMember={member} />
                <Button variant="outline">Edit</Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 