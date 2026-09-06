'use client'

import { useEffect, useState } from 'react'
import { useTransactionActions } from '@/hooks/useTransactionActions'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { AlertDialog } from '@/components/ui/alert-dialog'
import { DataTable } from '@/components/ui/data-table'
import { Toaster, toast } from 'sonner'
import Link from 'next/link'

interface TransactionListProps {
  familyId: string
}

export function TransactionList({ familyId }: TransactionListProps) {
  const [transactions, setTransactions] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState({
    type: '',
    search: '',
    dateFrom: '',
    dateTo: '',
  })
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const { getTransactions, deleteTransaction, loading, error } = useTransactionActions()

  useEffect(() => {
    const loadTransactions = async () => {
      const result = await getTransactions(familyId, {
        page,
        type: filters.type || undefined,
        search: filters.search || undefined,
        dateFrom: filters.dateFrom || undefined,
        dateTo: filters.dateTo || undefined,
      })

      if (result?.data) {
        setTransactions(result.data)
        setTotalPages(result.meta?.totalPages || 1)
      }
    }

    loadTransactions()
  }, [familyId, page, filters])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const handleDelete = async () => {
    if (!deleteId) return

    const result = await deleteTransaction(familyId, deleteId)
    if (result) {
      toast.success('Transaction deleted')
      setDeleteId(null)
      setShowDeleteDialog(false)
      setPage(1)
    }
  }

  return (
    <>
      <div className="space-y-4">
        {/* Filters */}
        <div className="border rounded-lg p-4 space-y-4">
          <h3 className="font-semibold">Filters</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1">Type</label>
              <select
                value={filters.type}
                onChange={(e) => {
                  setFilters({ ...filters, type: e.target.value })
                  setPage(1)
                }}
                className="w-full px-3 py-2 border rounded-md text-sm"
              >
                <option value="">All</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">From Date</label>
              <Input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => {
                  setFilters({ ...filters, dateFrom: e.target.value })
                  setPage(1)
                }}
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">To Date</label>
              <Input
                type="date"
                value={filters.dateTo}
                onChange={(e) => {
                  setFilters({ ...filters, dateTo: e.target.value })
                  setPage(1)
                }}
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">Search</label>
              <Input
                type="text"
                placeholder="Search description..."
                value={filters.search}
                onChange={(e) => {
                  setFilters({ ...filters, search: e.target.value })
                  setPage(1)
                }}
              />
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <DataTable
          columns={[
            { header: 'Date', accessor: (tx) => formatDate(tx.transaction_date) },
            { header: 'Description', accessor: (tx) => tx.description || '-' },
            { header: 'Category', accessor: (tx) => tx.categories?.name || '-' },
            {
              header: 'Type',
              accessor: (tx) => (
                <Badge variant={tx.type === 'income' ? 'secondary' : 'destructive'}>
                  {tx.type}
                </Badge>
              ),
            },
            {
              header: 'Amount',
              accessor: (tx) => formatCurrency(tx.amount),
              cellClassName: 'font-semibold',
            },
            {
              header: 'Actions',
              accessor: (tx) => (
                <div className="flex gap-2 justify-end">
                  <Link href={`/families/${familyId}/finance/transactions/${tx.id}/edit`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <AlertDialog
                    open={showDeleteDialog && deleteId === tx.id}
                    onOpenChange={(open) => {
                      if (open) {
                        setDeleteId(tx.id)
                      }
                      setShowDeleteDialog(open)
                    }}
                    title="Delete Transaction?"
                    description="This action cannot be undone."
                    onConfirm={handleDelete}
                    isLoading={loading}
                    isDangerous
                  >
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setDeleteId(tx.id)
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
          data={transactions}
          keyExtractor={(tx) => tx.id}
          isLoading={loading}
          emptyMessage="No transactions found"
          emptyAction={
            <Link href={`/families/${familyId}/finance/create`}>
              <Button variant="outline" size="sm">
                Create Transaction
              </Button>
            </Link>
          }
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <span className="px-4 py-2 text-sm">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
      <Toaster />
    </>
  )
}
