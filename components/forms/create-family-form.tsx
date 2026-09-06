'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFamilySchema, type CreateFamilyInput } from '@/lib/validations'
import { useFamilyActions } from '@/hooks/useFamilyActions'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Toaster, toast } from 'sonner'

export function CreateFamilyForm() {
  const router = useRouter()
  const { createFamily, loading, error } = useFamilyActions()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateFamilyInput>({
    resolver: zodResolver(createFamilySchema),
  })

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const onSubmit = async (data: CreateFamilyInput) => {
    const result = await createFamily(data)
    if (result?.data) {
      toast.success('Family created successfully')
      router.push(`/dashboard/families/${result.data.id}`)
    }
  }

  return (
    <>
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

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Creating...' : 'Create Family'}
        </Button>
      </form>
      <Toaster />
    </>
  )
}
