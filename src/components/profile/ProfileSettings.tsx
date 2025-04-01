'use client'

import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'

interface ProfileData {
  name: string
  email: string
}

export function ProfileSettings() {
  const toast = useToast()
  const [loading, setLoading] = useState(false)

  // Example API call simulation
  const api = {
    saveProfile: async (data: ProfileData): Promise<ProfileData> => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      // Simulate success/failure randomly
      if (Math.random() > 0.5) {
        return data
      }
      throw new Error('Network error occurred')
    }
  }

  // Simple success/error examples
  const handleQuickSave = () => {
    try {
      // Some quick operation
      toast.success('Profile updated successfully', {
        duration: 3000,
        position: 'bottom-right'
      })
    } catch (err) {
      toast.error('Failed to save changes')
    }
  }

  // Promise example with loading state
  const handleSaveWithPromise = async () => {
    const profileData = {
      name: 'John Doe',
      email: 'john@example.com'
    }

    toast.promise(api.saveProfile(profileData), {
      loading: 'Saving changes...',
      success: 'Changes saved successfully',
      error: (err) => `Error: ${err.message}`,
    })
  }

  // Custom duration example
  const handleLongNotification = () => {
    toast.info('This notification will stay for 5 seconds', {
      duration: 5000
    })
  }

  // Custom position example
  const handleCenteredWarning = () => {
    toast.warning('Please review your changes!', {
      position: 'top-center'
    })
  }

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-bold mb-4">Profile Settings</h2>
      
      <div className="flex flex-col gap-3">
        <button
          onClick={handleQuickSave}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Quick Save
        </button>

        <button
          onClick={handleSaveWithPromise}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save with Loading State
        </button>

        <button
          onClick={handleLongNotification}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Show Long Notification
        </button>

        <button
          onClick={handleCenteredWarning}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Show Centered Warning
        </button>
      </div>
    </div>
  )
}