'use client'

import { useState } from 'react'

interface EventFilters {
  dateFrom?: string
  dateTo?: string
}

export function useEventActions() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getEvents = async (familyId: string, filters?: EventFilters) => {
    setLoading(true)
    setError(null)
    try {
      const url = new URL(`/api/families/${familyId}/events`, window.location.origin)
      if (filters?.dateFrom) url.searchParams.set('dateFrom', filters.dateFrom)
      if (filters?.dateTo) url.searchParams.set('dateTo', filters.dateTo)

      const response = await fetch(url.toString())

      if (!response.ok) {
        throw new Error('Failed to fetch events')
      }

      return await response.json()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch events'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  const createEvent = async (familyId: string, data: any) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/families/${familyId}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const { error: err } = await response.json()
        throw new Error(err || 'Failed to create event')
      }

      return await response.json()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create event'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  const updateEvent = async (familyId: string, eventId: string, data: any) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/families/${familyId}/events/${eventId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const { error: err } = await response.json()
        throw new Error(err || 'Failed to update event')
      }

      return await response.json()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update event'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  const deleteEvent = async (familyId: string, eventId: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/families/${familyId}/events/${eventId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const { error: err } = await response.json()
        throw new Error(err || 'Failed to delete event')
      }

      return await response.json()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete event'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    loading,
    error,
  }
}
