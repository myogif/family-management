'use client'

import { useState } from 'react'

export function useActivityLogActions() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getActivityLogs = async (familyId: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/families/${familyId}/activity-logs`)

      if (!response.ok) {
        throw new Error('Failed to fetch activity logs')
      }

      return await response.json()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch activity logs'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    getActivityLogs,
    loading,
    error,
  }
}
