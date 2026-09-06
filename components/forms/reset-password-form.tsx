'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { resetPasswordSchema, type ResetPasswordInput } from '@/lib/validations'
import { useAuthActions } from '@/hooks/useAuthActions'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Toaster, toast } from 'sonner'

export function ResetPasswordForm() {
  const router = useRouter()
  const { resetPassword, loading, error } = useAuthActions()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  })

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const onSubmit = async (data: ResetPasswordInput) => {
    const success = await resetPassword(data)
    if (success) {
      toast.success('Password reset successfully')
      router.push('/auth/login')
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-sm">
        <div>
          <Label htmlFor="password">New Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register('password')}
            disabled={loading}
          />
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="passwordConfirm">Confirm Password</Label>
          <Input
            id="passwordConfirm"
            type="password"
            placeholder="••••••••"
            {...register('passwordConfirm')}
            disabled={loading}
          />
          {errors.passwordConfirm && (
            <p className="text-sm text-red-500 mt-1">{errors.passwordConfirm.message}</p>
          )}
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Resetting...' : 'Reset Password'}
        </Button>
      </form>
      <Toaster />
    </>
  )
}
