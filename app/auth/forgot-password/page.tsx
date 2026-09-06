import { ForgotPasswordForm } from '@/components/forms/forgot-password-form'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Family Management</h1>
          <p className="text-muted-foreground mt-2">Reset your password</p>
        </div>

        <ForgotPasswordForm />

        <div className="text-center text-sm">
          <Link href="/auth/login" className="text-primary hover:underline">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}
