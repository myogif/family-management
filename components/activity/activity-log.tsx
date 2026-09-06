'use client'

import { useEffect, useState } from 'react'
import { useActivityLogActions } from '@/hooks/useActivityLogActions'
import { formatDateTime } from '@/lib/utils'
import { TableSkeleton } from '@/components/ui/skeleton'
import { Toaster, toast } from 'sonner'

interface ActivityLogProps {
  familyId: string
}

export function ActivityLog({ familyId }: ActivityLogProps) {
  const [logs, setLogs] = useState<any[]>([])
  const { getActivityLogs, loading, error } = useActivityLogActions()

  useEffect(() => {
    const loadLogs = async () => {
      const result = await getActivityLogs(familyId)
      if (result?.data) {
        setLogs(result.data)
      }
    }

    loadLogs()
  }, [familyId])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const getActionIcon = (action: string) => {
    if (action.includes('create')) return '➕'
    if (action.includes('update')) return '✏️'
    if (action.includes('delete')) return '🗑️'
    if (action.includes('upload')) return '📤'
    return '📝'
  }

  const getEntityLabel = (entityType: string) => {
    const labels: Record<string, string> = {
      transaction: 'Transaction',
      asset: 'Asset',
      debt: 'Debt',
      goal: 'Goal',
      event: 'Event',
      document: 'Document',
      family: 'Family',
      member: 'Member',
    }
    return labels[entityType] || entityType
  }

  if (loading) {
    return <TableSkeleton />
  }

  if (logs.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-muted-foreground">No activity yet</p>
        <p className="text-sm text-muted-foreground mt-2">
          Activities will appear here when family members take actions
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <div className="max-h-96 overflow-y-auto">
          {logs.map((log) => (
            <div
              key={log.id}
              className="p-4 border-b hover:bg-muted/50 last:border-b-0"
            >
              <div className="flex items-start gap-3">
                <span className="text-xl">{getActionIcon(log.action)}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold">
                      {log.profiles?.full_name || 'Unknown'}
                    </span>
                    <span className="text-muted-foreground">
                      {log.action.replace('_', ' ')}
                    </span>
                    <span className="px-2 py-0.5 bg-muted rounded text-xs">
                      {getEntityLabel(log.entity_type)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {log.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {formatDateTime(log.created_at)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Toaster />
    </>
  )
}
