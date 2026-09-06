'use client'

import { useEffect, useState } from 'react'
import { useDebtActions } from '@/hooks/useDebtActions'
import { formatCurrency, formatDate, isOverdue } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertDialog } from '@/components/ui/alert-dialog'
import { DataTable } from '@/components/ui/data-table'
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
        <DataTable
          columns={[
            { header: 'Name', accessor: (debt) => debt.name, cellClassName: 'font-semibold' },
            {
              header: 'Type',
              accessor: (debt) => (
                <Badge variant={debt.type === 'debt' ? 'destructive' : 'secondary'}>
                  {debt.type}
                </Badge>
              ),
            },
            {
              header: 'Remaining',
              accessor: (debt) => formatCurrency(debt.remaining_amount),
              cellClassName: 'font-semibold',
            },
            {
              header: 'Due Date',
              accessor: (debt) => {
                const overdue = isOverdue(debt.due_date) && debt.status === 'active'
                return (
                  <span>
                    {formatDate(debt.due_date)}
                    {overdue && <span className="text-destructive ml-2 text-xs">OVERDUE</span>}
                  </span>
                )
              },
            },
            {
              header: 'Status',
              accessor: (debt) => (
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
              ),
            },
            {
              header: 'Actions',
              accessor: (debt) => (
                <div className="flex gap-2 justify-end">
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
                </div>
              ),
            },
          ]}
          data={debts}
          keyExtractor={(debt) => debt.id}
          isLoading={loading}
          emptyMessage="No debts or receivables yet"
          emptyAction={
            <Link href={`/families/${familyId}/debts/create`}>
              <Button variant="outline" size="sm">
                Add Debt
              </Button>
            </Link>
          }
        />
      </div>
      <Toaster />
    </>
  )
}
