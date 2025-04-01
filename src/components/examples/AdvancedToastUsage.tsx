"use client"

import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"

export function AdvancedToastUsage() {
  const { toast, dismiss } = useToast()

  const showUpdatingToast = () => {
    const { id, update } = toast({
      title: "Loading...",
      description: "Please wait",
    })

    // Update the toast after 2 seconds
    setTimeout(() => {
      update({
        id,
        title: "Complete",
        description: "Operation finished successfully",
      })
    }, 2000)
  }

  const showDismissibleToast = () => {
    const { id } = toast({
      title: "Dismissible Toast",
      description: "Click the button to dismiss this toast",
    })

    // Dismiss the specific toast after 3 seconds
    setTimeout(() => {
      dismiss(id)
    }, 3000)
  }

  return (
    <div className="space-y-4">
      <Button onClick={showUpdatingToast}>
        Show Updating Toast
      </Button>

      <Button onClick={showDismissibleToast}>
        Show Dismissible Toast
      </Button>
    </div>
  )
}