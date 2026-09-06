'use client'

import { useState } from 'react'

export function useDebtActions() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getDebts = async (familyId: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/families/${familyId}/debts`)

      if (!response.ok) {
        throw new Error('Failed to fetch debts')
      }

      return await response.json()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch debts'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  const createDebt = async (familyId: string, data: any) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/families/${familyId}/debts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const { error: err } = await response.json()
        throw new Error(err || 'Failed to create debt')
      }

      return await response.json()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create debt'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  const updateDebt = async (familyId: string, debtId: string, data: any) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/families/${familyId}/debts/${debtId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const { error: err } = await response.json()
        throw new Error(err || 'Failed to update debt')
      }

      return await response.json()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update debt'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  const deleteDebt = async (familyId: string, debtId: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/families/${familyId}/debts/${debtId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const { error: err } = await response.json()
        throw new Error(err || 'Failed to delete debt')
      }

      return await response.json()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete debt'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    getDebts,
    createDebt,
    updateDebt,
    deleteDebt,
    loading,
    error,
  }
}
