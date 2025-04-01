"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export function ToastDemo() {
  const { toast } = useToast()

  return (
    <div className="space-y-4">
      <Button
        variant="outline"
        onClick={() => {
          toast({
            title: "Event Created",
            description: "Sunday, December 03, 2023 at 9:00 AM",
            action: {
              label: "Undo",
              onClick: () => console.log("Undo")
            },
          })
        }}
      >
        Show Toast
      </Button>

      <Button
        variant="default"
        onClick={() => {
          toast({
            variant: "default",
            title: "Success!",
            description: "Your event has been successfully created.",
          })
        }}
      >
        Success Toast
      </Button>

      <Button
        variant="destructive"
        onClick={() => {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to create event. Please try again.",
          })
        }}
      >
        Error Toast
      </Button>
    </div>
  )
}