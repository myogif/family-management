'use client'

import { useEffect, useState } from 'react'
import { useGoalActions } from '@/hooks/useGoalActions'
import { formatCurrency, formatDate, calculateProgress } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { AlertDialog } from '@/components/ui/alert-dialog'
import { TableSkeleton } from '@/components/ui/skeleton'
import { Toaster, toast } from 'sonner'
import Link from 'next/link'

interface GoalListProps {
  familyId: string
}

export function GoalList({ familyId }: GoalListProps) {
  const [goals, setGoals] = useState<any[]>([])
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const { getGoals, deleteGoal, loading, error } = useGoalActions()

  useEffect(() => {
    const loadGoals = async () => {
      const result = await getGoals(familyId)
      if (result?.data) {
        setGoals(result.data)
      }
    }

    loadGoals()
  }, [familyId])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const handleDelete = async () => {
    if (!deleteId) return

    const result = await deleteGoal(familyId, deleteId)
    if (result) {
      toast.success('Goal deleted')
      setGoals(goals.filter((g) => g.id !== deleteId))
      setDeleteId(null)
      setShowDeleteDialog(false)
    }
  }

  const activeGoals = goals.filter((g) => g.status === 'active')
  const totalTarget = activeGoals.reduce((sum, g) => sum + parseFloat(g.target_amount || '0'), 0)
  const totalCurrent = activeGoals.reduce((sum, g) => sum + parseFloat(g.current_amount || '0'), 0)

  return (
    <>
      <div className="space-y-4">
        {/* Summary Card */}
        {activeGoals.length > 0 && (
          <div className="p-6 border rounded-lg bg-muted/50">
            <h3 className="text-sm font-medium text-muted-foreground">Overall Progress</h3>
            <p className="text-3xl font-bold mt-2">{formatCurrency(totalCurrent)}</p>
            <p className="text-xs text-muted-foreground mt-2">
              of {formatCurrency(totalTarget)} ({Math.round((totalCurrent / totalTarget) * 100)}%)
            </p>
            <Progress value={(totalCurrent / totalTarget) * 100} className="mt-4" />
          </div>
        )}

        {/* Goals List */}
        {loading ? (
          <TableSkeleton />
        ) : goals.length === 0 ? (
          <div className="text-center py-12 border rounded-lg">
            <p className="text-muted-foreground">No goals yet</p>
            <Link href={`/families/${familyId}/goals/create`}>
              <Button variant="outline" size="sm" className="mt-4">
                Create Goal
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => {
              const progress = calculateProgress(goal.current_amount, goal.target_amount)
              return (
                <div key={goal.id} className="p-6 border rounded-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{goal.name}</h3>
                        <Badge
                          variant={
                            goal.status === 'completed'
                              ? 'secondary'
                              : goal.status === 'cancelled'
                                ? 'outline'
                                : 'default'
                          }
                        >
                          {goal.status}
                        </Badge>
                      </div>
                      {goal.description && (
                        <p className="text-sm text-muted-foreground">{goal.description}</p>
                      )}
                    </div>
                    <span className="text-sm font-semibold">{Math.round(progress)}%</span>
                  </div>

                  <Progress value={progress} className="mb-3" />

                  <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-muted-foreground">Current</p>
                      <p className="font-semibold">{formatCurrency(goal.current_amount)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Target</p>
                      <p className="font-semibold">{formatCurrency(goal.target_amount)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Deadline</p>
                      <p className="font-semibold">{formatDate(goal.deadline)}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/families/${familyId}/goals/${goal.id}/edit`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        Edit
                      </Button>
                    </Link>
                    <AlertDialog
                      open={showDeleteDialog && deleteId === goal.id}
                      onOpenChange={(open) => {
                        if (open) {
                          setDeleteId(goal.id)
                        }
                        setShowDeleteDialog(open)
                      }}
                      title="Delete Goal?"
                      description="This action cannot be undone."
                      onConfirm={handleDelete}
                      isLoading={loading}
                      isDangerous
                    >
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setDeleteId(goal.id)
                          setShowDeleteDialog(true)
                        }}
                      >
                        Delete
                      </Button>
                    </AlertDialog>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
      <Toaster />
    </>
  )
}
