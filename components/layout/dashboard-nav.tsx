'use client'

import { useAuth } from '@/lib/auth/context'
import { useAuthActions } from '@/hooks/useAuthActions'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Toaster, toast } from 'sonner'

export function DashboardNav() {
  const { user } = useAuth()
  const { logout } = useAuthActions()
  const router = useRouter()

  const handleLogout = async () => {
    const success = await logout()
    if (success) {
      toast.success('Logged out successfully')
      router.push('/auth/login')
    }
  }

  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="text-xl font-bold">
            Family Management
          </Link>
          <div className="hidden md:flex gap-4">
            <Link href="/dashboard" className="text-sm hover:text-primary">
              Dashboard
            </Link>
            <Link href="/families" className="text-sm hover:text-primary">
              Families
            </Link>
            <Link href="/profile" className="text-sm hover:text-primary">
              Profile
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{user?.email}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </div>
      <Toaster />
    </nav>
  )
}
