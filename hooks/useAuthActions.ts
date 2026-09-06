'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { LoginInput, RegisterInput, ForgotPasswordInput, ResetPasswordInput } from '@/lib/validations'

export function useAuthActions() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = async (data: LoginInput) => {
    setLoading(true)
    setError(null)
    try {
      const { error: err } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })
      if (err) throw err
      return true
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed'
      setError(message)
      return false
    } finally {
      setLoading(false)
    }
  }

  const register = async (data: RegisterInput) => {
    setLoading(true)
    setError(null)
    try {
      const { error: err } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
          },
        },
      })
      if (err) throw err
      return true
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed'
      setError(message)
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    setError(null)
    try {
      const { error: err } = await supabase.auth.signOut()
      if (err) throw err
      return true
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Logout failed'
      setError(message)
      return false
    } finally {
      setLoading(false)
    }
  }

  const forgotPassword = async (data: ForgotPasswordInput) => {
    setLoading(true)
    setError(null)
    try {
      const { error: err } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
      })
      if (err) throw err
      return true
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send reset email'
      setError(message)
      return false
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (data: ResetPasswordInput) => {
    setLoading(true)
    setError(null)
    try {
      const { error: err } = await supabase.auth.updateUser({
        password: data.password,
      })
      if (err) throw err
      return true
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to reset password'
      setError(message)
      return false
    } finally {
      setLoading(false)
    }
  }

  return { login, register, logout, forgotPassword, resetPassword, loading, error }
}
