'use client'

import { useState } from 'react'

export function useGoalActions() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getGoals = async (familyId: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/families/${familyId}/goals`)

      if (!response.ok) {
        throw new Error('Failed to fetch goals')
      }

      return await response.json()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch goals'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  const createGoal = async (familyId: string, data: any) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/families/${familyId}/goals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const { error: err } = await response.json()
        throw new Error(err || 'Failed to create goal')
      }

      return await response.json()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create goal'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  const updateGoal = async (familyId: string, goalId: string, data: any) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/families/${familyId}/goals/${goalId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const { error: err } = await response.json()
        throw new Error(err || 'Failed to update goal')
      }

      return await response.json()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update goal'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  const deleteGoal = async (familyId: string, goalId: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/families/${familyId}/goals/${goalId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const { error: err } = await response.json()
        throw new Error(err || 'Failed to delete goal')
      }

      return await response.json()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete goal'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    getGoals,
    createGoal,
    updateGoal,
    deleteGoal,
    loading,
    error,
  }
}
