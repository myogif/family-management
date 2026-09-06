'use client'

import { CreateDebtForm } from '@/components/forms/create-debt-form'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import React from 'react'

interface CreateDebtPageProps {
  params: Promise<{ id: string }>
}

export default function CreateDebtPage({ params }: CreateDebtPageProps) {
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
          <h1 className="text-3xl font-bold">Add Debt</h1>
          <p className="text-muted-foreground mt-2">Create a new debt or receivable record</p>
        </div>
        <Link href={`/families/${familyId}/debts`}>
          <Button variant="outline">Back</Button>
        </Link>
      </div>

      <div className="max-w-2xl">
        <CreateDebtForm
          familyId={familyId}
          onSuccess={() => router.push(`/families/${familyId}/debts`)}
        />
      </div>
    </div>
  )
}
