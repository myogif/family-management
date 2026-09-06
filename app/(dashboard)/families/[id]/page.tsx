'use client'

import { useEffect, useState } from 'react'
import { useFamilyActions } from '@/hooks/useFamilyActions'
import { useMemberActions } from '@/hooks/useMemberActions'
import { Family } from '@/types'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Toaster, toast } from 'sonner'

interface FamilyDetailPageProps {
  params: Promise<{ id: string }>
}

export default function FamilyDetailPage({ params }: FamilyDetailPageProps) {
  const [familyId, setFamilyId] = useState<string>('')
  const [family, setFamily] = useState<Family | null>(null)
  const [members, setMembers] = useState<any[]>([])
  const { getFamily, loading: familyLoading, error: familyError } = useFamilyActions()
  const { getMembers, loading: membersLoading, error: membersError } = useMemberActions()

  useEffect(() => {
    params.then((p) => setFamilyId(p.id))
  }, [params])

  useEffect(() => {
    if (!familyId) return

    const loadData = async () => {
      const familyResult = await getFamily(familyId)
      if (familyResult?.data) {
        setFamily(familyResult.data)
      }

      const membersResult = await getMembers(familyId)
      if (membersResult?.data) {
        setMembers(membersResult.data)
      }
    }

    loadData()
  }, [familyId])

  useEffect(() => {
    if (familyError) toast.error(familyError)
  }, [familyError])

  useEffect(() => {
    if (membersError) toast.error(membersError)
  }, [membersError])

  if (familyLoading || membersLoading) {
    return <div className="text-center py-12">Loading...</div>
  }

  if (!family) {
    return <div className="text-center py-12">Family not found</div>
  }

  return (
    <>
      <div className="space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{family.name}</h1>
            {family.description && (
              <p className="text-muted-foreground mt-2">{family.description}</p>
            )}
          </div>
          <div className="space-x-2">
            <Link href={`/families/${family.id}/edit`}>
              <Button variant="outline">Edit</Button>
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Members ({members.length})</h2>
            <Link href={`/families/${family.id}/invite`}>
              <Button>Invite Member</Button>
            </Link>
          </div>

          {members.length === 0 ? (
            <div className="text-center py-8 border rounded-lg">
              <p className="text-muted-foreground">No members yet</p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-4">Name</th>
                    <th className="text-left p-4">Role</th>
                    <th className="text-left p-4">Joined</th>
                    <th className="text-right p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member) => (
                    <tr key={member.id} className="border-t">
                      <td className="p-4">{member.profiles?.full_name || 'Unknown'}</td>
                      <td className="p-4 capitalize">{member.role}</td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {new Date(member.joined_at).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <Link href={`/families/${family.id}/members/${member.id}`}>
                          <Button variant="outline" size="sm">Manage</Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <Toaster />
    </>
  )
}
