'use client'

import { useState } from 'react'

export function useAssetActions() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getAssets = async (familyId: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/families/${familyId}/assets`)

      if (!response.ok) {
        throw new Error('Failed to fetch assets')
      }

      return await response.json()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch assets'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  const createAsset = async (familyId: string, data: any) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/families/${familyId}/assets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const { error: err } = await response.json()
        throw new Error(err || 'Failed to create asset')
      }

      return await response.json()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create asset'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  const updateAsset = async (familyId: string, assetId: string, data: any) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/families/${familyId}/assets/${assetId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const { error: err } = await response.json()
        throw new Error(err || 'Failed to update asset')
      }

      return await response.json()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update asset'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  const deleteAsset = async (familyId: string, assetId: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/families/${familyId}/assets/${assetId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const { error: err } = await response.json()
        throw new Error(err || 'Failed to delete asset')
      }

      return await response.json()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete asset'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    getAssets,
    createAsset,
    updateAsset,
    deleteAsset,
    loading,
    error,
  }
}
