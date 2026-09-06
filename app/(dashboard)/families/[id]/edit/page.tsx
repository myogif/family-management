'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFamilySchema, type CreateFamilyInput } from '@/lib/validations'
import { useFamilyActions } from '@/hooks/useFamilyActions'
import { useRouter } from 'next/navigation'
import { Toaster, toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Family } from '@/types'

interface EditFamilyPageProps {
  params: Promise<{ id: string }>
}

export default function EditFamilyPage({ params }: EditFamilyPageProps) {
  const router = useRouter()
  const [familyId, setFamilyId] = useState<string>('')
  const [family, setFamily] = useState<Family | null>(null)
  const [initialLoading, setInitialLoading] = useState(true)

  const { getFamily } = useFamilyActions()
  const { updateFamily, loading, error } = useFamilyActions()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateFamilyInput>({
    resolver: zodResolver(createFamilySchema),
  })

  useEffect(() => {
    params.then((p) => setFamilyId(p.id))
  }, [params])

  useEffect(() => {
    if (!familyId) return

    const loadFamily = async () => {
      const result = await getFamily(familyId)
      if (result?.data) {
        setFamily(result.data)
        setValue('name', result.data.name)
        setValue('description', result.data.description || '')
      }
      setInitialLoading(false)
    }

    loadFamily()
  }, [familyId])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const onSubmit = async (data: CreateFamilyInput) => {
    const result = await updateFamily(familyId, data)
    if (result?.data) {
      toast.success('Family updated successfully')
      router.push(`/families/${familyId}`)
    }
  }

  if (initialLoading) {
    return <div className="text-center py-12">Loading...</div>
  }

  if (!family) {
    return <div className="text-center py-12">Family not found</div>
  }

  return (
    <>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Edit Family</h1>
          <p className="text-muted-foreground mt-2">Update family information</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md">
          <div>
            <Label htmlFor="name">Family Name</Label>
            <Input
              id="name"
              placeholder="My Family"
              {...register('name')}
              disabled={loading}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description (optional)</Label>
            <Input
              id="description"
              placeholder="Brief description of your family"
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
