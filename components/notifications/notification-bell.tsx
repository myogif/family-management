'use client'

import { useEffect, useState } from 'react'
import { useNotificationActions } from '@/hooks/useNotificationActions'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Toaster, toast } from 'sonner'
import Link from 'next/link'
import { formatDateTime } from '@/lib/utils'

export function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const { getNotifications, markAsRead, markAllAsRead, loading, error } =
    useNotificationActions()

  useEffect(() => {
    const loadNotifications = async () => {
      const result = await getNotifications()
      if (result?.data) {
        setNotifications(result.data)
      }
    }

    loadNotifications()
    // Refresh every 30 seconds
    const interval = setInterval(loadNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const unreadCount = notifications.filter((n) => !n.is_read).length

  const handleMarkAsRead = async (notificationId: string) => {
    const result = await markAsRead(notificationId)
    if (result?.data) {
      setNotifications(
        notifications.map((n) =>
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      )
    }
  }

  const handleMarkAllAsRead = async () => {
    const result = await markAllAsRead()
    if (result) {
      setNotifications(notifications.map((n) => ({ ...n, is_read: true })))
      toast.success('All notifications marked as read')
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'debt_overdue':
        return '⚠️'
      case 'goal_deadline':
        return '🎯'
      case 'event_reminder':
        return '📅'
      default:
        return '🔔'
    }
  }

  return (
    <>
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="relative"
        >
          🔔
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute right-0 mt-2 w-80 bg-background border rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
              <div className="p-3 border-b flex justify-between items-center">
                <h3 className="font-semibold">Notifications</h3>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMarkAllAsRead}
                    disabled={loading}
                  >
                    Mark all read
                  </Button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    No notifications
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border-b hover:bg-muted/50 cursor-pointer ${
                        !notification.is_read ? 'bg-muted/30' : ''
                      }`}
                      onClick={() => {
                        if (!notification.is_read) {
                          handleMarkAsRead(notification.id)
                        }
                        setIsOpen(false)
                      }}
                    >
                      <div className="flex items-start gap-2">
                        <span>{getNotificationIcon(notification.type)}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {notification.title}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDateTime(notification.created_at)}
                          </p>
                        </div>
                        {!notification.is_read && (
                          <div className="w-2 h-2 bg-primary rounded-full mt-1" />
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2 border-t">
                <Link href="/notifications">
                  <Button variant="ghost" size="sm" className="w-full">
                    View All Notifications
                  </Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
      <Toaster />
    </>
  )
}
