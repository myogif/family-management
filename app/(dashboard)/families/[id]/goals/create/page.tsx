'use client'

import { CreateGoalForm } from '@/components/forms/create-goal-form'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import React from 'react'

interface CreateGoalPageProps {
  params: Promise<{ id: string }>
}

export default function CreateGoalPage({ params }: CreateGoalPageProps) {
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
          <h1 className="text-3xl font-bold">Create Goal</h1>
          <p className="text-muted-foreground mt-2">Set a new savings goal</p>
        </div>
        <Link href={`/families/${familyId}/goals`}>
          <Button variant="outline">Back</Button>
        </Link>
      </div>

      <div className="max-w-2xl">
        <CreateGoalForm
          familyId={familyId}
          onSuccess={() => router.push(`/families/${familyId}/goals`)}
        />
      </div>
    </div>
  )
}
