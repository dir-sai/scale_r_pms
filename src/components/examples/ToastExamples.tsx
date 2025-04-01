'use client'

import { toast } from 'sonner'

export function ToastExamples() {
  return (
    <div className="space-y-4">
      <button
        onClick={() => toast('Default toast')}
        className="px-4 py-2 bg-gray-500 text-white rounded"
      >
        Default Toast
      </button>

      <button
        onClick={() => toast.success('Success toast')}
        className="px-4 py-2 bg-green-500 text-white rounded"
      >
        Success Toast
      </button>

      <button
        onClick={() => 
          toast('Custom toast', {
            description: 'With extra details',
            action: {
              label: 'Undo',
              onClick: () => console.log('Undo clicked')
            },
            duration: 5000,
            position: 'top-center'
          })
        }
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Custom Toast
      </button>

      <button
        onClick={() => 
          toast.promise(
            // Your async function here
            new Promise((resolve) => setTimeout(resolve, 2000)),
            {
              loading: 'Loading...',
              success: 'Operation completed',
              error: 'Something went wrong'
            }
          )
        }
        className="px-4 py-2 bg-purple-500 text-white rounded"
      >
        Promise Toast
      </button>
    </div>
  )
}