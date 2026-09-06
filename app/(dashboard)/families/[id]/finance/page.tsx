'use client'

import { TransactionList } from '@/components/finance/transaction-list'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import React from 'react'

interface FinancePageProps {
  params: Promise<{ id: string }>
}

export default function FinancePage({ params }: FinancePageProps) {
  const [familyId, setFamilyId] = React.useState<string>('')

  React.useEffect(() => {
    params.then((p) => setFamilyId(p.id))
  }, [params])

  if (!familyId) return <div className="text-center py-12">Loading...</div>

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Finance</h1>
          <p className="text-muted-foreground mt-2">Manage income and expenses</p>
        </div>
        <Link href={`/families/${familyId}/finance/create`}>
          <Button>Add Transaction</Button>
        </Link>
      </div>

      <TransactionList familyId={familyId} />
    </div>
  )
}
