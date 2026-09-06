'use client'

import { CreateEventForm } from '@/components/forms/create-event-form'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import React from 'react'

interface CreateEventPageProps {
  params: Promise<{ id: string }>
}

export default function CreateEventPage({ params }: CreateEventPageProps) {
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
          <h1 className="text-3xl font-bold">Create Event</h1>
          <p className="text-muted-foreground mt-2">Add a new family event</p>
        </div>
        <Link href={`/families/${familyId}/events`}>
          <Button variant="outline">Back</Button>
        </Link>
      </div>

      <div className="max-w-2xl">
        <CreateEventForm
          familyId={familyId}
          onSuccess={() => router.push(`/families/${familyId}/events`)}
        />
      </div>
    </div>
  )
}
