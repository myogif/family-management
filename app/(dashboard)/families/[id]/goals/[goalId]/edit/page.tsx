'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createGoalSchema, type CreateGoalInput } from '@/lib/validations'
import { useGoalActions } from '@/hooks/useGoalActions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Toaster, toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface EditGoalPageProps {
  params: Promise<{ id: string; goalId: string }>
}

export default function EditGoalPage({ params }: EditGoalPageProps) {
  const router = useRouter()
  const [familyId, setFamilyId] = useState<string>('')
  const [goalId, setGoalId] = useState<string>('')
  const [goal, setGoal] = useState<any>(null)
  const [initialLoading, setInitialLoading] = useState(true)

  const { getGoals, updateGoal, loading, error } = useGoalActions()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateGoalInput>({
    resolver: zodResolver(createGoalSchema),
  })

  useEffect(() => {
    params.then((p) => {
      setFamilyId(p.id)
      setGoalId(p.goalId)
    })
  }, [params])

  useEffect(() => {
    if (!familyId || !goalId) return

    const loadGoal = async () => {
      const result = await getGoals(familyId)
      if (result?.data) {
        const found = result.data.find((g: any) => g.id === goalId)
        if (found) {
          setGoal(found)
          setValue('name', found.name)
          setValue('targetAmount', found.target_amount)
          setValue('currentAmount', found.current_amount)
          setValue('deadline', found.deadline.split('T')[0])
          setValue('status', found.status)
          setValue('description', found.description)
        }
      }
      setInitialLoading(false)
    }

    loadGoal()
  }, [familyId, goalId])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const onSubmit = async (data: CreateGoalInput) => {
    const result = await updateGoal(familyId, goalId, data)
    if (result?.data) {
      toast.success('Goal updated successfully')
      router.push(`/families/${familyId}/goals`)
    }
  }

  if (initialLoading || !goal) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Edit Goal</h1>
          <p className="text-muted-foreground mt-2">Update goal information</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-2xl">
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

          <div className="grid grid-cols-2 gap-4">
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
