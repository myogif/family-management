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

interface EditAssetPageProps {
  params: Promise<{ id: string; assetId: string }>
}

export default function EditAssetPage({ params }: EditAssetPageProps) {
  const router = useRouter()
  const [familyId, setFamilyId] = useState<string>('')
  const [assetId, setAssetId] = useState<string>('')
  const [asset, setAsset] = useState<any>(null)
  const [initialLoading, setInitialLoading] = useState(true)

  const { getAssets, updateAsset, loading, error } = useAssetActions()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateAssetInput>({
    resolver: zodResolver(createAssetSchema),
  })

  useEffect(() => {
    params.then((p) => {
      setFamilyId(p.id)
      setAssetId(p.assetId)
    })
  }, [params])

  useEffect(() => {
    if (!familyId || !assetId) return

    const loadAsset = async () => {
      const result = await getAssets(familyId)
      if (result?.data) {
        const found = result.data.find((a: any) => a.id === assetId)
        if (found) {
          setAsset(found)
          setValue('name', found.name)
          setValue('category', found.category)
          setValue('purchaseValue', found.purchase_value)
          setValue('currentValue', found.current_value)
          setValue('purchaseDate', found.purchase_date.split('T')[0])
          setValue('description', found.description)
        }
      }
      setInitialLoading(false)
    }

    loadAsset()
  }, [familyId, assetId])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const onSubmit = async (data: CreateAssetInput) => {
    const result = await updateAsset(familyId, assetId, data)
    if (result?.data) {
      toast.success('Asset updated successfully')
      router.push(`/families/${familyId}/assets`)
    }
  }

  if (initialLoading || !asset) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Edit Asset</h1>
          <p className="text-muted-foreground mt-2">Update asset information</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-2xl">
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

          <div className="grid grid-cols-2 gap-4">
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
