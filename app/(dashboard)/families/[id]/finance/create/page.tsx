'use client'

import { CreateTransactionForm } from '@/components/forms/create-transaction-form'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface CreateTransactionPageProps {
  params: Promise<{ id: string }>
}

export default function CreateTransactionPage({ params }: CreateTransactionPageProps) {
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
          <h1 className="text-3xl font-bold">Create Transaction</h1>
          <p className="text-muted-foreground mt-2">Add a new income or expense</p>
        </div>
        <Link href={`/families/${familyId}/finance`}>
          <Button variant="outline">Back</Button>
        </Link>
      </div>

      <div className="max-w-2xl">
        <CreateTransactionForm
          familyId={familyId}
          onSuccess={() => router.push(`/families/${familyId}/finance`)}
        />
      </div>
    </div>
  )
}

import React from 'react'
