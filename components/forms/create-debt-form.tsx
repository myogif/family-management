'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createDebtSchema, type CreateDebtInput } from '@/lib/validations'
import { useDebtActions } from '@/hooks/useDebtActions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Toaster, toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface CreateDebtFormProps {
  familyId: string
  onSuccess?: () => void
}

export function CreateDebtForm({ familyId, onSuccess }: CreateDebtFormProps) {
  const router = useRouter()
  const { createDebt, loading, error } = useDebtActions()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateDebtInput>({
    resolver: zodResolver(createDebtSchema),
    defaultValues: {
      type: 'debt',
      status: 'active',
      dueDate: new Date().toISOString(),
    },
  })

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const onSubmit = async (data: CreateDebtInput) => {
    const result = await createDebt(familyId, data)
    if (result?.data) {
      toast.success('Debt created successfully')
      reset()
      onSuccess?.()
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="name">Debt Name</Label>
          <Input
            id="name"
            placeholder="e.g., Car Loan, Mortgage"
            {...register('name')}
            disabled={loading}
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="type">Type</Label>
            <select
              id="type"
              {...register('type')}
              disabled={loading}
              className="w-full px-3 py-2 border rounded-md text-sm"
            >
              <option value="debt">Debt (Owe)</option>
              <option value="receivable">Receivable (Owed to us)</option>
            </select>
            {errors.type && (
              <p className="text-sm text-red-500 mt-1">{errors.type.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              {...register('status')}
              disabled={loading}
              className="w-full px-3 py-2 border rounded-md text-sm"
            >
              <option value="active">Active</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
            {errors.status && (
              <p className="text-sm text-red-500 mt-1">{errors.status.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="principalAmount">Principal Amount</Label>
            <Input
              id="principalAmount"
              type="number"
              placeholder="0.00"
              step="0.01"
              {...register('principalAmount')}
              disabled={loading}
            />
            {errors.principalAmount && (
              <p className="text-sm text-red-500 mt-1">{errors.principalAmount.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="remainingAmount">Remaining Amount</Label>
            <Input
              id="remainingAmount"
              type="number"
              placeholder="0.00"
              step="0.01"
              {...register('remainingAmount')}
              disabled={loading}
            />
            {errors.remainingAmount && (
              <p className="text-sm text-red-500 mt-1">{errors.remainingAmount.message}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="dueDate">Due Date</Label>
          <Input
            id="dueDate"
            type="date"
            {...register('dueDate')}
            disabled={loading}
          />
          {errors.dueDate && (
            <p className="text-sm text-red-500 mt-1">{errors.dueDate.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="description">Description (optional)</Label>
          <Input
            id="description"
            placeholder="Add notes about this debt"
            {...register('description')}
            disabled={loading}
          />
          {errors.description && (
            <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
          )}
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Creating...' : 'Create Debt'}
        </Button>
      </form>
      <Toaster />
    </>
  )
}
