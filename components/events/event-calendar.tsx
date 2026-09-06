'use client'

import { useEffect, useState } from 'react'
import { useEventActions } from '@/hooks/useEventActions'
import { formatDate, formatDateTime } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { CardSkeleton } from '@/components/ui/skeleton'
import { Toaster, toast } from 'sonner'
import Link from 'next/link'

interface EventCalendarProps {
  familyId: string
}

export function EventCalendar({ familyId }: EventCalendarProps) {
  const [events, setEvents] = useState<any[]>([])
  const [currentDate, setCurrentDate] = useState<Date | null>(null)
  const [isClient, setIsClient] = useState(false)
  const { getEvents, loading, error } = useEventActions()

  useEffect(() => {
    setIsClient(true)
    setCurrentDate(new Date())
  }, [])

  useEffect(() => {
    const loadEvents = async () => {
      if (!currentDate) return
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth()
      const dateFrom = new Date(year, month, 1).toISOString()
      const dateTo = new Date(year, month + 1, 0).toISOString()

      const result = await getEvents(familyId, { dateFrom, dateTo })
      if (result?.data) {
        setEvents(result.data)
      }
    }

    loadEvents()
  }, [familyId, currentDate])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()

    return { daysInMonth, startingDay }
  }

  const getEventsForDay = (day: number) => {
    if (!currentDate) return []
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const dayStart = new Date(year, month, day)
    const dayEnd = new Date(year, month, day + 1)

    return events.filter((event) => {
      const eventStart = new Date(event.start_at)
      const eventEnd = new Date(event.end_at)
      return eventStart < dayEnd && eventEnd >= dayStart
    })
  }

  const { daysInMonth, startingDay } = getDaysInMonth(currentDate || new Date())
  const monthName = (currentDate || new Date()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const prevMonth = () => {
    if (!currentDate) return
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    if (!currentDate) return
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  if (loading || !isClient) {
    return <CardSkeleton />
  }

  return (
    <>
      <div className="space-y-4">
        {/* Calendar Header */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={prevMonth}>
            ← Previous
          </Button>
          <h2 className="text-xl font-bold">{monthName}</h2>
          <Button variant="outline" onClick={nextMonth}>
            Next →
          </Button>
        </div>

        {/* Calendar Grid */}
        <div className="border rounded-lg overflow-hidden">
          {/* Week Days Header */}
          <div className="grid grid-cols-7 bg-muted">
            {weekDays.map((day) => (
              <div key={day} className="p-3 text-center text-sm font-semibold">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7">
            {/* Empty cells for days before month starts */}
            {[...Array(startingDay)].map((_, index) => (
              <div key={`empty-${index}`} className="min-h-[100px] border-t border-r p-2 bg-muted/30" />
            ))}

            {/* Days of the month */}
            {[...Array(daysInMonth)].map((_, index) => {
              const day = index + 1
              const dayEvents = getEventsForDay(day)
              const isToday = isClient && currentDate &&
                new Date().getDate() === day &&
                new Date().getMonth() === currentDate.getMonth() &&
                new Date().getFullYear() === currentDate.getFullYear()

              return (
                <div
                  key={day}
                  className={`min-h-[100px] border-t border-r p-2 ${
                    isToday ? 'bg-primary/10' : ''
                  }`}
                >
                  <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-primary' : ''}`}>
                    {day}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map((event) => (
                      <Link
                        key={event.id}
                        href={`/families/${familyId}/events/${event.id}`}
                        className="block text-xs bg-primary/20 hover:bg-primary/30 rounded px-1 py-0.5 truncate"
                      >
                        {event.title}
                      </Link>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-muted-foreground">
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Upcoming Events List */}
        <div className="space-y-2">
          <h3 className="font-semibold">Upcoming Events</h3>
          {events
            .filter((e) => new Date(e.start_at) >= (currentDate || new Date()))
            .slice(0, 5)
            .map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
              >
                <div>
                  <p className="font-semibold">{event.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDateTime(event.start_at)}
                    {event.location && ` • ${event.location}`}
                  </p>
                </div>
                <Link href={`/families/${familyId}/events/${event.id}/edit`}>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </Link>
              </div>
            ))}
        </div>
      </div>
      <Toaster />
    </>
  )
}
