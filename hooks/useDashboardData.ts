'use client'

import { useState } from 'react'

export function useDashboardData() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getDashboardData = async (familyId: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/families/${familyId}/dashboard`)

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data')
      }

      return await response.json()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch dashboard data'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { getDashboardData, loading, error }
}
