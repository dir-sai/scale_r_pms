'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function GuestCommunication() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Guest Communication</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pre-booking" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="pre-booking">Pre-booking</TabsTrigger>
              <TabsTrigger value="check-in">Check-in</TabsTrigger>
              <TabsTrigger value="during-stay">During Stay</TabsTrigger>
              <TabsTrigger value="check-out">Check-out</TabsTrigger>
              <TabsTrigger value="post-stay">Post-stay</TabsTrigger>
            </TabsList>
            <TabsContent value="pre-booking">
              <Card>
                <CardHeader>
                  <CardTitle>Pre-booking Messages</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Message Templates</h4>
                    <div className="grid gap-2">
                      <Button variant="outline" className="justify-start">
                        Property Information
                      </Button>
                      <Button variant="outline" className="justify-start">
                        Pricing Details
                      </Button>
                      <Button variant="outline" className="justify-start">
                        Availability Response
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">AI Assistance</h4>
                    <div className="grid gap-2">
                      <Button variant="outline" className="justify-start">
                        Generate Custom Response
                      </Button>
                      <Button variant="outline" className="justify-start">
                        Translate Message
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="check-in">
              <Card>
                <CardHeader>
                  <CardTitle>Check-in Instructions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Automated Instructions</h4>
                    <div className="grid gap-2">
                      <Button variant="outline" className="justify-start">
                        Access Details
                      </Button>
                      <Button variant="outline" className="justify-start">
                        House Rules
                      </Button>
                      <Button variant="outline" className="justify-start">
                        Property Guide
                      </Button>
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