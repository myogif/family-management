'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createGoalSchema, type CreateGoalInput } from '@/lib/validations'
import { useGoalActions } from '@/hooks/useGoalActions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Toaster, toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface CreateGoalFormProps {
  familyId: string
  onSuccess?: () => void
}

export function CreateGoalForm({ familyId, onSuccess }: CreateGoalFormProps) {
  const router = useRouter()
  const { createGoal, loading, error } = useGoalActions()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateGoalInput>({
    resolver: zodResolver(createGoalSchema),
    defaultValues: {
      currentAmount: '0',
      status: 'active',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
  })

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const onSubmit = async (data: CreateGoalInput) => {
    const result = await createGoal(familyId, data)
    if (result?.data) {
      toast.success('Goal created successfully')
      reset()
      onSuccess?.()
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="name">Goal Name</Label>
          <Input
            id="name"
            placeholder="e.g., Emergency Fund, New Car, Vacation"
            {...register('name')}
            disabled={loading}
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="targetAmount">Target Amount</Label>
            <Input
              id="targetAmount"
              type="number"
              placeholder="0.00"
              step="0.01"
              {...register('targetAmount')}
              disabled={loading}
            />
            {errors.targetAmount && (
              <p className="text-sm text-red-500 mt-1">{errors.targetAmount.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="currentAmount">Current Amount</Label>
            <Input
              id="currentAmount"
              type="number"
              placeholder="0.00"
              step="0.01"
              {...register('currentAmount')}
              disabled={loading}
            />
            {errors.currentAmount && (
              <p className="text-sm text-red-500 mt-1">{errors.currentAmount.message}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="deadline">Deadline</Label>
          <Input
            id="deadline"
            type="date"
            {...register('deadline')}
            disabled={loading}
          />
          {errors.deadline && (
            <p className="text-sm text-red-500 mt-1">{errors.deadline.message}</p>
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
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          {errors.status && (
            <p className="text-sm text-red-500 mt-1">{errors.status.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="description">Description (optional)</Label>
          <Input
            id="description"
            placeholder="Add notes about this goal"
            {...register('description')}
            disabled={loading}
          />
          {errors.description && (
            <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
          )}
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Creating...' : 'Create Goal'}
        </Button>
      </form>
      <Toaster />
    </>
  )
}
