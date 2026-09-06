'use client'

import { useState } from 'react'

export function useCategoryActions() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getCategories = async (familyId: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/families/${familyId}/categories`)

      if (!response.ok) {
        throw new Error('Failed to fetch categories')
      }

      return await response.json()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch categories'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  const createCategory = async (familyId: string, data: any) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/families/${familyId}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const { error: err } = await response.json()
        throw new Error(err || 'Failed to create category')
      }

      return await response.json()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create category'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  const updateCategory = async (familyId: string, categoryId: string, data: any) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/families/${familyId}/categories/${categoryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const { error: err } = await response.json()
        throw new Error(err || 'Failed to update category')
      }

      return await response.json()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update category'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  const deleteCategory = async (familyId: string, categoryId: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/families/${familyId}/categories/${categoryId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const { error: err } = await response.json()
        throw new Error(err || 'Failed to delete category')
      }

      return await response.json()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete category'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    loading,
    error,
  }
}
