'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Channel = {
  id: string
  name: string
  status: 'connected' | 'disconnected'
  lastSync: string
  properties: number
}

const mockChannels: Channel[] = [
  {
    id: '1',
    name: 'Airbnb',
    status: 'connected',
    lastSync: '2024-03-11 14:30',
    properties: 5
  },
  {
    id: '2',
    name: 'Booking.com',
    status: 'connected',
    lastSync: '2024-03-11 14:25',
    properties: 3
  },
  {
    id: '3',
    name: 'VRBO',
    status: 'disconnected',
    lastSync: '2024-03-10 09:15',
    properties: 0
  }
]

export function ChannelManager() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Channel Manager</CardTitle>
            <Button>Connect New Channel</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="channels" className="space-y-4">
            <TabsList>
              <TabsTrigger value="channels">Connected Channels</TabsTrigger>
              <TabsTrigger value="sync">Sync Status</TabsTrigger>
              <TabsTrigger value="rates">Rate Management</TabsTrigger>
            </TabsList>
            <TabsContent value="channels">
              <div className="space-y-4">
                {mockChannels.map((channel) => (
                  <div
                    key={channel.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{channel.name}</span>
                        <span
                          className={`text-sm px-2 py-1 rounded-full ${
                            channel.status === 'connected'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {channel.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Last synced: {channel.lastSync}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {channel.properties} properties connected
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline">Settings</Button>
                      <Button variant="outline">Sync Now</Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="sync">
              <Card>
                <CardHeader>
                  <CardTitle>Sync Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-4">
                      <div className="flex items-center justify-between p-4 rounded-lg border">
                        <div>
                          <h4 className="font-medium">Last Global Sync</h4>
                          <p className="text-sm text-muted-foreground">
                            2024-03-11 14:30
                          </p>
                        </div>
                        <Button>Run Global Sync</Button>
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-lg border">
                        <div>
                          <h4 className="font-medium">Sync Schedule</h4>
                          <p className="text-sm text-muted-foreground">
                            Every 30 minutes
                          </p>
                        </div>
                        <Button variant="outline">Adjust Schedule</Button>
                      </div>
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