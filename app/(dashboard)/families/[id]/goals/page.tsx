'use client'

import { GoalList } from '@/components/goals/goal-list'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import React from 'react'

interface GoalsPageProps {
  params: Promise<{ id: string }>
}

export default function GoalsPage({ params }: GoalsPageProps) {
  const [familyId, setFamilyId] = React.useState<string>('')

  React.useEffect(() => {
    params.then((p) => setFamilyId(p.id))
  }, [params])

  if (!familyId) return <div className="text-center py-12">Loading...</div>

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Goals</h1>
          <p className="text-muted-foreground mt-2">Track your family savings goals</p>
        </div>
        <Link href={`/families/${familyId}/goals/create`}>
          <Button>Create Goal</Button>
        </Link>
      </div>

      <GoalList familyId={familyId} />
    </div>
  )
}
