"use client"

import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"

export function ToastUsageExamples() {
  const { toast } = useToast()

  return (
    <div className="space-y-4">
      {/* Basic toast */}
      <Button
        onClick={() => {
          toast({
            title: "Default Toast",
            description: "This is a basic toast message",
          })
        }}
      >
        Show Basic Toast
      </Button>

      {/* Destructive toast */}
      <Button
        variant="destructive"
        onClick={() => {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Something went wrong!",
          })
        }}
      >
        Show Error Toast
      </Button>

      {/* Toast with action */}
      <Button
        onClick={() => {
          toast({
            title: "New message",
            description: "You have a new message in your inbox",
            action: (
              <Button
                variant="outline"
                size="sm"
                onClick={() => console.log("Action clicked")}
              >
                View
              </Button>
            ),
          })
        }}
      >
        Toast with Action
      </Button>

      {/* Async operation with toast */}
      <Button
        onClick={async () => {
          try {
            toast({
              title: "Saving...",
              description: "Please wait while we save your changes",
            })

            // Simulated async operation
            await new Promise(resolve => setTimeout(resolve, 2000))

            toast({
              title: "Saved",
              description: "Your changes have been saved successfully",
            })
          } catch (error) {
            toast({
              variant: "destructive",
              title: "Error",
              description: "Failed to save changes",
            })
          }
        }}
      >
        Async Operation
      </Button>
    </div>
  )
}