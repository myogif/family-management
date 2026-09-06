'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createTransactionSchema, type CreateTransactionInput } from '@/lib/validations'
import { useTransactionActions } from '@/hooks/useTransactionActions'
import { useCategoryActions } from '@/hooks/useCategoryActions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Toaster, toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface EditTransactionPageProps {
  params: Promise<{ id: string; transactionId: string }>
}

export default function EditTransactionPage({ params }: EditTransactionPageProps) {
  const router = useRouter()
  const [familyId, setFamilyId] = useState<string>('')
  const [transactionId, setTransactionId] = useState<string>('')
  const [transaction, setTransaction] = useState<any>(null)
  const [categories, setCategories] = useState<any[]>([])
  const [initialLoading, setInitialLoading] = useState(true)

  const { getTransactions, updateTransaction, loading, error } = useTransactionActions()
  const { getCategories } = useCategoryActions()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateTransactionInput>({
    resolver: zodResolver(createTransactionSchema),
  })

  useEffect(() => {
    params.then((p) => {
      setFamilyId(p.id)
      setTransactionId(p.transactionId)
    })
  }, [params])

  useEffect(() => {
    if (!familyId || !transactionId) return

    const loadData = async () => {
      const txResult = await getTransactions(familyId, { page: 1 })
      const catResult = await getCategories(familyId)

      if (txResult?.data) {
        const tx = txResult.data.find((t: any) => t.id === transactionId)
        if (tx) {
          setTransaction(tx)
          setValue('type', tx.type)
          setValue('amount', tx.amount)
          setValue('categoryId', tx.category_id)
          setValue('transactionDate', tx.transaction_date)
          setValue('description', tx.description)
          setValue('paymentMethod', tx.payment_method)
        }
      }

      if (catResult?.data) {
        setCategories(catResult.data)
      }

      setInitialLoading(false)
    }

    loadData()
  }, [familyId, transactionId])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const onSubmit = async (data: CreateTransactionInput) => {
    const result = await updateTransaction(familyId, transactionId, data)
    if (result?.data) {
      toast.success('Transaction updated successfully')
      router.push(`/families/${familyId}/finance`)
    }
  }

  if (initialLoading || !transaction) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Edit Transaction</h1>
          <p className="text-muted-foreground mt-2">Update transaction details</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-2xl">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Type</Label>
              <select
                id="type"
                {...register('type')}
                disabled={loading}
                className="w-full px-3 py-2 border rounded-md text-sm"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              {errors.type && (
                <p className="text-sm text-red-500 mt-1">{errors.type.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                step="0.01"
                {...register('amount')}
                disabled={loading}
              />
              {errors.amount && (
                <p className="text-sm text-red-500 mt-1">{errors.amount.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="categoryId">Category</Label>
            <select
              id="categoryId"
              {...register('categoryId')}
              disabled={loading}
              className="w-full px-3 py-2 border rounded-md text-sm"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-sm text-red-500 mt-1">{errors.categoryId.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="transactionDate">Date</Label>
            <Input
              id="transactionDate"
              type="datetime-local"
              {...register('transactionDate')}
              disabled={loading}
            />
            {errors.transactionDate && (
              <p className="text-sm text-red-500 mt-1">{errors.transactionDate.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Input
              id="paymentMethod"
              placeholder="e.g., cash, card, transfer"
              {...register('paymentMethod')}
              disabled={loading}
            />
            {errors.paymentMethod && (
              <p className="text-sm text-red-500 mt-1">{errors.paymentMethod.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description (optional)</Label>
            <Input
              id="description"
              placeholder="Add notes about this transaction"
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
