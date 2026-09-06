'use client'

import { useEffect, useState } from 'react'
import { useProfileActions } from '@/hooks/useProfileActions'
import { useAuth } from '@/lib/auth/context'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { profileSchema, type ProfileInput } from '@/lib/validations'
import { Toaster, toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ProfilePage() {
  const { user } = useAuth()
  const { getProfile, updateProfile, loading } = useProfileActions()
  const [initialLoading, setInitialLoading] = useState(true)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
  })

  useEffect(() => {
    const loadProfile = async () => {
      const result = await getProfile()
      if (result?.data) {
        setValue('fullName', result.data.full_name || '')
        setValue('phone', result.data.phone || '')
      }
      setInitialLoading(false)
    }

    loadProfile()
  }, [])

  const onSubmit = async (data: ProfileInput) => {
    const result = await updateProfile({
      fullName: data.fullName,
      phone: data.phone,
    })
    if (result?.data) {
      toast.success('Profile updated successfully')
    }
  }

  if (initialLoading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground mt-2">Manage your account information</p>
        </div>

        <div className="max-w-md space-y-6">
          <div className="p-4 border rounded-lg">
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="text-lg font-semibold">{user?.email}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="John Doe"
                {...register('fullName')}
                disabled={loading}
              />
              {errors.fullName && (
                <p className="text-sm text-red-500 mt-1">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Phone Number (optional)</Label>
              <Input
                id="phone"
                placeholder="+62 812 3456 7890"
                {...register('phone')}
                disabled={loading}
              />
              {errors.phone && (
                <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
              )}
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </div>
      </div>
      <Toaster />
    </>
  )
}
