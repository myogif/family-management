'use client'

import { CreateAssetForm } from '@/components/forms/create-asset-form'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import React from 'react'

interface CreateAssetPageProps {
  params: Promise<{ id: string }>
}

export default function CreateAssetPage({ params }: CreateAssetPageProps) {
  const [familyId, setFamilyId] = React.useState<string>('')
  const router = useRouter()

  React.useEffect(() => {
    params.then((p) => setFamilyId(p.id))
  }, [params])

  if (!familyId) return <div className="text-center py-12">Loading...</div>

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Add Asset</h1>
          <p className="text-muted-foreground mt-2">Create a new asset record</p>
        </div>
        <Link href={`/families/${familyId}/assets`}>
          <Button variant="outline">Back</Button>
        </Link>
      </div>

      <div className="max-w-2xl">
        <CreateAssetForm
          familyId={familyId}
          onSuccess={() => router.push(`/families/${familyId}/assets`)}
        />
      </div>
    </div>
  )
}
