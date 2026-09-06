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

interface TransactionFormProps {
  familyId: string
  onSuccess?: () => void
}

export function CreateTransactionForm({ familyId, onSuccess }: TransactionFormProps) {
  const router = useRouter()
  const [categories, setCategories] = useState<any[]>([])
  const [initialLoading, setInitialLoading] = useState(true)
  const { createTransaction, loading, error } = useTransactionActions()
  const { getCategories } = useCategoryActions()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateTransactionInput>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      transactionDate: new Date().toISOString(),
      paymentMethod: 'cash',
    },
  })

  useEffect(() => {
    const loadCategories = async () => {
      const result = await getCategories(familyId)
      if (result?.data) {
        setCategories(result.data)
      }
      setInitialLoading(false)
    }

    loadCategories()
  }, [familyId])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const onSubmit = async (data: CreateTransactionInput) => {
    const result = await createTransaction(familyId, data)
    if (result?.data) {
      toast.success('Transaction created successfully')
      reset()
      onSuccess?.()
    }
  }

  if (initialLoading) {
    return <div className="text-center py-4">Loading categories...</div>
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Creating...' : 'Create Transaction'}
        </Button>
      </form>
      <Toaster />
    </>
  )
}
