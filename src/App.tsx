import { Suspense } from 'react'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'

export default function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardLayout>
        {/* Your app content will be rendered here */}
      </DashboardLayout>
    </Suspense>
  )
} 