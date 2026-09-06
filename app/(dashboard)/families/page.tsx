'use client'

import { useEffect, useState } from 'react'
import { useFamilyActions } from '@/hooks/useFamilyActions'
import { Family, FamilyMember } from '@/types'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Toaster, toast } from 'sonner'

export default function FamiliesPage() {
  const { getFamilies, loading, error } = useFamilyActions()
  const [families, setFamilies] = useState<Family[]>([])

  useEffect(() => {
    const loadFamilies = async () => {
      const result = await getFamilies()
      if (result?.data) {
        setFamilies(result.data)
      }
    }
    loadFamilies()
  }, [])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Families</h1>
        <p className="text-muted-foreground">Loading families...</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Families</h1>
            <p className="text-muted-foreground mt-2">Manage your families and members</p>
          </div>
          <Link href="/families/create">
            <Button>Create Family</Button>
          </Link>
        </div>

        {families.length === 0 ? (
          <div className="text-center py-12 border rounded-lg">
            <h3 className="text-lg font-semibold">No families yet</h3>
            <p className="text-muted-foreground mt-2">Create your first family to get started</p>
            <Link href="/families/create" className="mt-4 inline-block">
              <Button>Create Family</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {families.map((family) => (
              <Link key={family.id} href={`/families/${family.id}`}>
                <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
                  <h3 className="text-lg font-semibold">{family.name}</h3>
                  {family.description && (
                    <p className="text-muted-foreground text-sm mt-2">{family.description}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-4">
                    Created {new Date(family.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Toaster />
    </>
  )
}
