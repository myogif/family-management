'use client'

import { useState } from 'react'

export function useProfileActions() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getProfile = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/profile')

      if (!response.ok) {
        throw new Error('Failed to fetch profile')
      }

      return await response.json()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch profile'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (data: { fullName: string; phone?: string }) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const { error: err } = await response.json()
        throw new Error(err || 'Failed to update profile')
      }

      return await response.json()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update profile'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { getProfile, updateProfile, loading, error }
}
