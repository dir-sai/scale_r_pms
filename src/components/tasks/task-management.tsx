'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreateTaskDialog } from "./create-task-dialog"
import { TimesheetDialog } from "./timesheet-dialog"

type Task = {
  id: string
  title: string
  description: string
  assignee: string
  dueDate: string
  status: 'pending' | 'in-progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  property: string
}

type TeamMember = {
  name: string
  clockedIn: string
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Clean Property A',
    description: 'Complete cleaning checklist for Property A after guest checkout',
    assignee: 'Mike Brown',
    dueDate: '2024-03-12',
    status: 'pending',
    priority: 'high',
    property: 'Property A'
  },
  {
    id: '2',
    title: 'Fix Bathroom Leak',
    description: 'Investigate and repair leak in master bathroom',
    assignee: 'Sarah Johnson',
    dueDate: '2024-03-13',
    status: 'in-progress',
    priority: 'medium',
    property: 'Property B'
  }
]

const mockTeamMembers: TeamMember[] = [
  {
    name: 'Mike Brown',
    clockedIn: '09:00'
  },
  {
    name: 'Sarah Johnson',
    clockedIn: '08:30'
  }
]

export function TaskManagement() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Task Management</CardTitle>
            <CreateTaskDialog />
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active" className="space-y-4">
            <TabsList>
              <TabsTrigger value="active">Active Tasks</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="timesheets">Timesheets</TabsTrigger>
            </TabsList>
            <TabsContent value="active">
              <div className="space-y-4">
                {mockTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{task.title}</span>
                        <span
                          className={`text-sm px-2 py-1 rounded-full ${
                            task.priority === 'high'
                              ? 'bg-red-100 text-red-700'
                              : task.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {task.priority}
                        </span>
                        <span
                          className={`text-sm px-2 py-1 rounded-full ${
                            task.status === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : task.status === 'in-progress'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {task.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {task.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Assigned to: {task.assignee}</span>
                        <span>Due: {task.dueDate}</span>
                        <span>Property: {task.property}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline">Edit</Button>
                      <Button variant="outline">Complete</Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="timesheets">
              <Card>
                <CardHeader>
                  <CardTitle>Team Timesheets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-4">
                      {mockTeamMembers.map((member) => (
                        <div
                          key={member.name}
                          className="flex items-center justify-between p-4 rounded-lg border"
                        >
                          <div>
                            <h4 className="font-medium">{member.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Clocked in: {member.clockedIn} AM
                            </p>
                          </div>
                          <TimesheetDialog teamMember={member} />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
} 