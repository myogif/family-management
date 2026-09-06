'use client'

import { useEffect, useState } from 'react'
import { useNotificationActions } from '@/hooks/useNotificationActions'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertDialog } from '@/components/ui/alert-dialog'
import { TableSkeleton } from '@/components/ui/skeleton'
import { Toaster, toast } from 'sonner'
import { formatDateTime } from '@/lib/utils'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    loading,
    error,
  } = useNotificationActions()

  useEffect(() => {
    const loadNotifications = async () => {
      const result = await getNotifications()
      if (result?.data) {
        setNotifications(result.data)
      }
    }

    loadNotifications()
  }, [])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

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

  const handleDelete = async () => {
    if (!deleteId) return

    const result = await deleteNotification(deleteId)
    if (result) {
      toast.success('Notification deleted')
      setNotifications(notifications.filter((n) => n.id !== deleteId))
      setDeleteId(null)
      setShowDeleteDialog(false)
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

  const unreadCount = notifications.filter((n) => !n.is_read).length

  return (
    <>
      <div className="space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-muted-foreground mt-2">
              {unreadCount > 0
                ? `You have ${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}`
                : 'All caught up!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button onClick={handleMarkAllAsRead} disabled={loading}>
              Mark All as Read
            </Button>
          )}
        </div>

        {loading ? (
          <TableSkeleton />
        ) : notifications.length === 0 ? (
          <div className="text-center py-12 border rounded-lg">
            <p className="text-muted-foreground">No notifications yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Notifications will appear here for important events
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-6 border rounded-lg ${
                  !notification.is_read ? 'bg-muted/30 border-primary/20' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <span className="text-2xl">
                    {getNotificationIcon(notification.type)}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{notification.title}</h3>
                      {!notification.is_read && (
                        <Badge variant="default">New</Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground mb-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{formatDateTime(notification.created_at)}</span>
                      {notification.families?.name && (
                        <span>Family: {notification.families.name}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!notification.is_read && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkAsRead(notification.id)}
                        disabled={loading}
                      >
                        Mark Read
                      </Button>
                    )}
                    <AlertDialog
                      open={showDeleteDialog && deleteId === notification.id}
                      onOpenChange={(open) => {
                        if (open) {
                          setDeleteId(notification.id)
                        }
                        setShowDeleteDialog(open)
                      }}
                      title="Delete Notification?"
                      description="This action cannot be undone."
                      onConfirm={handleDelete}
                      isLoading={loading}
                      isDangerous
                    >
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setDeleteId(notification.id)
                          setShowDeleteDialog(true)
                        }}
                      >
                        Delete
                      </Button>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Toaster />
    </>
  )
}
