'use client'

import { DebtList } from '@/components/debts/debt-list'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import React from 'react'

interface DebtsPageProps {
  params: Promise<{ id: string }>
}

export default function DebtsPage({ params }: DebtsPageProps) {
  const [familyId, setFamilyId] = React.useState<string>('')

  React.useEffect(() => {
    params.then((p) => setFamilyId(p.id))
  }, [params])

  if (!familyId) return <div className="text-center py-12">Loading...</div>

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Debts & Receivables</h1>
          <p className="text-muted-foreground mt-2">Track debts owed and money receivable</p>
        </div>
        <Link href={`/families/${familyId}/debts/create`}>
          <Button>Add Debt</Button>
        </Link>
      </div>

      <DebtList familyId={familyId} />
    </div>
  )
}
