"use client"

import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export function SonnerDemo() {
  return (
    <div className="space-y-4">
      {/* Basic toast with description and action */}
      <Button
        variant="outline"
        onClick={() =>
          toast("Event has been created", {
            description: "Sunday, December 03, 2023 at 9:00 AM",
            action: {
              label: "Undo",
              onClick: () => console.log("Undo"),
            },
          })
        }
      >
        Show Toast
      </Button>

      {/* Success toast */}
      <Button
        variant="default"
        onClick={() =>
          toast.success("Success!", {
            description: "Your event has been successfully created.",
          })
        }
      >
        Success Toast
      </Button>

      {/* Error toast */}
      <Button
        variant="destructive"
        onClick={() =>
          toast.error("Error occurred", {
            description: "Failed to create event. Please try again.",
          })
        }
      >
        Error Toast
      </Button>

      {/* Promise toast */}
      <Button
        variant="secondary"
        onClick={() => {
          const promise = new Promise((resolve, reject) => {
            setTimeout(() => {
              if (Math.random() > 0.5) {
                resolve("Success")
              } else {
                reject("Failed")
              }
            }, 1500)
          })

          toast.promise(promise, {
            loading: "Creating event...",
            success: "Event created successfully",
            error: "Failed to create event",
          })
        }}
      >
        Promise Toast
      </Button>
    </div>
  )
}