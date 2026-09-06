'use client'

import { useEffect, useState } from 'react'
import { useMemberActions } from '@/hooks/useMemberActions'
import { useRouter } from 'next/navigation'
import { Toaster, toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { FamilyMember } from '@/types'

interface ManageMemberPageProps {
  params: Promise<{ id: string; memberId: string }>
}

export default function ManageMemberPage({ params }: ManageMemberPageProps) {
  const router = useRouter()
  const [familyId, setFamilyId] = useState<string>('')
  const [memberId, setMemberId] = useState<string>('')
  const [member, setMember] = useState<any>(null)
  const [role, setRole] = useState('member')
  const [loading, setLoading] = useState(true)
  const { getMembers, updateMemberRole, removeMember } = useMemberActions()

  useEffect(() => {
    params.then((p) => {
      setFamilyId(p.id)
      setMemberId(p.memberId)
    })
  }, [params])

  useEffect(() => {
    if (!familyId) return

    const loadMember = async () => {
      const result = await getMembers(familyId)
      if (result?.data) {
        const found = result.data.find((m: any) => m.id === memberId)
        if (found) {
          setMember(found)
          setRole(found.role)
        }
      }
      setLoading(false)
    }

    loadMember()
  }, [familyId, memberId])

  const handleRoleChange = async () => {
    setLoading(true)
    const result = await updateMemberRole(familyId, memberId, role)
    if (result?.data) {
      toast.success('Member role updated')
      router.push(`/families/${familyId}`)
    } else {
      toast.error('Failed to update role')
    }
    setLoading(false)
  }

  const handleRemove = async () => {
    if (!confirm('Are you sure? This action cannot be undone.')) return

    setLoading(true)
    const result = await removeMember(familyId, memberId)
    if (result) {
      toast.success('Member removed')
      router.push(`/families/${familyId}`)
    } else {
      toast.error('Failed to remove member')
    }
    setLoading(false)
  }

  if (loading || !member) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Manage Member</h1>
          <p className="text-muted-foreground mt-2">{member.profiles?.full_name}</p>
        </div>

        <div className="space-y-6 max-w-md">
          <div>
            <label className="block text-sm font-medium mb-2">Role</label>
            <select
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
            <Button onClick={handleRoleChange} disabled={loading}>
              {loading ? 'Saving...' : 'Update Role'}
            </Button>
            <Button
              variant="destructive"
              onClick={handleRemove}
              disabled={loading}
            >
              Remove Member
            </Button>
            <Button
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  )
}
