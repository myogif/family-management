'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createEventSchema, type CreateEventInput } from '@/lib/validations'
import { useEventActions } from '@/hooks/useEventActions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Toaster, toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface EditEventPageProps {
  params: Promise<{ id: string; eventId: string }>
}

export default function EditEventPage({ params }: EditEventPageProps) {
  const router = useRouter()
  const [familyId, setFamilyId] = useState<string>('')
  const [eventId, setEventId] = useState<string>('')
  const [event, setEvent] = useState<any>(null)
  const [initialLoading, setInitialLoading] = useState(true)

  const { getEvents, updateEvent, loading, error } = useEventActions()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateEventInput>({
    resolver: zodResolver(createEventSchema),
  })

  useEffect(() => {
    params.then((p) => {
      setFamilyId(p.id)
      setEventId(p.eventId)
    })
  }, [params])

  useEffect(() => {
    if (!familyId || !eventId) return

    const loadEvent = async () => {
      const result = await getEvents(familyId)
      if (result?.data) {
        const found = result.data.find((e: any) => e.id === eventId)
        if (found) {
          setEvent(found)
          setValue('title', found.title)
          setValue('startAt', found.start_at.slice(0, 16))
          setValue('endAt', found.end_at.slice(0, 16))
          setValue('location', found.location)
          setValue('description', found.description)
        }
      }
      setInitialLoading(false)
    }

    loadEvent()
  }, [familyId, eventId])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const onSubmit = async (data: CreateEventInput) => {
    const result = await updateEvent(familyId, eventId, data)
    if (result?.data) {
      toast.success('Event updated successfully')
      router.push(`/families/${familyId}/events`)
    }
  }

  if (initialLoading || !event) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Edit Event</h1>
          <p className="text-muted-foreground mt-2">Update event details</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-2xl">
          <div>
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              placeholder="e.g., Family Dinner, Doctor Appointment"
              {...register('title')}
              disabled={loading}
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startAt">Start Date & Time</Label>
              <Input
                id="startAt"
                type="datetime-local"
                {...register('startAt')}
                disabled={loading}
              />
              {errors.startAt && (
                <p className="text-sm text-red-500 mt-1">{errors.startAt.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="endAt">End Date & Time</Label>
              <Input
                id="endAt"
                type="datetime-local"
                {...register('endAt')}
                disabled={loading}
              />
              {errors.endAt && (
                <p className="text-sm text-red-500 mt-1">{errors.endAt.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="location">Location (optional)</Label>
            <Input
              id="location"
              placeholder="e.g., Home, Restaurant, Office"
              {...register('location')}
              disabled={loading}
            />
            {errors.location && (
              <p className="text-sm text-red-500 mt-1">{errors.location.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description (optional)</Label>
            <Input
              id="description"
              placeholder="Add details about this event"
              {...register('description')}
              disabled={loading}
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
      <Toaster />
    </>
  )
}
