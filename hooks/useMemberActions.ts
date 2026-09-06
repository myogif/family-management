'use client'

import { useState } from 'react'

export function useMemberActions() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getMembers = async (familyId: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/families/${familyId}/members`)

      if (!response.ok) {
        throw new Error('Failed to fetch members')
      }

      return await response.json()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch members'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  const addMember = async (familyId: string, userId: string, role: string = 'member') => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/families/${familyId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role }),
      })

      if (!response.ok) {
        const { error: err } = await response.json()
        throw new Error(err || 'Failed to add member')
      }

      return await response.json()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add member'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  const updateMemberRole = async (familyId: string, memberId: string, role: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/families/${familyId}/members/${memberId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      })

      if (!response.ok) {
        const { error: err } = await response.json()
        throw new Error(err || 'Failed to update member role')
      }

      return await response.json()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update member role'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  const removeMember = async (familyId: string, memberId: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/families/${familyId}/members/${memberId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const { error: err } = await response.json()
        throw new Error(err || 'Failed to remove member')
      }

      return await response.json()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to remove member'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    getMembers,
    addMember,
    updateMemberRole,
    removeMember,
    loading,
    error,
  }
}
