import { useEffect, useState } from 'react'

interface Tenant {
  id: string
  name: string
  email: string
  phone: string
  propertyId: string
  unitId: string
  leaseStartDate: string
  leaseEndDate: string
  rentAmount: number
  currency: string
  status: 'active' | 'inactive' | 'pending'
}

export function useTenant() {
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchTenant() {
      try {
        // TODO: Replace with actual API call
        const response = await fetch('/api/tenant/current')
        if (!response.ok) throw new Error('Failed to fetch tenant data')
        const data = await response.json()
        setTenant(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
      } finally {
        setLoading(false)
      }
    }

    fetchTenant()
  }, [])

  return { tenant, loading, error }
} 