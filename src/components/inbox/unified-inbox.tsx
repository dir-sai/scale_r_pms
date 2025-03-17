'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Message = {
  id: string
  sender: string
  subject: string
  preview: string
  date: string
  platform: string
  unread: boolean
}

const mockMessages: Message[] = [
  {
    id: '1',
    sender: 'John Doe',
    subject: 'Booking Inquiry',
    preview: 'Hi, I\'m interested in booking your property for...',
    date: '2024-03-11',
    platform: 'Airbnb',
    unread: true
  },
  {
    id: '2',
    sender: 'Jane Smith',
    subject: 'Check-in Question',
    preview: 'Could you please provide the access code for...',
    date: '2024-03-10',
    platform: 'Booking.com',
    unread: false
  }
]

export function UnifiedInbox() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Unified Inbox</CardTitle>
            <Button>Compose</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockMessages.map((message) => (
              <div
                key={message.id}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  message.unread ? 'bg-muted/50' : ''
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{message.sender}</span>
                    <span className="text-sm text-muted-foreground">
                      via {message.platform}
                    </span>
                  </div>
                  <p className="font-medium">{message.subject}</p>
                  <p className="text-sm text-muted-foreground">
                    {message.preview}
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {message.date}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 