'use client'

import { useState } from 'react'
import { CreateFamilyInput } from '@/lib/validations'

export function useFamilyActions() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createFamily = async (data: CreateFamilyInput) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/families', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const { error: err } = await response.json()
        throw new Error(err || 'Failed to create family')
      }

      return await response.json()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create family'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  const getFamilies = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/families')

      if (!response.ok) {
        throw new Error('Failed to fetch families')
      }

      return await response.json()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch families'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  const getFamily = async (familyId: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/families/${familyId}`)

      if (!response.ok) {
        throw new Error('Failed to fetch family')
      }

      return await response.json()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch family'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  const updateFamily = async (familyId: string, data: Partial<CreateFamilyInput>) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/families/${familyId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const { error: err } = await response.json()
        throw new Error(err || 'Failed to update family')
      }

      return await response.json()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update family'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  const deleteFamily = async (familyId: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/families/${familyId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const { error: err } = await response.json()
        throw new Error(err || 'Failed to delete family')
      }

      return await response.json()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete family'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    createFamily,
    getFamilies,
    getFamily,
    updateFamily,
    deleteFamily,
    loading,
    error,
  }
}
