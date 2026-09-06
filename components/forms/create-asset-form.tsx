'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createAssetSchema, type CreateAssetInput } from '@/lib/validations'
import { useAssetActions } from '@/hooks/useAssetActions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Toaster, toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface CreateAssetFormProps {
  familyId: string
  onSuccess?: () => void
}

export function CreateAssetForm({ familyId, onSuccess }: CreateAssetFormProps) {
  const router = useRouter()
  const { createAsset, loading, error } = useAssetActions()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateAssetInput>({
    resolver: zodResolver(createAssetSchema),
    defaultValues: {
      purchaseDate: new Date().toISOString(),
    },
  })

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const onSubmit = async (data: CreateAssetInput) => {
    const result = await createAsset(familyId, data)
    if (result?.data) {
      toast.success('Asset created successfully')
      reset()
      onSuccess?.()
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="name">Asset Name</Label>
          <Input
            id="name"
            placeholder="e.g., Car, House, Laptop"
            {...register('name')}
            disabled={loading}
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            placeholder="e.g., Vehicle, Real Estate, Electronics"
            {...register('category')}
            disabled={loading}
          />
          {errors.category && (
            <p className="text-sm text-red-500 mt-1">{errors.category.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="purchaseValue">Purchase Value</Label>
            <Input
              id="purchaseValue"
              type="number"
              placeholder="0.00"
              step="0.01"
              {...register('purchaseValue')}
              disabled={loading}
            />
            {errors.purchaseValue && (
              <p className="text-sm text-red-500 mt-1">{errors.purchaseValue.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="currentValue">Current Value</Label>
            <Input
              id="currentValue"
              type="number"
              placeholder="0.00"
              step="0.01"
              {...register('currentValue')}
              disabled={loading}
            />
            {errors.currentValue && (
              <p className="text-sm text-red-500 mt-1">{errors.currentValue.message}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="purchaseDate">Purchase Date</Label>
          <Input
            id="purchaseDate"
            type="date"
            {...register('purchaseDate')}
            disabled={loading}
          />
          {errors.purchaseDate && (
            <p className="text-sm text-red-500 mt-1">{errors.purchaseDate.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="description">Description (optional)</Label>
          <Input
            id="description"
            placeholder="Add notes about this asset"
            {...register('description')}
            disabled={loading}
          />
          {errors.description && (
            <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
          )}
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Creating...' : 'Create Asset'}
        </Button>
      </form>
      <Toaster />
    </>
  )
}
