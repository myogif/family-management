'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createDebtSchema, type CreateDebtInput } from '@/lib/validations'
import { useDebtActions } from '@/hooks/useDebtActions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Toaster, toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface EditDebtPageProps {
  params: Promise<{ id: string; debtId: string }>
}

export default function EditDebtPage({ params }: EditDebtPageProps) {
  const router = useRouter()
  const [familyId, setFamilyId] = useState<string>('')
  const [debtId, setDebtId] = useState<string>('')
  const [debt, setDebt] = useState<any>(null)
  const [initialLoading, setInitialLoading] = useState(true)

  const { getDebts, updateDebt, loading, error } = useDebtActions()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateDebtInput>({
    resolver: zodResolver(createDebtSchema),
  })

  useEffect(() => {
    params.then((p) => {
      setFamilyId(p.id)
      setDebtId(p.debtId)
    })
  }, [params])

  useEffect(() => {
    if (!familyId || !debtId) return

    const loadDebt = async () => {
      const result = await getDebts(familyId)
      if (result?.data) {
        const found = result.data.find((d: any) => d.id === debtId)
        if (found) {
          setDebt(found)
          setValue('name', found.name)
          setValue('type', found.type)
          setValue('status', found.status)
          setValue('principalAmount', found.principal_amount)
          setValue('remainingAmount', found.remaining_amount)
          setValue('dueDate', found.due_date.split('T')[0])
          setValue('description', found.description)
        }
      }
      setInitialLoading(false)
    }

    loadDebt()
  }, [familyId, debtId])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const onSubmit = async (data: CreateDebtInput) => {
    const result = await updateDebt(familyId, debtId, data)
    if (result?.data) {
      toast.success('Debt updated successfully')
      router.push(`/families/${familyId}/debts`)
    }
  }

  if (initialLoading || !debt) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Edit Debt</h1>
          <p className="text-muted-foreground mt-2">Update debt information</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-2xl">
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

          <div className="grid grid-cols-2 gap-4">
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

          <div className="grid grid-cols-2 gap-4">
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
