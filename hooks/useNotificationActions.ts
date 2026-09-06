'use client'

import { useState } from 'react'

export function useNotificationActions() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getNotifications = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/notifications')

      if (!response.ok) {
        throw new Error('Failed to fetch notifications')
      }

      return await response.json()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch notifications'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: true }),
      })

      if (!response.ok) {
        throw new Error('Failed to mark notification as read')
      }

      return await response.json()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to mark as read'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  const markAllAsRead = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllAsRead: true }),
      })

      if (!response.ok) {
        throw new Error('Failed to mark all notifications as read')
      }

      return await response.json()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to mark all as read'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  const deleteNotification = async (notificationId: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete notification')
      }

      return await response.json()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete notification'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    loading,
    error,
  }
}
