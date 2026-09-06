'use client'

import { useState } from 'react'

interface TransactionFilters {
  page?: number
  type?: string
  categoryId?: string
  dateFrom?: string
  dateTo?: string
  search?: string
}

export function useTransactionActions() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getTransactions = async (familyId: string, filters?: TransactionFilters) => {
    setLoading(true)
    setError(null)
    try {
      const url = new URL(`/api/families/${familyId}/transactions`, window.location.origin)
      if (filters?.page) url.searchParams.set('page', filters.page.toString())
      if (filters?.type) url.searchParams.set('type', filters.type)
      if (filters?.categoryId) url.searchParams.set('categoryId', filters.categoryId)
      if (filters?.dateFrom) url.searchParams.set('dateFrom', filters.dateFrom)
      if (filters?.dateTo) url.searchParams.set('dateTo', filters.dateTo)
      if (filters?.search) url.searchParams.set('search', filters.search)

      const response = await fetch(url.toString())

      if (!response.ok) {
        throw new Error('Failed to fetch transactions')
      }

      return await response.json()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch transactions'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  const createTransaction = async (familyId: string, data: any) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/families/${familyId}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const { error: err } = await response.json()
        throw new Error(err || 'Failed to create transaction')
      }

      return await response.json()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create transaction'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  const updateTransaction = async (familyId: string, transactionId: string, data: any) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/families/${familyId}/transactions/${transactionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const { error: err } = await response.json()
        throw new Error(err || 'Failed to update transaction')
      }

      return await response.json()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update transaction'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  const deleteTransaction = async (familyId: string, transactionId: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/families/${familyId}/transactions/${transactionId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const { error: err } = await response.json()
        throw new Error(err || 'Failed to delete transaction')
      }

      return await response.json()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete transaction'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    getTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    loading,
    error,
  }
}
