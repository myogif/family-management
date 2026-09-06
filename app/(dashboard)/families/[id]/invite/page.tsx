'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { Toaster, toast } from 'sonner'

interface InviteMemberPageProps {
  params: Promise<{ id: string }>
}

export default function InviteMemberPage({ params }: InviteMemberPageProps) {
  const [familyId, setFamilyId] = useState<string>('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('member')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  React.useEffect(() => {
    params.then((p) => setFamilyId(p.id))
  }, [params])

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Note: This is a placeholder. In production, you would:
      // 1. Look up the user by email
      // 2. Create an invite code
      // 3. Send invite email
      // 4. Store invite in database

      toast.success('Invite sent successfully!')
      setEmail('')
      router.push(`/families/${familyId}`)
    } catch (error) {
      toast.error('Failed to send invite')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Invite Member</h1>
          <p className="text-muted-foreground mt-2">Invite someone to join this family</p>
        </div>

        <form onSubmit={handleInvite} className="space-y-4 w-full max-w-md">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="member@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div>
            <Label htmlFor="role">Role</Label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2 border rounded-md text-sm"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send Invite'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
      <Toaster />
    </>
  )
}

import React from 'react'
