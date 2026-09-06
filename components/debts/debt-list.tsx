'use client'

import { useEffect, useState } from 'react'
import { useDebtActions } from '@/hooks/useDebtActions'
import { formatCurrency, formatDate, isOverdue } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertDialog } from '@/components/ui/alert-dialog'
import { TableSkeleton } from '@/components/ui/skeleton'
import { Toaster, toast } from 'sonner'
import Link from 'next/link'

interface DebtListProps {
  familyId: string
}

export function DebtList({ familyId }: DebtListProps) {
  const [debts, setDebts] = useState<any[]>([])
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const { getDebts, deleteDebt, loading, error } = useDebtActions()

  useEffect(() => {
    const loadDebts = async () => {
      const result = await getDebts(familyId)
      if (result?.data) {
        setDebts(result.data)
      }
    }

    loadDebts()
  }, [familyId])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const handleDelete = async () => {
    if (!deleteId) return

    const result = await deleteDebt(familyId, deleteId)
    if (result) {
      toast.success('Debt deleted')
      setDebts(debts.filter((d) => d.id !== deleteId))
      setDeleteId(null)
      setShowDeleteDialog(false)
    }
  }

  const totalDebt = debts.reduce((sum, d) => sum + parseFloat(d.remaining_amount || '0'), 0)
  const overdueCount = debts.filter((d) => isOverdue(d.due_date) && d.status === 'active').length

  return (
    <>
      <div className="space-y-4">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-6 border rounded-lg bg-muted/50">
            <h3 className="text-sm font-medium text-muted-foreground">Total Remaining</h3>
            <p className="text-3xl font-bold mt-2">{formatCurrency(totalDebt)}</p>
            <p className="text-xs text-muted-foreground mt-4">{debts.length} debts</p>
          </div>

          {overdueCount > 0 && (
            <div className="p-6 border border-destructive rounded-lg bg-destructive/5">
              <h3 className="text-sm font-medium text-destructive">Overdue Alert</h3>
              <p className="text-3xl font-bold mt-2 text-destructive">{overdueCount}</p>
              <p className="text-xs text-destructive/70 mt-4">debts overdue</p>
            </div>
          )}
        </div>

        {/* Debts List */}
        {loading ? (
          <TableSkeleton />
        ) : debts.length === 0 ? (
          <div className="text-center py-12 border rounded-lg">
            <p className="text-muted-foreground">No debts or receivables yet</p>
            <Link href={`/families/${familyId}/debts/create`}>
              <Button variant="outline" size="sm" className="mt-4">
                Add Debt
              </Button>
            </Link>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-4 text-sm font-medium">Name</th>
                  <th className="text-left p-4 text-sm font-medium">Type</th>
                  <th className="text-right p-4 text-sm font-medium">Remaining</th>
                  <th className="text-left p-4 text-sm font-medium">Due Date</th>
                  <th className="text-left p-4 text-sm font-medium">Status</th>
                  <th className="text-right p-4 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {debts.map((debt) => {
                  const overdue = isOverdue(debt.due_date) && debt.status === 'active'
                  return (
                    <tr
                      key={debt.id}
                      className={`border-t hover:bg-muted/50 ${overdue ? 'bg-destructive/5' : ''}`}
                    >
                      <td className="p-4 text-sm font-semibold">{debt.name}</td>
                      <td className="p-4 text-sm">
                        <Badge variant={debt.type === 'debt' ? 'destructive' : 'secondary'}>
                          {debt.type}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm text-right font-semibold">
                        {formatCurrency(debt.remaining_amount)}
                      </td>
                      <td className="p-4 text-sm">
                        {formatDate(debt.due_date)}
                        {overdue && <span className="text-destructive ml-2">OVERDUE</span>}
                      </td>
                      <td className="p-4 text-sm">
                        <Badge
                          variant={
                            debt.status === 'paid'
                              ? 'secondary'
                              : debt.status === 'overdue'
                                ? 'destructive'
                                : 'outline'
                          }
                        >
                          {debt.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm text-right space-x-2">
                        <Link href={`/families/${familyId}/debts/${debt.id}/edit`}>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </Link>
                        <AlertDialog
                          open={showDeleteDialog && deleteId === debt.id}
                          onOpenChange={(open) => {
                            if (open) {
                              setDeleteId(debt.id)
                            }
                            setShowDeleteDialog(open)
                          }}
                          title="Delete Debt?"
                          description="This action cannot be undone."
                          onConfirm={handleDelete}
                          isLoading={loading}
                          isDangerous
                        >
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setDeleteId(debt.id)
                              setShowDeleteDialog(true)
                            }}
                          >
                            Delete
                          </Button>
                        </AlertDialog>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Toaster />
    </>
  )
}
