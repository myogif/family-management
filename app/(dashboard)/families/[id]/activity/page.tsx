'use client'

import { ActivityLog } from '@/components/activity/activity-log'
import React from 'react'

interface ActivityPageProps {
  params: Promise<{ id: string }>
}

export default function ActivityPage({ params }: ActivityPageProps) {
  const [familyId, setFamilyId] = React.useState<string>('')

  React.useEffect(() => {
    params.then((p) => setFamilyId(p.id))
  }, [params])

  if (!familyId) return <div className="text-center py-12">Loading...</div>

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Activity Log</h1>
        <p className="text-muted-foreground mt-2">
          Track all actions taken by family members
        </p>
      </div>

      <ActivityLog familyId={familyId} />
    </div>
  )
}
