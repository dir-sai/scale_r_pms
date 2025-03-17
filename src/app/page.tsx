'use client'

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">Scale-R PMS</h1>
        <p className="text-xl mb-4">Welcome to your property management system</p>
        <Button
          onClick={() => {
            toast({
              title: "Welcome!",
              description: "This is a test notification.",
            })
          }}
        >
          Show Toast
        </Button>
      </div>
    </main>
  )
} 