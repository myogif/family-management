'use client'

import { EventCalendar } from '@/components/events/event-calendar'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import React from 'react'

interface EventsPageProps {
  params: Promise<{ id: string }>
}

export default function EventsPage({ params }: EventsPageProps) {
  const [familyId, setFamilyId] = React.useState<string>('')

  React.useEffect(() => {
    params.then((p) => setFamilyId(p.id))
  }, [params])

  if (!familyId) return <div className="text-center py-12">Loading...</div>

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Agenda</h1>
          <p className="text-muted-foreground mt-2">Manage family events and schedule</p>
        </div>
        <Link href={`/families/${familyId}/events/create`}>
          <Button>Create Event</Button>
        </Link>
      </div>

      <EventCalendar familyId={familyId} />
    </div>
  )
}
