import { ResetPasswordForm } from '@/components/forms/reset-password-form'

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Family Management</h1>
          <p className="text-muted-foreground mt-2">Create a new password</p>
        </div>

        <ResetPasswordForm />
      </div>
    </div>
  )
}
