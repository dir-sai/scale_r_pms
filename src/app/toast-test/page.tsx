"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export default function ToastTestPage() {
  const { toast } = useToast()

  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-2xl font-bold mb-6">Toast Testing Page</h1>
      
      <div className="grid gap-4">
        <h2 className="text-xl font-semibold">Basic Toasts</h2>
        <div className="flex gap-4">
          <Button
            onClick={() => {
              toast({
                title: "Default Toast",
                description: "This is a default toast message",
              })
            }}
          >
            Default Toast
          </Button>

          <Button
            variant="destructive"
            onClick={() => {
              toast({
                variant: "destructive",
                title: "Error Toast",
                description: "Something went wrong!",
              })
            }}
          >
            Error Toast
          </Button>
        </div>

        <h2 className="text-xl font-semibold mt-4">Interactive Toasts</h2>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => {
              toast({
                title: "Action Required",
                description: "Please confirm your action",
                action: (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => console.log("Action clicked")}
                  >
                    Confirm
                  </Button>
                ),
              })
            }}
          >
            Toast with Action
          </Button>

          <Button
            variant="secondary"
            onClick={() => {
              toast({
                title: "Auto-dismiss Toast",
                description: "This toast will dismiss in 3 seconds",
                duration: 3000,
              })
            }}
          >
            Auto-dismiss Toast
          </Button>
        </div>

        <h2 className="text-xl font-semibold mt-4">Multiple Toasts</h2>
        <Button
          onClick={() => {
            Array.from({ length: 3 }).forEach((_, i) => {
              setTimeout(() => {
                toast({
                  title: `Toast ${i + 1}`,
                  description: `This is toast number ${i + 1}`,
                })
              }, i * 1000)
            })
          }}
        >
          Show Multiple Toasts
        </Button>
      </div>
    </div>
  )
}